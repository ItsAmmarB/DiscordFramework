/* eslint-disable no-undef */

// ----------------------------------------------------------------------------------------------------
// -----------------------------------[ CODE START FROM UNDER THIS ]-----------------------------------
// ----------------------------------------------------------------------------------------------------

/* DO NOT TOUCH ANYTHING IN THIS FILE UNLESS YOU ARE SURE YOU KNOW WHAT YOU ARE DOING */
/* DO NOT TOUCH ANYTHING IN THIS FILE UNLESS YOU ARE SURE YOU KNOW WHAT YOU ARE DOING */
/* DO NOT TOUCH ANYTHING IN THIS FILE UNLESS YOU ARE SURE YOU KNOW WHAT YOU ARE DOING */

// ----------------------------------------------------------------------------------------------------
// -----------------------------------[ CODE START FROM UNDER THIS ]-----------------------------------
// ----------------------------------------------------------------------------------------------------

const { writeFileSync, readFileSync } = require('fs');

// ------------------------------------------------------------------------------
// -----------------------------------[ KICK ]-----------------------------------
// ------------------------------------------------------------------------------

if(Config.Commands.administration.Kick.enabled) {
    RegisterCommand('kick', (source, args) => { // Registering a command
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.Kick.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                const Player = parseFloat(args[0]);
                CheckPlayerAdministration(source, Player, 'Kick', isValid => { // check if the player variable is an actual player
                    if(isValid) { // self-explaintory
                        CheckImmunity(source, Player, isImmune => { // checks if the player is immue
                            if(!isImmune) { // self-explaintory
                                const Reason = args.slice(1).join(' ');
                                if(Reason) { // check if Reason variable was decleared
                                    const Message = []; // Message collector array
                                    Message.push(Config.Commands.administration.Kick.messages['kicked'][0]); // Pushes first part of the message into the Message collector
                                    Message.push(Config.Commands.administration.Kick.messages['kicked'][1].split('%n').join(GetPlayerName(Player)).split('%r').join(Reason)); // Pushes second part of the message into the Message collector after editting it
                                    SendMessageAdmin(-1, Message); // Announces the kick message server side, because..; fuck him
                                    if(Config.Commands.administration.Kick.logging.enabled) {
                                        emit(Config.Commands.administration.Kick.logging.eventName, source, Player, Reason); // to the logging system
                                    }
                                    DropPlayer(Player, 'You have been kicked for: ' + Reason); // dropped the player aka. kicks him
                                }
                                else {
                                    SendMessageAdmin(source, Config.Commands.administration.Kick.messages['reason']); // send the player a message
                                }
                            }
                            else {
                                SendMessageAdmin(source, Config.Commands.immunity.message); // send the player a message
                            }
                        });
                    }
                });
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.Kick.messages['noPermission']); // send the player a message
            }
        });
    });
}

// ------------------------------------------------------------------------------
// -----------------------------------[ DROP ]-----------------------------------
// ------------------------------------------------------------------------------

if(Config.Commands.administration.Drop.enabled) {
    RegisterCommand('drop', (source, args) => { // Registering a command
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.Drop.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                const Player = parseFloat(args[0]);
                CheckPlayerAdministration(source, Player, 'Drop', isValid => { // check if the player variable is an actual player
                    if(isValid) { // self-explaintory
                        CheckImmunity(source, Player, isImmune => {
                            if(!isImmune) { // self-explaintory
                                const Message = []; // Message collector array
                                Message.push(Config.Commands.administration.Drop.messages['dropped'][0]); // Pushes first part of the message into the Message collector
                                Message.push(Config.Commands.administration.Drop.messages['dropped'][1].split('%n').join(GetPlayerName(Player))); // Pushes second part of the message into the Message collector after editting it
                                SendMessageAdmin(source, Message);
                                if(Config.Commands.administration.Drop.logging.enabled) {
                                    emit(Config.Commands.administration.Drop.logging.eventName, source, Player); // to the logging system
                                }
                                DropPlayer(Player, 'You have been dropped by staff');// dropped the player silently
                            }
                            else {
                                SendMessageAdmin(source, Config.Commands.immunity.message);
                            }
                        });
                    }
                });
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.Drop.messages['noPermission']); // send the player a message
            }
        });
    });
}

// -----------------------------------------------------------------------------
// -----------------------------------[ BAN ]-----------------------------------
// -----------------------------------------------------------------------------

if(Config.Commands.administration.PBan.enabled) {
    RegisterCommand('pban', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.PBan.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                const Player = parseFloat(args[0]);
                CheckPlayerAdministration(source, Player, 'PBan', isValid => { // check if the player variable is an actual player
                    if(isValid) { // self-explaintory
                        CheckImmunity(source, Player, isImmune => {
                            if(!isImmune) { // self-explaintory
                                const Reason = args.slice(1).join(' ');
                                if(Reason) { // check if Reason variable was decleared
                                    const BanObject = {
                                        name: GetPlayerName(Player),
                                        timestamp: Date.now(),
                                        by: GetPlayerName(source),
                                        reason: Reason,
                                        identifiers: []
                                    };
                                    for (let i = 0; i < GetNumPlayerIdentifiers(Player); i++) {
                                        const Identifier = GetPlayerIdentifier(Player, i);
                                        if(!Identifier.includes('ip:')) {
                                            BanObject.identifiers.push(Identifier);
                                        }
                                    }
                                    const BansList = JSON.parse(readFileSync(GetResourcePath(GetCurrentResourceName()) + '/bans/banslist.json', 'utf-8'));
                                    BansList.push(BanObject);
                                    writeFileSync(GetResourcePath(GetCurrentResourceName()) + '/bans/banslist.json', JSON.stringify(BansList));
                                    const Message = []; // Message collector array
                                    Message.push(Config.Commands.administration.PBan.messages['banned'][0]); // Pushes first part of the message into the Message collector
                                    Message.push(Config.Commands.administration.PBan.messages['banned'][1].split('%n').join(GetPlayerName(Player)).split('%r').join(Reason)); // Pushes second part of the message into the Message collector after editting it
                                    if(Config.Commands.administration.PBan.logging.enabled) {
                                        emit(Config.Commands.administration.PBan.logging.eventName, source, Player, Reason); // to the logging system
                                    }
                                    SendMessageAdmin(-1, Message); // Announces the ban message server side, because..; fuck him
                                    DropPlayer(Player, 'You have been banned for: ' + Reason); // dropped the player aka. kicks him
                                }
                                else {
                                    SendMessageAdmin(source, Config.Commands.administration.PBan.messages['reason']); // send the player a message
                                }
                            }
                            else {
                                SendMessageAdmin(source, Config.Commands.immunity.message); // send the player a message
                            }
                        });
                    }
                });
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.PBan.messages['noPermission']); // send the player a message
            }
        });
    });
}

