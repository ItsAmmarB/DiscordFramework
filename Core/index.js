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

    const Config = require('./config');

    // --------------------------------------
    //               MODULES
    // --------------------------------------

    let Discord = require('./Modules/Discord/index');
    let MongoDB = require('./Modules/MongoDB/index');

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

        Discord = require('./Modules/Discord/index');
        MongoDB = require('./Modules/MongoDB/index');

        emit('DiscordFramework:Core:Ready');
        Status = true;

        CountPlaytime();

    }, 500);

    Modules.Load();

    // --------------------------------------
    //       PLAYERS/DISCORD/MONGODB
    // --------------------------------------


    const { Players, Player } = require('./players');

    const CountPlaytime = () => setInterval(() => {
        MongoDB.UpdateOne('Players', { '_id': { $in: Players.toArray().filter(p => !p.Server.Connections.DisconnectedAt).map(p => p.PUID) } }, {
            $inc: { 'details.playtime': 1 },
            $set: { 'details.lastSeenTimestmap': Date.now() }
        });
    }, 60000);

    setTimeout(() => {
        MongoDB.Find('Players', {}, console.log);
    }, 3000);

    // Triggered when the player's connection request is received by the server
    on('playerConnecting', async (Name, SetKickReason, Deferrals) => {

        Deferrals.defer();

        if (!Status) return Deferrals.done('[DiscordFramework] Core is not ready yet, please try again in a few seconds!');

        // Fetching identifiers
        Deferrals.update('fetching information...');

        const PlayerId = global.source;

        const player = new Player(PlayerId)
            .setStatus('Connecting')
            .setConnectingAt(Date.now());

        console.log(`^9 ===> ^0${player.getServerId()} ^9| ^0${player.getName()} ^9is conencting^0`);

        if (Config.Players.RequireDiscord.Enabled && !player.Discord.ID) return Deferrals.done(Config.Players.RequireDiscord.Message);

        if(Config.Players.RequireMember.Enabled) {
            Deferrals.update('Checking community membership...');

            const Member = await Discord.GetMember(player.Discord.ID, Config.Discord.MainGuild.ID);
            if (!Member) Deferrals.update(Config.Players.RequireMember.Message);
        }

        emit('DiscordFramework:Player:Connecting', PlayerId, Deferrals);
        await Delay(3000); // yes; I know, waiting 3 seconds to start connecting is just absurd but it should be enough time for extensions to check and do stuff

        Deferrals.done();

    });

    // Triggered when the player's connected request is received by the server
    on('playerJoining', (TempID) => {
        const player = new Player(TempID)
            .setServerId(global.source)
            .setStatus('Joining')
            .setConnectedAt(Date.now());

        console.log(`^4 ===> ^0${player.getServerId()} ^4| ^0${player.getName()} ^4is joining^0`);
        emit('DiscordFramework:Player:Joining', player);
    });

    RegisterCommand('players', () => {
        console.log(Players);
    });

    RegisterCommand('player', (source, args) => {
        console.log(Player(args[0]));
    });

    // Triggered when the player is fully connected and is about to spawn
    onNet('playerJoined', async PlayerId => {

        await AwaitCore();

        let player = new Player(PlayerId)
            .setStatus('Joined')
            .setJoinedAt(Date.now());

        while(!player.PUID) {
            player = new Player(PlayerId);
            await Delay(100);
        }

        await Delay(1000);

        emit('DiscordFramework:Player:Joined', player);
        console.log(`^2 ===> ^0${player.getServerId()} ^2| ^0${player.getName()} ^2joined^0`);
    });

    // Triggered when a player leaves the server for whatever reason
    on('playerDropped', Reason => {
        const player = new Player(global.source)
            .setStatus('Disconnected')
            .setDisconnectedAt(Date.now())
            .setDisconnectReason(Reason);

        emit('DiscordFramework:Player:Disconnected', player, Reason);
        console.log(`^1 ===> ^0${player.getServerId()} ^1| ^0${player.getName()} ^1 ${Reason === 'Exiting' ? 'left' : Reason}^0`);
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