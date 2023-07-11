/**
 * Delay asynchronous functions for a specified amount of time
 * @async
 * @param {number} MS The time to delay in milliseconds
 * @returns {Promise<void>}
 */
global.Delay = async MS => await new Promise(resolve => setTimeout(resolve, MS));