// ---------------------------------------------------------------------------------
// -----------------------------------[ TMEPBAN ]-----------------------------------
// ---------------------------------------------------------------------------------

if(Config.Commands.administration.TBan.enabled) {
    RegisterCommand('tban', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.TBan.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                const Player = parseFloat(args[0]);
                CheckPlayerAdministration(source, Player, 'TBan', isValid => { // check if the player variable is an actual player
                    if(isValid) { // self-explaintory
                        CheckImmunity(source, Player, isImmune => {
                            if(!isImmune) { // self-explaintory
                                if(args[1]) {
                                    if(!isNaN(args[1])) {
                                        const Time = args[1] * 3600000;
                                        let Reason = args[2];
                                        if(Reason) { // check if Reason variable was decleared
                                            Reason = args.slice(2).join(' ');
                                            const BanObject = {
                                                name: GetPlayerName(Player),
                                                timestamp: Date.now(),
                                                by: GetPlayerName(source),
                                                reason: Reason,
                                                unbanIn: Date.now() + Time,
                                                identifiers: []
                                            };
                                            for (let i = 0; i < GetNumPlayerIdentifiers(Player); i++) {
                                                const Identifier = GetPlayerIdentifier(Player, i);
                                                if(!Identifier.includes('ip:')) {
                                                    BanObject.identifiers.push(Identifier);
                                                }
                                            }
                                            const BansList = JSON.parse(readFileSync(GetResourcePath(GetCurrentResourceName()) + '/bans/tempbanslist.json', 'utf-8'));
                                            BansList.push(BanObject);
                                            writeFileSync(GetResourcePath(GetCurrentResourceName()) + '/bans/tempbanslist.json', JSON.stringify(BansList));
                                            const Message = []; // Message collector array
                                            Message.push(Config.Commands.administration.TBan.messages['banned'][0]); // Pushes first part of the message into the Message collector
                                            Message.push(Config.Commands.administration.TBan.messages['banned'][1].split('%n').join(GetPlayerName(Player)).split('%r').join(Reason).split('%t').join(ms(Time, { verbose: true }))); // Pushes second part of the message into the Message collector after editting it
                                            if(Config.Commands.administration.TBan.logging.enabled) {
                                                emit(Config.Commands.administration.TBan.logging.eventName, source, Player, Time, Reason); // to the logging system
                                            }
                                            SendMessageAdmin(-1, Message); // Announces the ban message server side, because..; fuck him
                                            DropPlayer(Player, 'You have been banned for: ' + Reason); // dropped the player aka. kicks him
                                        }
                                        else {
                                            SendMessageAdmin(source, Config.Commands.administration.TBan.messages['reason']); // send the player a message
                                        }
                                    }
                                    else {
                                        SendMessageAdmin(source, Config.Commands.administration.TBan.messages['timeNumber']); // send the player a message
                                    }
                                }
                                else{
                                    SendMessageAdmin(source, Config.Commands.administration.TBan.messages['time']); // send the player a message
                                }
                            }
                            else {
                                SendMessageAdmin(source, Config.Commands.immunity.message); // send the player a message
                            }
                        });
                    }
                });
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.TBan.messages['noPermission']); // send the player a message
            }
        });
    });
}

// -----------------------------------------------------------------------------
// -----------------------------------[ UNBAN ]-----------------------------------
// -----------------------------------------------------------------------------

if(Config.Commands.administration.Unban.enabled) {
    RegisterCommand('unban', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.Unban.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                const Identifier = args[0];
                if(Identifier) {
                    const BansList = JSON.parse(readFileSync(GetResourcePath(GetCurrentResourceName()) + '/bans/banslist.json', 'utf-8'));
                    const TempBansList = JSON.parse(readFileSync(GetResourcePath(GetCurrentResourceName()) + '/bans/tempbanslist.json', 'utf-8'));
                    if(BansList.find(banee => banee.identifiers.includes(Identifier))) {
                        const Name = BansList.find(banee => banee.identifiers.includes(Identifier)).name;
                        const Message = []; // Message collector array
                        Message.push(Config.Commands.administration.Unban.messages['unbanned'][0]); // Pushes first part of the message into the Message collector
                        Message.push(Config.Commands.administration.Unban.messages['unbanned'][1].split('%n').join(Name)); // Pushes second part of the message into the Message collector after editting it
                        SendMessageAdmin(source, Message);
                        BansList.splice(BansList.findIndex(banee => banee.identifiers.includes(Identifier)), BansList.findIndex(banee => banee.identifiers.includes(Identifier)) + 1);
                        writeFileSync(GetResourcePath(GetCurrentResourceName()) + '/bans/banslist.json', JSON.stringify(BansList));
                        if(Config.Commands.administration.Unban.logging.enabled) {
                            emit(Config.Commands.administration.Unban.logging.eventName, source, Name); // to the logging system
                        }
                    }
                    else if(TempBansList.find(banee => banee.identifiers.includes(Identifier))) {
                        const Name = TempBansList.find(banee => banee.identifiers.includes(Identifier)).name;
                        const Message = []; // Message collector array
                        Message.push(Config.Commands.administration.Unban.messages['unbanned'][0]); // Pushes first part of the message into the Message collector
                        Message.push(Config.Commands.administration.Unban.messages['unbanned'][1].split('%n').join(Name)); // Pushes second part of the message into the Message collector after editting it
                        SendMessageAdmin(source, Message);
                        TempBansList.splice(TempBansList.findIndex(banee => banee.identifiers.includes(Identifier)), TempBansList.findIndex(banee => banee.identifiers.includes(Identifier)) + 1);
                        writeFileSync(GetResourcePath(GetCurrentResourceName()) + '/bans/tempbanslist.json', JSON.stringify(TempBansList));
                        if(Config.Commands.administration.Unban.logging.enabled) {
                            emit(Config.Commands.administration.Unban.logging.eventName, source, Name); // to the logging system
                        }
                    }
                    else {
                        SendMessageAdmin(source, Config.Commands.administration.Unban.messages['noMatch']); // send the player a message
                    }
                }
                else {
                    SendMessageAdmin(source, Config.Commands.administration.Unban.messages['noIdentifier']); // send the player a message
                }
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.Unban.messages['noPermission']); // send the player a message
            }
        });
    });
}

