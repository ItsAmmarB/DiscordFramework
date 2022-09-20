setImmediate(() => {
    setTimeout(() => {
        emitNet('playerJoined', GetPlayerServerId(GetPlayerIndex()));
    }, 1500);
});