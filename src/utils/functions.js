/**
 * Delays asynchronous functions for a specified amount of time using a promise
 * @async
 * @param {number} MS The time to delay in milliseconds
 * @returns {Promise<void>}
 */
module.exports.delay = async (MS) =>
  await new Promise((resolve) => setTimeout(resolve, MS));