// -------------------------------------------------------------------------------
// -----------------------------------[ CRASH ]-----------------------------------
// -------------------------------------------------------------------------------

if(Config.Commands.administration.Crash.enabled) {
    RegisterCommand('crash', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.Crash.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                const Player = parseFloat(args[0]);
                CheckPlayerAdministration(source, Player, 'Crash', isValid => { // check if the player variable is an actual player
                    if(isValid) { // self-explaintory
                        CheckImmunity(source, Player, isImmune => {
                            if(!isImmune) { // self-explaintory
                                const Message = []; // Message collector array
                                Message.push(Config.Commands.administration.Crash.messages['crashed'][0]); // Pushes first part of the message into the Message collector
                                Message.push(Config.Commands.administration.Crash.messages['crashed'][1].split('%n').join(GetPlayerName(Player))); // Pushes second part of the message into the Message collector after editting it
                                SendMessageAdmin(source, Message);
                                emitNet('DiscordFramework:Commands:Administration:Crash', Player);
                                const Message2 = []; // Message collector array
                                Message2.push(Config.Commands.administration.Crash.messages['announce'][0]); // Pushes first part of the message into the Message collector
                                Message2.push(Config.Commands.administration.Crash.messages['announce'][1].split('%n1').join(GetPlayerName(source)).split('%n2').join(GetPlayerName(Player))); // Pushes second part of the message into the Message collector after editting it
                                emitNet('DiscordFramework:Commands:Administration:Executives:Announce', -1, source, Config.Commands.administration.Crash.announceRoles, Message2);
                                if(Config.Commands.administration.Crash.logging.enabled) {
                                    emit(Config.Commands.administration.Crash.logging.eventName, source, Player); // to the logging system
                                }
                            }
                            else {
                                SendMessageAdmin(source, Config.Commands.immunity.message); // send the player a message
                            }
                        });
                    }
                });
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.Crash.messages['noPermission']); // send the player a message
            }
        });
    });
}

// -------------------------------------------------------------------------------
// -----------------------------------[ Kill ]-----------------------------------
// -------------------------------------------------------------------------------

if(Config.Commands.administration.Kill.enabled) {
    RegisterCommand('kill', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.Kill.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                const Player = parseFloat(args[0]);
                CheckPlayerAdministration(source, Player, 'Kill', isValid => { // check if the player variable is an actual player
                    if(isValid) { // self-explaintory
                        CheckImmunity(source, Player, isImmune => {
                            if(!isImmune) { // self-explaintory
                                const Message = []; // Message collector array
                                Message.push(Config.Commands.administration.Kill.messages['killed'][0]); // Pushes first part of the message into the Message collector
                                Message.push(Config.Commands.administration.Kill.messages['killed'][1].split('%n').join(GetPlayerName(Player))); // Pushes second part of the message into the Message collector after editting it
                                SendMessageAdmin(source, Message); // send the player a message
                                SendMessageAdmin(Player, Config.Commands.administration.Kill.messages['player']);
                                emitNet('DiscordFramework:Commands:Administration:Kill', Player);
                                if(Config.Commands.administration.Kill.logging.enabled) {
                                    emit(Config.Commands.administration.Kill.logging.eventName, source, Player); // to the logging system
                                }
                            }
                            else {
                                SendMessageAdmin(source, Config.Commands.immunity.message); // send the player a message
                            }
                        });
                    }
                });
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.Kill.messages['noPermission']); // send the player a message
            }
        });
    });
}

// --------------------------------------------------------------------------------
// -----------------------------------[ FREEZE ]-----------------------------------
// --------------------------------------------------------------------------------

if(Config.Commands.administration.Freeze.enabled) {
    RegisterCommand('freeze', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.Freeze.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                const Player = parseFloat(args[0]);
                CheckPlayerAdministration(source, Player, 'Freeze', isValid => { // check if the player variable is an actual player
                    if(isValid) { // self-explaintory
                        CheckImmunity(source, Player, isImmune => {
                            if(!isImmune) { // self-explaintory
                                const Message = []; // Message collector array
                                Message.push(Config.Commands.administration.Freeze.messages['frozen'][0]); // Pushes first part of the message into the Message collector
                                Message.push(Config.Commands.administration.Freeze.messages['frozen'][1].split('%n').join(GetPlayerName(Player))); // Pushes second part of the message into the Message collector after editting it
                                SendMessageAdmin(source, Message); // send the player a message
                                SendMessageAdmin(Player, Config.Commands.administration.Freeze.messages['player']);
                                emitNet('DiscordFramework:Commands:Administration:Freeze', Player);
                                if(Config.Commands.administration.Freeze.logging.enabled) {
                                    emit(Config.Commands.administration.Freeze.logging.eventName, source, Player); // to the logging system
                                }
                            }
                            else {
                                SendMessageAdmin(source, Config.Commands.immunity.message); // send the player a message
                            }
                        });
                    }
                });
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.Freeze.messages['noPermission']); // send the player a message
            }
        });
    });
}

// ----------------------------------------------------------------------------------
// -----------------------------------[ UNFREEZE ]-----------------------------------
// ----------------------------------------------------------------------------------

if(Config.Commands.administration.Unfreeze.enabled) {
    RegisterCommand('unfreeze', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.Unfreeze.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                const Player = parseFloat(args[0]);
                CheckPlayerAdministration(source, Player, 'Unfreeze', isValid => { // check if the player variable is an actual player
                    if(isValid) { // self-explaintory
                        CheckImmunity(source, Player, isImmune => {
                            if(!isImmune) { // self-explaintory
                                const Message = []; // Message collector array
                                Message.push(Config.Commands.administration.Unfreeze.messages['unfrozen'][0]); // Pushes first part of the message into the Message collector
                                Message.push(Config.Commands.administration.Unfreeze.messages['unfrozen'][1].split('%n').join(GetPlayerName(Player))); // Pushes second part of the message into the Message collector after editting it
                                SendMessageAdmin(source, Message); // send the player a message
                                SendMessageAdmin(Player, Config.Commands.administration.Unfreeze.messages['player']);
                                emitNet('DiscordFramework:Commands:Administration:Unfreeze', Player);
                                if(Config.Commands.administration.Unfreeze.logging.enabled) {
                                    emit(Config.Commands.administration.Unfreeze.logging.eventName, source, Player); // to the logging system
                                }
                            }
                            else {
                                SendMessageAdmin(source, Config.Commands.immunity.message); // send the player a message
                            }
                        });
                    }
                });
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.Unfreeze.messages['noPermission']); // send the player a message
            }
        });
    });
}

