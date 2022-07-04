onNet('DiscordFramework:Extensions:RunClientSide:Blacklist', () => {

    let AllWeapons = [];

    let Weapons = [];
    let Vehicles = [];

    onNet('DiscordFramework:Extensions:Blacklist:Initialize', async Config => {

        console.log('^2[^0Extensions^2:^0Blacklist^2]^6: ^3Received client config!');

        AllWeapons = Config.AllWeapons;

        Weapons = Config.Weapons;
        // Prepare weapons hashkeys
        for (let i = 0; i < Weapons.length; i++) {
            const group = Weapons[i];
            group.list = await group.list.map(weapon => GetHashKey(weapon));
        }

        Vehicles = Config.Vehicles;
        // Prepare vehicles hashkeys
        for (let i = 0; i < Vehicles.length; i++) {
            const group = Vehicles[i];
            group.list = await group.list.map(vehicle => GetHashKey(vehicle));
        }

        BlacklistInterval();

    });

    const ShowNotification = (message) => {
        SetNotificationTextEntry('STRING');
        AddTextComponentString(message);
        DrawNotification(true, false);
    };

    const BlacklistInterval = () => setInterval(() => {

        if(Weapons) {

            const Ped = PlayerPedId(-1);
            for (let i = 0; i < AllWeapons.length; i++) {
                const Weapon = GetHashKey(AllWeapons[i]);

                if (HasPedGotWeapon(Ped, Weapon, false)) {

                    const IsWeaponBlacklisted = Weapons.find(group => group.list.includes(Weapon));
                    if (IsWeaponBlacklisted) {

                        const Permissions = IsWeaponBlacklisted.permissions;
                        if (!exports.DiscordFramework['Permissions.CheckPermission'](Permissions)) {

                            ShowNotification('~r~Restricted Weapon Model');
                            RemoveWeaponFromPed(Ped, Weapon);

                        }


                    }

                }

            }

        }

        if(Vehicles) {

            const Ped = PlayerPedId(-1);
            const Vehicle = IsPedInAnyVehicle(Ped, false) ? GetVehiclePedIsUsing(Ped) : GetVehiclePedIsTryingToEnter(Ped);
            if (Vehicle && DoesEntityExist(Vehicle)) {

                const VehicleModel = GetEntityModel(Vehicle);
                const Driver = GetPedInVehicleSeat(Vehicle, -1);
                if (Driver === Ped) {

                    const IsVehicleBlacklisted = Vehicles.find(group => group.list.includes(VehicleModel));
                    if (IsVehicleBlacklisted) {

                        const Permissions = IsVehicleBlacklisted.permissions;
                        if (!exports.DiscordFramework['Permissions.CheckPermission'](Permissions)) {

                            ShowNotification('~r~Restricted Weapon Model');
                            TaskLeaveVehicle(Ped, Vehicle, 0);

                        }


                    }

                }

            }
        }

    }, 200);

});

/**
 * MAKE SURE TO CHANGE THE "Template" IN THE EVENT TO THE EXTENSION NAME ELSE IT WILL NEVER BE TRIGGERED BY DEFAULT.
 *
 * The "Extension" parameter is the name of the extension, in which can be used if you have a client side config
 * by using this line below as an example
 *
 *          const Config = CL_Config.Extensions.find(extension => extension.name === Extension).config;
 *
 * This is a client side file and can only be used for client sided functions/natives
 * refer to https://docs.fivem.net/natives/ to see 'Client' functions/natives
 *
 * this file can be removed if not needed, it was created to let people know that it can be used
 */