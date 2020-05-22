/* eslint-disable no-undef */
emitNet('DiscordFramework:Watchlist:PlayerJoined', GetPlayerServerId(GetPlayerIndex()), GetPlayerName(GetPlayerIndex()));


onNet('DiscordFramework:Watchlist:ToModerators', (Message, Roles) => {
    if(!exports.DiscordFramework.CheckPermission(Roles)) return;
    emit('chat:addMessage', { args: Message, multiline : true });
});