// ------------------------------------------------------------------------------
// -----------------------------------[ SLAP ]-----------------------------------
// ------------------------------------------------------------------------------

if(Config.Commands.administration.Slap.enabled) {
    RegisterCommand('slap', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.Slap.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                const Player = parseFloat(args[0]);
                CheckPlayerAdministration(source, Player, 'Slap', isValid => { // check if the player variable is an actual player
                    if(isValid) { // self-explaintory
                        CheckImmunity(source, Player, isImmune => {
                            if(!isImmune) { // self-explaintory
                                const Message = []; // Message collector array
                                Message.push(Config.Commands.administration.Slap.messages['slapped'][0]); // Pushes first part of the message into the Message collector
                                Message.push(Config.Commands.administration.Slap.messages['slapped'][1].split('%n').join(GetPlayerName(Player))); // Pushes second part of the message into the Message collector after editting it
                                SendMessageAdmin(source, Message); // send the player a message
                                SendMessageAdmin(Player, Config.Commands.administration.Slap.messages['player']);
                                emitNet('DiscordFramework:Commands:Administration:Slap', Player);
                                if(Config.Commands.administration.Slap.logging.enabled) {
                                    emit(Config.Commands.administration.Slap.logging.eventName, source, Player); // to the logging system
                                }
                            }
                            else {
                                SendMessageAdmin(source, Config.Commands.immunity.message); // send the player a message
                            }
                        });
                    }
                });
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.Slap.messages['noPermission']); // send the player a message
            }
        });
    });
}

// ------------------------------------------------------------------------------
// -----------------------------------[ GOTO ]-----------------------------------
// ------------------------------------------------------------------------------

if(Config.Commands.administration.GoTo.enabled) {
    RegisterCommand('goto', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.GoTo.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                const Player = parseFloat(args[0]);
                CheckPlayerAdministration(source, Player, 'GoTo', isValid => { // check if the player variable is an actual player
                    if(isValid) { // self-explaintory
                        emitNet('DiscordFramework:Commands:Administration:GoTo', source, parseFloat(Player));
                        if(args[1] && args[1] === 'a') {
                            SendMessageAdmin(Player, Config.Commands.administration.GoTo.messages['player']); // send the player a message
                        }
                        if(Config.Commands.administration.GoTo.logging.enabled) {
                            emit(Config.Commands.administration.GoTo.logging.eventName, source, Player); // to the logging system
                        }
                    }
                });
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.GoTo.messages['noPermission']); // send the player a message
            }
        });
    });
}

// -------------------------------------------------------------------------------
// -----------------------------------[ BRING ]-----------------------------------
// -------------------------------------------------------------------------------

if(Config.Commands.administration.Bring.enabled) {
    RegisterCommand('bring', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.Bring.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                let Player = args[0];
                if(Player) {
                    if(!isNaN(Player)) {
                        if(GetPlayerEndpoint(Player)) {
                            if(!Config.Commands.administration.actionAgainstSelf || Config.Commands.administration.actionAgainstSelf && source !== Player) {
                                CheckImmunity(source, Player, isImmune => {
                                    if(!isImmune) { // self-explaintory
                                        if(Player !== source) {
                                            emitNet('DiscordFramework:Commands:Administration:Bring', Player, source, false, Config.Commands.administration.Bring.messages['player']);
                                            const Message = []; // Message collector array
                                            Message.push(Config.Commands.administration.Bring.messages['brought'][0]); // Pushes first part of the message into the Message collector
                                            Message.push(Config.Commands.administration.Bring.messages['brought'][1].split('%n').join(GetPlayerName(Player))); // Pushes second part of the message into the Message collector after editting it
                                            SendMessageAdmin(source, Message); // send the player a message
                                            if(Config.Commands.administration.Bring.logging.enabled) {
                                                emit(Config.Commands.administration.Bring.logging.eventName, source, Player); // to the logging system
                                            }
                                        }
                                    }
                                    else{
                                        SendMessageAdmin(source, Config.Commands.immunity.message); // send the player a message
                                    }
                                });
                            }
                            else {
                                SendMessageAdmin(source, Config.Commands.administration.actionAgainstSelf.mesage); // send the player a message
                            }
                        }
                        else {
                            SendMessageAdmin(source, Config.Commands.administration.Bring.messages['notFound']); // send the player a message
                        }
                    }
                    else if(Player.toLowerCase() === 'all') {
                        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.BringAll.roles, _hasPermission => {
                            if(_hasPermission) {
                                Player = -1;
                                emitNet('DiscordFramework:Commands:Administration:Bring', Player, source, true, Config.Commands.administration.Bring.messages['player']);
                                SendMessageAdmin(source, Config.Commands.administration.BringAll.messages['broughtAll']); // send the player a message
                                if(Config.Commands.administration.BringAll.logging.enabled) {
                                    emit(Config.Commands.administration.BringAll.logging.eventName, source, Player); // to the logging system
                                }
                            }
                            else{
                                SendMessageAdmin(source, Config.Commands.administration.Bring.messages['noPermission']); // send the player a message
                            }
                        });
                    }
                    else {
                        SendMessageAdmin(source, Config.Commands.administration.Bring.messages['idNumber']); // send the player a message
                    }
                }
                else{
                    SendMessageAdmin(source, Config.Commands.administration.Bring.messages['usage']); // send the player a message
                }
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.Bring.messages['noPermission']); // send the player a message
            }
        });
    });
}

// ------------------------------------------------------------------------------
// -----------------------------------[ ADV ]-----------------------------------
// ------------------------------------------------------------------------------

