on('DiscordFramework:Extensions:Extension:Load', () => {

    const { Extension } = require(GetResourcePath(GetCurrentResourceName()) + '/Core/Modules/Extensions/index');

    new class Permissions extends Extension {
        constructor() {
            const config = require(GetResourcePath(GetCurrentResourceName()) + '/Extensions/Permissions/config');
            super({
                name: 'Permissions', // Change to extension name
                description: 'Provides permissions checking using Discord roles', // Add a brief decription of what does the extension do
                toggle: true, // Whether the extension is supposed to be enabled or disabled
                dependencies: [], // Add the dependencies/other extensions needed for this extension to be usable
                version: '1.2', // The current version of the extension if available
                author: 'ItsAmmarB',
                config: config
            });

        }

        Run() {

            // When a player connects do shizz
            on('DiscordFramework:Player:Joined', async Player => {

                if (Player.Discord.ID) {
                    await this.AcePermissionsAdd(Player);

                    // Trigger the client side
                    this.RunClient(Player.ServerId);

                    // The client config is made here as a security measure
                    const config = { ... this.Config };
                    delete config.acePermissions;

                    emitNet('DiscordFramework:Permissions:Initialize', Player.Server.ID, Player, config);
                }

            });

            on('DiscordFramework:Player:Disconnected', async Player => {
                if (Player.Discord.ID) {
                    await this.AcePermissionsRemove(Player);
                }
            });

            on('DiscordFrameworK:Player:Roles:Updated', Player => {
                emitNet('DiscordFramework:Permissions:UpdatePermissions', Player.Server.ID, Player);
            });

            this.#Exports();

        }

        /**
         * Used to match provided roles ID and/or users' IDs against players' roles' IDs and/or players' IDs
         * @param {Number} PlayerId The player's server ID, or Discord ID
         * @param {Array<String>} Roles An array or roles' IDs or users' IDs
         * @param {String} Guild A guild ID (Optional)
         */
        CheckPermission(PlayerId, Roles, GuildID = null) {

            // if "allowEveryone" then just save the time and just return true; otherwise keep going... :P
            if (this.Config.AllowEveryone || PlayerId === 0) return true;

            // Veriables checking
            if(!PlayerId) return new Error('Unknown PlayerID');
            if(!isNaN(PlayerId)) PlayerId = String(PlayerId); // if number then turn it into a string
            if(typeof PlayerId !== 'string') return new Error('PlayerID must be typeof String');

            if(!Roles) return new Error('Unknown Roles');
            if(!Array.isArray(Roles)) return new Error('Roles must be typeof Array');

            // Get and check of the player has a network object store in the Core
            const Player = require(GetResourcePath(GetCurrentResourceName()) + '/Core/index').Players.get(PlayerId);

            console.log(Player);
            if (!Player || !Player.Discord.ID) return false;

            /**
             * If "Guild" was provided, then look for the server whilst also keeping in mind;
             * if "MainGuildOnly" was true, only and only check the main guild if the IDs match; but
             * if "MainGuildOnly" was false; then check all registered guilds provided in the config
             * for a matching guild ID;
             *
             * but if "Guild" was not provided; then check all registered guild in the config for matching roles
             * with those provided;
             *
             * The returned guild(s) are the "AllowedGuilds"; which means they can be looked into; AKA. *allowed*
             */
            const AllowedGuilds = this.GetAllowedGuilds(GuildID);
            if (AllowedGuilds.length < 1) return false;

            /**
             * Get basic player/member information for easy access later;
             */
            const MemberGuilds = Player.Discord.Guilds.filter(g => AllowedGuilds.find(_g => _g.ID === g.ID));
            const IsMemberAdministrator = MemberGuilds.find(guild => guild.Administrator) ? true : false;

            /**
             * Check if member is an admin and the "discordAdmin"; if both are true, then just return true to save time and CPU usage
             * and the same goes for "selfPermission", if the member's ID was present within the provided "Roles"; then also just return
             * true to save time and ... you know it; CPU usage :D
             */
            if (this.Config.DiscordAdmin && IsMemberAdministrator) return true;
            if (this.Config.SelfPermission && Roles.includes(Player.Discord.ID)) return true;

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
                        return _role.ID === roleID;
                    });
                });
            })) return true;

            return false;
        }

        /**
         * Used to get all of the allowed guilds or search for one within the allowed guilds for the members' roles to be fetched from; guilds must be registered in the config
         * @param GuildID The guild ID (Optional)
         * @return object
         */
        GetAllowedGuilds(GuildID = null) {
            if (GuildID) {
                return this.GetAllowedGuilds().filter(Guild => Guild.ID === GuildID);
            } else {
                return this.Config.Guilds.filter(Guild => this.Config.MainGuildOnly ? Guild.ID === this.Config.RegisteredMainGuild.ID : Guild);
            }
        }

        async AcePermissionsAdd(Player) {
            if (this.Config.AcePermissions.Enabled) {
                if (Player.Discord.ID) {
                    for (const Permission of this.Config.AcePermissions.Permissions) {
                        if(Permission.Enabled) {
                            const IsAllowed = this.CheckPermission(Player.Discord.ID, [Permission.Roles]);
                            await this.Delay(25); // Delay is present in the parent class as a method
                            if (IsAllowed) {
                                // Assign groups
                                if(Permission.Groups.length > 0) {
                                    for (const Group of Permission.Groups) {
                                        ExecuteCommand('add_principal identifier.discord:' + Player.Discord.ID + ' ' + Group);
                                    }
                                }
                                // Assign aces
                                if(Permission.Aces.length > 0) {
                                    for (const Ace of Permission.Aces) {
                                        ExecuteCommand('add_ace identifier.discord:' + Player.Discord.ID + ' ' + Ace);
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
            if (this.Config.AcePermissions.Enabled) {
                if (Player.Discord.ID) {
                    for (const Permission of this.Config.AcePermissions.Permissions) {
                        if(Permission.Enabled) {
                            const IsAllowed = this.CheckPermission(Player.Discord.ID, [Permission.Roles]);
                            await this.Delay(25); // Delay is present in the parent class as a method
                            if (IsAllowed) {
                                // Assign groups
                                if(Permission.Groups.length > 0) {
                                    for (const Group of Permission.Groups) {
                                        ExecuteCommand('remove_principal identifier.discord:' + Player.Discord.ID + ' ' + Group);
                                    }
                                }
                                // Assign aces
                                if(Permission.Aces.length > 0) {
                                    for (const Ace of Permission.Aces) {
                                        ExecuteCommand('remove_ace identifier.discord:' + Player.Discord.ID + ' ' + Ace);
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
                    GetDiscordID: PlayerId => {
                        const LocalPlayer = this.Players.find(player => player.ServerId === PlayerId || player.Discord.ID === PlayerId);
                        if (!LocalPlayer) return null;
                        return LocalPlayer.Discord.ID;
                    },
                    GetServerID: PlayerId => {
                        const LocalPlayer = this.Players.find(player => player.ServerId === PlayerId || player.Discord.ID === PlayerId);
                        if (!LocalPlayer) return null;
                        return LocalPlayer.ServerId;
                    }
                };
            });

        }

    };

});