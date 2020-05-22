/* eslint-disable no-undef */
RegisterCommand('adrev', (source, args) => {
    exports.DiscordFramework.CheckPermission(source, Config.DeathManager.commands.administration['AdRev'].roles, hasPermission => { // An export that checks if a player has a specific role
        if(hasPermission) {
            const Player = args[0] || source;
            CheckPlayerDeathManager(source, Player, 'AdRev', isValid => {
                if(isValid) {
                    if(Player.toString().toLowerCase() === 'all') {
                        emitNet('DiscordFramework:DeathManager:AdminRevive', -1, source, true);
                        SendMessageDeathManager(source, Config.DeathManager.commands.administration['AdRev'].messages['all']);
                    }
                    else {
                        emitNet('DiscordFramework:DeathManager:AdminRevive', Player, source, false);
                    }
                }
            });
        }
        else{
            SendMessageDeathManager(source, Config.DeathManager.commands.administration['AdRev'].messages['noPermission']); // send the player a message
        }
    });
});

RegisterCommand('adres', (source, args) => {
    exports.DiscordFramework.CheckPermission(source, Config.DeathManager.commands.administration['AdRev'].roles, hasPermission => { // An export that checks if a player has a specific role
        if(hasPermission) {
            const Player = args[0] || source;
            CheckPlayerDeathManager(source, Player, 'AdRes', isValid => {
                if(isValid) {
                    if(Player.toString().toLowerCase() === 'all') {
                        emitNet('DiscordFramework:DeathManager:AdminRespawn', -1, source, true);
                        SendMessageDeathManager(source, Config.DeathManager.commands.administration['AdRes'].messages['all']);
                    }
                    else {
                        emitNet('DiscordFramework:DeathManager:AdminRespawn', Player, source, false);
                    }
                }
            });
        }
        else{
            SendMessageDeathManager(source, Config.DeathManager.commands.administration['AdRes'].messages['noPermission']); // send the player a message
        }
    });
});

RegisterCommand('revive', source => {
    emitNet('DiscordFramework:DeathManager:Revive', source, Config.DeathManager.commands.public.Revive.messages);
});

RegisterCommand('respawn', source => {
    emitNet('DiscordFramework:DeathManager:Respawn', source, Config.DeathManager.commands.public.Respawn.messages);
});

onNet('DiscordFramework:DeathManager:Admin:Return', (Player, Moderator, State, Command) => {
    if(State === 'alive') {
        const Message = [];
        Message.push(Config.DeathManager.commands.administration[Command].messages['alive'][0]);
        Message.push(Config.DeathManager.commands.administration[Command].messages['alive'][1].split('%n').join(GetPlayerName(Player)));
        SendMessageDeathManager(Moderator, Message);
    }
    else if (State === 'revived') {
        const Message = [];
        Message.push(Config.DeathManager.commands.administration[Command].messages[State][0]);
        Message.push(Config.DeathManager.commands.administration[Command].messages[State][1].split('%n').join(GetPlayerName(Player)));
        SendMessageDeathManager(Moderator, Message);
        SendMessageDeathManager(Player, Config.DeathManager.commands.administration[Command].messages[Command]);
    }
    else if (State === 'respawned') {
        const Message = [];
        Message.push(Config.DeathManager.commands.administration[Command].messages[State][0]);
        Message.push(Config.DeathManager.commands.administration[Command].messages[State][1].split('%n').join(GetPlayerName(Player)));
        SendMessageDeathManager(Moderator, Message);
        SendMessageDeathManager(Player, Config.DeathManager.commands.administration[Command].messages[Command]);
    }
    else if (State === 'all') {
        SendMessageDeathManager(Player, Config.DeathManager.commands.administration[Command].messages[Command]);
    }
});

onNet('DiscordFramework:DeathManager:OnJoin:Retrieve', PlayerID => {
    return emitNet('DiscordFramework:DeathManager:OnJoin:Retrieve:Return', PlayerID, Config.DeathManager);
});

function SendMessageDeathManager(player, message) {
    emitNet('chat:addMessage', player, { args: message });
}

function CheckPlayerDeathManager(source, player, command, callback) {
    if(player) {
        if(!isNaN(player)) {
            if(Config.Commands.actionAgainstSelf.enabled || !Config.Commands.actionAgainstSelf.enabled && source !== player) {
                callback(true);
            }
            else{
                SendMessageDeathManager(source, Config.DeathManager.commands.administration[command].messages['notFound']);
            }
        }
        else if (player.toLowerCase() === 'all') {
            callback(true);
        }
        else{
            SendMessageDeathManager(source, Config.DeathManager.commands.administration[command].messages['idNumber']);
        }
    }
    else{
        SendMessageDeathManager(source, Config.DeathManager.commands.administration[command].messages['usage']);
    }
}