if(Config.Commands.administration.ADV.enabled) {
    RegisterCommand('adv', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.ADV.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                const Player = parseFloat(args[0]);
                CheckPlayerAdministration(source, Player, 'ADV', isValid => { // check if the player variable is an actual player
                    if(isValid) { // self-explaintory
                        CheckImmunity(source, Player, isImmune => {
                            if(!isImmune) { // self-explaintory
                                emitNet('DiscordFramework:Commands:Administration:ADV', Player, source);
                            }
                            else {
                                SendMessageAdmin(source, Config.Commands.immunity.message); // send the player a message
                            }
                        });
                    }
                });
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.ADV.messages['noPermission']); // send the player a message
            }
        });
    });

    onNet('DiscordFramework:Commands:Administration:ADV:Return', (Status, source, Player) => {
        if(Status === 'deleted') {
            const Message = []; // Message collector array
            Message.push(Config.Commands.administration.ADV.messages['deleted'][0]); // Pushes first part of the message into the Message collector
            Message.push(Config.Commands.administration.ADV.messages['deleted'][1].split('%n').join(GetPlayerName(Player))); // Pushes second part of the message into the Message collector after editting it
            SendMessageAdmin(source, Message); // send the player a message
            SendMessageAdmin(Player, Config.Commands.administration.ADV.messages['player']);
            if(Config.Commands.administration.ADV.logging.enabled) {
                emit(Config.Commands.administration.ADV.logging.eventName, source, Player); // to the logging system
            }

        }
        else {
            const Message = []; // Message collector array
            Message.push(Config.Commands.administration.ADV.messages['noVehicle'][0]); // Pushes first part of the message into the Message collector
            Message.push(Config.Commands.administration.ADV.messages['noVehicle'][1].split('%n').join(GetPlayerName(Player))); // Pushes second part of the message into the Message collector after editting it
            SendMessageAdmin(source, Message); // send the player a message
        }
    });
}

// ------------------------------------------------------------------------------
// -----------------------------------[ ADPM ]-----------------------------------
// ------------------------------------------------------------------------------

if(Config.Commands.administration.AdPM.enabled) {
    RegisterCommand('adpm', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.AdPM.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                const Player = parseFloat(args[0]);
                CheckPlayerAdministration(source, Player, 'adpm', isValid => { // check if the player variable is an actual player
                    if(isValid) { // self-explaintory
                        CheckImmunity(source, Player, isImmune => {
                            if(!isImmune) { // self-explaintory
                                const PM = args.slice(1);
                                if(PM) {
                                    const MessageA = []; // Message collector array
                                    MessageA.push(Config.Commands.administration.AdPM.messages['player'][0]); // Pushes first part of the message into the Message collector
                                    MessageA.push(Config.Commands.administration.AdPM.messages['player'][1].split('%m').join(PM.join(' '))); // Pushes second part of the message into the Message collector after editting it
                                    SendMessageAdmin(Player, MessageA); // send the player a message
                                    const MessageB = []; // MessageB collector array
                                    MessageB.push(Config.Commands.administration.AdPM.messages['sent'][0]); // Pushes first part of the message into the Message collector
                                    MessageB.push(Config.Commands.administration.AdPM.messages['sent'][1].split('%n').join(GetPlayerName(Player)).split('%m').join(PM.join(' '))); // Pushes second part of the message into the Message collector after editting it
                                    emitNet('DiscordFramework:Commands:Administration:AdPM:ToAllModerators', -1, MessageB, Config.Commands.administration.AdPM.roles);
                                    if(Config.Commands.administration.AdPM.logging.enabled) {
                                        emit(Config.Commands.administration.AdPM.logging.eventName, source, Player, PM.join(' ')); // to the logging system
                                    }
                                }
                                else {
                                    SendMessageAdmin(source, Config.Commands.administration.AdPM.messages['pm']); // send the player a message
                                }
                            }
                            else {
                                SendMessageAdmin(source, Config.Commands.immunity.message); // send the player a message
                            }
                        });
                    }
                });
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.AdPM.messages['noPermission']); // send the player a message
            }
        });
    });
}

// ------------------------------------------------------------------------------
// -----------------------------------[ ADWARN ]---------------------------------
// ------------------------------------------------------------------------------

if(Config.Commands.administration.AdWarn.enabled) {
    RegisterCommand('adwarn', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.AdWarn.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                const Player = parseFloat(args[0]);
                CheckPlayerAdministration(source, Player, Config.Commands.administration.AdWarn, isValid => { // check if the player variable is an actual player
                    if(isValid) { // self-explaintory
                        CheckImmunity(source, Player, isImmune => {
                            if(!isImmune) { // self-explaintory
                                const Warning = args.slice(1);
                                if(Warning) {
                                    const Message = []; // Message collector array
                                    Message.push(Config.Commands.administration.AdWarn.messages['player'][0]); // Pushes first part of the message into the Message collector
                                    Message.push(Config.Commands.administration.AdWarn.messages['player'][1].split('%m').join(Warning.join(' '))); // Pushes second part of the message into the Message collector after editting it
                                    SendMessageAdmin(Player, Message); // send the player a message
                                    const Message2 = []; // Message collector array
                                    Message2.push(Config.Commands.administration.AdWarn.messages['sent'][0]); // Pushes first part of the message into the Message collector
                                    Message2.push(Config.Commands.administration.AdWarn.messages['sent'][1].split('%n').join(GetPlayerName(Player))); // Pushes second part of the message into the Message collector after editting it
                                    SendMessageAdmin(source, Message2); // send the player a message
                                    if(Config.Commands.administration.AdWarn.logging.enabled) {
                                        emit(Config.Commands.administration.AdWarn.logging.eventName, source, Player, Warning); // to the logging system
                                    }
                                }
                                else {
                                    SendMessageAdmin(source, Config.Commands.administration.AdWarn.messages['warning']); // send the player a message
                                }
                            }
                            else {
                                SendMessageAdmin(source, Config.Commands.immunity.message); // send the player a message
                            }
                        });
                    }
                });
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.AdWarn.messages['noPermission']); // send the player a message
            }
        });
    });
}

// ------------------------------------------------------------------------------
// -----------------------------------[ ADANN ]----------------------------------
// ------------------------------------------------------------------------------

if(Config.Commands.administration.AdAnn.enabled) {
    RegisterCommand('adann', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.AdAnn.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                const Announcement = args;
                if(Announcement[0]) {
                    SendMessageAdmin(source, Config.Commands.administration.AdAnn.messages['sent']);
                    const Message = []; // Message collector array
                    Message.push(Config.Commands.administration.AdAnn.messages['announcement'][0]); // Pushes first part of the message into the Message collector
                    Message.push(Config.Commands.administration.AdAnn.messages['announcement'][1].split('%m').join(Announcement.join(' '))); // Pushes second part of the message into the Message collector after editting it
                    SendMessageAdmin(-1, Message); // Announces something server wide
                    emitNet('DiscordFramework:Commands:Administration:SFX', -1, -1, 'FocusOut', 'HintCamSounds', 1);
                    if(Config.Commands.administration.AdAnn.logging.enabled) {
                        emit(Config.Commands.administration.AdAnn.logging.eventName, source, Announcement.join(' ')); // to the logging system
                    }

                }
                else {
                    SendMessageAdmin(source, Config.Commands.administration.AdAnn.messages['message']); // send the player a message
                }
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.AdAnn.messages['noPermission']); // send the player a message
            }
        });
    });
}

