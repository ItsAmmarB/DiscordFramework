setImmediate(() => {
    emitNet('playerConnected', GetPlayerServerId(GetPlayerIndex()));
});