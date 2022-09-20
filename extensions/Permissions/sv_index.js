on('DiscordFramework:Extensions:Extension:Load', () => {

    const { Extension } = require(GetResourcePath(GetCurrentResourceName()) + '/core/modules/Extensions/index');

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
                            id: '354062777737936896',
                            name: 'JusticeCommunityRP',
                            main: true
                        }
                    ]
                }
            });

            this.Players = [];

        }

        Run() {

            const Discord = require(GetResourcePath(GetCurrentResourceName()) + '/core/modules/Discord/index');

            // When a player connects do shizz
            on('DiscordFramework:Player:Joined', async Player => {

                // Trigger the client side
                this.RunClient(Player.ServerId);

                /**
                 * Get the player roles and discord information and store it for the first time
                 * Then send the server side constructed config to the client
                 */
                if (Player.DiscordId) {

                    const Guilds = [];
                    for (let i = 0; i < this.GetAllowedGuilds().length; i++) {
                        const guild = this.GetAllowedGuilds()[i];
                        if (!guild) return;
                        const member = await Discord.GetMember(Player.DiscordId, guild.id);
                        if (!member) return;
                        Guilds.push(member);
                    }
                    setTimeout(async () => {
                        await this.UpdatePermissions(Player, Guilds);
                        await this.AcePermissionsAdd(Player);
                    }, 200);

                }

                // The client config is made here as a security measure
                const config = { ... this.Config };
                delete config.acePermissions;

                // emitNet('DiscordFramework:Permissions:Initialize', Player.ServerId, config);
            });

            on('DiscordFramework:Player:Disconnected', async (PlayerId) => {

                const { Players } = require(GetResourcePath(GetCurrentResourceName()) + '/core/index');
                const Player = Players.get(PlayerId);
                if (Player.DiscordId) await this.AcePermissionsRemove(Player);

                this.Players = this.Players.filter(player => player.id !== PlayerId);

            });


            Discord.Client.on('guildMemberUpdate', async (oldMember, newMember) => {
                const Player = this.Players.find(p => p.DiscordId === newMember.id);
                if (Player) {
                    if (this.GetAllowedGuilds().find(guild => guild.id === newMember.guild.id)) {
                        await this.UpdatePermissions(Player, [newMember]);
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
            const Player = this.Players.find(player => PlayerId === player.ServerId || PlayerId === player.DiscordId);
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
                const MemberGuilds = LocalPlayer.Guilds.filter(guild => AllowedGuilds.includes(guild.id));
                const IsMemberAdministrator = MemberGuilds.find(guild => guild.Administrator) ? true : false;

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
                if (Roles.find(roleID => {
                    return MemberGuilds.find(guild => {
                        return guild.Roles.find(_role => {
                            return _role.id === roleID;
                        });
                    });
                })) return true;

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
        async UpdatePermissions(Player, Member) {

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

            await this.Delay(25);

            for (let i = 0; i < Member.length; i++) {

                const member = Member[i];
                const Roles = member.roles.cache.map(role => ({ Name: role.name, Id: role.id }));

                const _playerGuild = LocalPlayer.Guilds.find(guild => guild.id === member.guild.id);
                if(!_playerGuild) {
                    const _guild = {
                        Name: member.guild.name,
                        Id: member.guild.id,
                        Administrator: member.permissions.has('ADMINISTRATOR'),
                        Roles: Roles
                    };

                    LocalPlayer.Guilds.push(_guild);
                    LocalPlayer = this.Players.find(player => player.DiscordId === Player.DiscordId);
                } else {
                    _playerGuild.Roles = Roles;
                    _playerGuild.Administrator = member.permissions.has('ADMINISTRATOR');
                }
            }

            await this.Delay(25);

            LocalPlayer = this.Players.find(player => player.DiscordId === Player.DiscordId);

            emitNet('DiscordFramework:Permissions:UpdatePermissions', LocalPlayer.ServerId, LocalPlayer);

        }

        /**
         * @description Used to get all of the allowed guilds or search for one within the allowed guilds for the members' roles to be fetched from; guilds must be registered in the config
         * @param GuildID The guild ID (Optional)
         * @return object
         */
        GetAllowedGuilds(GuildID = null) {
            if (GuildID) {
                return this.GetAllowedGuilds().filter(guild => guild.id === GuildID);
            } else {
                return this.Config.guilds.filter(guild => this.Config.mainGuildOnly ? guild.main : guild);
            }
        }

        async AcePermissionsAdd(Player) {
            if (this.Config.acePermissions.enabled) {
                if (Player.DiscordId) {
                    for (const Permission of this.Config.acePermissions.permissions) {
                        if(Permission.enabled) {
                            const IsAllowed = this.CheckPermission(Player.DiscordId, [Permission.roles]);
                            await this.Delay(25); // Delay is present in the parent class as a method
                            if (IsAllowed) {
                                // Assign groups
                                if(Permission.groups.length > 0) {
                                    for (const Group of Permission.groups) {
                                        ExecuteCommand('add_principal identifier.discord:' + Player.DiscordId + ' ' + Group);
                                    }
                                }
                                // Assign aces
                                if(Permission.aces.length > 0) {
                                    for (const Ace of Permission.aces) {
                                        ExecuteCommand('add_ace identifier.discord:' + Player.DiscordId + ' ' + Ace);
                                    }
                                }
                                ExecuteCommand('refresh');
                            }
                        }
                    }
                }
            }
        }

        async AcePermissionsRemove(Player) {
            if (this.Config.acePermissions.enabled) {
                if (Player.DiscordId) {
                    for (const Permission of this.Config.acePermissions.permissions) {
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
                            return LocalPlayer.Guilds.filter(guild => guild.id === guild);
                        } else {
                            return LocalPlayer.Guilds;
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