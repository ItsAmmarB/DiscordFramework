setImmediate(() => {
    emitNet('playerConnected', GetPlayerServerId(GetPlayerIndex()));
});

onNet('DiscordFramework:Core:Console', text => console.log(text));