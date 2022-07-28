// Globalizing DebugMode for debugging functions
global.DebugMode = String(GetResourceMetadata(GetCurrentResourceName(), 'debug_mode', 0)).toLowerCase() === 'true' ? true : false;
/**
 * Check current local version with the GitHub version
 * if version do not match then console log a warning
 * and show current local version and latest remote version
 */
// require('./version').Core(Result => {
//     if(!Result.isUpToDate) {
//         if(Result.deprecated) {
//             console.error('Your current version of DiscordFramework is deprecated!');
//         } else {
//             console.warn('Your current version of DiscordFramework is outdate');
//         }
//     }
// });

// --------------------------------------
//               MODULES
// --------------------------------------

const Modules = {
    Discord: require('./modules/discord'),
    MongoDB: require('./modules/mongo'),
    Console: require('./modules/console'),
    Extensions: require('./modules/extensions')
};


// Just a temporary variable to check whether all modules are loaded or not
let Status = false;
let _discordReady = false;
let _mongoReady = false;
on('DiscordFramework:Module:Ready', async Client => {
    if(Status) return;
    switch (Client.toLowerCase()) {
    case 'discord':
        _discordReady = true;
    case 'mongodb':
        _mongoReady = true;
    default:
        if(global.DebugMode) console.debug(`---> ${Client} is Ready!`);
        if (_discordReady && _mongoReady) {
            if(global.DebugMode) console.debug('---> Core is Ready!');
            Status = true;
            emit('DiscordFramework:Core:Ready');
            await Delay(2000);
            Modules.Extensions.Load();

            Modules.Console.Core();
            CountPlaytime();
        }
    }
});


// --------------------------------------
//              EXTENSIONS
// --------------------------------------


const { Extensions: ExtensionsSet, Extension: ExtensionClass } = require('./handlers/extensions');
const Extensions = new ExtensionsSet();
on('DiscordFramework:Extension:Register', Extension => {
    if(Extensions.get(Extension.name)) {
        console.log(Extensions.get(Extension.name));
        console.log(Extension);
        return Console.PrintError(new Error(`EXTEN_DUPLIC: Duplicate extension config names were found "${Extension.name}"`));
    }
    if(Extension.dependencies.length > 0) {
        let dependencies = ExtensionClass.CheckDependencies(Extensions, Extension.dependencies);
        if(dependencies.find(d => d.state === 'Template')) {
            dependencies = dependencies.filter(d => d.state !== 'Template');
            console.warn(`Template cannot be a dependency for an extension; Dependency was ignored in the "${Extension.name}" extension`);
        }
        if(dependencies.find(d => d.name === Extension.name)) {
            dependencies = dependencies.filter(d => d.name !== Extension.name);
            console.warn(`An extension cannot be a dependency for itself; Dependency was ignored in the "${Extension.name}" extension`);
        }
        dependencies = dependencies.find(d => d.state !== 'Enabled');
        if(dependencies) {
            emit('DiscordFramework:Extension:Register:Return', Extension.name, dependencies.state);
            Extension.state = dependencies.state;
            Extensions.add(Extension);
        }
    }
    emit('DiscordFramework:Extension:Run', Extension.name);
    Extensions.add(Extension);
});


// --------------------------------------
//       PLAYERS/DISCORD/MONGODB
// --------------------------------------

const { Players: PlayersSet, Player } = require('./handlers/players');
const Players = new PlayersSet();

const CountPlaytime = () => setInterval(async () => {
    for (const player of Players) {
        await Delay(50);
        Modules.MongoDB.DatabaseUpdateOne('Players', { 'details.discordId': player.getDiscordId() }, {
            $inc: { 'details.playtime': 1 },
            $set: { 'details.lastSeenTimestmap': Date.now() }
        }, err => {
            if (err) new Error(err);
        });
    }
}, 200);

// Triggered when the player's connected request is received by the server
on('playerConnecting', async (Name, SetKickReason, Deferrals) => {
    const PlayerId = global.source;

    if(global.DebugMode) console.debug(`^9 ===> ${GetPlayerName(PlayerId)} is conencting^0`);

    Deferrals.defer();

    if (!Status) return Deferrals.done('[DiscordFramework] Core is not ready yet, please try again in a few seconds!');

    // Fetching identifiers
    Deferrals.update('[DiscordFramework] Checking identifiers...');

    const Identifiers = Player.GetIdentifiers(PlayerId);

    // Check if discord id is present within the identifiers if not then don't allow connection
    if (!Identifiers.discord) return Deferrals.done('[DiscordFramework] Discord ID could be detected!');

    Deferrals.update('[DiscordFramework] Checking community membership...');
    const Member = await Modules.Discord.GetMember(Identifiers.discord);
    if (!Member) Deferrals.update('[DiscordFramework] You are not a member of the community!');

    emit('DiscordFramework:Player:Connecting', PlayerId, Deferrals);
    await Delay(3000); // yes; I know, waiting 3 seconds to start connecting is just absurd but it should be enough time for extensions to check and do stuff

    Deferrals.done();
});

