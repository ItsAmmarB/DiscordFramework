on('DiscordFramework:Core:Ready', () => {
    SV_Config.Extensions.push({
        name: 'Blacklist', // Extension name here, and make sure it the same as the one in the extension class in the 'sv_index.js'
        config: {
            weapons: {
                enabled: true,
                groups: [
                    /**
                     * the group object should always look like the example below
                     *
                     * the name is to notify the player that he doesn't belong to the group
                     * if they do not have the require permissions/roles
                     *
                     * The permission in permissions can either be an object or a string
                     *
                     * if an object it must look like this
                     * {
                     *  role: 'ROLE ID',
                     *  guild: 'GUILD ID'
                     * }
                     * the guild part is optional and can be removed if not needed
                     *
                     * if a string then the string must only contain the role ID; ex:
                     * 'ROLE ID'
                     * and nothing else; this is the best way if you do not want to lock it to a specific guild
                     *
                     * The list contains all the weapons locked to the group, you must use the weapon model key for it to work,
                     * All weapons' model keys can be found at the bottom of the config!
                     * only the people with the permissions specified are able to use those weapons.
                     * Admins maybe allowed to use those weapons if configured in the "Permission" extension!
                     */
                    {
                        name: 'Group Template',
                        permissions: [
                            'ROLE ID' // ROLE ID
                        ],
                        list: [
                            'WEAPON MODEL KEY'
                        ]
                    }
                ]
            },
            vehicles: {
                enabled: true,
                groups: [
                    /**
                     * the group object should always look like the example below
                     *
                     * the name is to notify the player that he doesn't belong to the group
                     * if they do not have the require permissions/roles
                     *
                     * The permission in permissions can only be a string and must only contain the role ID; ex:
                     * 'ROLE ID'
                     * and nothing else;
                     *
                     * The list contains all the vehicles locked to the group, you must use the vehicle spawncode,
                     * only the people with the permissions specified are able to use those vehicles.
                     * Admins maybe allowed to use those vehicles if configured in the "Permission" extension!
                     */
                    {
                        name: 'Group Template',
                        permissions: [
                            'ROLE ID' // ROLE ID
                        ],
                        list: [
                            'VEHICLE SPAWNCODE'
                        ]
                    }
                ]
            },
            /**
             * DO NOT DELETE ANYTHING FROM HERE OTHERWISE WHATEVER WAS DELETED WILL NOT BE CHECKED!!
             */
            Weapons: [
                'weapon_stinger',
                'weapon_dagger',
                'weapon_bat',
                'weapon_bottle',
                'weapon_crowbar',
                'weapon_unarmed',
                'weapon_flashlight',
                'weapon_golfclub',
                'weapon_hammer',
                'weapon_hatchet',
                'weapon_knuckle',
                'weapon_knife',
                'weapon_machete',
                'weapon_switchblade',
                'weapon_nightstick',
                'weapon_wrench',
                'weapon_battleaxe',
                'weapon_poolcue',
                'weapon_stone_hatchet',
                'weapon_pistol',
                'weapon_pistol_mk2',
                'weapon_combatpistol',
                'weapon_appistol',
                'weapon_stungun',
                'weapon_pistol50',
                'weapon_snspistol',
                'weapon_snspistol_mk2',
                'weapon_heavypistol',
                'weapon_vintagepistol',
                'weapon_flaregun',
                'weapon_marksmanpistol',
                'weapon_revolver',
                'weapon_revolver_mk2',
                'weapon_doubleaction',
                'weapon_raypistol',
                'weapon_ceramicpistol',
                'weapon_navyrevolver',
                'weapon_microsmg',
                'weapon_smg',
                'weapon_smg_mk2',
                'weapon_assaultsmg',
                'weapon_combatpdw',
                'weapon_machinepistol',
                'weapon_minismg',
                'weapon_raycarbine',
                'weapon_pumpshotgun',
                'weapon_pumpshotgun_mk2',
                'weapon_sawnoffshotgun',
                'weapon_assaultshotgun',
                'weapon_bullpupshotgun',
                'weapon_musket',
                'weapon_heavyshotgun',
                'weapon_dbshotgun',
                'weapon_autoshotgun',
                'weapon_assaultrifle',
                'weapon_assaultrifle_mk2',
                'weapon_carbinerifle',
                'weapon_carbinerifle_mk2',
                'weapon_advancedrifle',
                'weapon_specialcarbine',
                'weapon_specialcarbine_mk2',
                'weapon_bullpuprifle',
                'weapon_bullpuprifle_mk2',
                'weapon_compactrifle',
                'weapon_mg',
                'weapon_combatmg',
                'weapon_combatmg_mk2',
                'weapon_gusenberg',
                'weapon_sniperrifle',
                'weapon_heavysniper',
                'weapon_heavysniper_mk2',
                'weapon_marksmanrifle',
                'weapon_marksmanrifle_mk2',
                'weapon_rpg',
                'weapon_grenadelauncher',
                'weapon_grenadelauncher_smoke',
                'weapon_minigun',
                'weapon_firework',
                'weapon_railgun',
                'weapon_hominglauncher',
                'weapon_compactlauncher',
                'weapon_rayminigun',
                'weapon_grenade',
                'weapon_bzgas',
                'weapon_smokegrenade',
                'weapon_flare',
                'weapon_molotov',
                'weapon_stickybomb',
                'weapon_proxmine',
                'weapon_snowball',
                'weapon_pipebomb',
                'weapon_ball',
                'weapon_petrolcan',
                'weapon_fireextinguisher',
                'weapon_parachute',
                'weapon_hazardcan'
            ]
        }
    });
});


/**
 * This is a Server side config file and can only be used for Server sided variables
 *
 *  add the extension's configurable variables in the 'config' object only otherwise it will be overridden
 *
 * this file can be removed if not needed, it was created to let people know that it can be used
 * or you can make your own config file and call it using "require"
 */