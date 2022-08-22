const { Module: Modules } = require('../../modules');

module.exports.Module = class Discord extends Modules {

    /**
     * Put your Discord bot token here and make sure to never share it with anyone
     * keep in mind, the framework does not need any permissions to work out of the box,
     * extensions may require certain permissions, be careful of what they require and
     * use your own judgement.
     *
     * The token was put here as a security measure to prevent outside sources from
     * obtaining it, thought it still CAN be obtained, again, use your judgement!
     *
     * DISCLAIMER:
     * I am not responsible for anything that could or would happen if an extension that was
     * not made by me, Ammar B. AKA. ItsAmmarB that caused harm or damage in any capacity to your
     * FiveM server, Discord server, or anything in any way, share, or form.
     */
    #Token = 'TOKEN HERE';

    constructor(modules) {
        super(modules, {
            name: 'Discord',
            description: 'A discord integration module',
            toggle: true,
            version: '1.0',
            author: 'ItsAmmarB',
            config: {
                /**
                     * Change GuildId to your main/primary discord server
                     * in the functions below if no guild ID is provided
                     * the function will look for that GuildId
                     * and if not present an error will be throw
                 */
                GuildId: '354062777737936896' // JusticeCommunityRP
            }
        });

        const { Client } = require('discord.js');
        this.client = new Client({ intents: 131071 });
        this.Run();
    }

    Run() {
        this.client.login(this.#Token);
        this.client.on('ready', () => {
            this.Ready();
            this.#Exports();

            const { AddPrint, Table } = require('../Console/index');
            let i = 1;
            AddPrint('Discord', `
    ^3Discord API Client: ^4${this.client.user.tag + ' ^6(' + this.client.user.id + ')'}
    ^3Discord Users: ^4${this.client.users.cache.size + (this.client.users.cache.size === 1 ? ' User' : ' Users')}
    ^3Discord Guilds: \n${Table(this.client.guilds.cache.map(guild => {i === 1 ? i++ : i--; return ({ '^3ID': (i === 1 ? '^4' : '^9') + guild.id, '^3Name': (i === 1 ? '^4' : '^9') + guild.name, '^3Members Count': (i === 1 ? '^4' : '^9') + guild.members.cache.size, '^3Roles Count': (i === 1 ? '^4' : '^9') + guild.roles.cache.size });}))}
            `);
        });
    }

    /**
     * @description Gets a discord guild information from a discord guild id
     * @param {number} DiscordGuildId The discord guild id
     * @return Discord Guild
     */
    async GetGuild(DiscordGuildId) {

        if (!DiscordGuildId) throw new Error('DiscordFramework: Discord --> GetGuild() No guild ID provided');
        if (isNaN(DiscordGuildId)) throw new Error('DiscordFramework: Discord --> GetGuild() Invalid guild ID provided');

        let Guild;

        try {
            Guild = await this.client.guilds.fetch(DiscordGuildId);
        } catch (err) {
            Guild = null;
        }

        return Guild;
    }

    /**
     * @description Checks a player exists in a discord guild
     * @param {number} PlayerId The player server ID or the player discord ID or any player identifier
     * @param {number} DiscordGuildId The discord guild id (optional)
     * @returns Discord GuildMember
     */
    async GetMember(PlayerId, DiscordGuildId = this.config.GuildId) {

        if (!PlayerId) throw new Error('DiscordFramework: Discord --> GetMember() No player ID provided');
        if (isNaN(PlayerId)) throw new Error('DiscordFramework: Discord --> GetMember() Invalid player ID provided');

        let MemberId;
        if (PlayerId.length > 10) { // Check whether the provided ID is a Discord ID or just a normal FiveM Player ID
            MemberId = PlayerId;
        } else {
            const Player = require('../../core').Players.get(PlayerId);
            if (!Player) throw new Error('DiscordFramework: Discord --> GetMember() Player does not have a player network object');
            MemberId = Player.discordId;
        }

        const Guild = await this.client.guilds.fetch(DiscordGuildId);
        if (!Guild) throw new Error('DiscordFramework: Discord --> GetMember() Client is not a member of provided guild\'s ID or guild does not exist');

        let Member;

        try {
            Member = await Guild.members.fetch(MemberId);
        } catch (err) {
            Member = null;
        }

        return Member;
    }

    /**
     * @description Get a discord role information from a discord role id
     * @param {number} RoleId The discord role id
     * @param {number} DiscordGuildId The discord guild id (optional)
     * @return Discord Role
     */
    async GetRole(RoleId, DiscordGuildId = this.config.GuildId) {

        if (!RoleId) throw new Error('DiscordFramework: Discord --> GetRole() No role ID provided');
        if (isNaN(RoleId)) throw new Error('DiscordFramework: Discord --> GetRole() Invalid role ID provided');

        const Guild = await GetGuild(DiscordGuildId);
        if (!Guild) throw new Error('DiscordFramework: Discord --> GetRole() Client is not a member of provided guild\'s ID or guild does not exist');


        let Role;

        try {
            Role = await Guild.roles.fetch(DiscordGuildId);
        } catch (err) {
            Role = null;
        }

        return Role;
    }

    /**
     * @description Checks a player exists in a discord guild
     * @param {number} PlayerId The player server ID or the player discord ID or any player identifier
     * @returns Discord User
     */
    async GetUser(PlayerId) {

        if (!PlayerId) throw new Error('DiscordFramework: Discord --> GetMember() No player ID provided');
        if (isNaN(PlayerId)) throw new Error('DiscordFramework: Discord --> GetMember() Invalid player ID provided');

        let UserId;
        if (PlayerId.length > 10) { // Check whether the provided ID is a Discord ID or just a normal FiveM Player ID
            UserId = PlayerId;
        } else {
            const Player = require('../../core').Players.get(PlayerId);
            if (!Player) throw new Error('DiscordFramework: Discord --> GetMember() Player does not have a player network object');
            UserId = Player.discordId;
        }

        let User;

        try {
            User = await this.client.users.fetch(UserId);
        } catch (err) {
            User = null;
        }

        return User;
    }

    #Exports() {
        // JS Module Export
        module.exports.Client = this.client,
        module.exports.GetGuild = async (GuildId) => {
            return await this.GetGuild(GuildId);
        },
        module.exports.GetMember = async (MemberId, GuildId) => {
            return await this.GetMember(MemberId, GuildId);
        },
        module.exports.GetRole = async (RoleId, GuildId) => {
            return await this.GetRole(RoleId, GuildId);
        };
        module.exports.GetUser = async (PlayerId) => {
            return await this.GetUser(PlayerId);
        };


        // CFX Export
        emit('DiscordFramework:Export:Create', 'Discord', () => {
            return {
                GetGuild: async (GuildId) => {
                    const Guild = await this.GetGuild(GuildId);
                    return {
                        id: Guild.id,
                        name: Guild.name,
                        ownerId: Guild.ownerId,
                        channels: Guild.channels.cache.map(channel => ({ name: channel.name, type: channel.type, id: channel.id })),
                        role: Guild.roles.cache.map(role => ({ name: role.name, id: role.id, color: role.hexColor })),
                        members: Guild.members.cache.map(member => ({ id: member.id, displayName: member.displayName, username: member.user.tag, joinedAt: member.joinedTimestamp, createdAt: member.user.createdTimestamp, roles: member.roles.cache.map(role => ({ name: role.name, id: role.id, color: role.hexColor })) })),
                        createdAt: Guild.createdTimestamp,
                        locale: Guild.locale,
                        region: Guild.region,
                        invites: Guild.invites.cache.map(invite => ({ code: invite.code, url: invite.url, expiresAt: invite.expiresTimestamp })),
                        icon: Guild.iconURL({ dynamic: true })
                    };
                },
                GetMember: async (MemberId, GuildId) => {
                    const Member = await this.GetMember(MemberId, GuildId);
                    return {
                        id: Member.id,
                        displayName: Member.displayName,
                        username: Member.user.tag,
                        color: Member.displayHexColor,
                        joinedAt: Member.joinedTimestamp,
                        createdAt: Member.user.createdTimestamp,
                        roles: Member.roles.cache.map(role => ({ name: role.name, id: role.id, color: role.hexColor })),
                        avatar: Member.displayAvatarURL({ dynamic: true }),
                        banner: Member.user.banner({ dynamic: true })
                    };
                },
                GetRole: async (RoleId, GuildId) => {
                    const Role = await this.GetRole(RoleId, GuildId);
                    return {
                        id: Role.id,
                        name: Role.name,
                        color: Role.hexColor,
                        members: Role.members.cache.map(member => ({ id: member.id, nickname: member.nickname, username: member.user.tag, joinedAt: member.joinedTimestamp, createdAt: member.user.createdTimestamp, roles: member.roles.cache.map(role => ({ name: role.name, id: role.id, color: role.hexColor })) })),
                        createdAt: Role.createdTimestamp
                    };
                },
                GetUser: async (PlayerId) => {
                    const User = await this.GetUser(PlayerId);
                    return {
                        id: User.id,
                        username: User.tag,
                        createdAt: User.createdTimestamp,
                        avatar: User.avatarURL({ dynamic: true }),
                        banner: User.bannerURL({ dynamic: true })
                    };
                }
            };
        });

    }

};
