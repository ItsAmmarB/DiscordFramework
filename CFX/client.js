onNet('DiscordFramework:DebuggingMode', DebuggingMode => {
    global.debug = msg => {
        if(!DebuggingMode) return;
        console.log(`^5[DEBUG] ^3${msg}^0`);
    };
});

setImmediate(() => {
    setTimeout(() => {
        emitNet('playerJoined', GetPlayerServerId(GetPlayerIndex()));
    }, 1500);
});