on('DiscordFramework:Core:Ready', () => {

    SV_Config.Extensions.push({
        name: 'Permissions', // Extension name here, and make sure it the same as the one in the extension class in the 'sv_index.js'
        config: {
            guilds: [
                /**
         * At least one guild has to be labeled main
         * otherwise all requests will be nullified.
         *
         * template:
         * {
         *   id: '000000000000000000',
         *   name: 'The DF Project',
         *   main: true
         * }
         *
         * the "main", can be removed if another guild is main;
         * meaning, it it's false then you can remove that variables if you wish to do so
         *
         */
                {
                    id: '572195755922685962',
                    name: 'The WM Project',
                    main: true
                },
                {
                    id: '902547132928655370',
                    name: 'JCRP | Whitelist'
                }
            ],
            AcePermissions: {
                enabled: true,
                roles: [
                /**
                 * The role is the specific role that contains the permission
                 * the group is the group related to the role to be given
                 * the ace is the permission related to the role to be gived
                 *
                 * Ex;
                 * {
                 *  role: '623157095948353546', The Administration Team role
                 *  group: 'group.admin', The ace perm group you want to add the discord role members to
                 *  ace: 'command.ban' The ace you want to give to the discord role member to
                 * }
                 *
                 * Now whoever has the "623157095948353546" role will be in "group.admin" and will have the "command.ban" permission
                 * The group and ace can be removed if not needed, ex; if you use group, and do not need ace, you can remove ace, and vice versa
                 */
                    {
                        role: '623157095948353546', // ROLE ID
                        group: 'group.example', // ADD THE PERSON TO THIS GROUP
                        ace: 'example.example' // GIVE THE PERSON THIS ACE
                    }
                ]
            },
            mainGuildOnly: false, // Whether perssions should only be based off of the main guild in the this config in the guilds section
            allowEveryone: false, // Give permission to everyone, EVERY PERSON/PLAYER; this is a dangerous toggle!!!!
            discordAdmin: false, // If a player is present in the discord server and has administrator permission, if this toggle is true, they will have permission to everything, otherwise no
            /**
         * "selfPermission" if this is toggle, meaning it's true, it would unlock a new way of checking permissions.
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
         * this can be used to give permission of something to only a selected people without the need of an actual discord role, ex;
         *
         * Needed Role of the ban command: [
         *  "357842475328733186", // (ItsAmmarB#7897)
         *  "199406317520027648", // (James V.#0001)
         *  "173082448958062592" // (aF#1790)
         * ]
         *
         * this way no matter what are the member's roles, only those with those IDs can use the ban command
         *
         * also; it doesn't hurt to keep it on; "true"
         */
            selfPermission: true
        }
    });

});