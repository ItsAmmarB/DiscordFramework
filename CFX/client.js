setImmediate(() => {
    setTimeout(() => {
        emitNet('playerJoined', GetPlayerServerId(GetPlayerIndex()));
    }, 1500);
});

/**
 * Send a labeled log to the console if debug mode is enabled
 * @param {string} msg The message to send to the console if debug mode is enabled
 */
global.Debug = msg => {
    const isDebugEnabled = String(GetResourceMetadata(GetCurrentResourceName(), 'debug_mode', 0)).toLowerCase() === 'true' ? true : false;
    if(!msg) return isDebugEnabled;
    if(isDebugEnabled) console.log(`^5[DEBUG] ^3${msg.split('\n').join('\n        ')}^0`);
};