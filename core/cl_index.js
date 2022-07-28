setImmediate(() => {
    emitNet('playerJoined', GetPlayerServerId(GetPlayerIndex()));
});