// -------------------------------------------------------------------------------
// -----------------------------------[ AJAIL ]-----------------------------------
// -------------------------------------------------------------------------------

if(Config.Commands.administration.AJail.enabled) {
    RegisterCommand('ajail', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.AJail.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                const Player = parseFloat(args[0]);
                CheckPlayerAdministration(source, Player, 'AJail', isValid => { // check if the player variable is an actual player
                    if(isValid) { // self-explaintory
                        CheckImmunity(source, Player, isImmune => {
                            if(!isImmune) { // self-explaintory
                                const Time = args[1];
                                if(Time) {
                                    if(!isNaN(Time)) {
                                        const Message = []; // Message collector array
                                        Message.push(Config.Commands.administration.AJail.messages['jailed'][0]); // Pushes first part of the message into the Message collector
                                        Message.push(Config.Commands.administration.AJail.messages['jailed'][1].split('%n').join(GetPlayerName(Player))); // Pushes second part of the message into the Message collector after editting it
                                        SendMessageAdmin(source, Message); // send the player a message
                                        SendMessageAdmin(Player, Config.Commands.administration.AJail.messages['player']);
                                        const JailCoords = Config.Commands.administration.AJail.settings.jailCoords;
                                        const JailRadius = Config.Commands.administration.AJail.settings.jailRadius;
                                        const JailMessage = Config.Commands.administration.AJail.messages['remaining'];
                                        const ReleaseCoords = Config.Commands.administration.AJail.settings.releaseCoords;
                                        const ReleaseMessage = Config.Commands.administration.AJail.messages['released'];
                                        emitNet('DiscordFramework:Commands:Administration:AJail', Player, JailCoords, JailRadius, Time * 1000, JailMessage, ReleaseCoords, ReleaseMessage);
                                        if(Config.Commands.administration.AJail.logging.enabled) {
                                            emit(Config.Commands.administration.AJail.logging.eventName, source, Player, Time); // to the logging system
                                        }

                                    }
                                    else {
                                        SendMessageAdmin(source, Config.Commands.administration.AJail.messages['idNumber']); // send the player a message
                                    }
                                }
                                else {
                                    SendMessageAdmin(source, Config.Commands.administration.AJail.messages['time']); // send the player a message
                                }
                            }
                            else {
                                SendMessageAdmin(source, Config.Commands.immunity.message); // send the player a message
                            }
                        });
                    }
                });
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.AJail.messages['noPermission']); // send the player a message
            }
        });
    });
}

// ------------------------------------------------------------------------------
// -----------------------------------[ AUNJAIL ]-----------------------------------
// ------------------------------------------------------------------------------

if(Config.Commands.administration.AUnjail.enabled) {
    RegisterCommand('aunjail', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.AUnjail.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                const Player = parseFloat(args[0]);
                CheckPlayerAdministration(source, Player, 'AUnjail', isValid => { // check if the player variable is an actual player
                    if(isValid) { // self-explaintory
                        CheckImmunity(source, Player, isImmune => {
                            if(!isImmune) { // self-explaintory
                                emitNet('DiscordFramework:Commands:Administration:AUnjail', Player, source);

                            }
                            else {
                                SendMessageAdmin(source, Config.Commands.immunity.message); // send the player a message
                            }
                        });
                    }
                });
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.AUnjail.messages['noPermission']); // send the player a message
            }
        });
    });

    onNet('DiscordFramework:Commands:Administration:AUnjail:Return', (Status, source, Player) => {
        if(Status === 'unjailed') {
            const Message = []; // Message collector array
            Message.push(Config.Commands.administration.AUnjail.messages['released'][0]); // Pushes first part of the message into the Message collector
            Message.push(Config.Commands.administration.AUnjail.messages['released'][1].split('%n').join(GetPlayerName(Player))); // Pushes second part of the message into the Message collector after editting it
            SendMessageAdmin(Player, Config.Commands.administration.AUnjail.messages['player']);
            SendMessageAdmin(source, Message); // send the player a message
            if(Config.Commands.administration.AUnjail.logging.enabled) {
                emit(Config.Commands.administration.AUnjail.logging.eventName, source, Player); // to the logging system
            }

        }
        else {
            const Message = []; // Message collector array
            Message.push(Config.Commands.administration.AUnjail.messages['notJailed'][0]); // Pushes first part of the message into the Message collector
            Message.push(Config.Commands.administration.AUnjail.messages['notJailed'][1].split('%n').join(GetPlayerName(Player))); // Pushes second part of the message into the Message collector after editting it
            SendMessageAdmin(source, Message); // send the player a message
        }
    });
}

// -----------------------------------------------------------------------------
// ---------------------------------[ AREPORT ]---------------------------------
// -----------------------------------------------------------------------------

