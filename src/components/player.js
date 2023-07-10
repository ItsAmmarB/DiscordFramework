/**
 * A class constructor for player
 * @param {number} PlayerId The player server ID
 */
const Player = class Player {
    constructor(PlayerId) {
        const player = NetworkPlayers.get(PlayerId);
        if(player) {
            try{
                if(!player.Server.connections.disconnectedAt) return player;
            }
            catch(err) {
                console.log(player);
            }
        };

        this.PUID = null;
        this.Server = {
            id: PlayerId,
            name: GetPlayerName(PlayerId) || null,
            identifiers: Player.GetIdentifiers(PlayerId, 1),
            connections: {
                status: 'unknown',
                connectingAt: null,
                connectedAt: null,
                joinedAt: null,
                disconnectedAt: null,
                disconnectReason: null
            }
        };
        this.Discord = {
            id: this.Server.identifiers.find(identifier => identifier.includes('discord:')) ? this.Server.identifiers.find(identifier => identifier.includes('discord:')).split(':')[1] : null,
            guilds: null
        };
        this.Cache = {
        }; // extensions and different resources can store things here and use it

        if (this.Discord.id) {
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
        return this.Server.name;
    }

    /**
     * Returns the player's server ID
     * @return {string} Server ID
     */
    getServerId() {
        return this.Server.id;
    }

    /**
     * Set the player's server ID
     */
    setServerId(ServerId) {
        this.Server.id = ServerId;
        this.#UpdateDatabaseInformation();
        return this;
    }

    /**
     * Returns the player discord ID if available
     * @return {(void|string)} Discord ID
     */
    getDiscordId() {
        return this.Discord.id;
    }

    /**
     * Returns an array of the player identifiers
     * @return {string[]} player identifiers
     */
    getIdentifiers() {
        return this.Server.identifiers;
    }

    /**
     * Returns the current player status
     * @return {string[]} current status of the player
     */
    getStatus() {
        return this.Server.connections.status;
    }

    /**
     * Sets the player status
     * @param {string} Status The new player status
     */
    setStatus(Status) {
        this.Server.connections.status = Status;
        return this;
    }

    /**
     * Returns the player connections timestamps
     * @return {<{Status: string, ConnectingAt: number, JoinedAt: number, DisconnectedAt: number, DisconnectReason: (void|string)}>} Connections details
     */
    getConnections() {
        return this.Server.connections;
    }

    /**
     * Sets the timestamp when the player starting connecting
     * @param {number} timestamp A Unix timestamp
     */
    setConnectingAt(timestamp) {
        this.Server.connections.connectingAt = timestamp;
        return this;
    }

    /**
     * Sets the timestamp when the player fully connected
     * @param {number} timestamp A Unix timestamp
     */
    setConnectedAt(timestamp) {
        this.Server.connections.connectedAt = timestamp;
        return this;
    }

    /**
     * Sets the timestamp when the player has joined
     * @param {number} timestamp A Unix timestamp
     */
    setJoinedAt(timestamp) {
        this.Server.connections.joinedAt = timestamp;
        return this;
    }

    /**
     * Sets the timestamp when the player disconnected
     * @param {number} timestamp A Unix timestamp
     */
    setDisconnectedAt(timestamp) {
        this.Server.connections.disconnectedAt = timestamp;
        return this;
    }

    /**
     * Sets the timestamp when the player disconnected
     * @param {string} reason Why the player disconnected
     */
    setDisconnectReason(reason) {
        this.Server.connections.disconnectReason = reason;
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

        const { helpers: { FindOne } } = require('../core/lib/mongodb/index');

        return await FindOne('Players', filter);
    }

    /**
     * Return the player's current ped model
     * @return {hash} the player's ped
     */
    getPed() {
        return GetPlayerPed(this.Server.id);
    }

    /**
     * Sets the player's ped model
     * @param {hash} model
     */
    setPed(model) {
        SetPlayerModel(this.Server.id, model);
    }

    /**
     * Returns whether the player is invincible or not
     * @return {boolean} whether the player is invincible or not
     */
    getInvincible() {
        return GetPlayerInvincible(this.Server.id);
    }

    /**
     * Sets the player's invincibility
     * @param {boolean} bool
     */
    setInvincible(bool) {
        SetPlayerInvincible(this.Server.id, bool);
    }

    /**
     * Returns whether the player is evading the wanted level, meaning that the wanted level stars are blink.
     * @return {boolean} whether player is trying to evade the cops
     */
    getIsEvadingWantedLevel() {
        return IsPlayerEvadingWantedLevel(this.Server.id);
    }

    /**
     * Returns the player's current wanted level
     * @return {number} wanted level
     */
    getWantedLevel() {
        return GetPlayerWantedLevel(this.Server.id);
    }

    /**
     * Sets the player's wanted level
     * @param {number} level 0 - 5 representing the stars
     */
    setWantedLevel(level) {
        SetPlayerWantedLevel(this.Server.id, level, false);
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
        this.Cache.CanRagdoll = bool;
    }

    /**
     * Returns whether the player can ragdoll or not
     * @return {boolean} Ragdoll state
     */
    getRagdoll() {
        return this.Cache.CanRagdoll || null;
    }

    /**
     * Sets the player's routing bucket
     * @param {number} bucket 0 - 63
     */
    setRoutingBucket(bucket) {
        SetPlayerRoutingBucket(this.Server.id, bucket);
        SetEntityRoutingBucket(this.getPed(), bucket);
    }

    /**
     * Returns the player's routing bucket
     * @return {boolean} Routing bucket ID
     */
    getRoutingBucket() {
        return GetPlayerRoutingBucket(this.Server.id);
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
            ClearPlayerWantedLevel(this.Server.id);
        }
    }

    /**
     * Kicks the player
     * @param {string} reason the reason for the kick
     */
    kick(reason = 'No reason provided') {
        DropPlayer(this.Server.id, reason);
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
        return IsPlayerAceAllowed(this.Server.id, ace) ? true : false;
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


        for (let i = 0; i < GetNumPlayerIdentifiers(this.Server.id); i++) {
            const Identifier = GetPlayerIdentifier(this.Server.id, i);
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
        const { helpers: { FindOne, InsertOne, UpdateOne } } = require('../core/lib/mongodb/index');

        // Database
        FindOne('Players', { 'information.identifiers': { $in: this.Server.identifiers } }, async result => {
            if (result) {

                this.PUID = result._id;

                // Match current player information with database information
                const Query = {};

                // Update serverId and lastSeenTimestamp
                Query.$set = {
                    'information.serverId': this.Server.id,
                    'information.lastSeenTimestamp': Date.now()
                };

                // Check for new Identifiers and update
                const NewIdentifiers = this.Server.identifiers.filter(identifier => !result.information.identifiers.includes(identifier));
                if (NewIdentifiers.length > 0) {
                    if (!Query.$push) Query.$push = {};
                    Query.$push['information.identifiers'] = { $each: NewIdentifiers };
                }

                // Check for a new name change and update
                const NewName = this.Server.name;
                if (NewName !== result.information.names[0].name) {
                    if (!Query.$push) Query.$push = {};
                    Query.$push['information.names'] = {
                        $each: [{ name: NewName, timestamp: Date.now() }],
                        $position: 0
                    };
                }

                // Check Location
                const fetch = require('node-fetch');

                let GeoIP = await fetch('http://ip-api.com/json/' + this.Server.identifiers.find(iden => iden.includes('ip:')).split(':')[1]);
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
                        discordId: this.Discord.id,
                        serverId: this.Server.id,
                        playtime: 0,
                        lastSeenTimestamp: Date.now(),
                        identifiers: this.Server.identifiers,
                        names: [{ name: this.Server.name, timestamp: Date.now() }],
                        location: null
                    },
                    infractions: [],
                    characters: []
                };

                // Get the player's country AKA. GeoIP
                const fetch = require('node-fetch');

                // let GeoIP = await fetch('http://ip-api.com/json/' + this.Server.identifiers.find(iden => iden.includes('ip:')).split(':')[1]);
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

        const Discord = require('../core/lib/discord/index');

        this.Discord.guilds = Discord.helpers.GetSharedGuilds(this.Discord.id).map(guild => {
            const Member = guild.members.resolve(this.Discord.id);
            return {
                ID: guild.id,
                Name: guild.name,
                Administrator: Member.permissions.has('ADMINISTRATOR'),
                Roles: Member.roles.cache.map(role => ({ ID: role.id, Name: role.name }))
            };
        });

        Discord.client.on('guildMemberUpdate', (oldM, newM) => {
            if(this.Discord.id && newM.id === this.Discord.id && !this.Server.connections.disconnectedAt) {
                Debug(`(${this.getServerId()}) ${this.getName()}'s roles were updated!`);
                const Guild = this.Discord.guilds.find(guild => guild.ID === newM.guild.id);
                if(Guild) {
                    Guild.Name = newM.guild.name;
                    Guild.Administrator = newM.permissions.has('ADMINISTRATOR');
                    Guild.Roles = newM.roles.cache.map(role => ({ ID: role.id, Name: role.name }));
                }
                else {
                    this.Discord.guilds.push({
                        ID: newM.guild.id,
                        Name: newM.guild.name,
                        Administrator: newM.permissions.has('ADMINISTRATOR'),
                        Roles: newM.roles.cache.map(role => ({ ID: role.id, Name: role.name }))
                    });
                }
                return emit('DiscordFrameworK:Player:Roles:Updated', this);
            }
        });
    }
};

/**
 * A modified Set() that was made to make player details management a lot easier and simpler to obtain and utilize
 */
const PlayerSet = class PlayerSet extends Set {
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
            const ValIden = this.ValidateIdentifier(Identifier);
            if (ValIden === 'Server') {
                const _Players = this.toArray();
                const _Player = _Players.filter(player => String(player.Server.id) === Identifier).sort((a, b) => b.Server.id - a.Server.id)[0];
                if (_Player) {
                    return _Player;
                }
                else {
                    return undefined;
                }
            }
            else if (ValIden === 'Discord') {
                const _Players = this.toArray();
                const _Player = _Players.filter(player => String(player.Discord.id) === Identifier).sort((a, b) => b.Server.id - a.Server.id)[0];
                if (_Player) {
                    return _Player;
                }
                else {
                    return undefined;
                }
            }
            else if (ValIden === 'Identifier') {
                const _Players = this.toArray();
                const _Player = _Players.filter(player => player.Server.identifiers.map(iden => String(iden).toLowerCase()).find(iden => iden === Identifier)).sort((a, b) => b.Server.id - a.Server.id)[0];
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
     * @returns {object[]} Array of players objects
     */
    toArray() {
        return Array.from(this.values(), element => element);
    }

    ValidateIdentifier(Identifier) {
        if (Identifier.includes('license:') && typeof Identifier === 'string' ||
            Identifier.includes('discord:') && typeof Identifier === 'string' ||
            Identifier.includes('live:') && typeof Identifier === 'string' ||
            Identifier.includes('ip:') && typeof Identifier === 'string' ||
            Identifier.includes('xbl:') && typeof Identifier === 'string' ||
            Identifier.includes('fivem:') && typeof Identifier === 'string') {
            return 'Identifier';
        }
        if (!isNaN(Identifier)) {
            if (Identifier.length === 19) {
                return 'Discord';
            }
            else {
                return 'Server';
            }
        }
        return undefined;
    }
};

/**
 * The players information since the last server start
 * @return {Players}
 */
const NetworkPlayers = new PlayerSet();

if(Debug) {
    RegisterCommand('Players', (source) => {
        if(source > 0) return console.log('ServerFX terminal command only!');
        return console.log(NetworkPlayers);
    });
    RegisterCommand('Player', (source, args) => {
        if(source > 0) return console.log('ServerFX terminal command only!');
        if(!args[0]) return console.log('missing 1 argument (player identifer)');
        const _Player = NetworkPlayers.get(args[0]);
        if(!_Player) return console.log('Player not found!');
        return console.log(_Player);
    });
}


module.exports = {
    NetworkPlayers,
    PlayerSet,
    Player
};