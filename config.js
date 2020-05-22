/* eslint-disable no-undef */
module.exports = {
    Permissions: {
        enabled: true, // Changing this to false will always return true; which means everyone has every permissions
        authorizationKey: 'GXX103W11mqJ5ZO3h34ddySV6IfdNlaU5wi3cHaOryR5M', // This will be used to authenticate the API request
        AcePermissionsEnabled: true, // This resource is compatible with AcePermissions if you use Ace, make sure to leave it a True, otherewise False
        serverId: 'JCRP-SA1', // The ID of the server this resource is running on; make sure you add it as well on the bot side
        lastResource: 'TrainTracks', // Name of the last resource on your resources.cfg, to stop people from joining mid-loading
        discordAdmin: true, // Give users with admin permission on discord full permission in the server, This is a scary option; use it wisely!
        ownerRole: '615697187980181505',
        messages: {
            checkingDiscord: 'Hello %n, Hold While We Look For Your Discord ID!',
            discord: 'You Do Not Have Discord Connected; Please Connect Your FiveM With Discord & Try Again',
            resources: 'Please Wait While The Server Is Starting Up...',
            checkingBans: 'Please Wait While The Bans Database Is Being Checked...',
            permaBan: 'You Are Permanently Banned From JCRP.\nReason: %r \nAppeal Your Ban On Our Discord Server: https//discord.gg/jcrp \nWe Hope You Enjoyed Your Stay :)',
            tempBan: 'You Are Banned From JCRP.\nReason: %r \nBan Expires In %d'
        }
    },
    Blacklists: {
        weapons: [
            {
                name: 'Civilian Specialist+',
                ranks: [
                    '652991049483943963', // CIV SPECIALIST
                    '652991049236742144', // CIV SUPERVISOR
                    '652991048577974282', // CIV MANAGER
                    '652991047634386944', // CIV EXECUTIVE
                    '652991046892126208', // CIV ASSISTANCE
                    '652991046011191315', // CIV CO - DIRECTOR
                    '652991045189107753' // CIV DIRECTOR
                ],
                weapons: [
                    'weapon_smg_mk2',
                    'weapon_mg',
                    'weapon_combatmg',
                    'weapon_bullpuprifle_mk2',
                    'weapon_carbinerifle_mk2',
                    'weapon_specialcarbine_mk2',
                    'weapon_assaultrifle_mk2'
                ]
            },
            {
                name: 'Civilian Supervisor+',
                ranks: [
                    '652991049236742144', // CIV SUPERVISOR
                    '652991048577974282', // CIV MANAGER
                    '652991047634386944', // CIV EXECUTIVE
                    '652991046892126208', // CIV ASSISTANCE
                    '652991046011191315', // CIV CO-DIRECTOR
                    '652991045189107753' // CIV DIRECTOR
                ],
                weapons: [
                    'weapon_combatmg_mk2',
                    'weapon_marksmanrifle',
                    'weapon_marksmanrifle_mk2',
                    'weapon_sniperrifle',
                    'weapon_heavysniper',
                    'weapon_heavysniper_mk2',
                    'weapon_assaultrifle_mk2',
                    'weapon_firework',
                    'weapon_pipebomb',
                    'weapon_heavyshotgun',
                    'weapon_assaultshotgun',
                    'weapon_bullpupshotgun',
                    'weapon_gusenberg'
                ]
            },
            {
                name: 'Civilian Manager+',
                ranks: [
                    '652991048577974282', // CIV MANAGER
                    '652991047634386944', // CIV EXECUTIVE
                    '652991046892126208', // CIV ASSISTANCE
                    '652991046011191315', // CIV CO-DIRECTOR
                    '652991045189107753' // CIV DIRECTOR
                ],
                weapons: [
                    'weapon_minigun',
                    'weapon_compactlauncher',
                    'weapon_grenadelauncher',
                    'weapon_grenadelauncher_smoke',
                    'weapon_rpg',
                    'weapon_hominglauncher',
                    'weapon_grenade',
                    'weapon_stickybomb',
                    'weapon_proxmine'
                ]
            },
            {
                name: 'JCRP Executive+',
                ranks: [
                    '652968963340238858' // EXECUTIVE ADMINSTRATOR

                ],
                weapons: [
                    'weapon_rayminigun',
                    'weapon_raycarbine',
                    'weapon_raypistol',
                    'weapon_railgun',
                    'weapon_stinger'
                ]
            }
        ],
        vehicles: [
            {
                name: 'Civilian III+',
                ranks: [
                    '652991050612342785', // CIV III
                    '652991049483943963', // CIV SPECIALIST
                    '652991049236742144', // CIV SUPERVISOR
                    '652991048577974282', // CIV MANAGER
                    '652991047634386944', // CIV EXECUTIVE
                    '652991046892126208', // CIV ASSISTANCE
                    '652991046011191315', // CIV CO - DIRECTOR
                    '652991045189107753' // CIV DIRECTOR
                ],
                vehicles: [
                    'autarch',
                    'cyclone',
                    'deveste',
                    'emerus',
                    'sheava',
                    'krieger',
                    'le7b',
                    's80',
                    'taipan',
                    'tezeract',
                    'thrax',
                    'tyrant',
                    'tyrus',
                    'vagner',
                    'tisione',
                    'prototipo',
                    'zorrusso',
                    'tampa2',
                    'hotring',
                    'kuruma2',
                    'paragon2',
                    'btype2',
                    'cognoscenti2',
                    'cog552',
                    'schafter6',
                    'schafter5',
                    'lurcher',
                    'ruiner3',
                    'baller5',
                    'baller6',
                    'xls2',
                    'vortex',
                    'blazer5',
                    'trophytruck2',
                    'insurgent2',
                    'nightshark',
                    'marshall',
                    'trophytruck',
                    'monster',
                    'hauler2',
                    'terabyte',
                    'cutter',
                    'handler',
                    'dump',
                    'brickade',
                    'rallytruck',
                    'pbus2',
                    'wastelander',
                    'trailerlarge'
                ]
            },
            {
                name: 'Civilian Specialist+',
                ranks: [
                    '652991049483943963', // CIV SPECIALIST
                    '652991049236742144', // CIV SUPERVISOR
                    '652991048577974282', // CIV MANAGER
                    '652991047634386944', // CIV EXECUTIVE
                    '652991046892126208', // CIV ASSISTANCE
                    '652991046011191315', // CIV CO - DIRECTOR
                    '652991045189107753' // CIV DIRECTOR
                ],
                vehicles: [
                    'revolter',
                    'ardent',
                    'savestra',
                    'stromberg',
                    'viseris',
                    'riot2',
                    'caracara',
                    'dune3',
                    'insurgent',
                    'insurgent3',
                    'menacer',
                    'technical',
                    'technical2',
                    'technical3',
                    'cerberus',
                    'cerberus2',
                    'cerberus3',
                    'mule4',
                    'pounder2',
                    'boxville5',
                    'speedo4',
                    'trailersmall2',
                    'apc',
                    'barracks',
                    'barracks3',
                    'barracks2',
                    'barrage',
                    'chernobog',
                    'crusader',
                    'halftrack',
                    'rhino',
                    'scarab',
                    'scarab2',
                    'scarab3',
                    'thruster',
                    'khanjali',
                    'annihilator',
                    'valkyrie',
                    'valkyrie2',
                    'cargoplane',
                    'mogul',
                    'titan',
                    'tula',
                    'stratumc',
                    'torerod'
                ]
            },
            {
                name: 'Civilian Supervisor+',
                ranks: [
                    '652991049236742144', // CIV SUPERVISOR
                    '652991048577974282', // CIV MANAGER
                    '652991047634386944', // CIV EXECUTIVE
                    '652991046892126208', // CIV ASSISTANCE
                    '652991046011191315', // CIV CO - DIRECTOR
                    '652991045189107753' // CIV DIRECTOR
                ],
                vehicles: [
                    'zr380',
                    'zr3802',
                    'zr3803',
                    'limo2',
                    'dominator4',
                    'dominator5',
                    'dominator6',
                    'dukes2',
                    'impaler2',
                    'impaler3',
                    'impaler4',
                    'imperator',
                    'imperator2',
                    'imperator3',
                    'ruiner2',
                    'tampa3',
                    'issi4',
                    'issi5',
                    'issi6',
                    'deathbike',
                    'deathbike2',
                    'deathbike3',
                    'bruiser',
                    'bruiser2',
                    'bruiser3',
                    'brutus',
                    'brutus2',
                    'brutus3',
                    'dune5',
                    'dune4',
                    'monster3',
                    'monster4',
                    'monster5',
                    'phantom2',
                    'buzzard',
                    'starling',
                    'nokota',
                    'zr',
                    'zr380s',
                    'hakuchou2'
                ]
            },
            {
                name: '',
                ranks: [
                    '615697187980181505', // SERVER OWNER
                    '652968963340238858' // EXECUTIVE
                ],
                vehicles: [
                    'thruster',
                    'oppressor',
                    'oppressor2',
                    'akula',
                    'hunter',
                    'savage',
                    'bombushka',
                    'volatol',
                    'pyro',
                    'molotok',
                    'strikeforce',
                    'lazer',
                    'hydra',
                    'voltic2',
                    'scramjet',
                    'vigilante',
                    'rcbandito',
                    'avenger',
                    'avenger2',
                    'deluxo'
                ]
            },
            {
                name: 'Premium Donator 1',
                ranks: [
                    '652991039841501184', // VIP TIER 5
                    '652991040461996044', // VIP TIER 4
                    '652991040776699957', // VIP TIER 3
                    '652991041833533461', // VIP TIER 2
                    '652991042437775360' // VIP TIER 1
                ],
                vehicles: [
                    'VIP1A',
                    'VIP1B',
                    'VIP1D',
                    'VIP1E',
                    'VIP1F',
                    'VIP1G',
                    'VIP1H',
                    'VIP1I',
                    'VIP1J',
                    'VIP1K',
                    'VIP1L',
                    'VIP1M',
                    'VIP1N',
                    'VIP1O',
                    'VIP1P'
                ]
            },
            {
                name: 'Premium Donator 2',
                ranks: [
                    '652991039841501184', // VIP TIER 5
                    '652991040461996044', // VIP TIER 4
                    '652991040776699957', // VIP TIER 3
                    '652991041833533461' // VIP TIER 2
                ],
                vehicles: [
                    'VIP2A',
                    'VIP2B',
                    'VIP2C',
                    'VIP2D',
                    'VIP2E',
                    'VIP2F',
                    'VIP2G',
                    'VIP2H',
                    'VIP2I',
                    'VIP2J',
                    'VIP2K',
                    'VIP2L',
                    'VIP2M',
                    'VIP2N',
                    'VIP2O'
                ]
            },
            {
                name: 'Premium Donator 3',
                ranks: [
                    '652991039841501184', // VIP TIER 5
                    '652991040461996044', // VIP TIER 4
                    '652991040776699957' // VIP TIER 3
                ],
                vehicles: [
                    'VIP3A',
                    'VIP3B',
                    'VIP3C',
                    'VIP3D',
                    'VIP3E',
                    'VIP3E',
                    'VIP3E',
                    'VIP3F',
                    'VIP3G',
                    'VIP3H',
                    'VIP3I',
                    'VIP3J',
                    'VIP3K',
                    'VIP3L',
                    'VIP3M',
                    'VIP3N',
                    'VIP3O'
                ]
            },
            {
                name: 'Premium Donator 4',
                ranks: [
                    '652991039841501184', // VIP TIER 5
                    '652991040461996044' // VIP TIER 4
                ],
                vehicles: [
                    'VIP4A',
                    'VIP4B',
                    'VIP4C',
                    'VIP4D',
                    'VIP4E',
                    'VIP4F',
                    'VIP4G',
                    'VIP4H',
                    'VIP4I',
                    'VIP4J',
                    'VIP4K',
                    'VIP4L',
                    'VIP4M',
                    'VIP4N',
                    'VIP4O',
                    'VIP4P'
                ]
            },
            {
                name: 'Premium Donator 5',
                ranks: [
                    '652991039841501184' // VIP TIER 5
                ],
                vehicles: [
                    'VIP5A',
                    'VIP5B',
                    'VIP5C',
                    'VIP5D',
                    'VIP5E',
                    'VIP5F',
                    'VIP5G',
                    'VIP5H',
                    'VIP5I',
                    'VIP5J',
                    'VIP5K',
                    'VIP5L',
                    'VIP5M',
                    'VIP5N',
                    'VIP5O'
                ]
            },
            {
                name: '',
                ranks: [
                    '677992456415084584' // SPRING PACK DONATOR
                ],
                vehicles: [
                    'SpringPack1',
                    'SpringPack2',
                    'SpringPack3',
                    'SpringPack4',
                    'SpringPack5'
                ]
            }
        ]
    },
    Commands: {
        immunity: {
            enabled: false,
            roles: {
                owner: [
                    '615697187980181505' // Community Owner
                ],
                leaders: [
                    '652968963340238858' // Executive Administrator
                ],
                administrators: [
                    '615697187980181505', // Community Owner
                    '652968963340238858' // Executive Administrator
                ]
            },
            message: ['^1^*(INFO)', ' ^1^*Player Is Immune']
        },
        actionAgainstSelf: {
            enabled: true,
            message: ['^1^*(INFO)', ' ^1^*Why Are You Hitting Yourself?']
        },
        administration: {
            PBan: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:PBan',
                    loggingEventName: 'Admin:PBan'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120', // Senior Administrator
                    '652990958102904835' // Administrator
                ],
                messages: {
                    banned: ['^1^*(INFO)', ' ^1^*%n HAS BEEN PERMANENTLY BANNED FROM THE SERVER | Reason: %r'],
                    reason: ['^1^*(INFO)', ' ^1^* Reason Not Specified'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /pban [PLAYER ID] [REASON]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            TBan: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:TBan',
                    loggingEventName: 'Admin:TBan'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120', // Senior Administrator
                    '652990958102904835' // Administrator
                ],
                messages: {
                    banned: ['^1^*(INFO)', ' ^1^*%n HAS BEEN TEMPORARILY BANNED FROM THE SERVER | Reason: %r | Duration: %t'],
                    reason: ['^1^*(INFO)', ' ^1^* Reason Not Specified'],
                    timeNumber: ['^1^*(INFO)', ' ^1^*Time Must Be A Number'],
                    time: ['^1^*(INFO)', ' ^1^* Time Must Be Specified'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /tban [PLAYER ID] [HOURS] [REASON]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            Unban: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:Unban',
                    loggingEventName: 'Admin:Unban'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858' // Executive Administrator
                ],
                messages: {
                    unbanned: ['^1^*(INFO)', ' ^1^*Successfully Unbanned: %n'],
                    noMatch: ['^1^*(INFO)', ' ^1^*No Matching Identifiers'],
                    noIdentifier: ['^1^*(INFO)', ' ^1^*Identifier Must Be Specified'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /unban [IDENTIFIER]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            Kick: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:Kick',
                    loggingEventName: 'Admin:Kick'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120', // Senior Administrator
                    '652990958102904835', // Administrator
                    '652990958333460522' // Junior Administrator
                ],
                messages: {
                    kicked: ['^1^*(INFO)', ' ^1^*%n HAS BEEN KICKED | Reason: %r'],
                    reason: ['^1^*(INFO)', ' ^1^* Reason Not Specified'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /kick [PLAYER ID] [REASON]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            Drop: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:Drop',
                    loggingEventName: 'Admin:Drop'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120' // Senior Administrator
                ],
                messages: {
                    dropped: ['^1^*(INFO)', ' ^1^*Successfully Dropped: %n'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /drop [PLAYER ID]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            Crash: {
                enabled: true,
                logging: {
                    enabled: false,
                    eventName: 'DiscordFramework:Logs:Crash',
                    loggingEventName: 'Admin:Crash'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858' // Executive Administrator
                ],
                announceRoles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858' // Executive Administrator
                ],
                messages: {
                    announce:  ['^1^*(INFO)', ' ^1^*%n1 Crashed %n2'],
                    crashed: ['^1^*(INFO)', ' ^1^*Successfully Crashed: %n'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /crash [PLAYER ID]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            Kill: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:Kill',
                    loggingEventName: 'Admin:Kill'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120', // Senior Administrator
                    '652990958102904835', // Administrator
                    '652990958333460522' // Junior Administrator
                ],
                messages: {
                    killed: ['^1^*(INFO)', ' ^1^*Successfully Killed: %n'],
                    player: ['^1^*(INFO)', ' ^1^*You Have Been Killed By A Staff Member'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /kill [PLAYER ID]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            Freeze: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:Freeze',
                    loggingEventName: 'Admin:Freeze'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120', // Senior Administrator
                    '652990958102904835', // Administrator
                    '652990958333460522' // Junior Administrator
                ],
                messages: {
                    frozen: ['^1^*(INFO)', ' ^1^*Successfully Froze: %n'],
                    player: ['^1^*(INFO)', ' ^1^*You Have Been Frozen By A Staff Member'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /freeze [PLAYER ID]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            Unfreeze: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:Unfreeze',
                    loggingEventName: 'Admin:Unfreeze'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120', // Senior Administrator
                    '652990958102904835', // Administrator
                    '652990958333460522' // Junior Administrator
                ],
                messages: {
                    unfrozen: ['^1^*(INFO)', ' ^1^*Successfully Unfroze: %n'],
                    player: ['^1^*(INFO)', ' ^1^*You Are Now Unfrozen'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /unfreeze [PLAYER ID]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            Slap: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:Slap',
                    loggingEventName: 'Admin:Slap'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858' // Executive Administrator
                ],
                messages: {
                    slapped: ['^1^*(INFO)', ' ^1^*Successfully Slapped: %n'],
                    player: ['^1^*(INFO)', ' ^1^*You Have Been Slapped By A Staff Member'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /slap [PLAYER ID]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            GoTo: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:GoTo',
                    loggingEventName: 'Admin:GoTo'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120', // Senior Administrator
                    '652990958102904835', // Administrator
                    '652990958333460522' // Junior Administrator
                ],
                messages: {
                    player: ['^1^*(INFO)', ' ^1^*You Have Been Teleported To By A Staff Member'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /goto [PLAYER ID]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            Bring: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:Bring',
                    loggingEventName: 'Admin:Bring'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120', // Senior Administrator
                    '652990958102904835', // Administrator
                    '652990958333460522' // Junior Administrator
                ],
                messages: {
                    brought: ['^1^*(INFO)', ' ^1^*Successfully Brought %n To You'],
                    player: ['^1^*(INFO)', ' ^1^*A Staff Member Teleported You To Them'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /bring [PLAYER ID]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            BringAll: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:BringAll',
                    loggingEventName: 'Admin:BringAll'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120', // Senior Administrator
                    '652990958102904835' // Administrator

                ],
                messages: {
                    broughtAll: ['^1^*(INFO)', ' ^1^*Successfully Brought Everyone To You'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /bring all']
                }
            },
            ADV: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:ADV',
                    loggingEventName: 'Admin:ADV'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120', // Senior Administrator
                    '652990958102904835', // Administrator
                    '652990958333460522' // Junior Administrator
                ],
                messages: {
                    deleted: ['^1^*(INFO)', ' ^1^*%n\'s Vehicle Was Deleted'],
                    noVehicle: ['^1^*(INFO)', ' ^1^*%n Is Not In A Vehicle'],
                    player: ['^1^*(INFO)', ' ^1^*Your Vehicle Was Deleted By A Staff Member'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /adv [PLAYER ID]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            AdPM: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:AdPM',
                    loggingEventName: 'Admin:AdPM'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120', // Senior Administrator
                    '652990958102904835', // Administrator
                    '652990958333460522' // Junior Administrator
                ],
                messages: {
                    sent: ['^1^*(INFO)', ' ^1^*APM Sent To: %n | %m'],
                    player: ['^1^*(AD-PM)', ' ^1^*From Staff Member: %m'],
                    pm: ['^1^*(INFO) ', ' ^1^*Message Must Be Specified'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /adpm [PLAYER ID] [MSG]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            AdWarn: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:AdWarn',
                    loggingEventName: 'Admin:AdWarn'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120', // Senior Administrator
                    '652990958102904835', // Administrator
                    '652990958333460522' // Junior Administrator
                ],
                messages: {
                    sent: ['^1^*(INFO)', ' ^1^*Successfully Warned: %n'],
                    player: ['^1^*(AD-WARN)', ' ^1^*%m'],
                    warning: ['^1^*(INFO)', ' ^1^* Warning Must Be Specified'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /adwarn [PLAYER ID] [MSG]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            AdAnn: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:AdAnn',
                    loggingEventName: 'Admin:AdAnn'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120', // Senior Administrator
                    '652990958102904835', // Administrator
                    '652990958333460522' // Junior Administrator
                ],
                messages: {
                    sent: ['^1^*(INFO)', ' ^1^*Successfully Sent Announcement'],
                    announcement: ['^1^*(ANNOUNCEMENT)', ' ^1^*%m'],
                    message: ['^1^*(INFO)', ' ^1^*Announcement Must Be Specified'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /adann [MSG]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            AJail: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:AJail',
                    loggingEventName: 'Admin:AJail'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120', // Senior Administrator
                    '652990958102904835', // Administrator
                    '652990958333460522' // Junior Administrator
                ],
                messages: {
                    jailed: ['^1^*(INFO)', ' ^1^*Successfully Server Jailed: %n'],
                    released: ['^1^*(INFO)', ' ^1^*You Were Released From Server Jail'],
                    player: ['^1^*(INFO)', ' ^1^*You Were Server Jailed By A Staff Member'],
                    remaining: ['^4^*(ADMIN-JAIL)', ' ^1^*%t LEFT'],
                    timeNumber: ['^1^*(INFO)', ' ^1^* Time Must Be A Number In Seconds'],
                    time: ['^1^*(INFO)', ' ^1^* Time Must Be Specified'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /ajail [PLAYER ID] [SECONDS]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                },
                settings: {
                    releaseCoords: [-385, 2602, 88.5],
                    jailCoords: [-2000.48, 3194.36, 33],
                    jailRadius: 21
                }
            },
            AUnjail: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:AUnjail',
                    loggingEventName: 'Admin:AUnjail'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120', // Senior Administrator
                    '652990958102904835', // Administrator
                    '652990958333460522' // Junior Administrator
                ],
                messages: {
                    released: ['^1^*(INFO)', ' ^1^*Successfully Unjailed: %n'],
                    player: ['^1^*(INFO)', ' ^1^*You Were Released From Server Jail'],
                    notJailed: ['^1^*(INFO)', ' ^1^*%n Is Not In Server Jail'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /aunjail [PLAYER ID]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            AReport: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventNameA: 'DiscordFramework:Logs:Report:Attach',
                    eventNameB: 'DiscordFramework:Logs:Report:Close',
                    loggingEventNameA: 'Admin:Report:Attach',
                    loggingEventNameB: 'Admin:Report:Close'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120', // Senior Administrator
                    '652990958102904835', // Administrator
                    '652990958333460522' // Junior Administrator
                ],
                messages: {
                    attached: ['^1^*(INFO)', ' ^1^*%n Has Attached To Report ID: %i'],
                    alreadyAttached: ['^1^*(INFO)', ' ^1^*You Are Already Attached To Report ID: %i'],
                    invalidAction: ['^1^*(INFO)', ' ^1^*Invalid Action'],
                    closed: ['^1^*(INFO)', ' ^1^*Closed Report ID: %i'],
                    player: ['^1^*(INFO)', ' ^1^*%n Has Attached To Your Report'],
                    close: ['^1^*(INFO)', ' ^1^*Your Report Has Been Handled'],
                    notFound: ['^1^*(INFO)', ' ^1^* Report Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Report ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /areport [REPORT ID]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            AIDensity: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:AIDensity',
                    loggingEventName: 'Admin:AIDensity'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120' // Senior Administrator
                ],
                messages: {
                    off: ['^1^*(INFO)', ' ^1^*AI Has Been Turned Off'],
                    set: ['^1^*(INFO)', ' ^1^*AI Density Has Been Set To %v'],
                    valueNumber: ['^1^*(INFO)', ' ^1^*Value Must Be A Number And Must Be Between 0 And 1'],
                    noValue: ['^1^*(INFO)', ' ^1^*Value Must Be Specified'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /aidensity [VALUE]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            Screenie: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:Screenie',
                    loggingEventName: 'Admin:Screenie'
                },
                cooldown:{
                    enabled: true,
                    time: 5 // In Seconds
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120' // Senior Administrator
                ],
                messages: {
                    shot: ['^1^*(INFO)', ' ^1^*A spy SR-71 took this photo from %n'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /screenie [ID]'],
                    cooldown: ['^1^*(INFO)', ' ^1^*You need to wait %t'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            ClearChat: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:ClearChat',
                    loggingEventName: 'Admin:ClearChat'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120', // Senior Administrator
                    '652990958102904835', // Administrator
                    '652990958333460522' // Junior Administrator
                ],
                messages: {
                    cleared: ['^1^*(INFO)', ' ^1^*CHAT HAS BEEN CLEARED BY A STAFF MEMBER'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /clearchat'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            },
            ACMDS: {
                enabled: true,
                logging: {
                    enabled: false,
                    eventName: 'DiscordFramework:Logs:ACMDS',
                    loggingEventName: 'Admin:ACMDS'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120', // Senior Administrator
                    '652990958102904835', // Administrator
                    '652990958333460522' // Junior Administrator
                ],
                messages: {
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /ACMDS'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            }
        },
        public: {
            Report: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:Report:Open',
                    loggingEventName: 'Public:Report:Open'
                },
                messages: {
                    reported: ['^1^*(INFO)', ' ^1^*Submitted Report Of: %n'],
                    moderator: ['^1^*(INFO)', ' ^1^*%n1 Reported %n2 - Reason: %r | Report ID: %i'],
                    noReport: ['^1^*(INFO)', ' ^1^* Report Must Be Specified'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /report [PLAYER ID] [REPORT]']
                }
            },
            APM: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:APM',
                    loggingEventName: 'Public:APM'
                },
                messages: {
                    player: ['^1^*(AD-PM)', ' ^1^*To Administrators: %m'],
                    sent: ['^1^*(INFO)', ' ^1^*From %n: %m'],
                    noPM: ['^1^*(INFO)', ' ^1^* Message Must Be Specified'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /apm [MESSAGE]']
                }
            },
            OOC: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:OOC',
                    loggingEventName: 'Public:OOC'
                },
                messages: {
                    sent: ['^9(( ', ' ^9%n | %i : %m ))'],
                    noMessage: ['^1^*(INFO)', ' ^1^* Message Must Be Specified'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /ooc [MESSAGE]']
                }
            },
            Me: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:Me',
                    loggingEventName: 'Public:Me'
                },
                noneGlobalRadius: 60,
                messages: {
                    sent: ['^5* %n', ' %m'],
                    sentGlobal: ['^5* %n', ' %m'],
                    noMessage: ['^1^*(INFO)', ' ^1^* Message Must Be Specified'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /me [MESSAGE]']
                }
            },
            Do: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:Do',
                    loggingEventName: 'Public:Do'
                },
                noneGlobalRadius: 60,
                messages: {
                    sent: ['^5*', ' %m (%n)'],
                    sentGlobal: ['^5*', ' %m (%n)'],
                    noMessage: ['^1^*(INFO)', ' ^1^* Message Must Be Specified'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /do [MESSAGE]']
                }
            },
            Ad: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:Ad',
                    loggingEventName: 'Public:Ad'
                },
                messages: {
                    sent: ['^3(AD)', ' ^0%m'],
                    noMessage: ['^1^*(INFO)', ' ^1^* Message Must Be Specified'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /ad [MESSAGE]']
                }
            },
            Tweet: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:Tweet',
                    loggingEventName: 'Public:Tweet'
                },
                messages: {
                    sent: ['^5Twitter', ' ^0| ^5%n ^0| %i ^0:^5 %m'],
                    sentAnonymous: ['^5(TWEET)', ' ^5Anonymous: %m'],
                    noMessage: ['^1^*(INFO)', ' ^1^* Message Must Be Specified'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /tweet [MESSAGE]']
                }
            },
            DW: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:Darkweb',
                    loggingEventName: 'Public:Darkweb'
                },
                messages: {
                    sent: ['^0(^9Dark Web^0)', ' ^9 %m'],
                    noMessage: ['^1^*(INFO)', ' ^1^* Message Must Be Specified'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /dw [MESSAGE]']
                }
            },
            PM: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:PM',
                    loggingEventName: 'Public:PM'
                },
                messages: {
                    sent: ['^3^*(PM)', ' ^3To %n | %i : %m'],
                    received: ['^3^*(PM)', ' ^3From %n | %i : %m'],
                    noMessage: ['^1^*(INFO)', ' ^1^* Message Must Be Specified'],
                    notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                    idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /pm [PLAYER ID] [MESSAGE]']
                }
            },
            911: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:911',
                    loggingEventName: 'Public:911'
                },
                messages: {
                    toOnduty: ['^3^*(911)', ' ^3Caller Name: %n | Caller ID: %i | Call Details: %m'],
                    sent: ['^3^*(911)', ' ^3Call Was Submitted'],
                    noMessage: ['^1^*(INFO)', ' ^1^* Call Must Be Specified'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /911 [CALL]']
                }
            },
            511: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:511',
                    loggingEventName: 'Public:511'
                },
                messages: {
                    toOnduty: ['^3^*(511)', ' ^3Caller Name: %n | Caller ID: %i | Call Details: %m'],
                    sent: ['^3^*(511)', ' ^3Call Was Submitted'],
                    noMessage: ['^1^*(INFO)', ' ^1^* Call Must Be Specified'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /511 [CALL]']
                }
            },
            311: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:311',
                    loggingEventName: 'Public:311'
                },
                messages: {
                    toOnduty: ['^3^*(311)', ' ^3Caller Name: %n | Caller ID: %i | Call Details: %m'],
                    sent: ['^3^*(311)', ' ^3Call Was Submitted'],
                    noMessage: ['^1^*(INFO)', ' ^1^* Call Must Be Specified'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /311 [CALL]']
                }
            },
            Dispatch: {
                enabled: true,
                logging: {
                    enabled: true,
                    eventName: 'DiscordFramework:Logs:Dispatch',
                    loggingEventName: 'Public:Dispatch'
                },
                roles: [
                    '615697187980181505', // Community Owner
                    '652968963340238858', // Executive Administrator
                    '652990957611909120', // Senior Administrator
                    '652990958102904835', // Administrator
                    '652990958333460522', // Junior Administrator
                    '652990966445244426' // Law Enforcement
                ],
                messages: {
                    sent: ['^4^*(DISPATCH)', ' ^4%m'],
                    noMessage: ['^1^*(INFO)', ' ^1^* Reply Must Be Specified'],
                    usage: ['^1^*(INFO)', ' ^1^*Usage: /Dispatch [REPLY]'],
                    noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                }
            }
        }
    },
    PrivateChat: {
        'nitro': {
            command: 'nc',
            roles: [
                '581644688138960897' // Nitro Booster
            ],
            message: ['^9^*[^2^*Nitro Booster Chat^9^*]', '^2^*%n ^9^*| ^2^* %i^9^*: ^2^*%m']
        },
        'donator': {
            command: 'dc',
            roles: [
                '652991039841501184', // VIP TIER 5
                '652991040461996044', // VIP TIER 4
                '652991040776699957', // VIP TIER 3
                '652991041833533461', // VIP TIER 2
                '652991042437775360' // VIP TIER 1
            ],
            message: ['^3^*[^8^*Donator Chat ^3^*]', '^8^*%n ^3^*| ^8^* %i^3^*: ^8^*%m']
        },
        'staff': {
            command: 'sc',
            roles: [
                '652990959100887041' // Staff Team
            ],
            message: ['^1^*(COM-S)', ' ^1^*%n | %i: %m']
        },
        'executive': {
            command: 'ec',
            roles: [
                '652968963340238858' // Executive Administrator
            ],
            message: ['^1^*(COM-E)', ' ^1^*%n | %i: %m']
        }
    },
    Logs: {
        channels: {
            'Player:Joined': '652991698523258880',
            'Player:Connecting': '652991698523258880',
            'Player:Identifiers': '656641546736893952',
            'Player:Left': '652991698523258880',
            'Admin:PBan': '696281546822516756',
            'Admin:TBan': '696281546822516756',
            'Admin:Unban': '696281546822516756',
            'Admin:Kick': '696281546822516756',
            'Admin:Drop': '696281546822516756',
            'Admin:Crash': '696281546822516756',
            'Admin:Kill': '702819931971911770',
            'Admin:Freeze': '702819931971911770',
            'Admin:Unfreeze': '702819931971911770',
            'Admin:Slap': '702819931971911770',
            'Admin:GoTo': '702819931971911770',
            'Admin:Bring': '702819931971911770',
            'Admin:BringAll': '702819931971911770',
            'Admin:ADV': '702819931971911770',
            'Admin:AdPM': '702819931971911770',
            'Admin:AdWarn': '702819931971911770',
            'Admin:AdAnn': '702819931971911770',
            'Admin:AJail': '702819931971911770',
            'Admin:AUnjail': '702819931971911770',
            'Admin:Report:Attach': '704175776106545282',
            'Admin:Report:Close': '704175776106545282',
            'Public:Report:Open': '704175776106545282',
            'Public:APM': '702819931971911770',
            'Public:Message': '652991702147268618',
            'Public:Me': '652991711538184195',
            'Public:Do': '652991711538184195',
            'Public:OOC': '652991702147268618',
            'Public:PM': '652991711538184195',
            'Public:Ad': '656596672134250513',
            'Public:Tweet': '656596672134250513',
            'Public:Darkweb': '656596672134250513',
            'Public:911': '682722685616390159',
            'Public:311': '682722685616390159',
            'Public:511': '682722685616390159',
            'Public:Dispatch': '682722685616390159'

        }

    },
    Queue: {
        enabled: false,
        maxPlayers: GetConvarInt('sv_maxclients', 0),
        defaultPoint: 0,
        rolesPoints: {
            '615697187980181505': 100, // Community Owner
            '652968963340238858': 90, // Lead Administrator
            '652990959100887041': 80, // Staff Team
            '652991039841501184': 60, // Donator Tier 5
            '652991040461996044': 50, // Donator Tier 4
            '652991040776699957': 40, // Donator Tier 3
            '652991041833533461': 30, // Donator Tier 2
            '652991042437775360': 20, // Donator Tier 1
            '581644688138960897': 10 // Nitro Booster
        },
        messages: {
            checkingQueue: 'Checking Queue',
            position: 'You Are %s In Queue',
            joining: 'Joining Server...',
            whitelist: 'Server is whitelisted to discord members only at this time.\nJoin our discord server to get access to the server.\nDiscord Invite: discord.jcrp.io'
        },
        // /Lets only people with a certain role join
        whitelistEnabled: false,
        // The role that lets you join the server, ID only
        whiltelistedRoles: [
            '653608608604618763', // Verified Member
            '652968963340238858', // Executive Administration
            '615697187980181505' // Community Owner
        ], // Community Owner // for now
        // will remove players from queue if the server doesn't recieve a signal from them
        queueTimeout: 60, // in seconds
        // Console colors
        consoleColor: {
            Reset: '\x1b[0m',
            Bright: '\x1b[1m',
            Dim: '\x1b[2m',
            Underscore: '\x1b[4m',
            Blink: '\x1b[5m',
            Reverse: '\x1b[7m',
            Hidden: '\x1b[8m',
            FgBlack: '\x1b[30m',
            FgRed: '\x1b[31m',
            FgGreen: '\x1b[32m',
            FgYellow: '\x1b[33m',
            FgBlue: '\x1b[34m',
            FgMagenta: '\x1b[35m',
            FgCyan: '\x1b[36m',
            FgWhite: '\x1b[37m',
            BgBlack: '\x1b[40m',
            BgRed: '\x1b[41m',
            BgGreen: '\x1b[42m',
            BgYellow: '\x1b[43m',
            BgBlue: '\x1b[44m',
            BgMagenta: '\x1b[45m',
            BgCyan: '\x1b[46m',
            BgWhite: '\x1b[47m'
        }
    },
    RPC: {
        enabled: true,
        updateWaitTime: 2000,
        swtichWaitTime: 2000
    },
    Watchlist: {
        enabled: true,
        command: {
            enabled: true,
            roles: [
                '615697187980181505', // Community Owner
                '652968963340238858', // Executive Administrator
                '652990957611909120', // Senior Administrator
                '652990958102904835' // Administrator
            ],
            sections: {
                add: {
                    enabled: true,
                    logging: {
                        enabled: true,
                        eventName: 'DiscordFramework:Logs:Watchlist:Add',
                        loggingEventName: 'Admin:Watchlist:Add'
                    },
                    roles: [
                        '615697187980181505', // Community Owner
                        '652968963340238858', // Executive Administrator
                        '652990957611909120', // Senior Administrator
                        '652990958102904835' // Administrator
                    ],
                    messages: {
                        added: ['^1(INFO)', ' ^1%n Was Added To The Watchlist'],
                        tbanReason: ['^1(INFO)', ' ^1TBan Duration Must Be Specified'],
                        reason: ['^1(INFO)', ' ^1Reason Must Be Specified'],
                        invalidIdentifier: ['^1(INFO)', ' ^1Invalid Identifier//Player ID'],
                        already: ['^1(INFO)', ' ^1%n Is Already In Watchlist For: %r'],
                        identifier: ['^1(INFO)', ' ^1Identifier Must Be Specified'],
                        noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions'],
                        disabled: ['^1^*(INFO)', ' ^1This Section Is Disabled']

                    }
                },
                remove: {
                    enabled: true,
                    logging: {
                        enabled: true,
                        eventName: 'DiscordFramework:Logs:Watchlist:Remove',
                        loggingEventName: 'Admin:Watchlist:Remove'
                    },
                    roles: [
                        '615697187980181505', // Community Owner
                        '652968963340238858', // Executive Administrator
                        '652990957611909120', // Senior Administrator
                        '652990957611909120' // Senior Administrator
                    ],
                    messages: {
                        removed: ['^1(INFO)', ' ^1%n Was Removed From The Watchlist'],
                        reason: ['^1(INFO)', ' ^1Reason Must Be Specified'],
                        noMatch: ['^1(INFO)', ' ^1No Match Was Found'],
                        invalidIdentifier: ['^1(INFO)', ' ^1Invalid Identifier'],
                        identifier: ['^1(INFO)', ' ^1Identifier Must Be Specified'],
                        noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions'],
                        disabled: ['^1^*(INFO)', ' ^1This Section Is Disabled']

                    }
                },
                show: {
                    enabled: true,
                    logging: {
                        enabled: true,
                        eventName: 'DiscordFramework:Logs:Watchlist:Show',
                        loggingEventName: 'Admin:Watchlist:Show'
                    },
                    roles: [
                        '615697187980181505', // Community Owner
                        '652968963340238858', // Executive Administrator
                        '652990957611909120', // Senior Administrator
                        '652990958102904835' // Administrator
                    ],
                    messages: {
                        found: ['^1(INFO)', '^1Match Found; Name: %n | Added By: %a | Reason: %r %o'],
                        noMatch: ['^1(INFO)', ' ^1No Match Was Found'],
                        invalidIdentifier: ['^1(INFO)', ' ^1Invalid Identifier'],
                        identifier: ['^1(INFO)', ' ^1Identifier Must Be Specified'],
                        noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions'],
                        disabled: ['^1^*(INFO)', ' ^1This Section Is Disabled'],
                        options: {
                            tban: '| PBan On Join ',
                            pban: '| TBan On Join '
                        }
                    }
                }
            },
            messages: {
                invalidAction: ['^1(INFO)', ' ^1Invalid Action'],
                usage: ['^1(INFO)', ' ^1usage: /watchlist [ACTION] [IDENTIFIER]']
            }
        },
        function: {
            logging: {
                pban: {
                    enabled: false,
                    eventName: 'DiscordFramework:Logs:PBan',
                    loggingEventName: 'Admin:PBan'
                },
                tban: {
                    enabled: false,
                    eventName: 'DiscordFramework:Logs:TBan',
                    loggingEventName: 'Admin:TBan'
                }
            },
            roles: [
                '615697187980181505', // Community Owner
                '652968963340238858', // Executive Administrator
                '652990957611909120', // Senior Administrator
                '652990958102904835', // Administrator
                '652990958333460522' // Junior Administrator
            ],
            messages: {
                joined: ['^1^*(WATCHLIST)', ' ^1%n1 IS CONNECTING\n PREVIOUS NAME: %n2\n IN WATCHLIST FOR: %r'],
                noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions'],
                pbanned: 'DiscordFramework: You have been permanent banned',
                tbanned: 'DiscordFramework: You have been temporary banned'
            }
        }
    },
    DeathManager: {
        enabled: true,
        reviveWaitTime: 240,
        respawnWaitTime: 120,
        hospitals: [
            [ 296.21, -1447.39, 30.4, 320.02], // Central LS Medical Center
            [ 298.38, -584.36, 44, 74.56], // Pillbox Hill Medical Center
            [ -449.01, -340.66, 35, 79.78], // Mount Zonah Medical Center
            [ 1839.03, 3672.32, 35, 208.24], // Sandy Shores Medical Center
            [ -247.07, 6330.2, 33, 227.3] // Paleto Bay Medical Center
        ],
        commands: {
            public: {
                Revive: {
                    enabled: true,
                    logging: {
                        enabled: true,
                        eventName: 'DiscordFramework:Logs:Revive',
                        loggingEventName: 'Public:Revive'
                    },
                    messages: {
                        revive: ['^3^*(INFO)', ' ^3You Have Revived'],
                        alive: ['^3^*(INFO)', ' ^3You Are Alive'],
                        usage: ['^1^*(INFO)', ' ^1^*Usage: /revive']
                    }
                },
                Respawn: {
                    enabled: true,
                    logging: {
                        enabled: true,
                        eventName: 'DiscordFramework:Logs:Respawn',
                        loggingEventName: 'Public:Respawn'
                    },
                    messages: {
                        respawn: ['^3^*(INFO)', ' ^3You Have Respawned'],
                        alive: ['^3^*(INFO)', ' ^3You Are Alive'],
                        usage: ['^1^*(INFO)', ' ^1^*Usage: /respawn']
                    }
                }
            },
            administration: {
                AdRev: {
                    enabled: true,
                    logging: {
                        enabled: true,
                        eventName: 'DiscordFramework:Logs:AdRev',
                        loggingEventName: 'Admin:AdRev'
                    },
                    roles: [
                        '615697187980181505', // Community Owner
                        '652968963340238858', // Executive Administrator
                        '652990957611909120', // Senior Administrator
                        '652990958102904835', // Administrator
                        '652990958333460522' // Junior Administrator
                    ],
                    messages: {
                        AdRev: ['^3^*(INFO)', ' ^3You Have Been Revived By An Admin'],
                        revived: ['^3^*(INFO)', ' ^3%n Has Been Revived'],
                        all: ['^3^*(INFO)', ' ^3Everyone Has Been Revived By An Admin'],
                        alive: ['^3^*(INFO)', '  ^3%n Is Alive'],
                        notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                        idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                        usage: ['^1^*(INFO)', ' ^1^*Usage: /adrev [PLAYER ID]'],
                        noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                    }
                },
                AdRes: {
                    enabled: true,
                    logging: {
                        enabled: true,
                        eventName: 'DiscordFramework:Logs:AdRes',
                        loggingEventName: 'Admin:AdRes'
                    },
                    roles: [
                        '615697187980181505', // Community Owner
                        '652968963340238858', // Executive Administrator
                        '652990957611909120', // Senior Administrator
                        '652990958102904835', // Administrator
                        '652990958333460522' // Junior Administrator
                    ],
                    messages: {
                        AdRes: ['^3^*(INFO)', ' ^3You Have Been Respawned By An Admin'],
                        respawned: ['^3^*(INFO)', ' ^3%n  Has Been Respawned By An Admin'],
                        all: ['^3^*(INFO)', ' ^3Everyone Has Been Respawned By An Admin'],
                        alive: ['^3^*(INFO)', ' ^3%n Is Alive'],
                        notFound: ['^1^*(INFO)', ' ^1^* Player Not Found'],
                        idNumber: ['^1^*(INFO)', ' ^1^* Player ID Must Be A Number'],
                        usage: ['^1^*(INFO)', ' ^1^*Usage: /adres [PLAYER ID]'],
                        noPermission: ['^1^*(INFO)', ' ^1^*Insufficient Permissions']
                    }
                }
            }
        }
    },
    Chat: {
        enabled: true,
        proximityEnabled: true,
        proximityRadius: 60, // In GTA V units
        roles: {
            // JCRP Comman
            '615697187980181505': '^1^*Server Owner^r',
            '652968963340238858': '^1^*Executive Admin^r',

            // JCRP Staff Team
            '652990957611909120': '^5^*Senior Administrator^r',
            '652990958102904835': '^5^*Administrator^r',
            '652990958333460522': '^5^*Junior Administrator^r',

            // Los Santos Sheriff's Department
            '652990981687214081': '^2^*LSSD Sheriff^r',
            '652990982526074890': '^2^*LSSD Undersheriff^r',
            '652990983532969994': '^2^*LSSD Asst. Sheriff^r',
            '652990984157659137': '^2^*LSSD Chief^r',
            '652990985638510655': '^2^*LSSD Captain^r',
            '652990986242228244': '^2^*LSSD Lieutenant^r',
            '652990986880024596': '^2^*LSSD Sergeant^r',
            '652990988079333397': '^2^*LSSD Sr. Deputy^r',
            '652990988637306881': '^2^*LSSD Deputy^r',
            '652990989580894208': '^2^*LSSD Prob. Deputy^r',

            // San Andreas State Police
            '652990999022534676': '^3^*SASP Colonel^r',
            '652990999634903070': '^3^*SASP Lieutenant Colonel^r',
            '652991000255397917': '^3^*SASP Commander^r',
            '652991000586747907': '^3^*SASP Major^r',
            '652991001740181504': '^3^*SASP Lieutenant Major^r',
            '652991002600013864': '^3^*SASP Captain^r',
            '652991003866955786': '^3^*SASP Lieutenant^r',
            '705925716331593818': '^3^*SASP First Sergeant^r',
            '652991005175578664': '^3^*SASP Sergeant^r',
            '652991006614093834': '^3^*SASP Master Trooper^r',
            '652991007041912850': '^3^*SASP Senior Trooper^r',
            '705926146939945051': '^3^*SASP Trooper II^r',
            '652991008493142066': '^3^*SASP Trooper I^r',
            '706648246948331650': '^3^*SASP Trainee^r',

            // JCRP Donators
            '652991039841501184': '^8^*JCRP Donator 5^r',
            '652991040461996044': '^8^*JCRP Donator 4^r',
            '652991040776699957': '^8^*JCRP Donator 3^r',
            '652991041833533461': '^8^*JCRP Donator 2^r',
            '652991042437775360': '^8^*JCRP Donator 1^r',
            '677992456415084584': '^8^*JCRP Donator SP^r',

            // Nitro Booster
            '581644688138960897': '^8^*Nitro Booster',

            // JCRP Civilian Operations
            '652991045189107753': '^8^*CO | Director^r',
            '652991046011191315': '^8^*CO | Co-Director^r',
            '652991046892126208': '^8^*CO | Assistant Director^r',
            '652991047634386944': '^8^*CO | Executive^r',
            '652991048577974282': '^8^*CO | Manager^r',
            '652991049236742144': '^8^*CO | Supervisor^r',
            '652991049483943963': '^8^*CO | Specialist^r',
            '652991050612342785': '^8^*Civilian III^r',
            '652991050960338945': '^8^*Civilian II^r',
            '652991051958845470': '^8^*Civilian I^r'
        }
    },
    AutoMessage: {
        enabled: true,
        waitTime: 300, // in seconds
        messages: [
            ['^1(JCRP) ', '^1If you wish to speak with a staff member use /apm to request an Administrator and they\'ll be with you shortly. If you get kicked from the server do not cause a disturbance in chat join the Need Staff voice chat in Discord and wait for a staff member to come and speak to you.'],
            ['^1(JCRP) ', '^1If your intention is to purposely ruin somebody\'s roleplay then just leave, we will not tolerate that sort of behaviour and if we do find out that doing this is you intention then you will be removed from the server, if you continue to do it then you will be banned. You are all here to have a good roleplay experience and a fun time, do not ruin people\'s roleplay.'],
            ['^1(JCRP) ', '^1 Any form of Cop Baiting on the server is strictly PROHIBITED and you will receieve consequences if you\'re seen Cop Baiting, please follow all server rules and regulations, if you\'re confused or curious about a certain rule, join the Justice Community Roleplay Discord and go to the #welcome channel and look at the (SERVER ADMINISTRATION) document.'],
            ['^1(JCRP) ', '^1Welcome to Justice Community Roleplay, we recommend you join our Discord Server for better communication between players, and various of other information regarding the server, such as Rules and Regulations.  You can find the Discord at the top right of your screen, or you may connect with discord.gg/jcrp.'],
            ['^1(JCRP) ', '^1If you are experiencing teleporting, vehicle spawning or anything out of the ordinary when pressing a certain key then you probably have your keybindings enabled. To disable them go to F3/F4 menu, Options, go to page 2, then disable key bindings. To save this change go to the end of page 2 and press "Save settings to trainerv.ini"'],
            ['^1(JCRP) ', '^1Keep your roleplays legit, if you wouldn\'t do it in real life then don\'t do it here, we want to keep the roleplay as realistic as possible failure to comply with server rules will result in a removal from the server, view rules by joining our Discord server located at the top left of your screen, or by connecting by using discord.gg/jcrp.'],
            ['^1(JCRP) ', '^1We are a menu based server, you may use our Server Sided Menu by clicking F6, or if you would like a menu installed download Lambda Menu from the FiveM forums at https://forum.fivem.net/']
        ]
    }
};