const { NetworkPlayers } = require('./players');

/**
 * A class constructor for player
 * @param {number} PlayerId The player server ID
 */
const Player = class Player {
    constructor(PlayerId) {
        const player = NetworkPlayers.get(PlayerId);
        if(player) {
            try{
                if(!player.server.connections.disconnectedAt) return player;
            }
            catch(err) {
            }
        };

        this.PUID = null;

        this.server = {
            id: PlayerId,
            name: GetPlayerName(PlayerId) || null,
            identifiers: Player.GetIdentifiers(PlayerId, 1),
            connections: {
                status: 'unknown',
                connectingAt: null,
                connectedAt: null,
                joiningAt: null,
                joinedAt: null,
                disconnectedAt: null,
                disconnectReason: null
            }
        };
        this.discord = {
            id: this.server.identifiers.find(identifier => identifier.includes('discord:')) ? this.server.identifiers.find(identifier => identifier.includes('discord:')).split(':')[1] : null,
            guilds: []
        };
        this.cache = {
        }; // extensions and different resources can store things here and use it

        if (this.discord.id) {
            this.#DiscordGuildsUpdate();
        }

        this.#UpdateDatabaseInformation();
    }

    /**
     * Returns the player's Unique ID
     * @return {string} player unique ID
     */
    getPUID() {
        return this.PUID;
    }

    /**
     * Returns the player name
     * @return {string} Player Name
     */
    getName() {
        return this.server.name;
    }

    /**
     * Returns the player's server ID
     * @return {string} Server ID
     */
    getServerId() {
        return this.server.id;
    }

    /**
     * Set the player's server ID
     */
    setServerId(ServerId) {
        this.server.id = ServerId;
        this.#UpdateDatabaseInformation();
        return this;
    }

    /**
     * Returns the player discord ID if available
     * @return {(void|string)} Discord ID
     */
    getDiscordId() {
        return this.discord.id;
    }

    /**
     * Returns an array of the player identifiers
     * @return {string[]} player identifiers
     */
    getIdentifiers() {
        return this.server.identifiers;
    }

    /**
     * Returns the current player status
     * @return {string[]} current status of the player
     */
    getStatus() {
        return this.server.connections.status;
    }

    /**
     * Sets the player status
     * @param {string} Status The new player status
     */
    #setStatus(Status) {
        this.server.connections.status = Status;
        return this;
    }

    /**
     * Returns the player connections timestamps
     * @return {<{Status: string, ConnectingAt: number, JoinedAt: number, DisconnectedAt: number, DisconnectReason: (void|string)}>} Connections details
     */
    getConnections() {
        return this.server.connections;
    }

    /**
     * Sets the timestamp when the player starting connecting
     * @param {number} timestamp A Unix timestamp
     */
    setConnectingAt(timestamp) {
        this.server.connections.connectingAt = timestamp;
        this.#setStatus('Connecting');
        return this;
    }

    /**
     * Sets the timestamp when the player fully connected
     * @param {number} timestamp A Unix timestamp
     */
    setConnectedAt(timestamp) {
        this.server.connections.connectedAt = timestamp;
        this.#setStatus('Connected');
        return this;
    }

    /**
     * Sets the timestamp when the player has started joining
     * @param {number} timestamp A Unix timestamp
     */
    setJoiningAt(timestamp) {
        this.server.connections.joiningAt = timestamp;
        this.#setStatus('Joining');
        return this;
    }

    /**
     * Sets the timestamp when the player has joined
     * @param {number} timestamp A Unix timestamp
     */
    setJoinedAt(timestamp) {
        this.server.connections.joinedAt = timestamp;
        this.#setStatus('Joined');
        return this;
    }

    /**
     * Sets the timestamp when the player disconnected
     * @param {number} timestamp A Unix timestamp
     */
    setDisconnectedAt(timestamp) {
        this.server.connections.disconnectedAt = timestamp;
        this.#setStatus('Disconnected');
        return this;
    }

    /**
     * Sets the timestamp when the player disconnected
     * @param {string} reason Why the player disconnected
     */
    setDisconnectReason(reason) {
        this.server.connections.disconnectReason = reason;
        return this;
    }

    /**
     * Fetches the database for the player document
     * @async
     * @param {*} filter
     * @returns Player database document
     */
    async getDatabase(filter = {}) {
        if(typeof filter !== 'object' || typeof filter === 'object' && Array.isArray(filter)) throw new Error('DiscordFramework: Player --> getInfractions() filter must be an Object');

        const { helpers: { FindOne } } = require('../../../index').MongoDB.module;

        return await FindOne('Players', filter);
    }

    /**
     * Return the player's current ped model
     * @return {hash} the player's ped
     */
    getPed() {
        return GetPlayerPed(this.server.id);
    }

    /**
     * Sets the player's ped model
     * @param {hash} model
     */
    setPed(model) {
        SetPlayerModel(this.server.id, model);
    }

    /**
     * Returns whether the player is invincible or not
     * @return {boolean} whether the player is invincible or not
     */
    getInvincible() {
        return GetPlayerInvincible(this.server.id);
    }

    /**
     * Sets the player's invincibility
     * @param {boolean} bool
     */
    setInvincible(bool) {
        SetPlayerInvincible(this.server.id, bool);
    }

    /**
     * Returns whether the player is evading the wanted level, meaning that the wanted level stars are blink.
     * @return {boolean} whether player is trying to evade the cops
     */
    getIsEvadingWantedLevel() {
        return IsPlayerEvadingWantedLevel(this.server.id);
    }

    /**
     * Returns the player's current wanted level
     * @return {number} wanted level
     */
    getWantedLevel() {
        return GetPlayerWantedLevel(this.server.id);
    }

    /**
     * Sets the player's wanted level
     * @param {number} level 0 - 5 representing the stars
     */
    setWantedLevel(level) {
        SetPlayerWantedLevel(this.server.id, level, false);
    }

    /**
     * Returns the player's current coordinates
     * @return {number[]} coordinates [X, Y, Z]
     */
    getCoordinates() {
        return GetEntityCoords(this.getPed());
    }

    /**
     * Returns the player's current coordinates
     * @param {number[]} coords [X, Y, Z]
     */
    setCoordinates(coords) {
        SetEntityCoords(this.getPed(), ...coords, false, false, false, false);
    }

    /**
     * Returns the player's current speed
     * @return {number} Velocity in GTA V units
     */
    getSpeed() {
        return GetEntitySpeed(this.getPed());
    }

    /**
     * Returns whether the player is frozen in place or not
     * @return {boolean} Whether ped is frozen or not
     */
    getFreezePosition() {
        return this.cache.Frozen || null;
    }

    /**
     * Sets the player's freeze status
     * @param {boolean} bool True or False
     */
    setFreezePosition(bool) {
        FreezeEntityPosition(this.getPed(), bool);
        this.cache.Frozen = bool;
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
     * @return {hash} Vehicle
     */
    getVehicle() {
        const vehicle = GetVehiclePedIsIn(this.getPed(), false);
        if(vehicle) {
            return vehicle;
        }
        else {
            return undefined;
        }
    }

    /**
     * Sets the player inside a specified vehicle
     * @param {hash} Vehicle
     */
    setVehicle(vehicle) {
        // set the player in an empty seat if available
        if(GetPedInVehicleSeat(vehicle, -1)) {
            if(GetPedInVehicleSeat(vehicle, 0)) {
                SetPedIntoVehicle(this.getPed(), vehicle, 1);
            }
            else {
                SetPedIntoVehicle(this.getPed(), vehicle, 0);
            }
        }
        else {
            SetPedIntoVehicle(this.getPed(), vehicle, -1);
        }
    }

    /**
     * Sets whether the player can ragdoll or not
     * @param {boolean} bool True or False
     */
    setRagdoll(bool) {
        SetPedCanRagdoll(this.getPed(), bool);
        this.cache.CanRagdoll = bool;
    }

    /**
     * Returns whether the player can ragdoll or not
     * @return {boolean} Ragdoll state
     */
    getRagdoll() {
        return this.cache.CanRagdoll || null;
    }

    /**
     * Sets the player's routing bucket
     * @param {number} bucket 0 - 63
     */
    setRoutingBucket(bucket) {
        SetPlayerRoutingBucket(this.server.id, bucket);
        SetEntityRoutingBucket(this.getPed(), bucket);
    }

    /**
     * Returns the player's routing bucket
     * @return {boolean} Routing bucket ID
     */
    getRoutingBucket() {
        return GetPlayerRoutingBucket(this.server.id);
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
            ClearPlayerWantedLevel(this.server.id);
        }
    }

    /**
     * Kicks the player
     * @param {string} reason the reason for the kick
     */
    kick(reason = 'No reason provided') {
        DropPlayer(this.server.id, reason);
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
     * @param {string} ace Ace permission keyword
     * @return {boolean} whether player is ace allowed or not
     */
    isAceAllowed(ace) {
        return IsPlayerAceAllowed(this.server.id, ace) ? true : false;
    }

    pushToNetwork() {
        NetworkPlayers.add(this);
        return this;
    }

    /**
     * Gets the player's identifiers
     * @param {boolean} returnAsArray Whether to return the identifiers as an array or an object (optional)
     * @returns {object|string[]} An Array or an Object containing the player's identifiers
     */
    GetIdentifiers(returnAsArray = false) {
        let Identifiers = null;
        if(returnAsArray) {
            Identifiers = [];
        }
        else {
            Identifiers = {};
        }


        for (let i = 0; i < GetNumPlayerIdentifiers(this.server.id); i++) {
            const Identifier = GetPlayerIdentifier(this.server.id, i);
            if(returnAsArray) {
                Identifiers.push(Identifier);
            }
            else {
                Identifiers[Identifier.split(':')[0]] = Identifier.split(':')[1];
            }
        }
        return Identifiers;
    }

    /**
     * Gets a player's identifiers
     * @param {number} PlayerId The player's server ID
     * @param {boolean} returnAsArray Whether to return the identifiers as an array or an object (optional)
     * @returns {object|string[]} An Array or an Object containing a player's identifiers
     */
    static GetIdentifiers(PlayerId, returnAsArray = false) {
        let Identifiers = null;
        if(returnAsArray) {
            Identifiers = [];
        }
        else {
            Identifiers = {};
        }

        for (let i = 0; i < GetNumPlayerIdentifiers(PlayerId); i++) {
            const Identifier = GetPlayerIdentifier(PlayerId, i);
            if(returnAsArray) {
                Identifiers.push(Identifier);
            }
            else {
                Identifiers[Identifier.split(':')[0]] = Identifier.split(':')[1];
            }
        }
        return Identifiers;
    }

    /**
     * Updates the player's database document to reflect latest player information
     */
    #UpdateDatabaseInformation() {

        const { ObjectId } = require('mongodb');
        const { helpers: { FindOne, InsertOne, UpdateOne } } = require('../../../index').MongoDB.module;

        // Database
        FindOne('Players', { 'information.identifiers': { $in: this.server.identifiers } }, async result => {
            if (result) {

                this.PUID = result._id;

                // Match current player information with database information
                const Query = {};

                // Update serverId and lastSeenTimestamp
                Query.$set = {
                    'information.serverId': this.server.id,
                    'information.lastSeenTimestamp': Date.now()
                };

                // Check for new Identifiers and update
                const NewIdentifiers = this.server.identifiers.filter(identifier => !result.information.identifiers.includes(identifier));
                if (NewIdentifiers.length > 0) {
                    if (!Query.$push) Query.$push = {};
                    Query.$push['information.identifiers'] = { $each: NewIdentifiers };
                }

                // Check for a new name change and update
                const NewName = this.server.name;
                if (NewName !== result.information.names[0].name) {
                    if (!Query.$push) Query.$push = {};
                    Query.$push['information.names'] = {
                        $each: [{ name: NewName, timestamp: Date.now() }],
                        $position: 0
                    };
                }

                // Check Location
                const fetch = require('node-fetch');

                let GeoIP = await fetch('http://ip-api.com/json/' + this.server.identifiers.find(iden => iden.includes('ip:')).split(':')[1]);
                GeoIP = await GeoIP.json();
                if (GeoIP.status.toLowerCase() === 'success') {
                    Query.$set['information.location'] = `${GeoIP.country}, ${GeoIP.regionName}, ${GeoIP.city}`;
                }

                UpdateOne('Players', { '_id': this.PUID }, Query, err => {
                    if (err) new Error(err);
                });
            }
            else {

                this.PUID = new ObjectId();

                // Database player object
                const NewPlayer = {
                    _id: this.PUID,
                    information: {
                        discordId: this.discord.id,
                        serverId: this.server.id,
                        playtime: 0,
                        lastSeenTimestamp: Date.now(),
                        identifiers: this.server.identifiers,
                        names: [{ name: this.server.name, timestamp: Date.now() }],
                        location: null
                    },
                    infractions: [],
                    characters: []
                };

                // Get the player's country AKA. GeoIP
                const fetch = require('node-fetch');

                // let GeoIP = await fetch('http://ip-api.com/json/' + this.server.identifiers.find(iden => iden.includes('ip:')).split(':')[1]);
                let GeoIP = await fetch('http://ip-api.com/json/51.36.221.139');
                GeoIP = await GeoIP.json();
                if (GeoIP.status.toLowerCase() === 'success') {
                    NewPlayer.information.location = `${GeoIP.country}, ${GeoIP.regionName}`;
                }
                else {
                    NewPlayer.information.location = 'Unknown';
                }

                InsertOne('Players', NewPlayer);
            }
        });

    }

    #DiscordGuildsUpdate() {
        const Discord = require('../../../index').Discord.module;

        this.discord.guilds = Discord.helpers.GetSharedGuilds(this.discord.id).map(guild => {
            const Member = guild.members.resolve(this.discord.id);
            return {
                id: guild.id,
                name: guild.name,
                administrator: Member.permissions.has('ADMINISTRATOR'),
                roles: Member.roles.cache.map(role => ({ id: role.id, name: role.name }))
            };
        });

        Discord.client.on('guildMemberUpdate', (oldM, newM) => {
            if(this.discord.id && newM.id === this.discord.id && !this.server.connections.disconnectedAt) {
                Debug(`(${this.getServerId()}) ${this.getName()}'s roles were updated!`);
                const Guild = this.discord.guilds.find(guild => guild.id === newM.guild.id);
                if(Guild) {
                    Guild.name = newM.guild.name;
                    Guild.administrator = newM.permissions.has('ADMINISTRATOR');
                    Guild.roles = newM.roles.cache.map(role => ({ id: role.id, name: role.name }));
                }
                else {
                    this.discord.guilds.push({
                        id: newM.guild.id,
                        name: newM.guild.name,
                        administrator: newM.permissions.has('ADMINISTRATOR'),
                        roles: newM.roles.cache.map(role => ({ id: role.id, name: role.name }))
                    });
                }
                return emit('DiscordFrameworK:Player:Roles:Updated', this);
            }
        });
    }
};

module.exports = {
    Player
};