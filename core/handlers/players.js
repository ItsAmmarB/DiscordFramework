const Collection = class Players extends Set {
    /**
     *
     * @param {String} Identifier A value that identifies a player, it can a sever id, discord id, or an identifier such as license or ip.
     * @returns {(object|any)} Player
     */
    get(Identifier) {
        // Check if Queries is not an instance of object/array
        if (!Identifier) return new Error('Collection.prototype.get(Identifier) ---> Unknown Identifier');
        if (typeof Identifier === 'object' && Array.isArray(Identifier)) {
            const returnable = [];
            for (let i = 0; i < Identifier.length; i++) {
                const identifier = this.get(Identifier[i]);
                returnable.push(identifier);
            }
            return returnable;
        } else {
            Identifier = String(Identifier);
            const ValIden = this.#ValidateIdentifier(Identifier);
            if (ValIden === 'Server') {
                const _Players = this.toArray();
                const Player = _Players.find(player => String(player.ServerId) === Identifier);
                if (Player) {
                    return Player;
                } else {
                    return undefined;
                }
            } else if (ValIden === 'Discord') {
                const _Players = this.toArray();
                const Player = _Players.find(player => String(player.DiscordId) === Identifier);
                if (Player) {
                    return Player;
                } else {
                    return undefined;
                }
            } else if (ValIden === 'Identifier') {
                const _Players = this.toArray();
                const Player = _Players.find(player => player.Identifiers.map(iden => String(iden).toLowerCase()).find(iden => iden === Identifier));
                if (Player) {
                    return Player;
                } else {
                    return undefined;
                }
            } else {
                return new Error('Collection.prototype.get(Identifier) ---> Unknown Identifier');
            }
        }

    }

    /**
     * Returns the players Collection as an array
     * @returns {(Array<object>)} Array of players objects
     */
    toArray() {
        return Array.from(this.values(), element => element);
    }

    #ValidateIdentifier(Identifier) {
        if (Identifier.includes('license:') && typeof Identifier === 'string' ||
            Identifier.includes('discord:') && typeof Identifier === 'string' ||
            Identifier.includes('live:') && typeof Identifier === 'string' ||
            Identifier.includes('ip:') && typeof Identifier === 'string' ||
            Identifier.includes('xbl:') && typeof Identifier === 'string' ||
            Identifier.includes('fivem:') && typeof Identifier === 'string') {
            return 'Identifier';
        }
        if (!isNaN(Identifier)) {
            if (Identifier.length > 10) {
                return 'Discord';
            } else {
                return 'Server';
            }
        }
        return undefined;
    }
};

/**
 * A class constructor for player
 * @param {number} PlayerId The player server ID
 */
