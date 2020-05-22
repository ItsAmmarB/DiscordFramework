/* eslint-disable no-undef */
onNet('DiscordFramework:RPC:MaxPlayers', PlayerID => {
    emitNet('DiscordFramework:RPC:MaxPlayers:Return', PlayerID, GetConvarInt('sv_maxclients', 0));
});