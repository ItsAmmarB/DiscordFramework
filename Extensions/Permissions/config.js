module.exports = {
    MainGuildOnly: false, // This will make the extension use the MainGuild specified in the Discord Module only as a permissions guild
    RegisteredMainGuild: require('../../Core/modules').Modules.get('Discord').config.MainGuild, // no need to change this, it will be overridden by the MainGuild from the Discord Module's config
    AllowEveryone: false, // Give permission to everyone, EVERY PERSON/PLAYER WILL HAVE EVERY SINGLE PERMISSION; this is a dangerous toggle!!!!
    DiscordAdmin: false, // If a player is present in the discord server and has administrator permission, if this toggle is true, they will have permission to everything, otherwise no
    /**
     * "selfPermission" if this is toggled, meaning it's true, it would unlock a new way of checking permissions.
     * it would allow for indiviual's discord ID to be checked instead of just matching their roles,
     * meaning; instead of just providing roles' ids, you can also provide members' ids as well, and they will be checked,
     * ex;
     * Your current Discord ID is: 357842475328733186 (ItsAmmarB#7897)
     * and your Discord Roles are: 868174309800161300 (Lead Developer), 653816068401528832 (Community Development Team), 781593036722274334 (Full Access Developer)
     *
     * if selfPermission was toggle off; AKA. "false", the extension would only check your roles, meaning it would match the provided roles against your roles.
     * but if selfPermission was toggle on; AKA. "true", the extension would check your roles but also check your ID, meaning it would match the provided roles against your roles but also
     * match your Discord ID against the provided roles.
     *
     * this can be used to give a permission of something to only a select people without the need of an actual discord role, making it a hidden permission, ex;
     *
     * Needed Roles for the ban command: [
     *  "357842475328733186", // (ItsAmmarB#7897)
     *  "199406317520027648", // (James V.#0001)
     *  "173082448958062592" // (aF#1790)
     * ]
     *
     * this way no matter what roles or permission a person has, those; and only those with the provided IDs can use the ban command
     *
     * also; it doesn't hurt to keep it on; "true"
     */
    SelfPermission: true,
    Guilds: [
        /**
         * Those are the only guilds a player's roles will be used from; essentially locking permissions to the guilds below
         *
         * meaning if someone has a role from a server that is not specified below, he would not have that link role-permission
         */
        {
            ID: '354062777737936896',
            Name: 'JusticeCommunityRP'
        }
    ],
    AcePermissions: {
        Enabled: true,
        Permissions: [
            /**
             * This feature could be helpful for servers that are too deep into ace permissions and cannot departure from it,
             * it will give the ability to give certain aces/principals to certain with certain roles.
             * Ex;
             */
            {
                Enabled: true,
                Groups: ['admin'],
                Aces: ['vMenu.ShowPlayersBlips'],
                Roles: [
                    '652990959100887041'
                ]
            }
            /**
             * now; in the example above; we have an array of groups, an array of aces, and an array of roles, so let's break it down,
             *
             * Enabled: is self-explanatory; true to enable and false to disable
             * Groups: is an array that consists of principals/groups
             * Aces: is an array that consists of aces
             * Roles: is an array that consists of roles' IDs only
             *
             * now; here is how this would translate into real usage, any player who has any of the roles present in the "Roles" array
             * will get all the aces present in the "Aces" array and will inherit all ace from each group present in the "Groups" array.
             *
             * so; if "group.admin" has aces/permissions for "vMenu.ban" & "vMenu.kick", any person who has the "652990959100887041" role, would
             * have ace/permission to use 'vMenu.ShowPlayersBlips' from the "Aces" array, and "vMenu.ban" & "vMenu.kick" inherited from 'group.admin'
             * from the "Groups" array.
             *
             * "Groups" & "Aces" array could be empty if there isn't use for it in the object;
             * also, discord users' IDs could be used in the "Roles" array if "SelfPermission" is toggled true
             */
        ]
    }
};