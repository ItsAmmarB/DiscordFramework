const ms = require('ms');

const { NetworkPlayers, PlayersSet } = require('./components/players');
const { Player } = require('./components/player');

const Config = require('../../../config');
const Logger = require('../../../components/logger');
const { delay } = require('../../../utils/functions');


const Connections = {
    onConnecting: [],
    onJoining: [],
    onJoined: [],
    onDisconnected: []
};

setTimeout(() => { emit('DiscordFramework:Core:Module:Ready', 'Players'); }, 250);

let CoreStatus = 'Starting';
let GetMember = null;

on('DiscordFramework:Core:Ready', () => {
    CoreStatus = 'Ready';
    GetMember = require('../../index').Discord.module.helpers.GetMember;

    const { UpdateMany } = require('../../index').MongoDB.module.helpers;
    setInterval(() => {
        UpdateMany('Players', { '_id': { $in: NetworkPlayers.filter(['Joined', '!Disconnected']).map(p => p.PUID) } }, {
            $inc: { 'information.playtime': 1 },
            $set: { 'information.lastSeenTimestmap': Date.now() }
        });
    }, 2000);
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

    if(Connections.onConnecting.length > 0) {
        deferrals.update(`Awaiting additional executions${dots}`);
        for (const fn of Connections.onConnecting) {
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

    if(Connections.onJoining.length > 0) {
        for (const fn of Connections.onJoining) {
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

    if(Connections.onJoined.length > 0) {
        for (const fn of Connections.onJoined) {
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

    if(Connections.onDisconnected.length > 0) {
        for (const fn of Connections.onDisconnected) {
            await fn(dPlayer);
        }
    }

    emit('DiscordFramework:Player:Disconnected', dPlayer, Reason);
    console.log(`^1 ===> ^0${dPlayer.getServerId()} ^1| ^0${dPlayer.getName()} ^1 ${Reason === 'Exiting' ? 'left' : Reason}^0`);
    Logger.player(`[PUID: ${dPlayer.PUID}] ${dPlayer.getServerId()} | ${dPlayer.getName()} ${Reason === 'Exiting' ? 'left' : Reason}`);

});


if(Debug) {
    RegisterCommand('DF_Players', (source, args) => {
        if(source > 0) return console.log('ServerFX terminal command only!');
        if(!args[0]) return console.log(NetworkPlayers);
        return console.log(NetworkPlayers.filter(args.join('')));
    });
    RegisterCommand('DF_Player', (source, args) => {
        if(source > 0) return console.log('ServerFX terminal command only!');
        if(!args[0]) return console.log('missing 1 argument (player identifer)');
        const _Player = NetworkPlayers.get(args[0]);
        if(!_Player) return console.log('Player not found!');
        return console.log(_Player);
    });
}


module.exports = {
    helpers: {
        NetworkPlayers,
        PlayersSet,
        Player,
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
         * The Connections is an array of functions that
         * gets executed when a player connection event takes place like,
         * - onConnecting: for when a player is starting to connect
         * - onJoining: for when a player is connected and started to join/load server assests
         * - onJoined: for when a player is fully joined and loaded
         * - onDisconnected: for when a player is disconnect for whatever reason
         */
        Connections: {
            /**
             * Adds a function to the Connections.onConnecting array.
             * @param {ConnectingExecutableCallbackFn} Function The function to execute
             * @example
             * onConnection((player, deferrals) => {
             *      // This code will be executed when the player is connecting
             * })
             */
            onConnecting: Function => {
                Connections.onConnecting.push(Function);
            },
            /**
             * Adds a function to the Connections.onJoining array.
             * @param {OtherExecutableCallbackFn} Function The function to execute
             * @example
             * onConnection((player) => {
             *      // This code will be executed when the player is joining
             * })
             */
            onJoining: Function => {
                Connections.onJoining.push(Function);
            },
            /**
             * Adds a function to the Connections.onJoined array.
             * @param {OtherExecutableCallbackFn} Function The function to execute
             * @example
             * onConnection((player) => {
             *      // This code will be executed when the player has joined
             * })
             */
            onJoined: Function => {
                Connections.onJoined.push(Function);
            },
            /**
             * Adds a function to the Connections.onDisconnected array.
             * @param {OtherExecutableCallbackFn} Function The function to execute
             * @example
             * onConnection((player) => {
             *      // This code will be executed when the player has disconnected
             * })
             */
            onDisconnected: Function => {
                Connections.onDisconnected.push(Function);
            }
        }
    }
};