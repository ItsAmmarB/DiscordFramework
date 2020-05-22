/* eslint-disable no-undef */
const PlayersDiscordIDS = {};

let allowConnect = false;
const ConnectCheck = setInterval(() => {
    const lastResource = GetResourceState(Config.Permissions.lastResource);
    if (lastResource === 'started') {
        allowConnect = true;
        clearInterval(ConnectCheck);
    }
}, 2000);

on('playerConnecting', (name, setKickReason, deferrals) => {
    deferrals.defer();
    const player = global.source;
    let gameIdentifier;
    let discordIndentifier;
    // Checks if all resources are loaded
    if (allowConnect) {
        // Looks for the Player's DiscordID and logs all Player's identifiers for future purposes!
        deferrals.update(Config.Permissions.messages.checkingDiscord.split('%n').join(name)); // Puts Player on hold and send them a NUI message!
        // Loops through all of the Player's identifiers and pushes all of them in an array variable; playerIdentifiers = []
        for (let i = 0; i < GetNumPlayerIdentifiers(player); i++) {
            const identifier = GetPlayerIdentifier(player, i);
            if (identifier.includes('discord:')) { // Checks if the Discord Identifier was one of the player's identifiers
                discordIndentifier = identifier; // Sets (discordIdentifier) variable to the player's DiscordID or discord:<identifier>
            }
            else if (identifier.includes('license:')) { // Checks if the game license Identifier was one of the player's identifiers
                gameIdentifier = identifier; // Sets (gameIdentifier) variable to the player's license ID or license:<identifier>
            }
        }
        emit('DiscordFramework:Logs:Connecting', player, discordIndentifier.split(':')[1]);
        setTimeout(() => {
            deferrals.update(Config.Permissions.messages.checkingBans); // Puts Player on hold and send them a NUI message!
            setTimeout(() => {
                CheckBan(player, deferrals);
            }, 50);
            setTimeout(() => {
                checkWatchlist(player);
            }, 150);
        }, 1000);
        setTimeout(() => {
            if (!discordIndentifier) { // Checks if the Discord Identifier was actually present
                console.debug(name + ' does not have Discord connected!'); // Prints that said player tried joining but they didn't have discord connected
                deferrals.done('DiscordFramework: ' + Config.Permissions.messages.discord); // cancels the player's join process and sorta kicks them for not having discord connected
            }
            else {
                const PlayersIdentifiers = JSON.parse(fs.readFileSync(`${GetResourcePath(GetCurrentResourceName())}/Permissions/Identifiers.database.json`, { encoding: 'utf8' }, err => console.debug(err))); // All player's identifier are here, keep them just in case; you don't know when you're going to need it ;)
                if (!PlayersIdentifiers.find(identifier => identifier.includes(discordIndentifier) && identifier.includes(gameIdentifier))) { // Checks if the player is already logged in the above file but metching both game license and discord id
                    if (PlayersIdentifiers.find(identifier => identifier.includes(discordIndentifier) && !identifier.includes(gameIdentifier))) { // Checks if the player is playing under another game license key; and if so, log both game licenses
                        PlayersIdentifiers.find(identifier => identifier.includes(discordIndentifier)).push(gameIdentifier); // Pushes the new game license key to the player's saved identifier
                        console.debug(name + '\'s game license did not match, both were logged successfully!'); // Prints the said player's ids were logged; in the server console of course, if available
                    }
                    else {
                        PlayersIdentifiers.push([gameIdentifier, discordIndentifier]); // Pushes discord id and game license as a new player;
                        console.debug(name + '\'s identifiers were logged successfully!'); // Prints the said player's ids were logged; in the server console of course, if available
                    }
                    fs.writeFileSync(`${GetResourcePath(GetCurrentResourceName())}/Permissions/Identifiers.database.json`, JSON.stringify(PlayersIdentifiers)); // overwrite current files with the newly edited one
                }
                setTimeout(() => {
                    const DiscordID = discordIndentifier.split(':')[1];
                    requestRoles(DiscordID, function(PlayerRoles) {
                        if(PlayerRoles) {
                            AcePermissionsCheck(DiscordID, PlayerRoles); // Calls (AcePermissionsCheck) function for give said player their needed perms; incase you have a resource that relies on AcePermissions
                            PlayerConnecting(player, name, discordIndentifier.split(':')[1], PlayerRoles, deferrals); // Calls (PlayerConnecting) function in the Queue section of this resource
                        }
                        else {
                            deferrals.done('Error: Texas-Pluto-Roses');
                        }
                    });
                }, 500);
            }
        }, 2000);
    }
    else {
        deferrals.done('DiscordFramework: ' + Config.Permissions.messages.resources); // Cancels the player's join procerss and send them a NUI message
    }
});


