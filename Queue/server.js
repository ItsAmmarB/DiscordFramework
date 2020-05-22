/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const Queue = {
    PlayersCount: 0,
    QueueList: [],
    ConnectionsList: [],
    ConnectedPlayers: {}
};

onNet('DiscordFramework:Queue:Refresh:Server', (PlayerID, PlayerName) => {
    const UpdatedConnections = Queue.ConnectionsList.filter(element => element.PlayerName !== PlayerName);
    Queue.ConnectionsList = UpdatedConnections;
    Queue.ConnectedPlayers[PlayerID] = PlayerName;
    Queue.PlayersCount = Object.keys(Queue.ConnectedPlayers).length;
});

function PlayerDropped(PlayerID, reason) {
    if (Queue.ConnectedPlayers[PlayerID]) {
        console.debug(Config.Queue.consoleColor.FgRed, Queue.ConnectedPlayers[PlayerID] + ' Left | Reason: ' + reason, Config.Queue.consoleColor.Reset);
        delete Queue.ConnectedPlayers[PlayerID];
        Queue.PlayersCount = Object.keys(Queue.ConnectedPlayers).length;
        Queue_Push();
    }
}

function PlayerConnecting(PlayerID, PlayerName, DiscordID, PlayerRoles, Deferrals) {
    if(!Config.Queue.whitelistEnabled || Config.Queue.whitelistEnabled && PlayerRoles.find(role => Config.Queue.whiltelistedRoles.includes(role)) || Config.Queue.whitelistEnabled && PlayerRoles.includes(Config.Permissions.ownerRole) || Config.Queue.whitelistEnabled && Config.Permissions.discordAdmin && PlayerRoles.includes('Full')) {
        if(Config.Queue.enabled) {
            if (Queue.PlayersCount + Queue.ConnectionsList.length > Config.Queue.maxPlayers - 1 || Queue.QueueList.length > 0) {
                if (!Queue.QueueList.find(element => element.PlayerDiscordID === DiscordID)) {
                    const Roles = Object.keys(Config.Queue.rolesPoints);
                    const PlayerQueueObject = {
                        PlayerID: PlayerID,
                        PlayerName: PlayerName,
                        PlayerDiscordID: DiscordID,
                        PlayerPriorityPower: Config.Queue.defaultPoint,
                        Deferrals: Deferrals,
                        QueueTimeouts: 0
                    };
                    for (let i = 0; i < Roles.length; i++) {
                        const Role = Roles[i];
                        if (PlayerRoles.includes(Role)) {
                            PlayerQueueObject.PlayerPriorityPower = Config.Queue.rolesPoints[Roles[i]];
                            break;
                        }
                    }
                    Queue.QueueList.push(PlayerQueueObject);
                    Queue_Rearrange();
                }
                else {
                    Queue.QueueList.find(element => element.PlayerDiscordID === DiscordID).PlayerID = PlayerID;
                    Queue.QueueList.find(element => element.PlayerDiscordID === DiscordID).Deferrals = Deferrals;
                    Queue_Rearrange();
                }
            }
            else {
                const PlayerConnectionsListeObject = {
                    PlayerID: PlayerID,
                    PlayerName: PlayerName,
                    PlayerDiscordID: DiscordID,
                    PlayerPriorityPower: 'Direct Join',
                    ConnectingTimestamp: Date.now(),
                    QueueTimeouts: 0
                };
                Queue.ConnectionsList.push(PlayerConnectionsListeObject);
                Deferrals.done();
            }
        }
        else {
            Deferrals.done();
        }
    }
    else {
        Deferrals.done('DiscordFramework: ' + Config.Queue.messages.whitelist);
    }
}


// Queue Checker
setInterval(() => {
    if (Queue.QueueList[0]) {
        Queue.QueueList.forEach(queuee => {
            if (!GetPlayerEndpoint(queuee.PlayerID) && queuee.QueueTimeouts < 1) {
                queuee.QueueTimeouts = 1;
                setTimeout(() => {
                    if (!GetPlayerEndpoint(queuee.PlayerID)) {
                        const UpdatedQueue = Queue.QueueList.filter(element => element.PlayerID !== queuee.PlayerID);
                        Queue.QueueList = UpdatedQueue;
                        Queue_Rearrange();
                    }
                    else if (GetPlayerEndpoint(queuee.PlayerID) && queuee.QueueTimeouts > 0) {
                        queuee.QueueTimeouts = 0;
                    }
                }, Config.Queue.queueTimeout * 1000);
            }
        });
    }
}, 5000);

// Connection Checker [mid-loading]
setInterval(() => {
    if (Queue.ConnectionsList[0]) {
        Queue.ConnectionsList.forEach(connectee => {
            if (!GetPlayerEndpoint(connectee.PlayerID)) {
                const UpdatedConnections = Queue.ConnectionsList.filter(element => element.PlayerID !== connectee.PlayerID);
                DropPlayer(connectee.PlayerID, 'DiscordFramework: Connection timed out!');
                Queue.ConnectionsList = UpdatedConnections;
            }
        });
    }
}, 5000);

setInterval(() => {
    Queue.ConnectedPlayers = {};
    Queue.PlayersCount = 0;
    emitNet('DiscordFramework:Queue:Refresh:Client', -1);
}, 30000);

setInterval(() => {
    const QueueLength = Object.keys(Queue.QueueList).length;
    if(QueueLength > 0) {
        ExecuteCommand(`set Queue Enabled;_${QueueLength}_player_in_queue`);
    }
    else {
        ExecuteCommand('set Queue Disabled;_Server_isn\'t_full');
    }
}, 10000);

ExecuteCommand(`set Framework DiscordFramework_v${version}`);


function Queue_Push() {
    if (Queue.QueueList[0]) {
        Queue.QueueList[0].Deferrals.update(Config.Queue.messages.joining);
        setTimeout(() => {
            Queue.QueueList[0].Deferrals.done();
            Queue.ConnectionsList.push(Queue.QueueList[0]);
            Queue.QueueList.shift();
            Queue_Rearrange();
        }, 500);
    }
}

function Queue_Rearrange() {
    Queue.QueueList = Queue.QueueList.sort((elementA, elementB) => parseFloat(elementB.PlayerPriorityPower) - parseFloat(elementA.PlayerPriorityPower));
    Queue.QueueList.forEach(queuee => {
        const QueuePosition = Queue.QueueList.findIndex(element => element.PlayerID === queuee.PlayerID) + 1;
        queuee.Deferrals.update(Config.Queue.messages.position.split('%s')[0] + QueuePosition + ' of ' + Queue.QueueList.length + Config.Queue.messages.position.split('%s')[1]);
    });
}