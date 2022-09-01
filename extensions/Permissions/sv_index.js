on('DiscordFramework:Extensions:Extension:Load', () => {

    const { Extension } = require(GetResourcePath(GetCurrentResourceName()) + '/core/modules/extensions/index');

    new class Permissions extends Extension {
        constructor() {
            super({
                name: 'Permissions', // Change to extension name
                description: 'Provides permissions checking using Discord roles', // Add a brief decription of what does the extension do
                toggle: true, // Whether the extension is supposed to be enabled or disabled
                dependencies: [], // Add the dependencies/other extensions needed for this extension to be usable
                version: '1.0', // The current version of the extension if available
                author: 'ItsAmmarB',
                config: {
                    mainGuildOnly: true,
                    allowEveryone: false,
                    discordAdmin: true,
                    selfPermission: true,
                    acePermissions: {
                        enabled: true,
                        permissions: [
                            {
                                enabled: true,
                                groups: ['admin'],
                                aces: ['vMenu.ShowPlayersBlips'],
                                roles: [
                                    '652990959100887041'
                                ]
                            }
                        ]
                    },
                    guilds: [
                        {
                            id: 354062777737936896,
                            name: 'JusticeCommunityRP'
                        }
                    ]
                }
            });

            this.Players = [];

            on('DiscordFramework:Module:Ready', () => {
                this.Discord = require(GetResourcePath(GetCurrentResourceName()) + '/core/modules/discord/index');
                this.Core = require(GetResourcePath(GetCurrentResourceName()) + '/core/core');
            });
        }

        Run() {

            // When a player connects do shizz
            on('DiscordFramework:Player:Joined', async Player => {

                // Trigger the client side
                this.RunClient(Player.ServerId);

                /**
                 * Get the player roles and discord information and store it for the first time
                 * Then send the server side constructed config to the client
                 */
                if (Player.DiscordId) {

                    const Member = [];
                    for (let i = 0; i < this.GetAllowedGuilds().length; i++) {
                        const guild = this.GetAllowedGuilds()[i];
                        if (!guild) return;
                        const member = await GetMember(Player.DiscordId, guild.id);
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

                emitNet('DiscordFramework:Permissions:Initialize', Player.ServerId, config);
            });

            on('DiscordFramework:Player:Disconnected', async (PlayerId) => {

                const { Players } = require(GetResourcePath(GetCurrentResourceName()) + '/core/core');
                const Player = Players.get(PlayerId);
                if (Player.DiscordId) await this.AcePermissionsRemove(Player);

                this.Players = this.Players.filter(player => player.id !== PlayerId);

            });

            this.Discord.Client.on('guildMemberUpdate', (oldMember, newMember) => {
                const Player = this.Players.find(p => p.DiscordId === newMember.id);
                console.log(Player);
                if (Player) {
                    if (this.GetAllowedGuilds().find(guild => guild.id === newMember.guild.id)) {
                        this.UpdatePermissions(Player, [newMember]);
                    }
                }
            });

            this.#Exports();

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
            const { Players } = require(GetResourcePath(GetCurrentResourceName()) + '/core/core');
            const Player = Players.get(PlayerId);
            console.log(Player);
            if (Player && Player.DiscordId) {

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
                const LocalPlayer = this.Players.find(player => player.DiscordId === Player.DiscordId);
                const MemberGuilds = LocalPlayer.guilds.filter(guild => AllowedGuilds.includes(guild.id));
                const IsMemberAdministrator = MemberGuilds.find(guild => guild.administrator) ? true : false;

                /**
                 * Check if member is an admin and the "discordAdmin"; if both are true, then just return true to save time and CPU usage
                 * and the same goes for "selfPermission", if the member's ID was present within the provided "Roles"; then also just return
                 * true to save time and ... you know it; CPU usage :D
                 */
                if (this.Config.discordAdmin && IsMemberAdministrator) return true;
                if (this.Config.selfPermission && Roles.includes(Player.DiscordId)) return true;

                /**
                 * This is very confusing as I don't even know how I did it myself
                 *
                 * jk; so basically, you try to find a matching role within the guilds that are allowed!
                 * obviously those guilds and roles are stored, and so no fetching or resolving is needed here
                 * just pure hide n' seek
                 *
                 * and if a "MatchingRole" is found then true shall be returned,
                 * but if not found it will return null in which it will falsify the if statement
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
                return null;
            }
        }

        /**
         * @description Used to update the server and the client sided stored data
         * @param Player The player's network object stored in Core
         * @param Member An array of "GuildMember" objects related to the "Player"
         */
        UpdatePermissions(Player, Member) {

            let LocalPlayer = this.Players.find(player => player.DiscordId === Player.DiscordId);
            if(!LocalPlayer) {
                const _player = {
                    ServerId: Player.ServerId,
                    DiscordId: Player.DiscordId,
                    Guilds: []
                };
                this.Players.push(_player);
                LocalPlayer = this.Players.find(player => player.DiscordId === Player.DiscordId);
            }

            for (let i = 0; i < Member.length; i++) {
                const member = Member[i];
                const Roles = member.roles.cache.map(role => ({ Name: role.name, Id: role.id, guild: { Name: role.guild.name, Id: role.guild.id } }));

                const PlayerGuild = LocalPlayer.Guilds.find(guild => guild.id === member.guild.id);
                if(!PlayerGuild) {
                    const _guild = {
                        Name: Member.guild.name,
                        Id: Member.guild.id,
                        Administrator: null,
                        Roles: []
                    };
                    LocalPlayer.Guilds.push(_guild);
                    LocalPlayer = this.Players.find(player => player.DiscordId === Player.DiscordId);
                }

                PlayerGuild.Roles = Roles;

                member.permissions.has('ADMINISTRATOR') ?
                    LocalPlayer.Guilds.find(guild => guild.id === member.guild.id).Administrator = true :
                    LocalPlayer.Guilds.find(guild => guild.id === member.guild.id).Administrator = false;
            }

            LocalPlayer = this.Players.find(player => player.DiscordId === Player.DiscordId);

            emitNet('DiscordFramework:Permissions:UpdatePermissions', LocalPlayer.ServerId, LocalPlayer);

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
                if (Player.DiscordId) {

                    for (let i = 0; i < this.Config.AcePermissions.roles.length; i++) {

                        const Role = this.Config.AcePermissions.roles[i];
                        const IsAllowed = this.CheckPermission(Player.DiscordId, [Role]);

                        await this.Delay(25); // Delay is present in the parent class as a method

                        if (IsAllowed) {
                            Role.group ? ExecuteCommand('add_principal identifier.discord:' + Player.DiscordId + ' ' + Role.group) : undefined;
                            Role.ace ? ExecuteCommand('add_ace identifier.discord:' + Player.DiscordId + ' ' + Role.ace) : undefined;
                            Role.group || Role.ace ? ExecuteCommand('refresh') : undefined;
                        }

                    }

                }
            }

        }

        async AcePermissionsRemove(Player) {
            if (this.Config.AcePermissions.enabled) {
                if (Player.DiscordId) {
                    for (const Permission of this.Config.AcePermissions.permissions) {
                        if(Permission.enabled) {
                            const IsAllowed = this.CheckPermission(Player.DiscordId, [Permission.roles]);
                            await this.Delay(25); // Delay is present in the parent class as a method
                            if (IsAllowed) {
                                // Assign groups
                                if(Permission.groups.length > 0) {
                                    for (const Group of Permission.groups) {
                                        ExecuteCommand('remove_principal identifier.discord:' + Player.DiscordId + ' ' + Group);
                                    }
                                }
                                // Assign aces
                                if(Permission.aces.length > 0) {
                                    for (const Ace of Permission.aces) {
                                        ExecuteCommand('remove_ace identifier.discord:' + Player.DiscordId + ' ' + Ace);
                                    }
                                }
                                ExecuteCommand('refresh');
                            }
                        }
                    }
                }
            }
        }

        #Exports() {

            // CFX Exports
            exports('Permissions', () => {
                return {
                    CheckPermission: (PlayerId, Roles, Guild = null) => this.CheckPermission(PlayerId, Roles, Guild),
                    GetAllowedGuilds: (Guild = null) => this.GetAllowedGuilds(Guild),
                    GetGuilds: (PlayerId, Guild = null) => {
                        const LocalPlayer = this.Players.find(player => player.ServerId === PlayerId || player.DiscordId === PlayerId);
                        if (!LocalPlayer) return null;
                        if (Guild) {
                            return LocalPlayer.guilds.filter(guild => guild.id === guild);
                        } else {
                            return LocalPlayer.guilds;
                        }
                    },
                    GetDiscordID: PlayerId => {
                        const LocalPlayer = this.Players.find(player => player.ServerId === PlayerId || player.DiscordId === PlayerId);
                        if (!LocalPlayer) return null;
                        return LocalPlayer.DiscordId;
                    },
                    GetServerID: PlayerId => {
                        const LocalPlayer = this.Players.find(player => player.ServerId === PlayerId || player.DiscordId === PlayerId);
                        if (!LocalPlayer) return null;
                        return LocalPlayer.ServerId;
                    }
                };
            });

        }

    };

});