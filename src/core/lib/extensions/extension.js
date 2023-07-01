const Extensions = class Extensions extends Set {
    /**
     * Gets the specified extension if available
     * @param {string} name The name of the extension
     * @returns {object} extension details
     */
    get(name) {
        return this.toArray().find(e => e.Name === name);
    }

    /**
     * Returns the players Collection as an array
     * @returns {(Array<object>)} Array of players objects
     */
    toArray() {
        return Array.from(this.values(), element => element);
    }

};