/* eslint-disable no-undef */
let DiscordID = null;
let UserRoles = null;
let Config = null;

let newDiscordID = null;
let newUserRoles = null;
let newConfig = null;

let changeReady;

let UserRolesRetrieved = false;
let checkingCycles = 0;


const CheckingCycle = setInterval(() => { // This loop detects if the player actually connected and didn't get stuck in between two sesstions
    if (GetPlayerServerId(GetPlayerIndex(-1)) === 0 && checkingCycles > 5) {
        checkingCycles++;
        return ShutdownAndLoadMostRecentSave(); // This will send the player to the shadows realm (start loading the player into story mode)
    }
    else {
        clearInterval(CheckingCycle); // Clears the interval once the player actaully joins the server and spawns
    }
}, 100);

on('onClientResourceStart', (resourceName) => { // Get trigger only once the resource starts on the client side
    if (!UserRolesRetrieved) {
        if (GetCurrentResourceName() === resourceName) {
            emitNet('DiscordFramework:InitializeSession:RetrieveRoles', GetPlayerServerId(GetPlayerIndex(-1))); // An event works as a signal to trigger another event on the server side
            UserRolesRetrieved = true;
        }
    }
});

onNet('DiscordFramework:InitializeSession:RetrieveRoles:Return', (_newDiscordID, _newRoles, _Config) => { // Returns data from server side after initial request of line 17;
    DiscordID = _newDiscordID;
    UserRoles = _newRoles;
    Config = _Config;
});

onNet('DiscordFramework:UpdateSession:RetrieveRoles:Return', (_newDiscordID, _newUserRoles, _newConfig) => { // Returns data from server side after update request at line 61;
    newDiscordID = _newDiscordID;
    newUserRoles = _newUserRoles;
    newConfig = _newConfig;
    changeReady = true;
});

exports('CheckPermission', (Roles) => { // This export is used to get if player had permissions or not, it only return true or Flase;
    if(changeReady) {
        changeReady = false;
        DiscordID = newDiscordID;
        UserRoles = newUserRoles;
        Config = newConfig;
    }
    if(UserRoles && typeof UserRoles === 'object' & UserRoles.length > 0) {
        for (let i = 0; i < Roles.length; i++) {
            /**
                 * The line under this comment checks if DiscordAdmin is True and if so checks if the user has the 'Full' role which represents the 'Administrator' permission in discord;
                 *  or if the player have the owner roles, then it will return false; otherwise it will continue checking all of the roles
                 */
            if (Config.discordAdmin && UserRoles.includes('Full') || UserRoles.includes(Config.ownerRole)) return true;
            if (UserRoles.includes(Roles[i])) {
                return true;
            }
        }
        return false;
    }
});

setInterval(() => { // This acts as a loop or a timer for the session updater event
    if (DiscordID) {
        emitNet('DiscordFramework:UpdateSession:RetrieveRoles', GetPlayerServerId(GetPlayerIndex(-1)), DiscordID); // Updates the client side data every 3000ms
    }
}, 500); // this is the time; default is 3000ms don't change it unless you really want to, any number less that 1000ms may cause lag, d-sync or even connection loss