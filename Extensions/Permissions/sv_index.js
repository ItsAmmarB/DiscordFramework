on('DiscordFramework:Extensions:Extension:Load', () => {

    const { Extension } = require(GetResourcePath(GetCurrentResourceName()) + '/Core/Modules/Extensions/index');

    new class Permissions extends Extension {
        constructor() {
            const Config = require(GetResourcePath(GetCurrentResourceName()) + '/Extensions/Permissions/config');
            super({
                Name: 'Permissions', // Change to extension name
                Description: 'Provides permissions checking using Discord roles', // Add a brief decription of what does the extension do
                Enabled: true, // Whether the extension is supposed to be enabled or disabled
                Dependencies: [], // Add the dependencies/other extensions needed for this extension to be usable
                Version: '1.2', // The current version of the extension if available
                Author: 'ItsAmmarB',
                Config: Config
            });

        }

        Run() {

            // When a player connects do shizz
            on('DiscordFramework:Player:Joined', async Player => {

                if (Player.Discord.ID) {
                    await this.AcePermissionsAdd(Player);

                    // Trigger the client side
                    this.RunClient(Player.Server.ID);

                    // The client config is made here as a security measure
                    const config = { ... this.Config };
                    delete config.acePermissions;

                    emitNet('DiscordFramework:Extension:Permissions:Initialize', Player.Server.ID, Player, config);
                }

            });

            on('DiscordFramework:Player:Disconnected', async Player => {
                if (Player.Discord.ID) {
                    await this.AcePermissionsRemove(Player);
                }
            });

            on('DiscordFrameworK:Player:Roles:Updated', Player => {
                emitNet('DiscordFramework:Extension:Permissions:UpdatePermissions', Player.Server.ID, Player);
            });

            this.#Exports();

        }

        /**
         * Used to match provided roles ID and/or users' IDs against players' roles' IDs and/or players' IDs
         * @param {Number} PlayerId The player's server ID, or Discord ID
         * @param {Array<String>} Roles An array or roles' IDs or users' IDs
         * @param {String} Guild A guild ID (Optional)
         */
        CheckPermission(PlayerId, Roles) {

            // if "allowEveryone" then just save the time and just return true; otherwise keep going... :P
            if (this.Config.AllowEveryone || PlayerId === 0) return true;

            // Veriables checking
            if(!PlayerId) throw new Error('Unknown PlayerID');
            if(!isNaN(PlayerId)) PlayerId = String(PlayerId); // if number then turn it into a string
            if(typeof PlayerId !== 'string') throw new Error('PlayerID must be typeof String');

            if(!Roles) throw new Error('Unknown Roles');
            if(!Array.isArray(Roles)) throw new Error('Roles must be typeof Array');

            // Get and check of the player has a network object store in the Core
            const { Player } = require(GetResourcePath(GetCurrentResourceName()) + '/Core/players');
            const player = new Player(PlayerId);

            if (!player || !player.Discord.ID) return false;

            /**
             * Get basic player/member information for easy access later;
             */
            const MemberGuilds = player.Discord.Guilds.filter(g => this.Config.MainGuildOnly.Enabled ? g.ID === this.Config.MainGuildOnly.ID : g);
            const IsMemberAdministrator = MemberGuilds.find(guild => guild.Administrator) ? true : false;

            /**
             * Check if member is an admin and the "discordAdmin"; if both are true, then just return true to save time and CPU usage
             * and the same goes for "selfPermission", if the member's ID was present within the provided "Roles"; then also just return
             * true to save time and ... you know it; CPU usage :D
             */
            if (this.Config.DiscordAdmin && IsMemberAdministrator) return true;
            if (this.Config.SelfPermission && Roles.includes(player.Discord.ID)) return true;

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
                    CheckPermission: (PlayerId, Roles) => this.CheckPermission(PlayerId, Roles)
                };
            });

        }

    };

});