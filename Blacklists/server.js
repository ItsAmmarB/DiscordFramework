/* eslint-disable no-undef */
const AllWeapons = require('./Blacklists/database/gtaWeapons');

onNet('DiscordFramework:Blacklist:OnJoin:Retrieve', (player) => {
    try {
        const Database = {
            vehicles: [],
            weapons: []
        };
        Config.Blacklists.vehicles.forEach(Class => {
            const Group = {
                ranks: Class.ranks,
                vehicles: []
            };
            Class.vehicles.forEach(vehicle => {
                const HashKey = GetHashKey(vehicle);
                Group.vehicles.push(HashKey);
            });
            Database.vehicles.push(Group);
        });

        Config.Blacklists.weapons.forEach(Class => {
            const Group = {
                ranks: Class.ranks,
                weapons: []
            };
            Class.weapons.forEach(weapon => {
                const HashKey = GetHashKey(weapon);
                Group.weapons.push(HashKey);
            });
            Database.weapons.push(Group);
        });
        emitNet('DiscordFramework:Blacklist:OnJoin:Retrieve:Return', player, Database, AllWeapons);
    }
    catch (err) {
        console.error(er);
    }
});