onNet('DiscordFramework:InitializeSession:RetrieveRoles', (PlayerID) => { // This only gets trigger once only; which is once they join the server to retrieve the needed data for the first time
    for (let i = 0; i < GetNumPlayerIdentifiers(PlayerID); i++) { // Loops through all of the player's identifiers
        const identifier = GetPlayerIdentifier(PlayerID, i);
        if (identifier.includes('discord:')) {
            const DiscordID = identifier.split(':')[1]; // Sets (DiscordID) constant to the Player's Discord ID
            PlayersDiscordIDS[PlayerID] = DiscordID; // Pushes the player's Discord ID into the (PlayersDiscordIDS) array for future use
            emit('DiscordFramework:Logs:Joined', PlayerID);
            emit('DiscordFramework:Logs:Identifiers', PlayerID);
            requestRoles(DiscordID, function(UserRoles) {
                return emitNet('DiscordFramework:InitializeSession:RetrieveRoles:Return', PlayerID, DiscordID, UserRoles, Config.Permissions); // Returns needed data to the player's client side
            });
        }
    }
});

onNet('DiscordFramework:UpdateSession:RetrieveRoles', (PlayerID, DiscordID) => { // This event gets triggered once every 1500ms to update the all of the players's client sided data
    if (DiscordID && GetPlayerEndpoint(PlayerID)) { // self-explaintory; checks if the player's discord id is present
        requestRoles(DiscordID, function(UserRoles) {
            emitNet('DiscordFramework:UpdateSession:RetrieveRoles:Return', PlayerID, DiscordID, UserRoles, Config.Permissions); // Returns needed data to the player's client side
            return;
        });
    }
});

on('playerDropped', (reason) => { // Get trigger once a player leaves, gets kicked or banned
    emit('DiscordFramework:Logs:Left', PlayerID, reason);
    PlayerDropped(global.source, reason); // Calls the (PlayerDropped) function in the queue system so it updates the queue
    AcePermissionsRemove(global.source); // Calls the (AcePermissionsRemove) function to remove the permission from that player; just so we don't have an overlaping permissions chaos
});

exports('CheckPermission', (PlayerID, Roles, Callback) => {
    if (PlayersDiscordIDS[PlayerID] && Roles && typeof Roles === 'object') { // Checks the Player's Discord Id is cached; or saved, and also checks the presence of the Roles parameter and makes sure the Roles paramter is an Array, Yes Arrays are also Objects.
        requestRoles(PlayersDiscordIDS[PlayerID], function(UserRoles) {
            for (let i = 0; i < Roles.length; i++) {
                /**
                 * The line under this comment checks if DiscordAdmin is True and if so checks if the user has the 'Full' role which represents the 'Administrator' permission in discord;
                 *  or if the player have the owner roles, then it will return false; otherwise it will continue checking all of the roles
                 */
                if (Config.Permissions.discordAdmin && UserRoles.includes('Full') || UserRoles.includes(Config.Permissions.ownerRole)) {
                    return Callback(true);
                }
                else if (UserRoles.includes(Roles[i])) {
                    return Callback(true);
                }
            }
            return Callback(false);
        });
    }
});

