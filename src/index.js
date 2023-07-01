require('./core/index');

let isCoreReady = false;
on('DiscordFramework:Core:Ready', () => {
    CountPlaytime();
    GetMember = require('./core/lib/discord/index').helpers.GetMember;
    UpdateMany = require('./core/lib/mongodb/index').helpers.UpdateMany;

    setTimeout(() => isCoreReady = true, 3000); // A 3 seconds timeout to make sure everything is ready
});



const ms = require('ms');

const Config = require('./config');

let GetMember = null;
let UpdateMany = null;

const { NetworkPlayers, Players, Player } = require('./core/bin/player');
const ConnectingPlayers = new Players();

const CountPlaytime = () => setInterval(() => {
    UpdateMany('Players', { '_id': { $in: NetworkPlayers.toArray().filter(p => !p.Server.connections.disconnectedAt).map(p => p.PUID) } }, {
        $inc: { 'details.playtime': 1 },
        $set: { 'details.lastSeenTimestmap': Date.now() }
    });
}, 60000);

const ConnectionExecutables = [];
// Triggered when the player's connection request is received by the server
on('playerConnecting', async (playerName, setKickReason, deferrals) => {

    const cPlayerId = global.source;

    deferrals.defer();

    let dots = '';
    setInterval(() => { dots.length > 3 ? dots = '.' : dots = dots + '.'; }, 750);

    while(!isCoreReady) {
        deferrals.update(`Core modules are not ready yet!\nPlease wait${dots}`);
        await Delay(500);
    }

    // Fetching identifiers
    deferrals.update(`Fetching information${dots}`);

    const cPlayer = new Player(cPlayerId)
        .setStatus('Connecting')
        .setConnectingAt(Date.now());

    deferrals.update(`Checking bans${dots}`);

    await Delay(250);

    const cPlayerDatabase = await cPlayer.getDatabase();
    const cPlayerOutStandingBans = cPlayerDatabase.infractions.filter(infraction => infraction.type === 'Ban' && ((infraction.details.timestamp + infraction.details.duration) >= Date.now() || infraction.details.duration === 0));

    if(cPlayerOutStandingBans.length > 0) {
        deferrals.update(`Verifying ban${dots}`);

        const cPlayerBan = cPlayerOutStandingBans[0];
        return deferrals.presentCard({
            'type': 'AdaptiveCard',
            'body': [
                {
                    'type': 'TextBlock',
                    'text': `You are banned! (BANID:${cPlayerBan._id})`,
                    'size': 'Large',
                    'weight': 'Bolder',
                    'style': 'heading',
                    'wrap': true,
                    'color': 'Attention'
                },
                {
                    'type': 'TextBlock',
                    'text': cPlayerBan.details.duration > 0 ? ms((cPlayerBan.details.timestamp + cPlayerBan.details.duration) - Date.now(), { long: true }) + ' left to unban' : 'This ban permanent!',
                    'isSubtle': true,
                    'wrap': true
                },
                {
                    'type': 'TextBlock',
                    'text': `Reason: ${cPlayerBan.details.reason}`,
                    'wrap': true,
                    'color': 'Warning',
                    'style': 'columnHeader'
                },
                {
                    'type': 'TextBlock',
                    'text': `Moderator: ${cPlayerBan.moderator}`,
                    'wrap': true,
                    'style': 'columnHeader',
                    'size': 'Default',
                    'color': 'Warning'
                }
            ]
        });
    }

    if (!cPlayer.getDiscordId()) return deferrals.done('Discord ID could be detected!');

    if(Config.connection.requireMember.enabled) {
        deferrals.update(`Checking community membership${dots}`);

        const Member = await GetMember(cPlayer.getDiscordId(), Config.core.discord.mainGuild.id);
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
    await Delay(300);

    deferrals.done('');

});

// Triggered when the player's connected request is received by the server
on('playerJoining', async TempID => {
    const jPlayerId = global.source;
    const jPlayer = new Player(TempID)
        .setServerId(jPlayerId)
        .setStatus('Joining')
        .setConnectedAt(Date.now());

    await Delay(500);

    if(!NetworkPlayers.get(jPlayer.getServerId())) { // the only way this could happen, is if the resource were to restart while the player is still joining (in the loadingscreen)
        jPlayer
            .setConnectingAt('Resource Restarted!')
            .pushToNetwork();
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
        .setStatus('Joined')
        .setJoinedAt(Date.now());

    await Delay(1000);

    if(!NetworkPlayers.get(jPlayer.getServerId())) { // the only way this could happen, is if the resource were to restart while the player is in the server
        jPlayer
            .setConnectingAt('Resource Restarted!')
            .setConnectedAt('Resource Restarted!')
            .pushToNetwork();
        await Delay(300);
    }

    emit('DiscordFramework:Player:Joined', jPlayer);
    console.log(`^2 ===> ^0${jPlayer.getServerId()} ^2| ^0${jPlayer.getName()} ^2joined^0`);
});

// Triggered when a player leaves the server for whatever reason
on('playerDropped', Reason => {
    const dPlayer = new Player(global.source)
        .setStatus('Disconnected')
        .setDisconnectedAt(Date.now())
        .setDisconnectReason(Reason);

    emit('DiscordFramework:Player:Disconnected', dPlayer, Reason);
    console.log(`^1 ===> ^0${dPlayer.getServerId()} ^1| ^0${dPlayer.getName()} ^1 ${Reason === 'Exiting' ? 'left' : Reason}^0`);
});

RegisterCommand('players', () => {
    console.log(Players);
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
     * @param {function} Function The function to be executed upon call
     */
    Export: (Name, Function) => {
        emit('DiscordFramework:Export:Create', Name, Function);
    },
    /**
     * Adds a function to the ConnectionExecutables array.
     * The ConnectionExecutables is an array of functions that
     * gets executed when the player connection handshake is about
     * to finish are the player is about to join
     * @param {function(player<Player.prototype>, deferrals<object>)} Function The function to execute on player connection
     * @return {void}
     */
    ConnectionCheck: Function => ConnectionExecutables.push(Function)
};
