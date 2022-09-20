onNet('DiscordFramework:Extensions:RunClientSide:Permissions', () => {

    let DiscordID = null;
    let ServerID = null;
    let Guilds = [];

    const Config = {
        mainGuildOnly: null,
        allowEveryone: null,
        discordAdmin: null,
        selfPermission: null,
        guilds: []
    };


    onNet('DiscordFramework:Permissions:Initialize', config => {
        Config.mainGuildOnly = config.mainGuildOnly;
        Config.allowEveryone = config.allowEveryone;
        Config.discordAdmin = config.discordAdmin;
        Config.selfPermission = config.selfPermission;
        Config.guilds = config.guilds;

        console.log('^2[^0Extensions^2:^0Permissions^2]^6: ^3Received client config!');

        onNet('DiscordFramework:Permissions:UpdatePermissions', Player => {

            const _oldGuilds = Guilds;

            ServerID = Player.ServerId;
            DiscordID = Player.DiscordId;
            Guilds = Player.Guilds;

            Player.Guilds.forEach(guild => {
                console.log(guild);
                // _oldGuilds.Roles.
            });

            console.log('^2[^0Extensions^2:^0Permissions^2]^6: ^3Permissions updated!');
        });

        const CheckPermission = (Roles, Guild = null) => {
            // console.log('Given', Roles, Guild);
            // console.log('Stored', Guilds);

            // if "allowEveryone" then just save the time and just return true; otherwise keep going... :P
            if (Config.allowEveryone) return true;

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
            let AllowedGuilds = GetAllowedGuilds(Guild);
            if(AllowedGuilds.length < 1) return false;
            AllowedGuilds = AllowedGuilds.map(guild => guild.id);

            /**
             * Get basic player/member information for easy access later;
             */
            const MemberGuilds = Guilds.filter(guild => AllowedGuilds.includes(guild.id));
            const IsMemberAdministrator = MemberGuilds.find(guild => guild.Administrator) ? true : false;

            /**
             * Check if member is an admin and the "discordAdmin"; if both are true, then just return true to save time and CPU usage
             * and the same goes for "selfPermission", if the member's ID was present within the provided "Roles"; then also just return
             * true to save time and ... you know it; CPU usage :D
             */
            if (Config.discordAdmin && IsMemberAdministrator) return true;
            if (Config.selfPermission && Roles.includes(DiscordID)) return true;

            /**
             * is very confusing as I don't even how I did it myself
             *
             * jk; so basically, you try to find a matching role within the guilds that are allowed!
             * obviously those guilds and roles are stored, and so no fetching or resolving is needed here
             * just pure hide n' seek
             *
             * and if a "MatchingRole" is found then true shall be returned,
             * but if not found it will return null in which it will falsely the if statement
             * and then return false
             */
            if(Roles.find(roleID => {
                return MemberGuilds.find(guild => {
                    return guild.Roles.find(_role => {
                        return _role.id === roleID;
                    });
                });
            })) return true;

            return false;

        };

        const GetAllowedGuilds = (GuildID = null) => {
            if(GuildID) {
                return GetAllowedGuilds().filter(guild => guild.id === GuildID);
            } else {
                return Config.guilds.filter(guild => {
                    if(Config.mainGuildOnly) {
                        return guild.main;
                    } else {
                        return guild;
                    }
                });
            }
        };

        // FiveM Exports for external use
        exports('Permissions', () => {
            return {
                CheckPermission: (Roles, Guild = null) => CheckPermission(Roles, Guild),
                GetGuilds: (Guild = null) => Guild ? Guilds.filter(guild => guild.id === Guild) : Guilds,
                GetAllowedGuilds: (Guild = null) => GetAllowedGuilds(Guild),
                GetDiscordID:  DiscordID,
                GetServerID: ServerID
            };
        });
    });

});