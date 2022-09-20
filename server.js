setTimeout(() => {
    require(GetResourcePath(GetCurrentResourceName()) + '/core/index');
}, 500);
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
         * @returns player cached information
         */
        GetPlayer: PlayerId => {
            return Core.Players.get(PlayerId);
        },
        /**
         *
         * @param {string} IP the IP Identifier of the player
         * @returns player's Geo Location
         */
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