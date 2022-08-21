const { Module: Modules } = require('../../modules');

module.exports.Module = class Discord extends Modules {
    constructor(modules) {
        super(modules, {
            name: 'Discord',
            description: 'A discord integration module',
            toggle: true,
            quickStart: false,
            version: '1.0',
            author: 'ItsAmmarB',
            config: {
                /**
                     * Change GuildId to your main/primary discord server
                     * in the functions below if no guild ID is provided
                     * the function will look for that GuildId
                     * and if not present and error will be throw
                 */
                GuildId: '354062777737936896' // The main discord server
            }
        });

        this.Token = 'OTg1NzAzMjA3MDM4NzYzMDI4.GbgCei.6Vc4rE4Yl8EK2kleChxCuWMP3cSL3Doc1bbxSQ';

        const { Client } = require('discord.js');
        this.client = new Client({ intents: 131071 });
        this.Run();
    }

    Run() {
        this.client.login(this.Token);
        this.client.on('ready', () => {
            this.Ready();
            this.#Exports();
        });
    }

    /**
     * @description Gets a discord guild information from a discord guild id
     * @param {number} DiscordGuildId The discord guild id
     * @return Discord Guild
     */
    async GetGuild(DiscordGuildId) {

        if (!DiscordGuildId) return new Error('DiscordFramework: Discord --> GetGuild() No guild ID provided');
        if (isNaN(DiscordGuildId)) return new Error('DiscordFramework: Discord --> GetGuild() Invalid guild ID provided');

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

        if (!PlayerId) return new Error('DiscordFramework: Discord --> GetMember() No player ID provided');
        if (isNaN(PlayerId)) return new Error('DiscordFramework: Discord --> GetMember() Invalid player ID provided');

        let MemberId;
        if (PlayerId.length > 10) { // Check whether the provided ID is a Discord ID or just a normal FiveM Player ID
            MemberId = PlayerId;
        } else {
            const Player = require('../../core').Players.get(PlayerId);
            if (!Player) return new Error('DiscordFramework: Discord --> GetMember() Player does not have a player network object');
            MemberId = Player.discordId;
        }

        const Guild = await this.client.guilds.fetch(DiscordGuildId);
        if (!Guild) return new Error('DiscordFramework: Discord --> GetMember() Client is not a member of provided guild\'s ID or guild does not exist');

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
    }

    /**
     * @description Checks a player exists in a discord guild
     * @param {number} PlayerId The player server ID or the player discord ID or any player identifier
     * @returns Discord User
     */
    async GetUser(PlayerId) {

        if (!PlayerId) return new Error('DiscordFramework: Discord --> GetMember() No player ID provided');
        if (isNaN(PlayerId)) return new Error('DiscordFramework: Discord --> GetMember() Invalid player ID provided');

        let UserId;
        if (PlayerId.length > 10) { // Check whether the provided ID is a Discord ID or just a normal FiveM Player ID
            UserId = PlayerId;
        } else {
            const Player = require('../../core').Players.get(PlayerId);
            if (!Player) return new Error('DiscordFramework: Discord --> GetMember() Player does not have a player network object');
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
        module.exports.Client = this.client,
        module.exports.GetGuild = async (GuildId) => {
            return await this.GetGuild(GuildId);
        },
        module.exports.GetMember = async (MemberId, GuildId) => {
            return await this.GetMember(MemberId, GuildId);
        },
        module.exports.GetRole = async (RoleId, GuildId) => {
            return await this.GetRole(RoleId, GuildId);
        }
    }
};