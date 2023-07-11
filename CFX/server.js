/**
 * This registers exports without changing the environment behavior of the calling file
 */
on('DiscordFramework:Export:Create', (Name, Function) => {
    Debug(`Exporting Exports.${Name}`);
    exports(Name, Function);
});


const Logger = require(`${GetResourcePath(GetCurrentResourceName())}/src/components/logger`);

/**
 * Send a labeled log to the console if debug mode is enabled
 * @param {string} msg The message to send to the console if debug mode is enabled
 */
global.Debug = msg => {
    const isDebugEnabled = String(GetResourceMetadata(GetCurrentResourceName(), 'debug_mode', 0)).toLowerCase() === 'true' ? true : false;
    if(!msg) return isDebugEnabled;
    if(isDebugEnabled) console.log(`^5[DEBUG] ^3${msg.split('\n').join('\n        ')}^0`);
    Logger.debug(`${msg.split('\n').join('\n        ')}`);
};


require(`${GetResourcePath(GetCurrentResourceName())}/src/index`);
