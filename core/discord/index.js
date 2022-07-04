const Config = require(SV_Config.resourceDirectory + '/core/discord/config');
const Discord = require('discord.js');
const Client = new Discord.Client({ fetchAllMembers: true, intents: 131071 });

Client.on('ready', () => {
    emit('DiscordFramework:Discord:Client:Ready');
});

Client.login(Config.token); // Discord client login..
Config.token = null; // Nullify the token as a security measure; but you still must mindfull of what you add!!

/**
 * @description Gets a discord guild information from a discord guild id
 * @param {*} DiscordGuildId The discord guild id
 * @return Discord Guild
 */
const GetGuild = async (DiscordGuildId) => {

    if(!DiscordGuildId) return new Error('DiscordFramework: Discord --> GetGuild() No guild ID provided');
    if(isNaN(DiscordGuildId)) return new Error('DiscordFramework: Discord --> GetGuild() Invalid guild ID provided');

    let Guild;

    try {
        Guild = await Client.guilds.fetch(DiscordGuildId);
    } catch(err) {
        Guild = null;
    }

    return Guild;
};

/**
 * @description Checks a player exists in a discord guild
 * @param {*} PlayerId The player server ID or the player discord ID or any player identifier
 * @param {*} DiscordGuildId The discord guild id
 * @returns Discord GuildMember
 */
const GetMember = async (PlayerId, DiscordGuildId) => {

    if(!PlayerId) return new Error('DiscordFramework: Discord --> GetMember() No player ID provided');
    if(isNaN(PlayerId)) return new Error('DiscordFramework: Discord --> GetMember() Invalid player ID provided');

    let MemberId;
    if(PlayerId.length > 10) {
        MemberId = PlayerId;
    } else {
        const Player = SV_Config.Core.Players.Connected.find(player => player.server.id) || SV_Config.Core.Players.Session.find(player => player.server.id);
        if(!Player) return new Error('DiscordFramework: Discord --> GetMember() Player does not have a player network object');
        MemberId.discord.id;
    }

    const Guild = await GetGuild(DiscordGuildId);
    if(!Guild) return new Error('DiscordFramework: Discord --> GetMember() Client is not a member of provided guild\'s ID or guild does not exist');

    let Member;

    try {
        Member = await Guild.members.fetch(MemberId);
    } catch(err) {
        Member = null;
    }

    return Member;
};

/**
 * @description Get a discord role information from a discord role id
 * @param {*} RoleId The discord role id
 * @param {*} DiscordGuildId The discord guild id
 * @return Discord Role
 */
const GetRole = async (RoleId, DiscordGuildId) => {

    if(!RoleId) return new Error('DiscordFramework: Discord --> GetRole() No role ID provided');
    if(isNaN(RoleId)) return new Error('DiscordFramework: Discord --> GetRole() Invalid role ID provided');

    const Guild = await GetGuild(DiscordGuildId);
    if(!Guild) return new Error('DiscordFramework: Discord --> GetRole() Client is not a member of provided guild\'s ID or guild does not exist');


    let Role;

    try {
        Role = await Guild.roles.fetch(DiscordGuildId);
    } catch(err) {
        Role = null;
    }

    return Role;
};

module.exports = {
    Base: Discord,
    Client: Client,
    GetGuild: GetGuild,
    GetMember: GetMember,
    GetRole: GetRole
};