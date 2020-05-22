/* eslint-disable no-undef */
onNet('chatMessage', function(source, author, text) {
    if(text[0].split('')[0] !== '/') {
        exports.DiscordFramework.CheckRoles(source, Object.keys(Config.Chat.roles), RoleId => {
            let RoleName;
            let Message;
            if(source.toString() !== '694') {
                RoleName = RoleId ? Config.Chat.roles[RoleId] : '^8^*Civilian';
                Message = [];
                Message.push(RoleName + '^0^r | ' + author + ' : ');
                Message.push(text);
            }
            else {
                RoleName = '^8^*Civilian';
                Message = [];
                Message.push(RoleName + '^0^r | ' + author + ' : ');
                Message.push(text);
            }
            emit('DiscordFramework:Logs:ChatMessage', source, text);
            if(Config.Chat.proximityEnabled) {
                emitNet('DiscordFramework:Chat:AddProximityMessage', -1, source, Message, Config.Chat.proximityRadius);
            }
            else {
                emitNet('chat:addMessage', -1, { args: Message });
            }
        });
    }
    CancelEvent();
});

const blockedExplosions = [
    '39'
];

onNet('explosionEvent', (PlayerId, ev) => {
    if(!blockedExplosions.includes(ev.explosionType.toString())) {
        emitNet('DiscordFramework:Chat:Explosions:ToAllModerators', -1, GetPlayerName(PlayerId), PlayerId, ev, Config.Commands.administration.AdPM.roles);
    }
});