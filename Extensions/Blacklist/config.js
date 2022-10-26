module.exports = {
    Weapons: {
        Enabled: true, // if false, everyone can use any gun without restrictions
        Groups: [
            /**
             * the group object should always look like the example below
             *
             * You could also use Users' IDs in permission if the "SelfPermission" feature is enabled in the [Permissions] extension.
             * You could have multiple Roles/Users in Permissions in any group, and you could even have them overlapped
             * meaning; a Role/User could be in more than one group.
             *
             * The list contains all the weapons locked to the group, you must use the weapon model key for it to work,
             * only the people with the permissions specified are able to use those weapons.
             * Admins maybe allowed to use those weapons if the "DiscordAdmin" feature is enabled in the [Permissions] extension!
             *
             * All weapons' spawn codes can be found at the bottom of the config!
             *
             */
            {
                Name: 'Group Template',
                Permissions: [
                    {
                        Name: 'ROLE/USER NAME', // This isn't necessarily needed but; more so to remind you what role/user is this
                        ID: 'ROLE/USER ID' // ROLE ID
                    }
                ],
                List: [
                    'Weapon Spawn Code'
                ]
            }
        ]
    },
    Vehicles: {
        Enabled: true, // if false, everyone can use any vehicle without restrictions
        Groups: [
            /**
             * the group object should always look like the example below
             *
             * You could also use Users' IDs in permission if the "SelfPermission" feature is enabled in the Permissions extension.
             * You could have multiple Roles/Users in Permissions in any group, and you could even have them overlapped
             * meaning; a Role/User could be in more than one group.
             *
             * The list contains all the vehicles locked to the group, you must use the vehicle spawncode,
             * only the people with the permissions specified are able to use those vehicles.
             * Admins maybe allowed to use those vehicles if configured in the "Permission" extension!
             */
            {
                Name: 'Group Template',
                Permissions: [
                    {
                        Name: 'ROLE/USER NAME', // This isn't necessarily needed but; more so to remind you what role/user is this
                        ID: 'ROLE/USER ID' // ROLE ID
                    }
                ],
                List: [
                    'Vehicle Spawn Code'
                ]
            }
        ]
    },
    // Do not delete any weapon from this list, otherwise it will not be enforced and will be skipped over; as if it was never there
    AllWeapons: [
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
};