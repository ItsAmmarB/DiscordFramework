const Extension = require('./extension');

/**
 * A modified Set() to enhance extensions management
 * @returns {Set<Extension>}
 */
const Extensions = new class Extensions extends Set {
    /**
     * Gets the specified extension if available
     * @param {string} name The name of the extension
     * @returns {Extension} extension details
     */
    get(name) {
        return this.toArray().find(e => e.name === name);
    }

    /**
     * Returns the Extensions Set() as an array
     * @returns {Extension[]} Array of Extensions
     */
    toArray() {
        return Array.from(this.values(), element => element);
    }
};

module.exports = Extensions;