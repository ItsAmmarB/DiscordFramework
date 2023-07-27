module.exports = {
    communityGuild: {
        only: false, // if true; the extension will only use the roles of users within the communityGuild only; provided GuildIds will be ignored in all functions
        ...require('../../config').core.discord.communityGuild // This will obtain the communityGuild details from the main framework config
    },
    allowEveryone: false, // Give permission to everyone, EVERY PERSON/PLAYER WILL HAVE EVERY SINGLE PERMISSION; this is a dangerous toggle, use it as your own risk!!!!
    discordAdmin: false, // Whether the Discord admin permission should carry over to here, meaning; if true and a player has Discord admin permission, they will have permission to everything
    /**
     * "selfPermission" if it's true, it would unlock a new way of checking permissions.
     * it would allow for indiviual's discord ID to be checked alongeside their roles,
     * meaning; instead of just providing roles' ids, you can also provide members' ids as well, and they will be checked,
     * ex;
     * Your current Discord ID is: 357842475328733186 (ItsAmmarB#7897)
     * and your Discord Roles are: 868174309800161300 (Lead Developer), 653816068401528832 (Community Development Team), 781593036722274334 (Full Access Developer)
     *
     * if selfPermission was set to false, the extension would only check your roles, meaning it would match the provided roles against your roles.
     * but if selfPermission was set to true, the extension would check your roles and also check your ID, meaning it would match the provided roles against your roles and match your Discord ID
     * against the provided roles.
     *
     * this can be used to give a permission of something to only a select people without the need of an actual discord role, making it a hidden permission, ex;
     *
     * Needed Roles for the ban command: [
     *  "357842475328733186", // (ItsAmmarB#7897)
     *  "199406317520027648", // (James V.#0001)
     *  "173082448958062592" // (aF#1790)
     * ]
     *
     * this way no matter what roles or permissions a person has, those; and only those with those provided IDs can use the ban command
     */
    selfPermission: false,
    acePermissions: {
        enabled: true,
        permissions: [
            /**
             * This feature could be helpful for servers that are too deep into ace permissions and cannot departure from it,
             * it will give the ability to give certain aces/principals to certain people with certain roles.
             * Ex;
             */
            {
                enabled: true,
                groups: ['admin'],
                aces: ['vMenu.ShowPlayersBlips'],
                roles: [
                    '652990959100887041'
                ]
            }
            /**
             * in the example above; we have an array of groups, an array of aces, and an array of roles, so let's break it down,
             *
             * Enabled: is self-explanatory; true to enable and false to disable
             * Groups: is an array that consists of principals/groups
             * Aces: is an array that consists of aces/permissions
             * Roles: is an array that consists of roles' IDs only
             *
             * now; here is how this would translate into real usage, any player who has any of the roles present in the "Roles" array
             * will get all the aces present in the "Aces" array and will inherit all ace from each group present in the "Groups" array.
             *
             * so; if "group.admin" has aces/permissions for "vMenu.ban" & "vMenu.kick", any person who has the "652990959100887041" role, would
             * have ace/permission to use 'vMenu.ShowPlayersBlips' from the "Aces" array, and "vMenu.ban" & "vMenu.kick" inherited from 'group.admin'
             * from the "Groups" array.
             *
             * "Groups" & "Aces" arrays can be empty if there isn't use for it in the object;
             * also, discord users' IDs could be used in the "Roles" array if "SelfPermission" was set to true
             */
        ]
    }
};