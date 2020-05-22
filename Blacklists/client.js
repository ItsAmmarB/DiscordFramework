/* eslint-disable no-undef */
let Database = undefined;
let weaponsList = null;
let BlacklistRetrieved = false;

on('onClientMapStart', () => {
    if (!BlacklistRetrieved) {
        emitNet('DiscordFramework:Blacklist:OnJoin:Retrieve', GetPlayerServerId(GetPlayerIndex(-1)));
        BlacklistRetrieved = true;
    }
});

on('onClientResourceStart', (resourceName) => {
    if (!BlacklistRetrieved) {
        if (GetCurrentResourceName() === resourceName) {
            emitNet('DiscordFramework:Blacklist:OnJoin:Retrieve', GetPlayerServerId(GetPlayerIndex(-1)));
            BlacklistRetrieved = true;
        }
    }
});

onNet('DiscordFramework:Blacklist:OnJoin:Retrieve:Return', (database, weaponslist) => {
    Database = database;
    weaponsList = weaponslist;
});

// VEHICLES RESTRICTION SYSTEM
setInterval(() => {
    if (BlacklistRetrieved) {
        if (Database) {
            const Ped = PlayerPedId(-1);
            let vehicle;
            if (IsPedInAnyVehicle(Ped, false)) {
                vehicle = GetVehiclePedIsUsing(Ped);
            }
            else {
                vehicle = GetVehiclePedIsTryingToEnter(Ped);
            }
            if (vehicle && vehicle > 0) {
                if (vehicle && DoesEntityExist(vehicle)) {
                    const VehicleModel = GetEntityModel(vehicle);
                    const Driver = GetPedInVehicleSeat(vehicle, -1);
                    if (Driver === Ped) {
                        if (Database.vehicles.find(Class => Class.vehicles.includes(VehicleModel))) {
                            const Roles = Database.vehicles.find(Class => Class.vehicles.includes(VehicleModel)).ranks;
                            if (!exports.DiscordFramework.CheckPermission(Roles)) {
                                ShowNotification('~r~Restricted Vehicle Model');
                                TaskLeaveVehicle(Ped, vehicle, 0);
                            }
                        }
                    }
                }

            }
        }
    }
}, 1);

// WEAPONS RESTRICTION SYSTEM
setInterval(() => {
    if (BlacklistRetrieved) {
        if (Database && weaponsList) {
            const Ped = PlayerPedId(-1);
            for (let i = 0; i < weaponsList.length; i++) {
                const weapon = GetHashKey(weaponsList[i]);
                if (HasPedGotWeapon(Ped, weapon, false)) {
                    if (Database.weapons.find(Class => Class.weapons.includes(weapon))) {
                        const Roles = Database.weapons.find(Class => Class.weapons.includes(weapon)).ranks;
                        if (!exports.DiscordFramework.CheckPermission(Roles)) {
                            ShowNotification('~r~Restricted Weapon Model');
                            RemoveWeaponFromPed(Ped, weapon);
                        }
                    }
                }
            }
        }
    }
}, 1);


function ShowNotification(message) {
    SetNotificationTextEntry('STRING');
    AddTextComponentString(message);
    DrawNotification(true, false);
}