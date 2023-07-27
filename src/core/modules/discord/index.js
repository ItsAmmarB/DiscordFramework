// MODULES IMPORTS
const Discord = require('discord.js');

// FILES IMPORTS
const Config = require('../../../config');

// FILE CONSTANTS
const Client = new Discord.Client({ intents: 131071, presence: { status: 'dnd', activities: [ { name: 'DiscordFramework', type: 3, url: 'https://github.com/ItsAmmarB/DiscordFramework/' }] } });

Client.on('ready', () => {
    emit('DiscordFramework:Core:Module:Ready', 'Discord');
});
Client.login(Config.core.discord.token);

// ========================================================
//                      EXPORTS
// ========================================================

/**
 * Obtains a Guild from Discord, or the Guild cache if it's already available.
 * @async
 * @param {Discord.Snowflake} GuildId The discord guild id
 * @return {Promise<Discord.Guild|null>} discord guild
 */
const GetGuild = async GuildId => {

    if (!GuildId) throw new Error('DiscordFramework: Discord --> GetGuild() No guild ID provided');
    if (!IsSnowFlake(GuildId)) throw new Error('DiscordFramework: Discord --> GetGuild() Invalid guild ID provided');

    let Guild = null;
    try {
        Guild = await Client.guilds.fetch(GuildId);
    }
    catch (err) {
        if(err.message !== 'Unknown Guild') console.error(err);;
    }
    return Guild;
};

/**
 * Obtains a list of all shared Guilds between the Client and the Player/User
 * @async
 * @param {Discord.Snowflake|number} UserId The player's server ID
 * @returns {Discord.Guild[]} Array of Guilds
 */
const GetSharedGuilds = UserId => {

    if (!UserId) throw new Error('DiscordFramework: Discord --> GetSharedGuilds() No player ID provided');
    if (!IsSnowFlake(UserId)) throw new Error('DiscordFramework: Discord --> GetSharedGuilds() Invalid player ID provided');

    const { NetworkPlayers } = require('../../index').Players.module.helpers;
    if(NetworkPlayers.validateIdentifier(UserId) !== 'Discord') {
        // Check whether the provided ID is a server ID or a Discord ID; and if not discord, then fetch the player data and retrieve their Discord ID
        const Player = NetworkPlayers.get(UserId);
        if (!Player) throw new Error('DiscordFramework: Discord --> GetSharedGuilds() Player does not have a PlayerNetworkObject');
        UserId = Player.discordId;
    }

    const Guilds = Client.guilds.cache.filter(guild => guild.members.resolve(UserId));

    return Guilds;
};

/**
 * Obtains a Role from a Discord Guild, or the Role cache if they're already available.
 * @async
 * @param {Discord.Snowflake} RoleId The discord role id
 * @param {Discord.Snowflake} GuildId The discord guild id
 * @return {Promise<Discord.Role|null>} Discord Role
 */
const GetRole = async (RoleId, GuildId = Config.core.discord.communityGuild.id) => {

    if (!RoleId) throw new Error('DiscordFramework: Discord --> GetRole() No role ID provided');
    if (!IsSnowFlake(RoleId)) throw new Error('DiscordFramework: Discord --> GetRole() Invalid role ID provided');

    if (!IsSnowFlake(GuildId)) throw new Error('DiscordFramework: Discord --> GetRole() Invalid guild ID provided');
    const Guild = await GetGuild(GuildId);
    if (!Guild) throw new Error('DiscordFramework: Discord --> GetRole() Client is not a member of provided guild\'s ID or guild does not exist');

    let role = null;
    try {
        role = await Guild.roles.fetch(GuildId);
    }
    catch (err) {
        if(err.message !== 'Unknown Role') console.error(err);;
    }
    return role;
};

/**
 * Obtains a User as a Member from a Discord Guild
 * @async
 * @param {Discord.Snowflake|number} UserId The player server ID or the player discord ID or any player identifier
 * @param {Discord.Snowflake} GuildId The discord guild id
 * @returns {Promise<Discord.GuildMember|null>} Discord GuildMember
 */
