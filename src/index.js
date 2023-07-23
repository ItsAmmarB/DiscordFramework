const ms = require('ms');

const Config = require('./config');
const { Player, NetworkPlayers } = require('./components/player');
const Logger = require('./components/logger');
const { delay } = require('./utils/functions');

const ConnectionsExecutables = {
    onConnecting: [],
    onJoining: [],
    onJoined: [],
    onDisconnected: []
};

let CoreStatus = 'Starting';
let GetMember = null;
let UpdateMany = null;

require('./version')(async result => {
    if(result) {
        if(!result.upToDate) {
            console.log(`^3[DiscordFramework] A newer version '${result.remote}' was released! currently running ${result.local}^0`);
        }
        else {
            console.log(`^2[DiscordFramework] Running the latest version! ${result.local}^0`);
        };
    }

    await require('./core/index').initialize((isReady, Modules) => {
        CoreStatus = isReady ? 'Ready' : 'Error';
        if(isReady) {
            GetMember = Modules.Discord.helpers.GetMember;
            UpdateMany = Modules.MongoDB.helpers.UpdateMany;
            setInterval(() => {
                UpdateMany('Players', { '_id': { $in: NetworkPlayers.filter(['Joined', '!Disconnected']).map(p => p.PUID) } }, {
                    $inc: { 'information.playtime': 1 },
                    $set: { 'information.lastSeenTimestmap': Date.now() }
                });
            }, 2000);
        }
    });
});


// Triggered when the player's connection request is received by the server
on('playerConnecting', async (playerName, setKickReason, deferrals) => {
    const cPlayerId = global.source;

    deferrals.defer();

    let dots = '';
    const dotsInterval = setInterval(() => { dots.length > 3 ? dots = '.' : dots = dots + '.'; }, 750);

    while(CoreStatus !== 'Ready') {
        if(CoreStatus === 'Error') return deferrals.done('An unexpected error occurred!\nPlease try again later');
        deferrals.update(`Core modules are not ready yet!\nPlease wait${dots}`);
        await delay(500);
    }

    // Fetching identifiers
    deferrals.update(`Fetching information${dots}`);

    const cPlayer = new Player(cPlayerId)
        .setConnectingAt(Date.now());

    await delay(100);
    deferrals.update(`Checking bans${dots}`);

    await delay(250);
    const cPlayerDatabase = await cPlayer.getDatabase();
    await delay(250);
    let cPlayerOutStandingBans = await cPlayerDatabase.infractions.filter(infraction => infraction.type === 'Ban').filter(infraction => ((infraction.details.timestamp + infraction.details.duration) >= Date.now() || infraction.details.duration === 0));

    if(cPlayerOutStandingBans.length > 0) {
        deferrals.update(`Verifying ban${dots}`);

        /**
         * I wouldn't go through the effort to change this adaptive card, it's very limited in options and it just looks very subtle right now; but hey, you do you!
         * if you do decide to change this adaptive card, here is a website that I used to make this one
         *                             https://adaptivecards.io/designer/
         */
        cPlayerOutStandingBans = cPlayerOutStandingBans.map(ban => ({ 'type': 'Container', 'items': [{ 'type': 'TextBlock', 'text': `**ID**: ${ban._id}`, 'wrap': true, 'fontType': 'default', 'size': 'Default', 'weight': 'Default', 'color': 'Light', 'isSubtle': false }, { 'type': 'TextBlock', 'text': `**Reason**: ${ban.details.reason}`, 'wrap': true, 'fontType': 'default', 'size': 'Default', 'weight': 'Default', 'color': 'Light', 'isSubtle': false }, { 'type': 'TextBlock', 'text': `**Duration**: ${ban.details.duration > 0 ? `${ms((ban.details.timestamp + ban.details.duration) - Date.now(), { long: true })} remining` : 'Indefinite'}`, 'wrap': true, 'fontType': 'default', 'size': 'Default', 'weight': 'Default', 'color': 'Light', 'isSubtle': false } ], 'verticalContentAlignment': 'Center', 'horizontalAlignment': 'Left', 'separator': true, 'spacing': 'Small', 'style': 'default' }));
        return deferrals.presentCard({ 'type': 'AdaptiveCard', 'body': [{ 'type': 'Container', 'items': [ { 'type': 'TextBlock', 'text': '**You have an active ban!**', 'wrap': true, 'size': 'Large', 'weight': 'Bolder', 'color': 'Light', 'isSubtle': false }, { 'type': 'TextBlock', 'text': 'Active bans:', 'wrap': true, 'fontType': 'Monospace', 'size': 'Medium', 'weight': 'Lighter', 'color': 'Light', 'isSubtle': false } ] }, { 'type': 'Container', 'items': cPlayerOutStandingBans, 'style': 'emphasis', 'spacing': 'Small' } ], 'actions': [ { 'type': 'Action.OpenUrl', 'title': 'Need Help?', 'iconUrl': 'https://cdn-icons-png.flaticon.com/128/1660/1660114.png', 'url': Config.core.discord.communityGuild.invite } ] });
    };

    if (!cPlayer.getDiscordId()) return deferrals.done('Discord ID could be detected!');

    if(Config.connection.requireMember.enabled) {
        deferrals.update(`Checking community membership${dots}`);

        const Member = await GetMember(cPlayer.getDiscordId(), Config.core.discord.communityGuild.id);
        if (!Member) return deferrals.done(Config.connection.requireMember.message);
    }

    if(ConnectionsExecutables.onConnecting.length > 0) {
        deferrals.update(`Awaiting additional executions${dots}`);
        for (const fn of ConnectionsExecutables.onConnecting) {
            await fn(cPlayer, deferrals);
        }
    }

    console.log(`^9 ===> ^0${cPlayerId} ^9| ^0${cPlayer.getName()} ^9is connecting^0`);
    Logger.player(`[PUID: ${cPlayer.PUID}] ${cPlayer.getServerId()} | ${cPlayer.getName()} is connecting`);

    deferrals.update(`Adding player to network${dots}`);
    cPlayer.pushToNetwork();

    emit('DiscordFramework:Player:Connecting', cPlayer.getServerId(), deferrals);

    clearInterval(dotsInterval);
    await delay(300);

    deferrals.done();
});

