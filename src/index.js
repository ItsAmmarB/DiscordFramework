const ms = require('ms');

require('./core/index');

const Config = require('./config');
const { Player, NetworkPlayers } = require('./components/player');

const ConnectionExecutables = [];

let isCoreReady = false;
let GetMember = null;
let UpdateMany = null;


on('DiscordFramework:Core:Ready', () => {
    GetMember = require('./core/lib/discord/index').helpers.GetMember;
    UpdateMany = require('./core/lib/mongodb/index').helpers.UpdateMany;

    isCoreReady = true;

    setInterval(() => {
        UpdateMany('Players', { '_id': { $in: NetworkPlayers.filter(['!Disconnected']).map(p => p.PUID) } }, {
            $inc: { 'details.playtime': 1 },
            $set: { 'details.lastSeenTimestmap': Date.now() }
        });
    }, 60000);
});

// Triggered when the player's connection request is received by the server
on('playerConnecting', async (playerName, setKickReason, deferrals) => {
    const cPlayerId = global.source;

    deferrals.defer();

    let dots = '';
    const dotsInterval = setInterval(() => { dots.length > 3 ? dots = '.' : dots = dots + '.'; }, 750);

    while(!isCoreReady) {
        deferrals.update(`Core modules are not ready yet!\nPlease wait${dots}`);
        await Delay(500);
    }

    // Fetching identifiers
    deferrals.update(`Fetching information${dots}`);

    const cPlayer = new Player(cPlayerId)
        .setConnectingAt(Date.now());

    await Delay(100);
    deferrals.update(`Checking bans${dots}`);

    await Delay(250);
    const cPlayerDatabase = await cPlayer.getDatabase();
    await Delay(250);
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

    emit('DiscordFramework:Player:Connecting', cPlayer.getServerId(), deferrals);

    if(ConnectionExecutables.length > 0) {
        deferrals.update(`Awaiting additional executions${dots}`);
        for (const fn of ConnectionExecutables) {
            console.log(fn);
            await fn(cPlayer, deferrals);
        }
    }

    console.log(`^9 ===> ^0${cPlayerId} ^9| ^0${cPlayer.getName()} ^9is connecting^0`);
    deferrals.update(`Adding player to network${dots}`);
    cPlayer.pushToNetwork();
    clearInterval(dotsInterval);
    await Delay(300);

    deferrals.done();
});

// Triggered when the player's connected request is received by the server
on('playerJoining', async TempID => {
    const jPlayerId = global.source;
    const jPlayer = new Player(TempID)
        .setServerId(jPlayerId)
        .setConnectedAt(Date.now())
        .setJoiningAt(Date.now());

    await Delay(500);

    if(!NetworkPlayers.get(jPlayer.getServerId())) { // the only way this could happen, is if the resource were to restart while the player is still joining (in the loadingscreen)
        jPlayer.pushToNetwork();
        await Delay(300);
    }

    console.log(`^4 ===> ^0${jPlayer.getServerId()} ^4| ^0${jPlayer.getName()} ^4is joining^0`);
    emit('DiscordFramework:Player:Joining', jPlayer);
});

// Triggered when the player is fully connected and is about to spawn
onNet('playerJoined', async PlayerId => {

    while(!isCoreReady) {
        await Delay(500);
    }

    const jPlayer = new Player(PlayerId)
        .setJoinedAt(Date.now());

    await Delay(1000);

    if(!NetworkPlayers.get(jPlayer.getServerId())) { // the only way this could happen, is if the resource were to restart while the player is in the server
        jPlayer.pushToNetwork();
        await Delay(300);
    }

    emit('DiscordFramework:Player:Joined', jPlayer);
    console.log(`^2 ===> ^0${jPlayer.getServerId()} ^2| ^0${jPlayer.getName()} ^2joined^0`);
});

// Triggered when a player leaves the server for whatever reason
on('playerDropped', Reason => {
    const dPlayer = new Player(global.source)
        .setDisconnectedAt(Date.now())
        .setDisconnectReason(Reason);

    emit('DiscordFramework:Player:Disconnected', dPlayer, Reason);
    console.log(`^1 ===> ^0${dPlayer.getServerId()} ^1| ^0${dPlayer.getName()} ^1 ${Reason === 'Exiting' ? 'left' : Reason}^0`);
});


module.exports = {
    /**
     * The current state of the core
     * @return {boolean} True of False
     */
    Status: isCoreReady,
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
     * @callback onConnectionFunction
     * @param {Player} player - The player network object
     * @param {Object} deferrals - The connection defferals object
     */
    /**
     * Adds a function to the ConnectionExecutables array.
     * The ConnectionExecutables is an array of functions that
     * gets executed when the player connection handshake is about
     * to finish and the player is about to join
     * @param {onConnectionFunction} Function The function to execute on player connection
     * @example
     * onConnection((player, deferrals) => {
     *      // This code will be executed on player connection
     * })
     */
    onConnection: Function => {
        ConnectionExecutables.push(Function);
    }
};