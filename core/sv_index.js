const Core = require(GetResourcePath(GetCurrentResourceName()) + '/core/core');

// const Discord = require(GetResourcePath(GetCurrentResourceName()) + '/core/modules/discord');
// const MongoDB = require(GetResourcePath(GetCurrentResourceName()) + '/core/modules/mongo');

// --------------------------------------
//               TESTINGS
// --------------------------------------

RegisterCommand('Test', () => {
    console.log(Core.Players);
});

// --------------------------------------
//               EXPORTS
// --------------------------------------

/**
 * This registers exports without chaning the environment behavior of the calling file
 */
on('DiscordFramework:Export:Create', (Name, Function) => {
    exports(Name, Function);
    if(global.DebugMode) console.debug(Name, 'export was create!');
});

exports('Core', () => {
    return {
        Test: 'test',
        /**
         *
         * @returns Set of all players
         */
        GetPlayers: () => {
            return Core.Players;
        },
        /**
         *
         * @param {number} PlayerId Player server ID
         * @param {number} Gategory 0 = Network | 1 = Connected | 2 = Connecting
         * @returns player cached information
         */
        GetPlayer: PlayerId => {
            return Core.Players.get(PlayerId);
        },
        GetGeoLocation: async IP => {
            // Get the player's country AKA. GeoIP
            const fetch = require('node-fetch');

            let GeoIP = await fetch('http://ip-api.com/json/' + IP);
            GeoIP = await GeoIP.json();
            if (GeoIP.status.toLowerCase() === 'success') {
                NewPlayer.details.location = `${GeoIP.country}, ${GeoIP.regionName}`;
            } else {
                NewPlayer.details.location = 'Unknown';
            }
        },
        /**
         * @returns Set of all registered extensions
         */
        GetExtensions: () => {
            return Core.Extensions;
        },
        /**
         *
         * @param {string} Name Name of extension
         * @returns Extension details
         */
        GetExtension: (Name) => {
            return Core.ExtensionsGet(Name);
        }

    };
});


exports('Discord', () => {
    return {
        /**
         *
         * @returns discord Client user
         */
        ClientUser: () => {
            return JSON.parse(JSON.stringify(Discord.Client.user));
        },
        /**
         *
         * @returns all users client is aware of
         */
        GetUsers: () => {
            return JSON.parse(JSON.stringify(Discord.Client.users.cache));
        },
        /**
         *
         * @returns all guild client is part of
         */
        GetGuilds: () => {
            return JSON.parse(JSON.stringify(Discord.Client.guilds.cache));
        },
        /**
         *
         * @param {number} PlayerId Either the player's server ID or the Discord ID
         * @returns Member details
         */
        GetUser: async (PlayerId) => {
            return JSON.parse(JSON.stringify(await Discord.GetUser(PlayerId)));
        },
        /**
         *
         * @param {number} GuildId Targeted discord server ID
         * @returns Guild details
         */
        GetGuild: async (GuildId) => {
            return JSON.parse(JSON.stringify(await Discord.GetGuild(GuildId)));
        },
        /**
         *
         * @param {number} PlayerId Either the player's server ID or the Discord ID
         * @param {number} GuildId Targeted discord server ID (Optional)
         * @returns Member details
         */
        GetMember: async (PlayerId, GuildId) => {
            return JSON.parse(JSON.stringify(await Discord.GetMember(PlayerId, GuildId)));
        },
        /**
         *
         * @param {number} RoleId Targeted role ID
         * @param {number} GuildId Targeted discord server ID (Optional)
         * @returns Role details
         */
        GetRole: async (RoleId, GuildId) => {
            return JSON.parse(JSON.stringify(await Discord.GetRole(RoleId, GuildId)));
        }
    };
});


exports('MongoDB', () => {
    return {
        DatabaseInsertOne: (Collection, Query, Callback) => {
            MongoDB.DatabaseInsertOne(Collection, Query, _Callback => Callback(_Callback || null));
        },
        DatabaseInserMany: (Collection, Query, Callback) => {
            MongoDB.DatabaseInserMany(Collection, Query, _Callback => Callback(_Callback || null));
        },
        DatabaseFindOne: (Collection, Query, Callback) => {
            MongoDB.DatabaseFindOne(Collection, Query, _Callback => Callback(_Callback || null));
        },
        DatabaseFind: (Collection, Query, Callback) => {
            MongoDB.DatabaseFind(Collection, Query, _Callback => Callback(_Callback || null));
        },
        DatabaseDeleteOne: (Collection, Query, Callback) => {
            MongoDB.DatabaseDeleteOne(Collection, Query, _Callback => Callback(_Callback || null));
        },
        DatabaseDeleteMany: (Collection, Query, Callback) => {
            MongoDB.DatabaseDeleteMany(Collection, Query, _Callback => Callback(_Callback || null));
        },
        DatabaseUpdateOne: (Collection, Query, Data, Callback) => {
            MongoDB.DatabaseUpdateOne(Collection, Query, Data, _Callback => Callback(_Callback || null));
        },
        DatabaseUpdateMany: (Collection, Query, Data, Callback) => {
            MongoDB.DatabaseUpdateMany(Collection, Query, Data, _Callback => Callback(_Callback || null));
        }
    };
});