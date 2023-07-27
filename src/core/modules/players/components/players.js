/**
 * A modified Set() that was made to make player details management a lot easier and simpler to obtain and utilize
 */
const PlayersSet = class PlayersSet extends Set {
    /**
     * Get the last entry belonging to the specified player's identifier; including entries where the player had disconnected
     * @param {String} Identifier A value that identifies a player, it can a sever id, discord id, or an identifier such as license or ip.
     * @returns {Player} Player
     */
    get(Identifier) {
        // Check if Queries is not an instance of object/array
        if (!Identifier) return new Error('Players.prototype.get(Identifier) ---> Unknown Identifier');
        if (typeof Identifier === 'object' && Array.isArray(Identifier)) {
            const returnable = [];
            for (let i = 0; i < Identifier.length; i++) {
                const identifier = this.get(Identifier[i]);
                returnable.push(identifier);
            }
            return returnable;
        }
        else {
            Identifier = String(Identifier);
            const ValIden = this.validateIdentifier(Identifier);
            if (ValIden === 'Server') {
                const _Players = this.toArray();
                const _Player = _Players.filter(player => String(player.server.id) === Identifier).sort((a, b) => b.server.id - a.server.id)[0];
                if (_Player) {
                    return _Player;
                }
                else {
                    return undefined;
                }
            }
            else if (ValIden === 'Discord') {
                const _Players = this.toArray();
                const _Player = _Players.filter(player => String(player.discord.id) === Identifier).sort((a, b) => b.server.id - a.server.id)[0];
                if (_Player) {
                    return _Player;
                }
                else {
                    return undefined;
                }
            }
            else if (ValIden === 'Identifier') {
                const _Players = this.toArray();
                const _Player = _Players.filter(player => player.server.identifiers.map(iden => String(iden).toLowerCase()).find(iden => iden === Identifier)).sort((a, b) => b.server.id - a.server.id)[0];
                if (_Player) {
                    return _Player;
                }
                else {
                    return undefined;
                }
            }
            else if (ValIden === 'PUID') {
                const _Players = this.toArray();
                const _Player = _Players.filter(player => String(player.PUID) === Identifier).sort((a, b) => b.server.id - a.server.id)[0];
                if (_Player) {
                    return _Player;
                }
                else {
                    return undefined;
                }
            }
            else {
                return new Error('Players.prototype.get(Identifier) ---> Unknown Identifier');
            }
        }

    }

    /**
     * Returns the Players Collection as an array
     * @returns {Player[]} Array of players objects
     */
    toArray() {
        return Array.from(this.values(), element => element);
    }

    /**
     * Filters the network player to any of the available conditions
     * @param {Array.<('Connecting' | '!Connecting' | 'Connected' | '!Connected' | 'Joining' | '!Joining' | 'Joined' | '!Joined' | 'Disconnected' | '!Disconnected')>} filters - The available filters to filter out the player from the network players
     * @returns {Player[]} An array of the filtered players
     * @example
     * NetworkPlayers.filter(['Joined', '!Disconnected']) // this will return an array of the players who had joined and didn't leave
     * NetworkPlayers.filter(['Connecting', '!Connected', 'Disconnected']) // this will return an array of the players who started connecting but left before joining
     */
    filter(filters) {
        if(typeof filters !== 'object' && !Array.isArray(filters)) {
            if(typeof filters === 'string') {
                filters = [...filters.split('[')[1].split(']')[0].split(',').map(f => f.split('\'')[1])];
            }
            else {
                return console.error('PlayerSet.filter(filters) Filters parameter must be an array!');
            }
        }
        return this.toArray().filter(player => {
            let filter = player.server.connections.status;

            if(filters.find(f => f === 'Connecting')) {
                filter = filter && player.server.connections.connectingAt;
            }
            if(filters.find(f => f === '!Connecting')) {
                filter = filter && !player.server.connections.connectingAt;
            }

            if(filters.find(f => f === 'Connected')) {
                filter = filter && player.server.connections.connectedAt;
            }
            if(filters.find(f => f === '!Connected')) {
                filter = filter && !player.server.connections.connectedAt;
            }

            if(filters.find(f => f === 'Joining')) {
                filter = filter && player.server.connections.joiningAt;
            }
            if(filters.find(f => f === '!Joining')) {
                filter = filter && !player.server.connections.joiningAt;
            }

            if(filters.find(f => f === 'Joined')) {
                filter = filter && player.server.connections.joinedAt;
            }
            if(filters.find(f => f === '!Joined')) {
                filter = filter && !player.server.connections.joinedAt;
            }

            if(filters.find(f => f === 'Disconnected')) {
                filter = filter && player.server.connections.disconnectedAt;
            }
            if(filters.find(f => f === '!Disconnected')) {
                filter = filter && !player.server.connections.disconnectedAt;
            }

            return filter;
        });
    }

    /**
     * Checks whether the provided player identifier is an actual identifier
     * @param {string|number} Identifier A player identifier of any kind
     * @returns {('Identifier'|'Discord'|'Server'|'PUID')|undefined} The identifier type
     * @example
     * NetworkPlayers.validateIdentifier('fivem:63953')
     * // output: 'Identifier'
     */
    validateIdentifier(Identifier) {
        if (Identifier.includes('license:') && typeof Identifier === 'string' ||
            Identifier.includes('discord:') && typeof Identifier === 'string' ||
            Identifier.includes('live:') && typeof Identifier === 'string' ||
            Identifier.includes('ip:') && typeof Identifier === 'string' ||
            Identifier.includes('xbl:') && typeof Identifier === 'string' ||
            Identifier.includes('fivem:') && typeof Identifier === 'string') {
            return 'Identifier';
        }
        if (!isNaN(Identifier)) {
            if(Identifier.length < 10) {
                return 'Server';
            }
            else if (Identifier.length >= 17 && Identifier.length <= 21) {
                return 'Discord';
            }
        }
        else if(isNaN(Identifier)) {
            if(Identifier.length >= 24) {
                return 'PUID';
            }
        }
        return undefined;
    }
};

module.exports = {
    PlayersSet,
    /**
     * The players information since the last server start
     * @return {Players}
     */
    NetworkPlayers: new PlayersSet()
};