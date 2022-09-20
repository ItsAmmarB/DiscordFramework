/**
 * Check current local version with the GitHub version
 * if version do not match then console log a warning
 * and show current local version and latest remote version
 */
require('./version').Core(Result => {
    if(Result.deprecated) return console.error('Your current version of DiscordFramework is deprecated! Framework must be updated!');
    if(!Result.isUpToDate) console.warn('Your current version of DiscordFramework is outdate');

    Core();
});

const Core = () => {
// Globalizing DebugMode for debugging functions
    global.DebugMode = String(GetResourceMetadata(GetCurrentResourceName(), 'debug_mode', 0)).toLowerCase() === 'true' ? true : false;


    // --------------------------------------
    //               MODULES
    // --------------------------------------

    let Discord = require('./modules/Discord/index');
    let MongoDB = require('./modules/MongoDB/index');

    const Modules = require('./modules');

    // Just a temporary variable to check whether all modules are loaded or not
    let Status = false;
    on('DiscordFramework:Module:Ready', Module => {
        if(global.DebugMode) console.debug(`---> ${Module} is Ready!`);
    });

    setTimeout(async () => {

        while(!Modules.Ready()) {
            await Delay(500);
        }

        if(global.DebugMode) console.debug('---> Core is Ready!');

        Discord = require('./modules/Discord/index');
        MongoDB = require('./modules/MongoDB/index');

        emit('DiscordFramework:Core:Ready');
        Status = true;

        CountPlaytime();

    }, 500);

    Modules.Load();

    // --------------------------------------
    //       PLAYERS/DISCORD/MONGODB
    // --------------------------------------

    const { Players: PlayersSet, Player } = require('./handlers/players');
    const Players = new PlayersSet();

    const CountPlaytime = () => setInterval(async () => {
        for (const player of Players) {
            await Delay(50);
            MongoDB.UpdateOne('Players', { 'details.discordId': player.getDiscordId() }, {
                $inc: { 'details.playtime': 1 },
                $set: { 'details.lastSeenTimestmap': Date.now() }
            }, err => {
                if (err) new Error(err);
            });
        }
    }, 60000);

    // Triggered when the player's connection request is received by the server
    on('playerConnecting', async (Name, SetKickReason, Deferrals) => {
        const PlayerId = global.source;

        console.log(`^9 ===> ${GetPlayerName(PlayerId)} is conencting^0`);

        Deferrals.defer();

        if (!Status) return Deferrals.done('[DiscordFramework] Core is not ready yet, please try again in a few seconds!');

        // Fetching identifiers
        Deferrals.update('Checking identifiers...');

        const Identifiers = Player.GetIdentifiers(PlayerId);

        // Check if discord id is present within the identifiers if not then don't allow connection
        if (!Identifiers.discord) return Deferrals.done('[DiscordFramework] Discord ID could be detected!');

        Deferrals.update('Checking community membership...');
        const Member = await Discord.GetMember(Identifiers.discord);
        if (!Member) Deferrals.update('You are not a member of the community!');

        emit('DiscordFramework:Player:Connecting', PlayerId, Deferrals);
        await Delay(3000); // yes; I know, waiting 3 seconds to start connecting is just absurd but it should be enough time for extensions to check and do stuff

        Deferrals.done();
    });

    // Triggered when the player's connected request is received by the server
    on('playerJoining', () => {
        const player = new Player(global.source);
        Players.add(player);
        console.log(`^4 ===> ${player.getName()} is joining^0`);
        emit('DiscordFramework:Player:Joining', player);
    });

    // Triggered when the player is fully connected and is about to spawn
    onNet('playerJoined', async PlayerId => {

        await AwaitCore();


        let player = Players.get(PlayerId);
        if(!player) {
            player = new Player(PlayerId);
            player.setStatus('Joined');
            player.setConnectingAt(Date.now());
            player.setConnectedAt(Date.now());
            Players.add(player);
        }

        // Database
        MongoDB.FindOne('Players', { 'details.discordId': player.getDiscordId() }, async _Player => {
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

                MongoDB.UpdateOne('Players', { 'details.discordId': player.getDiscordId() }, Query, err => {
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

                MongoDB.InsertOne('Players', NewPlayer);
            }
        });

        await Delay(1000);

        emit('DiscordFramework:Player:Joined', player);
        console.log(`^2 ===> ${GetPlayerName(PlayerId)} joined^0`);
    });

    // Triggered when a player leaves the server for whatever reason
    on('playerDropped', Reason => {
        const player = Players.get(global.source);
        emit('DiscordFramework:Player:Disconnected', player, Reason);
        console.log(`^1 ===> ${player.Name} ${Reason === 'Exiting' ? 'left' : Reason}^0`);
    });

    // --------------------------------------
    //           AIDING FUNCTIONS
    // --------------------------------------

    const Delay = async MS => await new Promise(resolve => setTimeout(resolve, MS));
    const AwaitCore = async () => await new Promise(resolve => {
        const interval = setInterval(() => {
            if(Status) {
                resolve(true);
                clearInterval(interval);
            }
        }, 500);
    });

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
         * Returns all the players and their details
         * @return {Set<PlayersSet>} A Set() of players
         */
        Players: Players,
        /**
         * A pass-through from native JS export to CFX.re exports().
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

};