// Triggered when the player's connected request is received by the server
on('playerJoining', async TempID => {
    const jPlayerId = global.source;
    const jPlayer = new Player(TempID)
        .setServerId(jPlayerId)
        .setConnectedAt(Date.now())
        .setJoiningAt(Date.now());

    await delay(750);

    if(ConnectionsExecutables.onJoining.length > 0) {
        for (const fn of ConnectionsExecutables.onJoining) {
            await fn(jPlayer);
        }
    }

    if(!NetworkPlayers.get(jPlayer.getServerId())) { // the only way this could happen, is if the resource were to restart while the player is still joining (in the loadingscreen)
        jPlayer.pushToNetwork();
        await delay(300);
    }

    console.log(`^4 ===> ^0${jPlayer.getServerId()} ^4| ^0${jPlayer.getName()} ^4is joining^0`);
    Logger.player(`[PUID: ${jPlayer.PUID}] ${jPlayer.getServerId()} | ${jPlayer.getName()} is joining`);

    emit('DiscordFramework:Player:Joining', jPlayer);
});

// Triggered when the player is fully connected and is about to spawn
onNet('playerJoined', async PlayerId => {

    while(CoreStatus !== 'Ready') {
        await delay(250);
    }

    const jPlayer = new Player(PlayerId)
        .setJoinedAt(Date.now());

    await delay(1000);

    if(!NetworkPlayers.get(jPlayer.getServerId())) { // the only way this could happen, is if the resource were to restart while the player is in the server
        jPlayer.pushToNetwork();
        await delay(300);
    }

    if(ConnectionsExecutables.onJoined.length > 0) {
        for (const fn of ConnectionsExecutables.onJoined) {
            await fn(jPlayer);
        }
    }

    emit('DiscordFramework:Player:Joined', jPlayer);
    console.log(`^2 ===> ^0${jPlayer.getServerId()} ^2| ^0${jPlayer.getName()} ^2joined^0`);
    Logger.player(`[PUID: ${jPlayer.PUID}] ${jPlayer.getServerId()} | ${jPlayer.getName()} is joined`);

});

