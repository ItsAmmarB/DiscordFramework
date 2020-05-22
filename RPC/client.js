/* eslint-disable no-undef */
const DiscordAppId = GetConvar('RichAppId', '607557066151821323');
const DiscordAppAsset = GetConvar('RichAssetId', 'big_logo');

let switchRPC = 0;
let MaxPlayers = null;

let aop = 'San Andreas';

on('onClientMapStart', () => {
    if (MaxPlayers === null) {
        emitNet('DiscordFramework:RPC:MaxPlayers', GetPlayerServerId(GetPlayerIndex(-1)));
    }
});

on('onClientResourceStart', (resourceName) => {
    if (MaxPlayers === null) {
        if (GetCurrentResourceName() === resourceName) {
            emitNet('DiscordFramework:RPC:MaxPlayers', GetPlayerServerId(GetPlayerIndex(-1)));
        }
    }
});

onNet('DiscordFramework:RPC:MaxPlayers:Return', _MaxPlayers => {
    MaxPlayers = _MaxPlayers;
});

onNet('DiscordFramework:RPC:AOP', _aop => aop = _aop);

setInterval(() => {
    switchRPC++;
    if(switchRPC > 2) switchRPC = 0;
}, 5000);


setInterval(() => {
    if(switchRPC === 0) {
        SetDiscordAppId(DiscordAppId);
        SetDiscordRichPresenceAsset(DiscordAppAsset);
        const [x, y, z] = GetEntityCoords(PlayerPedId(), true);
        const StreetA = GetStreetNameFromHashKey(GetStreetNameAtCoord(x, y, z)[0]);
        const StreetB = GetStreetNameFromHashKey(GetStreetNameAtCoord(x, y, z)[1]);
        let location;
        StreetB ? location = StreetA + ' / ' + StreetB : location = StreetA;
        SetDiscordRichPresenceAssetText('discord.gg/jcrp | No website or bullshit; just user-friendly :)');
        if(IsPedOnFoot(PlayerPedId()) && !IsEntityInWater(PlayerPedId())) {
            if (IsPedSprinting(PlayerPedId())) {
                SetRichPresence('Sprinting down ' + location);
            }
            else if (IsPedRunning(PlayerPedId())) {
                SetRichPresence('Running down ' + location);
            }
            else if (IsPedWalking(PlayerPedId())) {
                SetRichPresence('Walking down ' + location);
            }
            else if (IsPedStill(PlayerPedId())) {
                SetRichPresence('Standing on ' + location);
            }
        }
        else if(GetVehiclePedIsUsing(PlayerPedId()) && !IsPedInAnyHeli(PlayerPedId()) && !IsPedInAnyPlane(PlayerPedId()) && !IsPedOnFoot(PlayerPedId()) && !IsPedInAnySub(PlayerPedId()) && !IsPedInAnyBoat(PlayerPedId())) {
            const MPH = GetEntitySpeed(GetVehiclePedIsUsing(PlayerPedId())) * 2.236936;
            if(MPH > 100) {
                SetRichPresence('Haulin\' ass down ' + location);
            }
            else if (MPH > 50) {
                SetRichPresence('Speeding down ' + location);
            }
            else if (MPH <= 50 && MPH > 0) {
                SetRichPresence('Cruising down ' + location);
            }
            else if (MPH == 0) {
                SetRichPresence('Parked on ' + location);
            }
        }
        else if(IsPedInAnyHeli(PlayerPedId()) || IsPedInAnyPlane(PlayerPedId())) {
            if (IsEntityInAir(GetVehiclePedIsUsing(PlayerPedId())) || GetEntityHeightAboveGround(GetVehiclePedIsUsing(PlayerPedId())) > 5.0) {
                SetRichPresence('Flying over ' + location);
            }
            else{
                SetRichPresence('Landed at ' + location);
            }
        }
        else if (IsEntityInWater(PlayerPedId())) {
            const Zones = { OBSERV : 'Galileo Observatory', GALLI : 'Galileo Park', golf : 'GWC and Golfing Society', ['AIRP']: 'Los Santos International Airport', ALAMO : 'Alamo Sea', ALTA : 'Alta', ARMYB : 'Fort Zancudo', BANHAMC : 'Banham Canyon Dr', BANNING : 'Banning', BEACH : 'Vespucci Beach', BHAMCA : 'Banham Canyon', BRADP : 'Braddock Pass', BRADT : 'Braddock Tunnel', BURTON : 'Burton', CALAFB : 'Calafia Bridge', CANNY : 'Raton Canyon', CCREAK : 'Cassidy Creek', CHAMH : 'Chamberlain Hills', CHIL : 'Vinewood Hills', CHU : 'Chumash', CMSW : 'Chiliad Mountain State Wilderness', CYPRE : 'Cypress Flats', DAVIS : 'Davis', DELBE : 'Del Perro Beach', DELPE : 'Del Perro', DELSOL : 'La Puerta', DESRT : 'Grand Senora Desert', DOWNT : 'Downtown', DTVINE : 'Downtown Vinewood', EAST_V : 'East Vinewood', EBURO : 'El Burro Heights', ELGORL : 'El Gordo Lighthouse', ELYSIAN : 'Elysian Island', GALFISH : 'Galilee', GOLF : 'GWC and Golfing Society', GRAPES : 'Grapeseed', GREATC : 'Great Chaparral', HARMO : 'Harmony', HAWICK : 'Hawick', HORS : 'Vinewood Racetrack', HUMLAB : 'Humane Labs and Research', JAIL : 'Bolingbroke Penitentiary', KOREAT : 'Little Seoul', LACT : 'Land Act Reservoir', LAGO : 'Lago Zancudo', LDAM : 'Land Act Dam', LEGSQU : 'Legion Square', LMESA : 'La Mesa', LOSPUER : 'La Puerta', MIRR : 'Mirror Park', MORN : 'Morningwood', MOVIE : 'Richards Majestic', MTCHIL : 'Mount Chiliad', MTGORDO : 'Mount Gordo', MTJOSE : 'Mount Josiah', MURRI : 'Murrieta Heights', NCHU : 'North Chumash', NOOSE : 'N.O.O.S.E', OCEANA : 'Pacific Ocean', PALCOV : 'Paleto Cove', PALETO : 'Paleto Bay', PALFOR : 'Paleto Forest', PALHIGH : 'Palomino Highlands', PALMPOW : 'Palmer-Taylor Power Station', PBLUFF : 'Pacific Bluffs', PBOX : 'Pillbox Hill', PROCOB : 'Procopio Beach', RANCHO : 'Rancho', RGLEN : 'Richman Glen', RICHM : 'Richman', ROCKF : 'Rockford Hills', RTRAK : 'Redwood Lights Track', SANAND : 'San Andreas', SANCHIA : 'San Chianski Mountain Range', SANDY : 'Sandy Shores', SKID : 'Mission Row', SLAB : 'Stab City', STAD : 'Maze Bank Arena', STRAW : 'Strawberry', TATAMO : 'Tataviam Mountains', TERMINA : 'Terminal', TEXTI : 'Textile City', TONGVAH : 'Tongva Hills', TONGVAV : 'Tongva Valley', VCANA : 'Vespucci Canals', VESP : 'Vespucci', VINE : 'Vinewood', WINDF : 'Ron Alternates Wind Farm', WVINE : 'West Vinewood', ZANCUDO : 'Zancudo River', ZP_ORT : 'Port of South Los Santos', ZQ_UAR : 'Davis Quartz' };
            const Area = Zones[GetNameOfZone(x, y, z)];
            if(Area) {
                SetRichPresence('Swimming in ' + Area);
            }
            else {
                SetRichPresence('Swimming around');
            }
        }
        else if(IsPedInAnyBoat(PlayerPedId()) && IsEntityInWater(GetVehiclePedIsUsing(PlayerPedId()))) {
            const Zones = { OBSERV : 'Galileo Observatory', GALLI : 'Galileo Park', golf : 'GWC and Golfing Society', ['AIRP']: 'Los Santos International Airport', ALAMO : 'Alamo Sea', ALTA : 'Alta', ARMYB : 'Fort Zancudo', BANHAMC : 'Banham Canyon Dr', BANNING : 'Banning', BEACH : 'Vespucci Beach', BHAMCA : 'Banham Canyon', BRADP : 'Braddock Pass', BRADT : 'Braddock Tunnel', BURTON : 'Burton', CALAFB : 'Calafia Bridge', CANNY : 'Raton Canyon', CCREAK : 'Cassidy Creek', CHAMH : 'Chamberlain Hills', CHIL : 'Vinewood Hills', CHU : 'Chumash', CMSW : 'Chiliad Mountain State Wilderness', CYPRE : 'Cypress Flats', DAVIS : 'Davis', DELBE : 'Del Perro Beach', DELPE : 'Del Perro', DELSOL : 'La Puerta', DESRT : 'Grand Senora Desert', DOWNT : 'Downtown', DTVINE : 'Downtown Vinewood', EAST_V : 'East Vinewood', EBURO : 'El Burro Heights', ELGORL : 'El Gordo Lighthouse', ELYSIAN : 'Elysian Island', GALFISH : 'Galilee', GOLF : 'GWC and Golfing Society', GRAPES : 'Grapeseed', GREATC : 'Great Chaparral', HARMO : 'Harmony', HAWICK : 'Hawick', HORS : 'Vinewood Racetrack', HUMLAB : 'Humane Labs and Research', JAIL : 'Bolingbroke Penitentiary', KOREAT : 'Little Seoul', LACT : 'Land Act Reservoir', LAGO : 'Lago Zancudo', LDAM : 'Land Act Dam', LEGSQU : 'Legion Square', LMESA : 'La Mesa', LOSPUER : 'La Puerta', MIRR : 'Mirror Park', MORN : 'Morningwood', MOVIE : 'Richards Majestic', MTCHIL : 'Mount Chiliad', MTGORDO : 'Mount Gordo', MTJOSE : 'Mount Josiah', MURRI : 'Murrieta Heights', NCHU : 'North Chumash', NOOSE : 'N.O.O.S.E', OCEANA : 'Pacific Ocean', PALCOV : 'Paleto Cove', PALETO : 'Paleto Bay', PALFOR : 'Paleto Forest', PALHIGH : 'Palomino Highlands', PALMPOW : 'Palmer-Taylor Power Station', PBLUFF : 'Pacific Bluffs', PBOX : 'Pillbox Hill', PROCOB : 'Procopio Beach', RANCHO : 'Rancho', RGLEN : 'Richman Glen', RICHM : 'Richman', ROCKF : 'Rockford Hills', RTRAK : 'Redwood Lights Track', SANAND : 'San Andreas', SANCHIA : 'San Chianski Mountain Range', SANDY : 'Sandy Shores', SKID : 'Mission Row', SLAB : 'Stab City', STAD : 'Maze Bank Arena', STRAW : 'Strawberry', TATAMO : 'Tataviam Mountains', TERMINA : 'Terminal', TEXTI : 'Textile City', TONGVAH : 'Tongva Hills', TONGVAV : 'Tongva Valley', VCANA : 'Vespucci Canals', VESP : 'Vespucci', VINE : 'Vinewood', WINDF : 'Ron Alternates Wind Farm', WVINE : 'West Vinewood', ZANCUDO : 'Zancudo River', ZP_ORT : 'Port of South Los Santos', ZQ_UAR : 'Davis Quartz' };
            const Area = Zones[GetNameOfZone(x, y, z)];
            if(Area) {
                SetRichPresence('Sailing  in ' + Area);
            }
            else {
                SetRichPresence('Sailing  around');
            }
        }
        else if(IsPedInAnySub(PlayerPedId()) && IsEntityInWater(GetVehiclePedIsUsing(PlayerPedId()))) {
            SetRichPresence('In a yellow submarine');
        }
    }
    else if(switchRPC === 1) {
        if(MaxPlayers === null) return switchRPC++;
        const CurrentPlayers = GetActivePlayers().length;
        SetRichPresence(CurrentPlayers + ' / ' + MaxPlayers + ' Players');
    }
    else if(switchRPC === 2) {
        SetRichPresence('AOP: ' + aop);
    }
}, 2000);