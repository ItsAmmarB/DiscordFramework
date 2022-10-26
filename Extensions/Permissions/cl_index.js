onNet('DiscordFramework:Extensions:RunClientSide:Permissions', () => {
    console.log('^2[^0Extensions^2:^0Permissions^2]^6: ^3Client script initializing!');

    let Player = null;
    let Config = null;


    onNet('DiscordFramework:Extension:Permissions:Initialize', (_player, _config) => {

        Config = _config;
        console.log('^2[^0Extensions^2:^0Permissions^2]^6: ^3Received client config!');
        Player = _player;

        onNet('DiscordFramework:Extension:Permissions:UpdatePermissions', __player => {
            console.log('^2[^0Extensions^2:^0Permissions^2]^6: ^3Permissions updated!');
            Player = __player;
        });

        console.log('^2[^0Extensions^2:^0Permissions^2]^6: ^3Client script initialized!');

        /**
         * Used to match provided roles ID and/or users' IDs against players' roles' IDs and/or players' IDs
         * @param {Array<String>} Roles An array or roles' IDs or users' IDs
         * @param {String} Guild A guild ID (Optional)
         */
        const CheckPermission = Roles => {

            // if "allowEveryone" then just save the time and just return true; otherwise keep going... :P
            if (Config.AllowEveryone) return true;

            // Veriables checking
            if(!Roles) throw new Error('Unknown Roles');
            if(!Array.isArray(Roles)) throw new Error('Roles must be typeof Array');

            // Get and check of the player has a network object store in the Core
            // const Player = require(GetResourcePath(GetCurrentResourceName()) + '/Core/index').Players.get(PlayerId);
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
            // const AllowedGuilds = GetAllowedGuilds(GuildID);
            // if (AllowedGuilds.length < 1) return false;

            // console.log(AllowedGuilds);

            /**
             * Get basic player/member information for easy access later;
             */
            const MemberGuilds = Player.Discord.Guilds.filter(g => Config.MainGuildOnly.Enabled ? g.ID === Config.MainGuildOnly.ID : g);
            const IsMemberAdministrator = MemberGuilds.find(guild => guild.Administrator) ? true : false;

            /**
             * Check if member is an admin and the "discordAdmin"; if both are true, then just return true to save time and CPU usage
             * and the same goes for "selfPermission", if the member's ID was present within the provided "Roles"; then also just return
             * true to save time and ... you know it; CPU usage :D
             */
            if (Config.DiscordAdmin && IsMemberAdministrator) return true;
            if (Config.SelfPermission && Roles.includes(Player.Discord.ID)) return true;

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
        };

        // FiveM Exports for external use
        exports('Permissions', () => {
            return {
                CheckPermission: Roles => CheckPermission(Roles)
            };
        });
    });

});