exports('CheckRoles', (PlayerID, Roles, Callback) => {
    if (PlayersDiscordIDS[PlayerID] && Roles && typeof Roles === 'object') { // Checks the Player's Discord Id is cached; or saved, and also checks the presence of the Roles parameter and makes sure the Roles paramter is an Array, Yes Arrays are also Objects.
        requestRoles(PlayersDiscordIDS[PlayerID], function(UserRoles) {
            for (let i = 0; i < Roles.length; i++) {
                if (UserRoles && UserRoles.includes(Roles[i])) {
                    return Callback(Roles[i]);
                }
            }
            return Callback(false);
        });
    }
});

exports('GetRoleName', (PlayerID, Role, Callback) => {
    if (PlayersDiscordIDS[PlayerID] && Role) { // Checks the Player's Discord Id is cached; or saved, and also checks the presence of the Role parameter and makes;
        requestRole(Role, function(roleName) {
            return Callback(roleName);
        });
    }
});

exports('IsUserInDiscord', (PlayerID, Callback) => {
    requestRoles(PlayersDiscordIDS[PlayerID] ? PlayersDiscordIDS[PlayerID] : PlayerID, function(UserRoles) {
        if(UserRoles) {
            Callback(true);
        }
        else {
            Callback(false);
        }
    });
});

exports('GetRoles', (PlayerID, Callback) => {
    if (PlayersDiscordIDS[PlayerID]) { // Checks the Player's Discord Id is cached; or saved.
        requestRoles(PlayersDiscordIDS[PlayerID], function(UserRoles) {
            return Callback(UserRoles);
        });
    }
});

exports('GetDiscordID', PlayerID => { // This export only return the player discord id; and nothing else.
    if(PlayersDiscordIDS[PlayerID]) {
        return PlayersDiscordIDS[PlayerID];
    }
    else {
        for (let i = 0; i < GetNumPlayerIdentifiers(PlayerID); i++) {
            const identifier = GetPlayerIdentifier(PlayerID, i);
            if (identifier.includes('discord:')) { // Checks if the Discord Identifier was one of the player's identifiers
                PlayersDiscordIDS[PlayerID] = identifier.split(':')[1]; // Adds the player's discord ID to the discordID variable as a quick accessed database
                return PlayersDiscordIDS[PlayerID];
            }
        }
    }
});

function requestRoles(DiscordID, Callback) { // And this is also a HTTP request function, it returns all of the player's discord roles if he was fetched successfully as a callback function
    /**
     * @param DiscordID must be a String, a valid Discord ID and must also be in the discord server for the bot to get his roles;
     * @param Callback A callback function;
     */
    const options = {
        'hostname': 'localhost',
        'port': '3010',
        'path': '/api/roles',
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'authorization_key': Config.Permissions.authorizationKey,
            'server_id': Config.Permissions.serverId
        }
    };
    const postData = JSON.stringify(
        {
            'user_id': DiscordID
        }
    );
    const req = http.request(options, res => {
        if(res.statusCode !== 200) {
            console.error('API Request status code: ' + res.statusCode);
            Callback(false);
        }
        else {
            res.on('data', data => {
                Callback(JSON.parse(data));
            });
        }
        res.on('error', error => {
            console.error(error);
        });
    });
    req.write(postData);
    req.end();
}

function requestRole(Role, Callback) { // And this is also a HTTP request function, it returns all of the player's discord roles if he was fetched successfully as a callback function
    /**
     * @param Role must be an integer, a valid Role ID;
     * @param Callback A callback function;
     */
    const options = {
        'hostname': 'localhost',
        'port': '3010',
        'path': '/api/role',
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'authorization_key': Config.Permissions.authorizationKey,
            'server_id': Config.Permissions.serverId
        }
    };
    const postData = JSON.stringify(
        {
            'role_id': Role
        }
    );
    const req = http.request(options, res => {
        if(res.statusCode !== 200) {
            console.error('API Request status code: ' + res.statusCode);
            Callback(false);
        }
        else {
            res.on('data', data => {
                Callback(JSON.parse(data)[0]);
            });
        }
        res.on('error', error => {
            console.error(error);
        });
    });
    req.write(postData);
    req.end();
}

