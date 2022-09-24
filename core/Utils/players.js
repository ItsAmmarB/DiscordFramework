const Players = class Players extends Set {
    /**
     *
     * @param {String} Identifier A value that identifies a player, it can a sever id, discord id, or an identifier such as license or ip.
     * @returns {(object|any)} Player
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
        } else {
            Identifier = String(Identifier);
            const ValIden = this.#ValidateIdentifier(Identifier);
            if (ValIden === 'Server') {
                const _Players = this.toArray();
                const Player = _Players.find(player => String(player.Server.ID) === Identifier);
                if (Player) {
                    return Player;
                } else {
                    return undefined;
                }
            } else if (ValIden === 'Discord') {
                const _Players = this.toArray();
                const Player = _Players.find(player => String(player.Discord.ID) === Identifier);
                if (Player) {
                    return Player;
                } else {
                    return undefined;
                }
            } else if (ValIden === 'Identifier') {
                const _Players = this.toArray();
                const Player = _Players.find(player => player.Server.Identifiers.map(iden => String(iden).toLowerCase()).find(iden => iden === Identifier));
                if (Player) {
                    return Player;
                } else {
                    return undefined;
                }
            } else {
                return new Error('Players.prototype.get(Identifier) ---> Unknown Identifier');
            }
        }

    }

    /**
     * Returns the Players Collection as an array
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
    constructor(PlayerId, resourceRestarted = false) {
        this.Name = GetPlayerName(PlayerId);
        this.Server = {
            ID: PlayerId,
            Identifiers: Player.GetIdentifiers(PlayerId, true),
            Connections: {
                Status: 'Joining',
                ConnectingAt: Date.now(),
                JoinedAt: null,
                DisconnectedAt: null,
                DisconnectReason: null
            }
        };
        this.Discord = {
            ID: null,
            Guilds: null
        };
        this.Cache = {
        }; // extensions and different resources can store things here and use it

        if (this.Server.Identifiers.find(identifier => identifier.includes('discord:')).split(':')[1]) {

            this.Discord.ID = this.Server.Identifiers.find(identifier => identifier.includes('discord:')).split(':')[1];

            const Discord = require('../Modules/Discord/index');
            const SharedGuilds = Discord.SharedGuilds(this.Discord.ID);

            const Guilds = SharedGuilds.map(guild => {
                const Member = guild.members.resolve(this.Discord.ID);
                return {
                    ID: guild.id,
                    Name: guild.name,
                    Administrator: Member.permissions.has('ADMINISTRATOR'),
                    Permissions: Member.permissions.toArray(),
                    Roles: Member.roles.cache.map(role => ({ ID: role.id, Name: role.name }))
                };
            });

            this.Discord.Guilds = Guilds;

            this.#DiscordGuildsUpdate(Discord);
        }

        this.#Events(resourceRestarted);

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
        return this.Server.ID;
    }

    /**
     * Returns the player discord ID if available
     * @return {(string|undefined)}
     */
    getDiscordId() {
        return this.Discord.ID;
    }

    /**
     * Returns an array of the player identifiers
     * @return {Array<string>}
     */
    getIdentifiers() {
        return this.Server.Identifiers;
    }

    /**
     * Returns the current player status
     * @return {Array<string>}
     */
    getStatus() {
        return this.Server.Connections.Status;
    }

    /**
     * Sets the player status
     * @param {string} Status The new player status
     */
    setStatus(Status) {
        this.Server.Connections.Status = Status;
    }

    /**
     * Returns the player connections timestamps
     * @return {object}
     */
    getConnections() {
        return this.Server.Connections;
    }

    /**
     * Sets the timestamp when the player starting connecting
     * @param {number} timestamp A Unix timestamp
     */
    setConnectingAt(timestamp) {
        this.Server.Connections.ConnectingAt = timestamp;
    }

    /**
     * Sets the timestamp when the player fully connected
     * @param {number} timestamp A Unix timestamp
     */
    setConnectedAt(timestamp) {
        this.Server.Connections.ConnectedAt = timestamp;
    }

    /**
     * Sets the timestamp when the player disconnected
     * @param {number} timestamp A Unix timestamp
     */
    setDisconnectedAt(timestamp) {
        this.Server.Connections.DisconnectedAt = timestamp;
    }

    /**
     * Sets the timestamp when the player disconnected
     * @param {string} reason Why the player disconnected
     */
    setDisconnectReason(reason) {
        this.Server.Connections.DisconnectReason = reason;
    }

    /**
     * Return the player's current ped model
     * @return {any}
     */
    getPed() {
        return GetPlayerPed(this.Server.ID);
    }

    /**
     * Sets the player's ped model
     * @param {hash} model
     */
    setPed(model) {
        SetPlayerModel(this.Server.ID, model);
    }

    /**
     * Returns whether the player is invincible or not
     * @return {boolean}
     */
    getInvincible() {
        return GetPlayerInvincible(this.Server.ID);
    }

    /**
     * Sets the player's invincibility
     * @param {boolean} bool
     */
    setInvincible(bool) {
        SetPlayerInvincible(this.Server.ID, bool);
    }

    /**
     * Returns whether the player is evading the wanted level, meaning that the wanted level stars are blink.
     * @return {boolean}
     */
    getIsEvadingWantedLevel() {
        return IsPlayerEvadingWantedLevel(this.Server.ID);
    }

    /**
     * Returns the player's current wanted level
     * @return {number}
     */
    getWantedLevel() {
        return GetPlayerWantedLevel(this.Server.ID);
    }

    /**
     * Sets the player's wanted level
     * @param {number} level 0 - 5 representing the stars
     */
    setWantedLevel(level) {
        SetPlayerWantedLevel(this.Server.ID, level, false);
    }

    /**
     * Returns the player's current coordinates
     * @return {Array<number>} [X, Y, Z]
     */
    getCoordinates() {
        return GetEntityCoords(this.getPed());
    }

    /**
     * Returns the player's current coordinates
     * @param {Array<number>} coords [X, Y, Z]
     */
    setCoordinates(coords) {
        SetEntityCoords(this.getPed(), ...coords, false, false, false, false);
    }

    /**
     * Returns the player's current speed
     * @return {number}
     */
    getSpeed() {
        return GetEntitySpeed(this.getPed());
    }

    /**
     * Returns whether the player is frozen in place or not
     * @return {boolean}
     */
    getFreezePosition() {
        return this.Cache.Frozen || null;
    }

    /**
     * Sets the player's freeze status
     * @param {boolean} bool True or False
     */
    setFreezePosition(bool) {
        FreezeEntityPosition(this.getPed(), bool);
        this.Cache.Frozen = bool;
    }

    /**
     * Returns the player's current armour status
     * @return {boolean}
     */
    getArmour() {
        return GetPedArmour(this.getPed());
    }

    /**
     * Sets the player's current armour
     * @param {number} armour 0 - 100 indicating the value to set the Ped's armor to
     */
    setArmour(armour) {
        SetPedArmour(this.getPed(), armour);
    }

    /**
     * Returns the player's current health
     * @return {number} 0 - 200 indicating the value of the player's health
     */
    getHealth() {
        return GetEntityHealth(this.getPed());
    }

    /**
     * Returns the player's current weapon in hand
     * @return {hash} hash of weapon in hand
     */
    getWeaponInHand() {
        return GetSelectedPedWeapon(this.getPed());
    }

    /**
     * Returns the vehicle if the player is in a vehicle; otherwise undefined
     * @return {entitiy} Vehicle
     */
    getVehicle() {
        const vehicle = GetVehiclePedIsIn(this.getPed(), false);
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
                SetPedIntoVehicle(this.getPed(), vehicle, 1);
            } else {
                SetPedIntoVehicle(this.getPed(), vehicle, 0);
            }
        } else {
            SetPedIntoVehicle(this.getPed(), vehicle, -1);
        }
    }

    /**
     * Sets whether the player can ragdoll or not
     * @param {boolean} bool True or False
     */
    setRagdoll(bool) {
        SetPedCanRagdoll(this.getPed(), bool);
        this.Cache.CanRagdoll = bool;
    }

    /**
     * Returns whether the player can ragdoll or not
     * @return {boolean}
     */
    getRagdoll() {
        return this.Cache.CanRagdoll || null;
    }

    /**
     * Sets the player's routing bucket
     * @param {number} bucket 0 - 63
     */
    setRoutingBucket(bucket) {
        SetPlayerRoutingBucket(this.Server.ID, bucket);
        SetEntityRoutingBucket(this.getPed(), bucket);
    }

    /**
     * Returns the player's routing bucket
     * @return {boolean}
     */
    getRoutingBucket() {
        return GetPlayerRoutingBucket(this.Server.ID);
    }


    /**
     * Gives the player a specified weapon with the amount of ammo
     * @param {hash} weapon weapon hash
     * @param {number} ammo number of bullets to give
     */
    giveWeapon(weapon, ammo = 120) {
        GiveWeaponToPed(this.getPed(), weapon, ammo, false, false);
    }

    /**
     * Gives the player a certain amount of ammo for a specified weapon
     * @param {hash} weapon weapon hash
     * @param {number} ammo number of bullets to give
     */
    setWeaponAmmo(weapon, ammo = 120) {
        SetPedAmmo(this.getPed(), weapon, ammo);
    }

    /**
     * Removes specified weapon from the player
     * @param {hash} weapon weapon hash
     */
    removeWeapon(weapon) {
        RemoveWeaponFromPed(this.getPed(), weapon);
    }

    /**
     * Removed all the player's weapons
     */
    removeWeapons() {
        RemoveAllPedWeapons(this.getPed(), false);
    }


    /**
     * Clears the player's wanted level if any
     */
    clearWantedLevel() {
        if(this.wantedLevel) {
            ClearPlayerWantedLevel(this.Server.ID);
        }
    }

    /**
     * Kicks the player
     * @param {string} reason the reason for the kick
     */
    kick(reason = 'No reason provided') {
        DropPlayer(this.Server.ID, reason);
    }

    /**
     * Clears the player's ped tasks
     */
    clearTasks() {
        ClearPedTasks(this.getPed());
    }
    /**
     * Clears the player's ped tasks immediately
     */
    clearTasksImmediately() {
        ClearPedTasksImmediately(this.getPed());
    }

    /**
     * Gets wether the player has certain permission
     */
    isAceAllowed(ace) {
        return IsPlayerAceAllowed(this.Server.ID, ace);
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
            if(PlayerId.Server.ID === this.Server.ID) {
                this.setStatus('Joined');
                this.Server.Connections.JoinedAt = Date.now();
            }
        });

        on('DiscordFramework:Player:Disconnected', (player, reason) => {
            if(player.Server.ID === this.Server.ID) {
                this.setStatus('Disconnected');
                this.setDisconnectedAt(Date.now());
                this.setDisconnectReason(reason);
            }
        });
    }

    #DiscordGuildsUpdate(Discord) {
        Discord.Client.on('guildMemberUpdate', (oldM, newM) => {
            if(this.Discord.ID && newM.id === this.Discord.ID && !this.Server.Connections.DisconnectedAt) {
                console.log(`(${this.getServerId()}) ${this.getName()}'s roles were updated!`);
                if(this.Discord.Guilds.find(guild => guild.id === newM.guild.id)) {
                    const prevGuild = this.Discord.Guilds.find(guild => guild.id === newM.guild.id);
                    prevGuild.Name = newM.guild.name;
                    prevGuild.Administrator = newM.permissions.has('ADMINISTRATOR');
                    prevGuild.Permissions = newM.permissions.toArray();
                    prevGuild.Roles = newM.roles.cache.map(role => ({ ID: role.id, Name: role.name }));
                    return;
                } else {
                    this.Discord.Guilds.push({
                        ID: newM.guild.id,
                        Name: newM.guild.name,
                        Administrator: newM.permissions.has('ADMINISTRATOR'),
                        Permissions: newM.permissions.toArray(),
                        Roles: newM.roles.cache.map(role => ({ ID: role.id, Name: role.name }))
                    });
                    return;
                }
            }
        });
    }
};

module.exports = {
    Players: Players,
    Player: Player
};