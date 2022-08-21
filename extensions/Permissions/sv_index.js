on('DiscordFramework:Core:Ready', () => {

    const { Extension } = require(GetResourcePath(GetCurrentResourceName()) + '/core/modules/extensions');
    const Config = require(GetResourcePath(GetCurrentResourceName()) + '/extensions/Permissions/config');
    const { Client, GetMember } = require(GetResourcePath(GetCurrentResourceName()) + '/core/modules/discord');

    new class Permissions extends Extension {
        constructor() {
            super({
                Name: 'Permissions', // Change to extension name
                Description: 'Provides permissions checking using Discord roles', // Add a brief decription of what does the extension do
                Enabled: true, // Whether the extension is supposed to be enabled or disabled
                Dependencies: [], // Add the dependencies/other extensions needed for this extension to be usable
                Version: '1.0', // The current version of the extension if available
                Author: 'ItsAmmarB',
                Config: Config
            });

            this.players = [];
        }

        Run() {


            // When a player connects do shizz
            on('DiscordFramework:Player:Connected', async PlayerId => {


                // Trigger the client side
                this.LoadClient(PlayerId);

                /**
                 * Get the player roles and discord information and store it for the first time
                 * Then send the server side constructed config to the client
                 */
                const Player = exports.DiscordFramework.Core().GetPlayer(PlayerId);
                if (Player.discordId) {

                    const Member = [];
                    for (let i = 0; i < this.GetAllowedGuilds().length; i++) {
                        const guild = this.GetAllowedGuilds()[i];
                        if (!guild) return;
                        const member = await GetMember(Player.discordId, guild.id);
                        if (!member) return;
                        Member.push(member);
                    }

                    setTimeout(async () => {
                        this.UpdatePermissions(Player, Member);
                        await this.AcePermissionsAdd(Player);
                    }, 200);

                }

                // The client config was made here as a security measure
                const config = {
                    mainGuildOnly: this.Config.mainGuildOnly,
                    allowEveryone: this.Config.allowEveryone,
                    discordAdmin: this.Config.discordAdmin,
                    selfPermission: this.Config.selfPermission,
                    guilds: this.Config.guilds
                };

                emitNet('DiscordFramework:Permissions:Initialize', PlayerId, config);
            });

            on('DiscordFramework:Player:Disconnected', async (PlayerId) => {

                const Player = exports.DiscordFramework.Core().GetPlayer(PlayerId);
                if (Player.discordId) await this.AcePermissionsRemove(Player);

                this.players = this.players.filter(player => player.id !== PlayerId);

            });

            Client.on('guildMemberUpdate', (oldMember, newMember) => {
                const Player = this.players.find(p => p.discordId === newMember.id);
                if (Player) {

                    if (this.GetAllowedGuilds().find(guild => guild.id === newMember.guild.id)) {

                        this.UpdatePermissions(Player, [newMember]);

                    }

                }
            });

            // FiveM Exports for external use
            exports('Permissions.CheckPermission', (PlayerId, Roles, Guild = null) => this.CheckPermission(PlayerId, Roles, Guild));
            exports('Permissions.GetGuilds', (PlayerId, Guild = null) => {
                const LocalPlayer = this.players.find(player => player.serverId === PlayerId || player.discordId === PlayerId);
                if (!LocalPlayer) return null;
                if (Guild) {
                    return LocalPlayer.guilds.filter(guild => guild.id === guild);
                } else {
                    return LocalPlayer.guilds;
                }
            });
            exports('Permissions.GetAllowedGuilds', (Guild = null) => this.GetAllowedGuilds(Guild));
            exports('Permissions.GetDiscordID', PlayerId => {
                const LocalPlayer = this.players.find(player => player.serverId === PlayerId || player.discordId === PlayerId);
                if (!LocalPlayer) return null;
                return LocalPlayer.discordId;
            });
            exports('Permissions.GetServerID', PlayerId => {
                const LocalPlayer = this.players.find(player => player.serverId === PlayerId || player.discordId === PlayerId);
                if (!LocalPlayer) return null;
                return LocalPlayer.serverId;
            });

        }

        /**
     * @description Used to match provided roles ID and/or users' IDs against players' roles' IDs and/or players' IDs
     * @param PlayerId The player's server ID, or Discord ID
     * @param Roles An array or roles' IDs or users' IDs
     * @param Guild A guild ID (Optional)
     * @returns Boolean
     */
        CheckPermission(PlayerId, Roles, Guild = null) {

            // if "allowEveryone" then just save the time and just return true; otherwise keep going... :P
            if (this.Config.allowEveryone || PlayerId === 0) return true;

            // Get and check of the player has a network object store in the Core
            const Player = exports.DiscordFramework.Core().GetPlayer(PlayerId) || Array.from(exports.DiscordFramework.Core().GetPlayers(), ([, value]) => value).find(p => p.discordId === PlayerId);
            if (Player && Player.discordId) {

                /**
             * If "Guild" was provided, then look for the server whilst also keeping in mind;
             * if "mainGuildOnly" was true, only and only check the main guild if the IDs match; but
             * if "mainGuildOnly" was false; then check all registered guilds provided in the config
             * for a matching guild ID;
             *
             * but if "Guild" was not provided; then check all registered guild in the config for matching roles
             * with those provided;
             *
             * The returned guild(s) are the "AllowedGuilds"; which means they can be looked into; AKA. *allowed*
             */
                let AllowedGuilds = this.GetAllowedGuilds(Guild);
                if (AllowedGuilds.length < 1) return false;
                AllowedGuilds = AllowedGuilds.map(guild => guild.id);

                /**
             * Get basic player/member information for easy access later;
             */
                const LocalPlayer = this.players.find(player => player.discordId === Player.discordId);
                const MemberGuilds = LocalPlayer.guilds.filter(guild => AllowedGuilds.includes(guild.id));
                const IsMemberAdministrator = MemberGuilds.find(guild => guild.administrator) ? true : false;

                /**
             * Check if member is an admin and the "discordAdmin"; if both are true, then just return true to save time and CPU usage
             * and the same goes for "selfPermission", if the member's ID was present within the provided "Roles"; then also just return
             * true to save time and ... you know it; CPU usage :D
             */
                if (this.Config.discordAdmin && IsMemberAdministrator) return true;
                if (this.Config.selfPermission && Roles.includes(Player.discordId)) return true;

                /**
             * This is very confusing as I don't even how I did it myself
             *
             * jk; so basically, you try to find a matching role within the guilds that are allowed!
             * obviously those guilds and roles are stored, and so no fetching or resolving is needed here
             * just pure hide n' seek
             *
             * and if a "MatchingRole" is found then true shall be returned,
             * but if not found it will return null in which it will falsely the if statement
             * and then return false
             */
                const MatchingRole = Roles.find(roleID => {
                    return MemberGuilds.find(guild => {
                        return guild.roles.find(_role => {
                            return _role.id === roleID;
                        });
                    });
                });

                if (MatchingRole) return true;

                return false;
            } else {
                return false;
            }
        }

        /**
     * @description Used to update the server and the client sided stored data
     * @param Player The player's network object stored in Core
     * @param Member An array of "GuildMember" objects related to the "Player"
     */
        UpdatePermissions(Player, Member) {

            let LocalPlayer = this.players.find(player => player.discordId === Player.discordId);
            if (LocalPlayer) {
                const _Player = this.players.find(player => player.discordId === Player.discordId);

                for (let i = 0; i < Member.length; i++) {
                    const member = Member[i];
                    const roles = [];

                    member.roles.cache.forEach(role => roles.push(({ name: role.name, id: role.id, guild: role.guild.id })));
                    _Player.guilds.find(guild => guild.id === member.guild.id).roles = roles;

                    member.permissions.has('ADMINISTRATOR') ?
                        _Player.guilds.find(guild => guild.id === member.guild.id).administrator = true :
                        _Player.guilds.find(guild => guild.id === member.guild.id).administrator = false;
                }

                LocalPlayer = this.players.find(player => player.discordId === Player.discordId);
            } else {
                const player = {
                    serverId: Player.serverId,
                    discordId: Player.discordId,
                    guilds: []
                };

                for (let i = 0; i < Member.length; i++) {
                    const member = Member[i];
                    const guild = {
                        id: member.guild.id,
                        name: member.guild.name,
                        administrator: false,
                        roles: []
                    };

                    if (member.permissions.has('ADMINISTRATOR')) guild.administrator = true;
                    member.roles.cache.forEach(role => guild.roles.push(({ name: role.name, id: role.id })));
                    player.guilds.push(guild);
                }

                this.players.push(player);
                LocalPlayer = this.players.find(_player => _player.discordId === Player.discordId);
            }

            emitNet('DiscordFramework:Permissions:UpdatePermissions', LocalPlayer.serverId, LocalPlayer);

        }

        /**
     * @description Used to get all of the allowed guilds or search for one within the allowed guilds for the members' roles to be fetched from; guilds must be registered in the config
     * @param GuildID The guild ID (Option)
     * @return object
     */
        GetAllowedGuilds(GuildID = null) {
            if (GuildID) {
                return this.GetAllowedGuilds().filter(guild => guild.id === GuildID);
            } else {
                return this.Config.guilds.filter(guild => {
                    if (this.Config.mainGuildOnly) {
                        return guild.main;
                    } else {
                        return guild;
                    }
                });
            }
        }

        async AcePermissionsAdd(Player) {

            if (this.Config.AcePermissions.enabled) {
                if (Player.discordId) {

                    for (let i = 0; i < this.Config.AcePermissions.roles.length; i++) {

                        const Role = this.Config.AcePermissions.roles[i];
                        const IsAllowed = this.CheckPermission(Player.discordId, [Role]);

                        await this.Delay(25); // Delay is present in the parent class as a method

                        if (IsAllowed) {
                            Role.group ? ExecuteCommand('add_principal identifier.discord:' + Player.discordId + ' ' + Role.group) : undefined;
                            Role.ace ? ExecuteCommand('add_ace identifier.discord:' + Player.discordId + ' ' + Role.ace) : undefined;
                            Role.group || Role.ace ? ExecuteCommand('refresh') : undefined;
                        }

                    }

                }
            }

        }

        async AcePermissionsRemove(Player) {

            if (this.Config.AcePermissions.enabled) {
                if (Player.discordId) {

                    for (let i = 0; i < this.Config.AcePermissions.roles.length; i++) {

                        const Role = this.Config.AcePermissions.roles[i];
                        const IsAllowed = this.CheckPermission(Player.discordId, [Role]);

                        await this.Delay(25); // Delay is present in the parent class as a method

                        if (IsAllowed) {
                            Role.group ? ExecuteCommand('remove_principal identifier.discord:' + Player.discordId + ' ' + Role.group) : undefined;
                            Role.ace ? ExecuteCommand('remove_ace identifier.discord:' + Player.discordId + ' ' + Role.ace) : undefined;
                            Role.group || Role.ace ? ExecuteCommand('refresh') : undefined;
                        }

                    }

                }
            }

        }

    };

});