const Player = class Player {
    constructor(PlayerId) {
        this.Name = GetPlayerName(PlayerId);
        this.ServerId = PlayerId;
        this.DiscordId = null;
        this.Identifiers = Player.GetIdentifiers(PlayerId, true);
        this.Connections = {
            Status: 'Joining',
            ConnectingAt: Date.now(),
            JoinedAt: null,
            DisconnectedAt: null,
            DisconnectReason: null
        };

        this.Cache = {
        }; // extensions and different resources can store things here and use it

        if (this.Identifiers.find(identifier => identifier.includes('discord:')).split(':')[1]) {
            this.DiscordId = this.Identifiers.find(identifier => identifier.includes('discord:')).split(':')[1];
        }

        this.#Events();

    }

    /**
     * Returns the player name
     * @return {string}
     */
    getName() {
        return this.Name;
    }

    /**
     * Returns the player server ID
     * @return {string}
     */
    getServerId() {
        return this.ServerId;
    }

    /**
     * Returns the player discord ID if available
     * @return {(string|undefined)}
     */
    getDiscordId() {
        return this.DiscordId;
    }

    /**
     * Returns an array of the player identifiers
     * @return {Array<string>}
     */
    getIdentifiers() {
        return this.Identifiers;
    }

    /**
     * Returns the current player status
     * @return {Array<string>}
     */
    getStatus() {
        return this.Connections.Status;
    }

    /**
     * Sets the player status
     * @param {string} Status The new player status
     */
    setStatus(Status) {
        this.Connections.Status = Status;
    }

    /**
     * Returns the player connections timestamps
     * @return {object}
     */
    getConnections() {
        return this.Connections;
    }

    /**
     * Sets the timestamp when the player starting connecting
     * @param {number} timestamp A Unix timestamp
     */
    setConnectingAt(timestamp) {
        this.Connections.ConnectingAt = timestamp;
    }

    /**
     * Sets the timestamp when the player fully connected
     * @param {number} timestamp A Unix timestamp
     */
    setConnectedAt(timestamp) {
        this.Connections.ConnectedAt = timestamp;
    }

    /**
     * Sets the timestamp when the player disconnected
     * @param {number} timestamp A Unix timestamp
     */
    setDisconnectedAt(timestamp) {
        this.Connections.DisconnectedAt = timestamp;
    }

    /**
     * Sets the timestamp when the player disconnected
     * @param {string} reason Why the player disconnected
     */
    setDisconnectReason(reason) {
        this.Connections.DisconnectReason = reason;
    }

    /**
     * Return the player's current ped model
     * @return {any}
     */
    getPed() {
        return GetPlayerPed(this.ServerId);
    }

    /**
     * Sets the player's ped model
     * @param {hash} model
     */
    setPed(model) {
        SetPlayerModel(this.ServerId, model);
    }

    /**
     * Returns whether the player is invincible or not
     * @return {boolean}
     */
    getInvincible() {
        return GetPlayerInvincible(this.ServerId);
    }

    /**
     * Sets the player's invincibility
     * @param {boolean} bool
     */
    setInvincible(bool) {
        SetPlayerInvincible(this.ServerId, bool);
    }

    /**
     * Returns whether the player is evading the wanted level, meaning that the wanted level stars are blink.
     * @return {boolean}
     */
    getIsEvadingWantedLevel() {
        return IsPlayerEvadingWantedLevel(this.ServerId);
    }

    /**
     * Returns the player's current wanted level
     * @return {number}
     */
    getWantedLevel() {
        return GetPlayerWantedLevel(this.ServerId);
    }

    /**
     * Sets the player's wanted level
     * @param {number} level 0 - 5 representing the stars
     */
    setWantedLevel(level) {
        SetPlayerWantedLevel(this.ServerId, level, false);
    }

    /**
     * Returns the player's current coordinates
     * @return {Array<number>} [X, Y, Z]
     */
    getCoordinates() {
        return GetEntityCoords(this.ped);
    }

    /**
     * Returns the player's current coordinates
     * @param {Array<number>} coords [X, Y, Z]
     */
    setCoordinates(coords) {
        SetEntityCoords(this.ped, ...coords, false, false, false, false);
    }

    /**
     * Returns the player's current speed
     * @return {number}
     */
    getSpeed() {
        return GetEntitySpeed(this.ped);
    }

    /**
     * Returns whether the player is frozen in place or not
     * @return {boolean}
     */
    getFreezePosition() {
        return this.Cache.Frozen;
    }

    /**
     * Sets the player's freeze status
     * @param {boolean} bool True or False
     */
    setFreezePosition(bool) {
        FreezeEntityPosition(this.ped, bool);
        this.Cache.Frozen = bool;
    }

    /**
     * Returns the player's current armour status
     * @return {boolean}
     */
    getArmour() {
        return GetPedArmour(this.ped);
    }

    /**
     * Sets the player's current armour
     * @param {number} armour 0 - 100 indicating the value to set the Ped's armor to
     */
    setArmour(armour) {
        SetPedArmour(this.ped, armour);
    }

    /**
     * Returns the player's current health
     * @return {number} 0 - 200 indicating the value of the player's health
     */
    getHealth() {
        return GetEntityHealth(this.ped);
    }

    /**
     * Returns the player's current weapon in hand
     * @return {hash} hash of weapon in hand
     */
    getWeaponInHand() {
        return GetSelectedPedWeapon(this.ped);
    }

    /**
     * Returns the vehicle if the player is in a vehicle; otherwise undefined
     * @return {entitiy} Vehicle
     */
    getVehicle() {
        const vehicle = GetVehiclePedIsIn(this.ped, false);
        if(vehicle) {
            return vehicle;
        } else {
            return undefined;
        }
    }

    /**
     * Sets the player inside a specified vehicle
     * @param {entitiy} Vehicle
     */
    setVehicle(vehicle) {
        // set the player in an empty seat if available
        if(GetPedInVehicleSeat(vehicle, -1)) {
            if(GetPedInVehicleSeat(vehicle, 0)) {
                SetPedIntoVehicle(this.ped, vehicle, 1);
            } else {
                SetPedIntoVehicle(this.ped, vehicle, 0);
            }
        } else {
            SetPedIntoVehicle(this.ped, vehicle, -1);
        }
    }

    /**
     * Sets whether the player can ragdoll or not
     * @param {boolean} bool True or False
     */
    setRagdoll(bool) {
        SetPedCanRagdoll(this.ped, bool);
        this.Cache.CanRagdoll = bool;
    }

    /**
     * Returns whether the player can ragdoll or not
     * @return {boolean}
     */
    getRagdoll() {
        return this.Cache.CanRagdoll = bool;
    }

    /**
     * Sets the player's routing bucket
     * @param {number} bucket 0 - 63
     */
    setRoutingBucket(bucket) {
        SetPlayerRoutingBucket(this.ServerId, bucket);
        SetEntityRoutingBucket(this.ped, bucket);
    }

    /**
     * Returns the player's routing bucket
     * @return {boolean}
     */
    getRoutingBucket() {
        return GetPlayerRoutingBucket(this.serverId);
    }


    /**
     * Gives the player a specified weapon with the amount of ammo
     * @param {hash} weapon weapon hash
     * @param {number} ammo number of bullets to give
     */
    giveWeapon(weapon, ammo = 120) {
        GiveWeaponToPed(this.ped, weapon, ammo, false, false);
    }

    /**
     * Gives the player a certain amount of ammo for a specified weapon
     * @param {hash} weapon weapon hash
     * @param {number} ammo number of bullets to give
     */
    setWeaponAmmo(weapon, ammo = 120) {
        SetPedAmmo(this.ped, weapon, ammo);
    }

    /**
     * Removes specified weapon from the player
     * @param {hash} weapon weapon hash
     */
    removeWeapon(weapon) {
        RemoveWeaponFromPed(this.ped, weapon);
    }

    /**
     * Removed all the player's weapons
     */
    removeWeapons() {
        RemoveAllPedWeapons(this.ped, false);
    }


    /**
     * Clears the player's wanted level if any
     */
    clearWantedLevel() {
        if(this.wantedLevel) {
            ClearPlayerWantedLevel(this.ServerId);
        }
    }

    /**
     * Kicks the player
     * @param {string} reason the reason for the kick
     */
    kick(reason = 'No reason provided') {
        DropPlayer(this.ServerId, reason);
    }

    /**
     * Clears the player's ped tasks
     */
    clearTasks() {
        ClearPedTasks(this.ped);
    }
    /**
     * Clears the player's ped tasks immediately
     */
    clearTasksImmediately() {
        ClearPedTasksImmediately(this.ped);
    }

    /**
     * Gets wether the player has certain permission
     */
    isAceAllowed(ace) {
        return IsPlayerAceAllowed(this.ServerId, ace);
    }

    static GetIdentifiers(PlayerId, forConstructor = false) {
        let Identifiers = null;
        if(forConstructor) {
            Identifiers = [];
        } else {
            Identifiers = {};
        }

        for (let i = 0; i < GetNumPlayerIdentifiers(PlayerId); i++) {
            const Identifier = GetPlayerIdentifier(PlayerId, i);
            if(forConstructor) {
                Identifiers.push(Identifier);
            } else {
                Identifiers[Identifier.split(':')[0]] = Identifier.split(':')[1];
            }
        }
        return Identifiers;
    }

    #Events() {
        on('DiscordFramework:Player:Joined', PlayerId => {
            if(PlayerId.ServerId === this.ServerId) {
                this.setStatus('Joined');
                this.Connections.JoinedAt = Date.now();
            }
        });

        on('DiscordFramework:Player:Disconnected', (player, reason) => {
            if(player.ServerId === this.ServerId) {
                this.setStatus('Disconnected');
                this.setDisconnectedAt(Date.now());
                this.setDisconnectReason(reason);
            }
        });
    }
};

module.exports = {
    Players: Collection,
    Player: Player
};