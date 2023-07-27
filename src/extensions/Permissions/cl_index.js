onNet('DiscordFramework:Extensions:RunClient:Permissions', ({ player, config }) => {
    console.log('^2[^0Extensions^2:^0Permissions^2]^6: ^3Client script initializing!');

    let Player = player;
    const Config = config;

    onNet('DiscordFrameworK:Extension:Permission:UpdateRole', _player => {
        console.log('^2[^0Extensions^2:^0Permissions^2]^6: ^3Roles updated!');
        Player = _player;
    });

    /**
     * Checks a player's permission by matching their ID, Roles, and administrative status against the provided roles
     * @param {string[]} Roles An array of string containing roles' ids
     * @param {string} GuildId Targeted guild id to check within
     * @returns {boolean} Whether the player has permission or not
     */
    const CheckPermission = (Roles, GuildId) => {

        if(Config.allowEveryone) return true; // if "allowEveryone" or playerId is 0 (Server terminal) then save the time and just return true; otherwise keep going... :P

        if(!Player.discord.id) return false; // Check whether the player has Discord connected

        if(!Roles) return false; // Check whether Roles were provided
        if(!Array.isArray(Roles)) return false; // Check whether the provided Role is an Array

        if(Config.communityGuild.only) GuildId = Config.communityGuild.id; // Check if communityGuild.only is active, then set communityGuild as targeted guild

        if(Config.selfPermission) { // Check whether Permission.selfPermission is enabled or not
            if(Roles.includes(Player.discord.id)) return true; // if Permission.selfPermission is enabled and the player's Discord ID is included in the Role, then return true
        }

        const Guilds = GuildId ? Player.discord.guilds.filter(guild => guild.id === GuildId) : Player.discord.guilds; // Makes the guild/guilds into an altered array for a unified logic

        if(Config.discordAdmin) { // Check whether Permission.discordAdmin is enabled or not
            if(Guilds.find(guild => guild.administrator)) return true; // Check if the player is an administrator in any of the guild in the Guilds array
        }

        if(Roles.find(roleA => Guilds.find(guild => guild.roles.find(roleB => roleA === roleB.id)))) return true; // Check if the player has any role of the provided role within the guilds in the Guilds array

        return false; // if the player doesn't have admin or match any of the roles, then return false
    };
});