const GetMember = async (UserId, GuildId = Config.core.discord.communityGuild.id) => {

    if (!UserId) throw new Error('DiscordFramework: Discord --> GetMember() No player ID provided');

    const { NetworkPlayers } = require('../../index').Players.module.helpers;
    if(NetworkPlayers.validateIdentifier(UserId) !== 'Discord') {
        // Check whether the provided ID is a server ID or a Discord ID; and if not discord, then fetch the player data and retrieve their Discord ID
        const Player = NetworkPlayers.get(UserId);
        if (!Player) throw new Error('DiscordFramework: Discord --> GetMember() Player does not have a PlayerNetworkObject');
        UserId = Player.discordId;
    }

    if (!IsSnowFlake(UserId)) throw new Error('DiscordFramework: Discord --> GetMember() Invalid player ID provided');

    const Guild = await GetGuild(GuildId);
    if (!Guild) throw new Error('DiscordFramework: Discord --> GetMember() Client is not a member of provided guild\'s ID or guild does not exist');

    let member = null;
    try {
        member = await Guild.members.fetch(UserId);
    }
    catch (err) {
        if(err.message !== 'Unknown Member') console.error(err);;
    }
    return member;
};

/**
 * Obtains a User from Discord, or the User cache if it's already available.
 * @async
 * @param {Discord.Snowflake|number} UserId The player server ID or the player discord ID or any player identifier
 * @returns {Promise<Discord.User|null>} Discord User
 */
const GetUser = async UserId => {

    if (!UserId) throw new Error('DiscordFramework: Discord --> GetUser() No player ID provided');

    const { NetworkPlayers } = require('../../index').Players.module.helpers;
    // Check whether the provided ID is a server ID or a Discord ID; and if not discord, then fetch the player data and retrieve their Discord ID
    if(NetworkPlayers.validateIdentifier(UserId) !== 'Discord') {
        const Player = NetworkPlayers.get(UserId);
        if (!Player) throw new Error('DiscordFramework: Discord --> GetUser() Player does not have a PlayerNetworkObject');
        UserId = Player.discordId;
    }

    if (!IsSnowFlake(UserId)) throw new Error('DiscordFramework: Discord --> GetUser() Invalid player ID provided');

    let user = null;
    try {
        user = await Client.users.fetch(UserId);
    }
    catch (err) {
        if(err.message !== 'Unknown Member') console.error(err);;

    }
    return user;
};


/**
 * Checked whether the provided parameter is a sknowflake or not by comparing it to a SnowFlake's properties
 * @param {any} SnowFlake
 * @returns {boolean}
 */
const IsSnowFlake = SnowFlake => {
    if(isNaN(SnowFlake)) return false;

    if(SnowFlake.length <= 18 && SnowFlake.length >= 19) return false;

    const SnowFlakeTS = Discord.SnowflakeUtil.timestampFrom(SnowFlake);
    const MaxSnowFlakeTS = 9223372036854775807;
    const MixSnowFlakeTS = 1431478861000;

    if(SnowFlakeTS < MixSnowFlakeTS || SnowFlakeTS > MaxSnowFlakeTS) return false;
    return true;
};

/**
 * Return a brief information of the Discord client
 * @returns {string} client username & ID, client invite link, users size, and guilds size
 */
const GetInfo = () => {
    const msg = `\n              ^3Client Details: ^4${Client.user.tag + ' ^6(' + Client.user.id + ')'}` +
                `\n              ^3Client Invite: ^4${Client.generateInvite({ scopes: ['bot'] })}` +
                `\n              ^3Discord Users: ^4${Client.users.cache.size + (Client.users.cache.size === 1 ? ' User' : ' Users')}` +
                `\n              ^3Discord Guilds: \n${Client.guilds.cache.map(guild => `                ^3- ^4${guild.name} ^6(${guild.id})`).join('\n')}` +
                '\n^0';
    return msg;
};


/**
 * All CFX Exports are callbacks. since Asynchronous functions aren't compatible with lua/C#
 */
emit('DiscordFramework:Export:Create', 'Discord', () => {
    return {
        GetGuild: (GuildId, Callback) => {
            GetGuild(GuildId).finally(Callback);
        },
        GetSharedGuilds: (UserId, GuildId, Callback) => {
            Callback(GetSharedGuilds(UserId, GuildId));
        },
        GetRole: (RoleId, GuildId, Callback) => {
            GetRole(RoleId, GuildId).finally(Callback);
        },
        GetMember: (UserId, GuildId, Callback) => {
            GetMember(UserId, GuildId).finally(Callback);
        },
        GetUser: (UserId, Callback) => {
            GetUser(UserId).finally(Callback);
        }
    };
});


module.exports = {
    client: Client,
    info: GetInfo,
    helpers: {
        GetGuild,
        GetSharedGuilds,
        GetRole,
        GetMember,
        GetUser
    }
};