if(Config.Commands.administration.AReport.enabled) {
    RegisterCommand('areport', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.AReport.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                const ReportID = parseFloat(args[0]);
                if(ReportID) {
                    if(!isNaN(ReportID)) {
                        const ReportsDB = JSON.parse(readFileSync(GetResourcePath(GetCurrentResourceName()) + '/Commands/reports.json', 'utf-8'));
                        if(ReportsDB[ReportID]) {
                            const action = args[1];
                            if(action && action.toLowerCase() === 'close') {
                                if(GetPlayerEndpoint(ReportsDB[ReportID].reportBy)) {
                                    SendMessageAdmin(ReportsDB[ReportID].reportBy, Config.Commands.administration.AReport.messages['close']); // send the player a message
                                }
                                const Message = []; // Message collector array
                                Message.push(Config.Commands.administration.AReport.messages['closed'][0]); // Pushes first part of the message into the Message collector
                                Message.push(Config.Commands.administration.AReport.messages['closed'][1].split('%i').join(ReportID)); // Pushes second part of the message into the Message collector after editting it
                                emitNet('DiscordFramework:Commands:Administrator:AReport:ToAllModerators', -1, Message, Config.Commands.administration.AReport.roles);
                                if(Config.Commands.administration.AReport.logging.enabled) {
                                    emit(Config.Commands.administration.AReport.logging.eventNameB, source, ReportsDB[ReportID].reportBy, ReportID); // to the logging system
                                }
                                delete ReportsDB[ReportID]; // Deleted the report object from the database
                                writeFileSync(GetResourcePath(GetCurrentResourceName()) + '/Commands/reports.json', JSON.stringify(ReportsDB));

                            }
                            else if(!action) {
                                if(!ReportsDB[ReportID].admins.includes(source)) {
                                    if(GetPlayerEndpoint(ReportsDB[ReportID].reportBy)) {
                                        const _Message = []; // Message collector array
                                        _Message.push(Config.Commands.administration.AReport.messages['player'][0]); // Pushes first part of the message into the Message collector
                                        _Message.push(Config.Commands.administration.AReport.messages['player'][1].split('%n').join(GetPlayerName(source))); // Pushes second part of the message into the Message collector after editting it
                                        SendMessageAdmin(ReportsDB[ReportID].reportBy, _Message); // send the player a message
                                    }
                                    const Message = []; // Message collector array
                                    Message.push(Config.Commands.administration.AReport.messages['attached'][0]); // Pushes first part of the message into the Message collector
                                    Message.push(Config.Commands.administration.AReport.messages['attached'][1].split('%n').join(GetPlayerName(source)).split('%i').join(ReportID)); // Pushes second part of the message into the Message collector after editting it
                                    emitNet('DiscordFramework:Commands:Administrator:AReport:ToAllModerators', -1, Message, Config.Commands.administration.AReport.roles);
                                    if(Config.Commands.administration.AReport.logging.enabled) {
                                        emit(Config.Commands.administration.AReport.logging.eventNameA, source, ReportsDB[ReportID].reportBy, ReportID); // to the logging system
                                    }
                                    ReportsDB[ReportID].admins.push(source); // added the moderator//administrator to the report object in the database
                                    writeFileSync(GetResourcePath(GetCurrentResourceName()) + '/Commands/reports.json', JSON.stringify(ReportsDB));
                                }
                                else {
                                    SendMessageAdmin(source, Config.Commands.administration.AReport.messages['alreadyAttached']); // send the player a message
                                }
                            }
                            else {
                                const Message = []; // Message collector array
                                Message.push(Config.Commands.administration.AReport.messages['alreadyAttached'][0]); // Pushes first part of the message into the Message collector
                                Message.push(Config.Commands.administration.AReport.messages['alreadyAttached'][1].split('%i').join(ReportID)); // Pushes second part of the message into the Message collector after editting it
                                SendMessageAdmin(source); // send the player a message
                            }
                        }
                        else {
                            SendMessageAdmin(source, Config.Commands.administration.AReport.messages['notFound']); // send the player a message
                        }
                    }
                    else {
                        SendMessageAdmin(source, Config.Commands.administration.AReport.messages['idNumber']); // send the player a message
                    }

                }
                else {
                    SendMessageAdmin(source, Config.Commands.administration.AReport.messages['usage']); // send the player a message
                }
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.AReport.messages['noPermission']); // send the player a message
            }
        });
    });
}

// ------------------------------------------------------------------------------
// ---------------------------------[ AIDENSITY ]--------------------------------
// ------------------------------------------------------------------------------


let CurrentAIDensity = 0.2;
if(Config.Commands.administration.AIDensity.enabled) {
    RegisterCommand('aidensity', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.AIDensity.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                const AIDensity = args[0];
                if(AIDensity) {
                    if(!isNaN(AIDensity) && AIDensity < 1 && AIDensity > 0) {
                        const Message = [];
                        Message.push(Config.Commands.administration.AIDensity.messages['set'][0]);
                        Message.push(Config.Commands.administration.AIDensity.messages['set'][1].split('%v').join(AIDensity));
                        SendMessageAdmin(source, Message);
                        CurrentAIDensity = AIDensity;
                        emitNet('DiscordFramework:Commands:Administrator:AIDensity:Sync', -1, AIDensity);
                        if(Config.Commands.administration.AIDensity.logging.enabled) {
                            emit(Config.Commands.administration.AIDensity.logging.eventName, source, AIDensity); // to the logging system
                        }
                    }
                    else if (AIDensity && AIDensity.toLowerCase() === 'off') {
                        SendMessageAdmin(source, Config.Commands.administration.AIDensity.messages['off']);
                        emitNet('DiscordFramework:Commands:Administrator:AIDensity:Sync', -1, -10);
                    }
                    else {
                        SendMessageAdmin(source, Config.Commands.administration.AIDensity.messages['valueNumber']); // send the player a message
                    }
                }
                else {
                    SendMessageAdmin(source, Config.Commands.administration.AIDensity.messages['noValue']); // send the player a message
                }
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.AIDensity.messages['noPermission']); // send the player a message
            }
        });
    });

    onNet('DiscordFramework:Commands:Administrator:AIDensity:Sync:Request', Player => {
        emitNet('DiscordFramework:Commands:Administrator:AIDensity:Sync', Player, CurrentAIDensity);
    });
}

// ------------------------------------------------------------------------------
// -----------------------------------[ ACMDS ]----------------------------------
// ------------------------------------------------------------------------------


if(Config.Commands.administration.ACMDS.enabled) {
    RegisterCommand('acmds', (source) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.ACMDS.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                for (let i = 0; i < Config.Commands.administration.ACMDS.roles.length; i++) {
                    const Role = Config.Commands.administration.ACMDS.roles[i];
                    exports.DiscordFramework.CheckRoles(source, [Role], hasRole => {
                        if(hasRole) {
                            exports.DiscordFramework.GetRoleName(source, Role, roleName => {
                                Config.Commands.administration.adrev = Config.DeathManager.commands.administration.AdRev;
                                Config.Commands.administration.adres = Config.DeathManager.commands.administration.AdRes;
                                Config.Commands.administration.watchlist = Config.Watchlist.command;
                                emitNet('DiscordFramework:Commands:Administrator:ACMDS', source, Config.Commands.administration, roleName, Role);
                            });
                        }
                    });
                }
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.ACMDS.messages['noPermission']); // send the player a message
            }
        });
    });
}

// ------------------------------------------------------------------------------
// ----------------------------------[ SCREENIE ]--------------------------------
// ------------------------------------------------------------------------------

const screenieCooldown = {};

