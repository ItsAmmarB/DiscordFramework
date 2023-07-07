/**
 * Delay asynchronous functions for a specified amount of time
 * @async
 * @param {number} MS The time to delay in milliseconds
 * @returns {Promise}
 */
global.Delay = async MS => await new Promise(resolve => setTimeout(resolve, MS));

const Debug = msg => {
    const isDebugEnabled = String(GetResourceMetadata(GetCurrentResourceName(), 'debug_mode', 0)).toLowerCase() === 'true' ? true : false;
    if(isDebugEnabled) console.log(`^5[DEBUG] ^3${msg}^0`);
};


onNet('DiscordFramework:DebuggingMode', DebuggingMode => {
    console.log(DebuggingMode);
    console.log('Shared');
});