// Triggered when the player's connected request is received by the server
on('playerJoining', () => {
    const player = new Player(global.source);
    Players.add(player);
    if(global.DebugMode) console.debug(`^4 ===> ${player.getName()} is joining^0`);
});

// Triggered when the player is fully connected and is about to spawn
onNet('playerJoined', async (PlayerId) => {

    while (!Status) {
        await Delay(1000);
    }

    let player = Players.get(PlayerId);
    if(!player) {
        player = new Player(PlayerId);
        player.setStatus('Joined');
        player.setConnectingAt(Date.now());
        player.setConnectedAt(Date.now());
        Players.add(player);
    }

    // Database
    Modules.MongoDB.DatabaseFindOne('Players', { 'details.discordId': player.getDiscordId() }, async _Player => {
        if (_Player) {
            // Match current player information with database information
            const Query = {};

            // Update serverId and lastSeenTimestamp
            Query.$set = {
                'details.serverId': PlayerId,
                'details.lastSeenTimestamp': Date.now()
            };

            // Check for new Identifiers and update
            const NewIdentifiers = player.getIdentifiers().filter(identifier => !_Player.details.identifiers.includes(identifier));
            if (NewIdentifiers.length > 0) {
                if (!Query.$push) Query.$push = {};
                Query.$push['details.identifiers'] = { $each: NewIdentifiers };
            }

            // Check for a new name change and update
            const NewName = player.getName();
            if (NewName !== _Player.details.names[0].name) {
                if (!Query.$push) Query.$push = {};
                Query.$push['details.names'] = {
                    $each: [{ name: NewName, timestamp: Date.now() }],
                    $position: 0
                };
            }

            // Check Location
            const fetch = require('node-fetch');

            let GeoIP = await fetch('http://ip-api.com/json/' + player.getIdentifiers().find(iden => iden.includes('ip:')).split(':')[1]);
            GeoIP = await GeoIP.json();
            if (GeoIP.status.toLowerCase() === 'success') {
                Query.$set['details.location'] = `${GeoIP.country}, ${GeoIP.regionName}, ${GeoIP.city}`;
            }

            Modules.MongoDB.DatabaseUpdateOne('Players', { 'details.discordId': player.getDiscordId() }, Query, err => {
                if (err) new Error(err);
            });
        } else {
            // Database player object
            const NewPlayer = {
                details: {
                    discordId: player.getDiscordId(),
                    serverId: player.getServerId(),
                    playtime: 0,
                    lastSeenTimestamp: Date.now(),
                    identifiers: player.getIdentifiers(),
                    names: [{ name: player.getName(), timestamp: Date.now() }],
                    location: null
                }
            };

            // Get the player's country AKA. GeoIP
            const fetch = require('node-fetch');

            let GeoIP = await fetch('http://ip-api.com/json/' + player.getIdentifiers().find(iden => iden.includes('ip:')).split(':')[1]);
            GeoIP = await GeoIP.json();
            if (GeoIP.status.toLowerCase() === 'success') {
                NewPlayer.details.location = `${GeoIP.country}, ${GeoIP.regionName}`;
            } else {
                NewPlayer.details.location = 'Unknown';
            }

            Modules.MongoDB.DatabaseInsertOne('Players', NewPlayer);
        }
    });

    await Delay(150);

    emit('DiscordFramework:Player:Joined', player);
    if(global.DebugMode) console.debug(`^2 ===> ${GetPlayerName(PlayerId)} joined^0`);
});

// Triggered when a player leaves the server for whatever reason
on('playerDropped', (Reason) => {
    const player = Players.get(global.source);
    emit('DiscordFramework:Player:Disconnected', player, Reason);
    if(global.DebugMode) console.debug(`^1 ===> ${player.Name} left^0`);
});


// --------------------------------------
//           AIDING FUNCTIONS
// --------------------------------------

const Delay = async (MS) => await new Promise(resolve => setTimeout(resolve, MS));

// --------------------------------------
//                 EXPORTS
// --------------------------------------

module.exports = {
    /**
     * The current state of the core
     * @return {boolean} True of False
     */
    Status: Status,
    /**
     * Return all the players and their details
     * @return {Set<PlayersSet>} A Set
     */
    Players: Players,
    /**
     * Return all registered extensions
     * @return {Set<ExtensionsSet>} A Set
     */
    Extensions: Extensions,
    /**
     * A pass-through from native JS export to CFX.re exports().
     *
     * This was implemented because requiring a server side file will cause all CFX.re exports() to be nullified/undefined
     * this is a mere workaround to which it provides the ability to use both native JS module.exports and CFX.re export()
     * at the same time.
     *
     * @param {string} Name The desired name of the exports()
     * @param {function} Function The function to be executed upon call
     */
    Export: (Name, Function) => {
        emit('DiscordFramework:Export:Create', Name, Function);
    }
};