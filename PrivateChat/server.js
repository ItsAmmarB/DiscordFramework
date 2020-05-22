/* eslint-disable no-undef */

RegisterCommand('nc', (playerId, args) => {
    ExecuteChatMessage(playerId, args, 'nitro');
});

RegisterCommand('dc', (playerId, args) => {
    ExecuteChatMessage(playerId, args, 'donator');
});

RegisterCommand('sc', (playerId, args) => {
    ExecuteChatMessage(playerId, args, 'staff');
});

RegisterCommand('ec', (playerId, args) => {
    ExecuteChatMessage(playerId, args, 'executive');
});

function ExecuteChatMessage(playerId, args, type) {
    exports.DiscordFramework.CheckPermission(playerId, Config.PrivateChat[type].roles, hasPermission => {
        if(hasPermission) {
            if(args[0]) {
                const Message = [];
                Message.push(Config.PrivateChat[type].message[0]);
                Message.push(Config.PrivateChat[type].message[1].split('%n').join(GetPlayerName(playerId)).split('%i').join(playerId).split('%m').join(args.join(' ')));
                emitNet('DiscordFramework:PrivateChat:ExecuteMessage', -1, Config.PrivateChat[type].roles, Message);
            }
            else{
                emitNet('DiscordFramework:PrivateChat:ShowNotification', playerId, '~o~Usage: /' + Config.PrivateChat[type].command + ' [MSG]');
            }
        }
        else{
            emitNet('DiscordFramework:PrivateChat:ShowNotification', playerId, '~r~Insufficient Permission');
        }
    });
}