if(Config.Commands.administration.Screenie.enabled) {
    RegisterCommand('screenie', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.Screenie.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                console.log(screenieCooldown[source] && screenieCooldown[source].time < Date.now() || !Config.Commands.administration.Screenie.cooldown.enabled);
                if(!screenieCooldown[source] || screenieCooldown[source] && screenieCooldown[source].time < Date.now() || !Config.Commands.administration.Screenie.cooldown.enabled) {
                    const Player = parseFloat(args[0]);
                    CheckPlayerAdministration(source, Player, 'Screenie', isValid => { // check if the player variable is an actual player
                        if(isValid) { // self-explaintory
                            CheckImmunity(source, Player, isImmune => {
                                if(!isImmune) { // self-explaintory
                                    const Message = [];
                                    Message.push(Config.Commands.administration.Screenie.messages['shot'][0]);
                                    Message.push(Config.Commands.administration.Screenie.messages['shot'][1].split('%n').join(GetPlayerName(Player)));
                                    SendMessageAdmin(source, Message); // send the player a message
                                    exports.DiscordFramework.GetScreenshot(source, Player);
                                    if(Config.Commands.administration.Screenie.cooldown.enabled) {
                                        screenieCooldown[source] = {
                                            time: Date.now() + (Config.Commands.administration.Screenie.cooldown.time * 1000)
                                        } ;
                                    }
                                }
                                else {
                                    SendMessageAdmin(source, Config.Commands.immunity.message); // send the player a message
                                }
                            });
                        }
                    });
                }
                else {
                    const Message = [];
                    Message.push(Config.Commands.administration.Screenie.messages['cooldown'][0]);
                    Message.push(Config.Commands.administration.Screenie.messages['cooldown'][1].split('%t').join(ms(screenieCooldown[source].time - Date.now(), { verbose: true })));
                    SendMessageAdmin(source, Message); // send the player a message
                }
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration.Screenie.messages['noPermission']); // send the player a message
            }
        });
    });
}

// ------------------------------------------------------------------------------
// ----------------------------------[ CLEARCHAT ]--------------------------------
// ------------------------------------------------------------------------------


if(Config.Commands.administration.ClearChat.enabled) {
    RegisterCommand('clearchat', (source, args) => {
        ClearChat(source, args);
    });


    RegisterCommand('cc', (source, args) => {
        ClearChat(source, args);
    });
}

function ClearChat(source) {
    exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.ClearChat.roles, hasPermission => { // An export that checks if a player has a specific role
        if(hasPermission) { // self-explaintory
            emitNet('chat:clear', -1);
            SendMessageAdmin(-1, Config.Commands.administration.ClearChat.messages['cleared']); // send the player a message
        }
        else{
            SendMessageAdmin(source, Config.Commands.administration.ClearChat.messages['noPermission']); // send the player a message
        }
    });
}

// -----------------------------------------------------------------------------------
// -----------------------------------[ FUNCTIONS ]-----------------------------------
// -----------------------------------------------------------------------------------
// ----------[ DONT EVEN THINK ABOUT TOUCHING THIS YOU WILL BORK EVERYTHING]----------
// ----------[ DONT EVEN THINK ABOUT TOUCHING THIS YOU WILL BORK EVERYTHING]----------
// ----------[ DONT EVEN THINK ABOUT TOUCHING THIS YOU WILL BORK EVERYTHING]----------
// ----------[ DONT EVEN THINK ABOUT TOUCHING THIS YOU WILL BORK EVERYTHING]----------
// ----------[ DONT EVEN THINK ABOUT TOUCHING THIS YOU WILL BORK EVERYTHING]----------
// -----------------------------------------------------------------------------------

function SendMessageAdmin(player, message) {
    emitNet('chat:addMessage', player, { args: message });
}

function CheckImmunity(source, player, callback) {
    if(player === source) {
        callback(false);
    }
    else if(Config.Commands.immunity.enabled) {
        exports.DiscordFramework.CheckRoles(source, Config.Commands.immunity.roles.owner, isOwner => {
            if(isOwner) {
                exports.DiscordFramework.CheckRoles(player, Config.Commands.immunity.roles.owner, isHeOwner => {
                    if(isHeOwner) {
                        callback(true);
                    }
                    else {
                        callback(false);
                    }
                });
            }
            else {
                exports.DiscordFramework.CheckRoles(source, Config.Commands.immunity.roles.leaders, isLeader => {
                    if(isLeader) {
                        exports.DiscordFramework.CheckRoles(player, Config.Commands.immunity.roles.owner, isHeOwner => {
                            if(isHeOwner) {
                                callback(true);
                            }
                            else {
                                exports.DiscordFramework.CheckRoles(player, Config.Commands.immunity.roles.leaders, isHeLeader => {
                                    if(isHeLeader) {
                                        callback(true);
                                    }
                                    else {
                                        callback(false);
                                    }
                                });
                            }
                        });
                    }
                    else {
                        exports.DiscordFramework.CheckRoles(source, Config.Commands.immunity.roles.administrators, isAdmin => {
                            if(isAdmin) {
                                exports.DiscordFramework.CheckRoles(player, Config.Commands.immunity.roles.owner, isHeOwner => {
                                    if(isHeOwner) {
                                        callback(true);
                                    }
                                    else {
                                        exports.DiscordFramework.CheckRoles(player, Config.Commands.immunity.roles.leaders, isHeLeader => {
                                            if(isHeLeader) {
                                                callback(true);
                                            }
                                            else {
                                                exports.DiscordFramework.CheckRoles(player, Config.Commands.immunity.roles.administrators, isHeAdmin => {
                                                    if(isHeAdmin) {
                                                        callback(true);
                                                    }
                                                    else {
                                                        callback(false);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                callback(true);
                            }
                        });
                    }
                });
            }
        });
    }
    else{
        callback(false);
    }
}

function CheckPlayerAdministration(source, player, command, callback) {
    if(player) {
        if(!isNaN(player)) {
            if(GetPlayerEndpoint(player)) {
                if(Config.Commands.actionAgainstSelf.enabled || !Config.Commands.actionAgainstSelf.enabled && source !== player) {
                    callback(true);
                }
                else {
                    SendMessageAdmin(source, Config.Commands.actionAgainstSelf.message);
                }
            }
            else{
                SendMessageAdmin(source, Config.Commands.administration[command].messages['notFound']);
            }
        }
        else{
            SendMessageAdmin(source, Config.Commands.administration[command].messages['idNumber']);
        }
    }
    else{
        SendMessageAdmin(source, Config.Commands.administration[command].messages['usage']);
    }
}

