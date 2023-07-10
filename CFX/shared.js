/**
 * Delay asynchronous functions for a specified amount of time
 * @async
 * @param {number} MS The time to delay in milliseconds
 * @returns {Promise<void>}
 */
global.Delay = async MS => await new Promise(resolve => setTimeout(resolve, MS));

/**
 * Send a labeled log to the console if debug mode is enabled
 * @param {string} msg The message to send to the console if debug mode is enabled
 */
global.Debug = msg => {
    const isDebugEnabled = String(GetResourceMetadata(GetCurrentResourceName(), 'debug_mode', 0)).toLowerCase() === 'true' ? true : false;
    if(isDebugEnabled) console.log(`^5[DEBUG] ^3${msg.split('\n').join('\n        ')}^0`);
};