function CheckBan(PlayerID, Deferrals) {
    const BansList = JSON.parse(readFileSync(GetResourcePath(GetCurrentResourceName()) + '/bans/banslist.json', 'utf-8'));
    const TempBansList = JSON.parse(readFileSync(GetResourcePath(GetCurrentResourceName()) + '/bans/tempbanslist.json', 'utf-8'));
    for (let i = 0; i < GetNumPlayerIdentifiers(PlayerID); i++) {
        const identifier = GetPlayerIdentifier(PlayerID, i);
        if(BansList.find(banee => banee.identifiers.includes(identifier))) {
            const Reason = BansList.find(banee => banee.identifiers.includes(identifier)).reason;
            Deferrals.done(Config.Permissions.messages.permaBan.split('%r').join(Reason));
        }
        else if(TempBansList.find(banee => banee.identifiers.includes(identifier))) {
            const TimeLeft = TempBansList.find(banee => banee.identifiers.includes(identifier)).unbanIn - Date.now();
            if(TimeLeft > 0) {
                const CalTime = ms(TimeLeft, { verbose: true, secondsDecimalDigits: 0 });
                const Reason = TempBansList.find(banee => banee.identifiers.includes(identifier)).reason;
                Deferrals.done(Config.Permissions.messages.tempBan.split('%d').join(CalTime).split('%r').join(Reason));
            }
            else {
                TempBansList.splice(TempBansList.findIndex(banee => banee.identifiers.includes(identifier)), TempBansList.findIndex(banee => banee.identifiers.includes(identifier)) + 1);
                writeFileSync(GetResourcePath(GetCurrentResourceName()) + '/bans/tempbanslist.json', JSON.stringify(TempBansList));
            }
            return;
        }
    }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------Permissions Ace-------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------

/*
 This part is only related to PermissionsAce; if you don't use it; then just leave the varabile in the config.Permissions to (PermissionsAceEnabled = false);
 IF you do use it, then change the administration and mo
*/
const AdminRoles = {
    '652990958333460522': {
        name: 'junioradmin',
        id: '652990958333460522'
    },
    '652990958102904835': {
        name: 'admin',
        id: '652990958102904835'
    },
    '652990957611909120': {
        name: 'senioradmin',
        id: '652990957611909120'
    },
    '652968963340238858': {
        name: 'executive',
        id: '652968963340238858'
    }
};

/*
Thses two below are AcePermissions functions, I'd say don't even bother touching it; it works flowlessly,
 unless you want to change the identifier to steam; then why in the hell are even looking at this resource!
*/
function AcePermissionsCheck(DiscordID, PlayerRoles) {
    if(!Config.Permissions.AcePermissionsEnabled) {
        for (let i = 0; i < Object.keys(AdminRoles).length; i++) {
            const AdminRole = AdminRoles[Object.keys(AdminRoles)[i]];
            if (PlayerRoles.includes(AdminRole.id)) {
                ExecuteCommand('add_principal identifier.discord:' + DiscordID + ' group.' + AdminRole.name);
                ExecuteCommand('refresh');
                return;
            }
        }
    }
}

function AcePermissionsRemove(PlayerID) {
    if(!Config.Permissions.AcePermissionsEnabled) {
        const DiscordID = PlayersDiscordIDS[PlayerID];
        requestRoles(DiscordID, function(PlayerRoles) {
            for (let i = 0; i < Object.keys(AdminRoles).length; i++) {
                const AdminRole = AdminRoles[Object.keys(AdminRoles)[i]];
                if (PlayerRoles.includes(AdminRole.id)) {
                    ExecuteCommand('remove_principal identifier.discord:' + DiscordID + ' group.' + AdminRole.name);
                    ExecuteCommand('refresh');
                    return;
                }
            }
        });
    }
}