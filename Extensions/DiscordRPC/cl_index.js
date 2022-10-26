onNet('DiscordFramework:Extensions:RunClientSide:DiscordRPC', () => {

    console.log('^2[^0Extensions^2:^0DiscordRPC^2]^6: ^3Client script initializing!');

    const DiscordAppId = GetConvar('RichAppId', '1011368700332482571');
    const DiscordAppAsset = GetConvar('RichAssetId', 'logo');

    const Zones = {
        OBSERV: 'Galileo Observatory',
        GALLI: 'Galileo Park',
        golf: 'GWC and Golfing Society',
        AIRP: 'Los Santos International Airport',
        ALAMO: 'Alamo Sea',
        ALTA: 'Alta',
        ARMYB: 'Fort Zancudo',
        BANHAMC: 'Banham Canyon Dr',
        BANNING: 'Banning',
        BEACH: 'Vespucci Beach',
        BHAMCA: 'Banham Canyon',
        BRADP: 'Braddock Pass',
        BRADT: 'Braddock Tunnel',
        BURTON: 'Burton',
        CALAFB: 'Calafia Bridge',
        CANNY: 'Raton Canyon',
        CCREAK: 'Cassidy Creek',
        CHAMH: 'Chamberlain Hills',
        CHIL: 'Vinewood Hills',
        CHU: 'Chumash',
        CMSW: 'Chiliad Mountain State Wilderness',
        CYPRE: 'Cypress Flats',
        DAVIS: 'Davis',
        DELBE: 'Del Perro Beach',
        DELPE: 'Del Perro',
        DELSOL: 'La Puerta',
        DESRT: 'Grand Senora Desert',
        DOWNT: 'Downtown',
        DTVINE: 'Downtown Vinewood',
        EAST_V: 'East Vinewood',
        EBURO: 'El Burro Heights',
        ELGORL: 'El Gordo Lighthouse',
        ELYSIAN: 'Elysian Island',
        GALFISH: 'Galilee',
        GOLF: 'GWC and Golfing Society',
        GRAPES: 'Grapeseed',
        GREATC: 'Great Chaparral',
        HARMO: 'Harmony',
        HAWICK: 'Hawick',
        HORS: 'Vinewood Racetrack',
        HUMLAB: 'Humane Labs and Research',
        JAIL: 'Bolingbroke Penitentiary',
        KOREAT: 'Little Seoul',
        LACT: 'Land Act Reservoir',
        LAGO: 'Lago Zancudo',
        LDAM: 'Land Act Dam',
        LEGSQU: 'Legion Square',
        LMESA: 'La Mesa',
        LOSPUER: 'La Puerta',
        MIRR: 'Mirror Park',
        MORN: 'Morningwood',
        MOVIE: 'Richards Majestic',
        MTCHIL: 'Mount Chiliad',
        MTGORDO: 'Mount Gordo',
        MTJOSE: 'Mount Josiah',
        MURRI: 'Murrieta Heights',
        NCHU: 'North Chumash',
        NOOSE: 'N.O.O.S.E',
        OCEANA: 'Pacific Ocean',
        PALCOV: 'Paleto Cove',
        PALETO: 'Paleto Bay',
        PALFOR: 'Paleto Forest',
        PALHIGH: 'Palomino Highlands',
        PALMPOW: 'Palmer-Taylor Power Station',
        PBLUFF: 'Pacific Bluffs',
        PBOX: 'Pillbox Hill',
        PROCOB: 'Procopio Beach',
        RANCHO: 'Rancho',
        RGLEN: 'Richman Glen',
        RICHM: 'Richman',
        ROCKF: 'Rockford Hills',
        RTRAK: 'Redwood Lights Track',
        SANAND: 'San Andreas',
        SANCHIA: 'San Chianski Mountain Range',
        SANDY: 'Sandy Shores',
        SKID: 'Mission Row',
        SLAB: 'Stab City',
        STAD: 'Maze Bank Arena',
        STRAW: 'Strawberry',
        TATAMO: 'Tataviam Mountains',
        TERMINA: 'Terminal',
        TEXTI: 'Textile City',
        TONGVAH: 'Tongva Hills',
        TONGVAV: 'Tongva Valley',
        VCANA: 'Vespucci Canals',
        VESP: 'Vespucci',
        VINE: 'Vinewood',
        WINDF: 'Ron Alternates Wind Farm',
        WVINE: 'West Vinewood',
        ZANCUDO: 'Zancudo River',
        ZP_ORT: 'Port of South Los Santos',
        ZQ_UAR: 'Davis Quartz'
    };

    let MaxPlayers;

    onNet('DiscordFramework:DiscordRPC:MaxPlayers', maxPlayers => {

        console.log('^2[^0Extensions^2:^0DiscordRPC^2]^6: ^3Client script initialized!');

        MaxPlayers = maxPlayers;

        SetDiscordRichPresenceAction(0, 'Teaser', 'https://www.youtube.com/watch?v=oHg5SJYRHA0');

        let Switch = 0;

        setInterval(() => {
            if (Switch === 0) {
                SetDiscordAppId(DiscordAppId);
                SetDiscordRichPresenceAsset(DiscordAppAsset);

                if (MaxPlayers) {
                    const CurrentPlayers = GetActivePlayers().length;
                    SetDiscordRichPresenceAssetText(`${CurrentPlayers} / ${MaxPlayers} Players`);
                } else {
                    SetDiscordRichPresenceAssetText('Obtaining players...');
                }

                const PedCoords = GetEntityCoords(PlayerPedId());
                const [StreetA, StreetB] = GetStreetNameAtCoord(...PedCoords);
                const Area = Zones[GetNameOfZone(...PedCoords)];
                const location = StreetB ? GetStreetNameFromHashKey(StreetA) + ' / ' + GetStreetNameFromHashKey(StreetB) : GetStreetNameFromHashKey(StreetA);
                if (IsPedOnFoot(PlayerPedId()) && !IsEntityInWater(PlayerPedId())) {
                    if (IsPedSprinting(PlayerPedId())) {
                        SetRichPresence('Sprinting down ' + location);
                    } else if (IsPedRunning(PlayerPedId())) {
                        SetRichPresence('Running down ' + location);
                    } else if (IsPedWalking(PlayerPedId())) {
                        SetRichPresence('Walking down ' + location);
                    } else if (IsPedStill(PlayerPedId())) {
                        SetRichPresence('Standing on ' + location);
                    }
                } else if (GetVehiclePedIsUsing(PlayerPedId()) && !IsPedInAnyHeli(PlayerPedId()) && !IsPedInAnyPlane(PlayerPedId()) && !IsPedOnFoot(PlayerPedId()) && !IsPedInAnySub(PlayerPedId()) && !IsPedInAnyBoat(PlayerPedId())) {
                    const MPH = GetEntitySpeed(GetVehiclePedIsUsing(PlayerPedId())) * 2.236936;
                    if (MPH > 100) {
                        SetRichPresence('Haulin\' ass down ' + location);
                    } else if (MPH > 50) {
                        SetRichPresence('Speeding down ' + location);
                    } else if (MPH <= 50 && MPH > 0) {
                        SetRichPresence('Cruising down ' + location);
                    } else if (MPH == 0) {
                        SetRichPresence('Parked on ' + location);
                    }
                } else if (IsPedInAnyHeli(PlayerPedId()) || IsPedInAnyPlane(PlayerPedId())) {
                    if (IsEntityInAir(GetVehiclePedIsUsing(PlayerPedId())) || GetEntityHeightAboveGround(GetVehiclePedIsUsing(PlayerPedId())) > 5.0) {
                        SetRichPresence('Flying over ' + location);
                    } else {
                        SetRichPresence('Landed at ' + location);
                    }
                } else if (IsEntityInWater(PlayerPedId())) {
                    if (Area) {
                        SetRichPresence('Swimming in ' + Area);
                    } else {
                        SetRichPresence('Swimming around');
                    }
                } else if (IsPedInAnyBoat(PlayerPedId()) && IsEntityInWater(GetVehiclePedIsUsing(PlayerPedId()))) {
                    if (Area) {
                        SetRichPresence('Sailing  in ' + Area);
                    } else {
                        SetRichPresence('Sailing  around');
                    }
                } else if (IsPedInAnySub(PlayerPedId()) && IsEntityInWater(GetVehiclePedIsUsing(PlayerPedId()))) {
                    SetRichPresence('In a yellow submarine');
                }
            } else if (Switch === 1) {
                if (MaxPlayers) {
                    const CurrentPlayers = GetActivePlayers().length;
                    SetRichPresence(CurrentPlayers + ' / ' + MaxPlayers + ' Players');
                }
            } else {
                Switch = -1;
            }
            Switch++;
        }, 4000);
    });
});