const Config = {
    /**
     * Change the token to your bot's token
     * Make sure to not share the token with anyone else
     */
    Token: 'ODQ2MzQyMjQ5ODUxMTI1Nzgx.Gvhv9d.khV_Z8y4PEumq03lY2JXsBY0ixA8Ed_wL3cwVM',
    /**
     * Change GuildId to your main/primary discord server
     * in the functions below if no guild ID is provided
     * the function will look for that GuildId
     * and if not present and error will be throw
     */
    GuildId: '572195755922685962' // The main discord server
};

const Discord = require('discord.js');
const Client = new Discord.Client({ intents: 131071 });

Client.login(Config.Token);
Client.on('ready', () => {
    emit('DiscordFramework:Module:Ready', 'Discord');
});

console.log('----------> Discord file called!');

// --------------------------------------
//              FUNCTIONS
// --------------------------------------

/**
 * @description Gets a discord guild information from a discord guild id
 * @param {number} DiscordGuildId The discord guild id
 * @return Discord Guild
 */
const GetGuild = async (DiscordGuildId) => {


    if (!DiscordGuildId) return new Error('DiscordFramework: Discord --> GetGuild() No guild ID provided');
    if (isNaN(DiscordGuildId)) return new Error('DiscordFramework: Discord --> GetGuild() Invalid guild ID provided');

    let Guild;

    try {
        Guild = await Client.guilds.fetch(DiscordGuildId);
    } catch (err) {
        Guild = null;
    }

    return Guild;
};

/**
 * @description Checks a player exists in a discord guild
 * @param {number} PlayerId The player server ID or the player discord ID or any player identifier
 * @param {number} DiscordGuildId The discord guild id (optional)
 * @returns Discord GuildMember
 */
const GetMember = async (PlayerId, DiscordGuildId = Config.GuildId) => {

    if (!PlayerId) return new Error('DiscordFramework: Discord --> GetMember() No player ID provided');
    if (isNaN(PlayerId)) return new Error('DiscordFramework: Discord --> GetMember() Invalid player ID provided');

    let MemberId;
    if (PlayerId.length > 10) { // Check whether the provided ID is a Discord ID or just a normal FiveM Player ID
        MemberId = PlayerId;
    } else {
        const Player = exports.DiscordFramework.Core().GetPlayer(PlayerId);
        if (!Player) return new Error('DiscordFramework: Discord --> GetMember() Player does not have a player network object');
        MemberId = Player.discordId;
    }

    const Guild = await Client.guilds.fetch(DiscordGuildId);
    if (!Guild) return new Error('DiscordFramework: Discord --> GetMember() Client is not a member of provided guild\'s ID or guild does not exist');

    let Member;

    try {
        Member = await Guild.members.fetch(MemberId);
    } catch (err) {
        Member = null;
    }

    return Member;
};

/**
 * @description Get a discord role information from a discord role id
 * @param {number} RoleId The discord role id
 * @param {number} DiscordGuildId The discord guild id (optional)
 * @return Discord Role
 */
const GetRole = async (RoleId, DiscordGuildId = Config.GuildId) => {

    if (!RoleId) return new Error('DiscordFramework: Discord --> GetRole() No role ID provided');
    if (isNaN(RoleId)) return new Error('DiscordFramework: Discord --> GetRole() Invalid role ID provided');

    const Guild = await GetGuild(DiscordGuildId);
    if (!Guild) return new Error('DiscordFramework: Discord --> GetRole() Client is not a member of provided guild\'s ID or guild does not exist');


    let Role;

    try {
        Role = await Guild.roles.fetch(DiscordGuildId);
    } catch (err) {
        Role = null;
    }

    return Role;
};

/**
 * @description Checks a player exists in a discord guild
 * @param {number} PlayerId The player server ID or the player discord ID or any player identifier
 * @returns Discord User
 */
const GetUser = async (PlayerId) => {

    if (!PlayerId) return new Error('DiscordFramework: Discord --> GetMember() No player ID provided');
    if (isNaN(PlayerId)) return new Error('DiscordFramework: Discord --> GetMember() Invalid player ID provided');

    let UserId;
    if (PlayerId.length > 10) { // Check whether the provided ID is a Discord ID or just a normal FiveM Player ID
        UserId = PlayerId;
    } else {
        const Player = exports.DiscordFramework.Core().GetPlayer(PlayerId);
        if (!Player) return new Error('DiscordFramework: Discord --> GetMember() Player does not have a player network object');
        UserId = Player.discordId;
    }

    let User;

    try {
        User = await Client.users.fetch(UserId);
    } catch (err) {
        User = null;
    }

    return User;
};

// --------------------------------------
//                EXPORTS
// --------------------------------------

module.exports = {
    Base: Discord,
    Client: Client,
    GetUsers: Client.users.cach,
    GetGuilds: Client.guilds.cach,
    GetUser: GetUser,
    GetGuild: GetGuild,
    GetMember: GetMember,
    GetRole: GetRole
};