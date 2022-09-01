setTimeout(() => {
    emitNet('playerJoined', GetPlayerServerId(GetPlayerIndex()));
}, 1000);