// Triggered when a player leaves the server for whatever reason
on('playerDropped', async Reason => {
    const dPlayer = new Player(global.source)
        .setDisconnectedAt(Date.now())
        .setDisconnectReason(Reason);

    if(ConnectionsExecutables.onDisconnected.length > 0) {
        for (const fn of ConnectionsExecutables.onDisconnected) {
            await fn(dPlayer);
        }
    }

    emit('DiscordFramework:Player:Disconnected', dPlayer, Reason);
    console.log(`^1 ===> ^0${dPlayer.getServerId()} ^1| ^0${dPlayer.getName()} ^1 ${Reason === 'Exiting' ? 'left' : Reason}^0`);
    Logger.player(`[PUID: ${dPlayer.PUID}] ${dPlayer.getServerId()} | ${dPlayer.getName()} ${Reason === 'Exiting' ? 'left' : Reason}`);

});


module.exports = {
    /**
     * A pass-through from native JS export to CFX.re exports().
     * This was implemented because requiring a server side file will cause all CFX.re exports() to be nullified/undefined
     * this is a mere workaround to which it provides the ability to use both native JS module.exports and CFX.re export()
     * at the same time.
     *
     * @param {string} Name The desired name of the exports()
     * @param {function} Function The function to be executed upon exports call
     */
    Export: (Name, Function) => {
        emit('DiscordFramework:Export:Create', Name, Function);
    },
    /**
     * The function to be executed on player connection
     * @callback ConnectingExecutableCallbackFn
     * @param {Player} player - The player network object
     * @param {Object} deferrals - The connection defferals object
     */
    /**
     * The function to be executed on player connection
     * @callback OtherExecutableCallbackFn
     * @param {Player} player - The player network object
     */
    /**
     * The ConnectionExecutables is an array of functions that
     * gets executed when a player connection event takes place like,
     * - onConnecting: for when a player is starting to connect
     * - onJoining: for when a player is connected and started to join/load server assests
     * - onJoined: for when a player is fully joined and loaded
     * - onDisconnected: for when a player is disconnect for whatever reason
     */
    ConnectionExecutables: {
        /**
         * Adds a function to the ConnectionExecutables.onConnecting array.
         * @param {ConnectingExecutableCallbackFn} Function The function to execute
         * @example
         * onConnection((player, deferrals) => {
         *      // This code will be executed when the player is connecting
         * })
         */
        onConnecting: Function => {
            ConnectionsExecutables.onConnecting.push(Function);
        },
        /**
         * Adds a function to the ConnectionExecutables.onJoining array.
         * @param {OtherExecutableCallbackFn} Function The function to execute
         * @example
         * onConnection((player) => {
         *      // This code will be executed when the player is joining
         * })
         */
        onJoining: Function => {
            ConnectionsExecutables.onJoining.push(Function);
        },
        /**
         * Adds a function to the ConnectionExecutables.onJoined array.
         * @param {OtherExecutableCallbackFn} Function The function to execute
         * @example
         * onConnection((player) => {
         *      // This code will be executed when the player has joined
         * })
         */
        onJoined: Function => {
            ConnectionsExecutables.onJoined.push(Function);
        },
        /**
         * Adds a function to the ConnectionExecutables.onDisconnected array.
         * @param {OtherExecutableCallbackFn} Function The function to execute
         * @example
         * onConnection((player) => {
         *      // This code will be executed when the player has disconnected
         * })
         */
        onDisconnected: Function => {
            ConnectionsExecutables.onDisconnected.push(Function);
        }
    }
};

