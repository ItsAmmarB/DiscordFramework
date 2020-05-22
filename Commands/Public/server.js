/* eslint-disable no-undef */

// ----------------------------------------------------------------------------------------------------
// -----------------------------------[ CODE START FROM UNDER THIS ]-----------------------------------
// ----------------------------------------------------------------------------------------------------

/* DO NOT TOUCH ANYTHING IN THIS FILE UNLESS YOU ARE SURE YOU KNOW WHAT YOU ARE DOING */
/* DO NOT TOUCH ANYTHING IN THIS FILE UNLESS YOU ARE SURE YOU KNOW WHAT YOU ARE DOING */
/* DO NOT TOUCH ANYTHING IN THIS FILE UNLESS YOU ARE SURE YOU KNOW WHAT YOU ARE DOING */
/* DO NOT TOUCH ANYTHING IN THIS FILE UNLESS YOU ARE SURE YOU KNOW WHAT YOU ARE DOING */
/* DO NOT TOUCH ANYTHING IN THIS FILE UNLESS YOU ARE SURE YOU KNOW WHAT YOU ARE DOING */

// ----------------------------------------------------------------------------------------------------
// -----------------------------------[ CODE START FROM UNDER THIS ]-----------------------------------
// ----------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------
// ----------------------------------[ REPORT ]----------------------------------
// ------------------------------------------------------------------------------

if (Config.Commands.public.Report.enabled) {
    RegisterCommand('Report', (source, args) => {
        const Player = parseFloat(args[0]);
        CheckPlayerPublic(source, Player, 'Report', isValid => {
            if (isValid) {
                const Report = args.slice(1).join(' ');
                if (Report) {
                    const CaseNo = randomNumberGenerator();
                    const ReportsDB = JSON.parse(readFileSync(GetResourcePath(GetCurrentResourceName()) + '/Commands/reports.json', 'utf-8'));
                    ReportsDB[CaseNo] = {
                        reportBy: source,
                        reportee: Player,
                        reportId: CaseNo,
                        report: Report,
                        admins: []
                    };
                    writeFileSync(GetResourcePath(GetCurrentResourceName()) + '/Commands/reports.json', JSON.stringify(ReportsDB));
                    const Message = []; // Message collector array
                    Message.push(Config.Commands.public.Report.messages['reported'][0]);
                    Message.push(Config.Commands.public.Report.messages['reported'][1].split('%n').join(GetPlayerName(Player)).split('%r').join(Report));
                    SendMessagePublic(source, Message);
                    const Message2 = []; // Message collector array
                    Message2.push(Config.Commands.public.Report.messages['moderator'][0]);
                    Message2.push(Config.Commands.public.Report.messages['moderator'][1].split('%n1').join(GetPlayerName(source)).split('%n2').join(GetPlayerName(Player)).split('%r').join(Report).split('%i').join(CaseNo));
                    emitNet('DiscordFramework:Commands:Public:Report:ToAllModerators', -1, Message2, Config.Commands.administration.AReport.roles);
                    if (Config.Commands.public.Report.logging.enabled) {
                        emit(Config.Commands.public.Report.logging.eventName, source, Player, CaseNo, Report); // to the logging system
                    }
                }
                else {
                    SendMessagePublic(source, Config.Commands.public.Report.messages['noReport']);
                }
            }
        });
    });
}

// ------------------------------------------------------------------------------
// -----------------------------------[ APM ]------------------------------------
// ------------------------------------------------------------------------------

if (Config.Commands.public.APM.enabled) {
    RegisterCommand('apm', (source, args) => {
        if (args[0]) {
            const PM = args.join(' ');
            const MessageA = [];
            MessageA.push(Config.Commands.public.APM.messages['player'][0]);
            MessageA.push(Config.Commands.public.APM.messages['player'][1].split('%m').join(PM));
            SendMessagePublic(source, MessageA);

            const MessageB = [];
            MessageB.push(Config.Commands.public.APM.messages['sent'][0]);
            MessageB.push(Config.Commands.public.APM.messages['sent'][1].split('%n').join(GetPlayerName(source)).split('%m').join(PM));
            emitNet('DiscordFramework:Commands:Public:APM:ToAllModerators', -1, MessageB, Config.Commands.administration.AdPM.roles);
            if (Config.Commands.public.APM.logging.enabled) {
                emit(Config.Commands.public.APM.logging.eventName, source, PM); // to the logging system
            }
        }
        else {
            SendMessagePublic(source, Config.Commands.public.APM.messages['noPM']);
        }
    });
}

// -------------------------------------------------------------------------------
// ------------------------------------[ OOC ]------------------------------------
// -------------------------------------------------------------------------------

if (Config.Commands.public.OOC.enabled) {
    RegisterCommand('ooc', (source, args) => {
        OOC(source, args);
    });
}

if (Config.Commands.public.OOC.enabled) {
    RegisterCommand('o', (source, args) => {
        OOC(source, args);
    });
}

function OOC(source, args) {
    if (args[0]) {
        exports.DiscordFramework.CheckRoles(source, Object.keys(Config.Chat.roles), RoleId => {
            const RoleName = RoleId ? Config.Chat.roles[RoleId] : '^8^*Civilian^r';
            const Message = [];
            Message.push(Config.Commands.public.OOC.messages['sent'][0]);
            Message.push(Config.Commands.public.OOC.messages['sent'][1].split('%n').join(RoleName + '^0 | ' + GetPlayerName(source)).split('%i').join(source).split('%m').join(args.join(' ')));
            SendMessagePublic(-1, Message);
            if (Config.Commands.public.OOC.logging.enabled) {
                emit(Config.Commands.public.OOC.logging.eventName, source, args.join(' ')); // to the logging system
            }
        });
    }
    else {
        SendMessagePublic(source, Config.Commands.public.OOC.messages['neMessage']);
    }
}

// ------------------------------------------------------------------------------
// ------------------------------------[ ME ]------------------------------------
// ------------------------------------------------------------------------------

if (Config.Commands.public.Me.enabled) {
    RegisterCommand('me', (source, args) => {
        if (args[0]) {
            const Message = [];
            Message.push(Config.Commands.public.Me.messages['sent'][0].split('%n').join(GetPlayerName(source)));
            Message.push(Config.Commands.public.Me.messages['sent'][1].split('%n').join(GetPlayerName(source)).split('%i').join(source).split('%m').join(args.join(' ')));
            emitNet('DiscordFramework:Commands:Public:Me:Send', -1, source, Message, Config.Commands.public.Me.noneGlobalRadius, false);
            if (Config.Commands.public.Me.logging.enabled) {
                emit(Config.Commands.public.Me.logging.eventName, source, args.join(' '), false); // to the logging system
            }
        }
        else {
            SendMessagePublic(source, Config.Commands.public.Me.messages['neMessage']);
        }
    });
}

// ------------------------------------------------------------------------------
// ------------------------------------[ MEG ]-----------------------------------
// ------------------------------------------------------------------------------

if (Config.Commands.public.Me.enabled) {
    RegisterCommand('meg', (source, args) => {
        if (args[0]) {
            const Message = [];
            Message.push(Config.Commands.public.Me.messages['sentGlobal'][0].split('%n').join(GetPlayerName(source)));
            Message.push(Config.Commands.public.Me.messages['sentGlobal'][1].split('%m').join(args.join(' ')));
            emitNet('DiscordFramework:Commands:Public:Me:Send', -1, source, Message, Config.Commands.public.Me.noneGlobalRadius, true);
            if (Config.Commands.public.Me.logging.enabled) {
                emit(Config.Commands.public.Me.logging.eventName, source, args.join(' '), true); // to the logging system
            }
        }
        else {
            SendMessagePublic(source, Config.Commands.public.Me.messages['neMessage']);
        }
    });
}

// ------------------------------------------------------------------------------
// ------------------------------------[ DO ]------------------------------------
// ------------------------------------------------------------------------------

if (Config.Commands.public.Do.enabled) {
    RegisterCommand('do', (source, args) => {
        if (args[0]) {
            const Message = [];
            Message.push(Config.Commands.public.Do.messages['sent'][0].split('%n').join(GetPlayerName(source)));
            Message.push(Config.Commands.public.Do.messages['sent'][1].split('%n').join(GetPlayerName(source)).split('%i').join(source).split('%m').join(args.join(' ')));
            emitNet('DiscordFramework:Commands:Public:Do:Send', -1, source, Message, Config.Commands.public.Do.noneGlobalRadius, false);
            if (Config.Commands.public.Do.logging.enabled) {
                emit(Config.Commands.public.Do.logging.eventName, source, args.join(' '), false); // to the logging system
            }
        }
        else {
            SendMessagePublic(source, Config.Commands.public.Do.messages['neMessage']);
        }
    });
}

// ------------------------------------------------------------------------------
// ------------------------------------[ DOG ]-----------------------------------
// ------------------------------------------------------------------------------

if (Config.Commands.public.Do.enabled) {
    RegisterCommand('dog', (source, args) => {
        if (args[0]) {
            const Message = [];
            Message.push(Config.Commands.public.Do.messages['sentGlobal'][0].split('%n').join(GetPlayerName(source)));
            Message.push(Config.Commands.public.Do.messages['sentGlobal'][1].split('%n').join(GetPlayerName(source)).split('%i').join(source).split('%m').join(args.join(' ')));
            emitNet('DiscordFramework:Commands:Public:Do:Send', -1, source, Message, Config.Commands.public.Do.noneGlobalRadius, true);
            if (Config.Commands.public.Do.logging.enabled) {
                emit(Config.Commands.public.Do.logging.eventName, source, args.join(' '), true); // to the logging system
            }
        }
        else {
            SendMessagePublic(source, Config.Commands.public.Do.messages['neMessage']);
        }
    });
}

// -------------------------------------------------------------------------------
// -------------------------------------[ Ad ]------------------------------------
// -------------------------------------------------------------------------------

if (Config.Commands.public.Ad.enabled) {
    RegisterCommand('ad', (source, args) => {
        if (args[0]) {
            const Message = [];
            Message.push(Config.Commands.public.Ad.messages['sent'][0]);
            Message.push(Config.Commands.public.Ad.messages['sent'][1].split('%n').join(GetPlayerName(source)).split('%i').join(source).split('%m').join(args.join(' ')));
            SendMessagePublic(-1, Message);
            if (Config.Commands.public.Ad.logging.enabled) {
                emit(Config.Commands.public.Ad.logging.eventName, source, args.join(' ')); // to the logging system
            }
        }
        else {
            SendMessagePublic(source, Config.Commands.public.Ad.messages['neMessage']);
        }
    });
}

// -------------------------------------------------------------------------------
// -----------------------------------[ TWEET ]-----------------------------------
// -------------------------------------------------------------------------------

if (Config.Commands.public.Tweet.enabled) {
    RegisterCommand('tweet', (source, args) => {
        if (args[0]) {
            const Message = [];
            Message.push(Config.Commands.public.Tweet.messages['sent'][0]);
            Message.push(Config.Commands.public.Tweet.messages['sent'][1].split('%n').join(GetPlayerName(source)).split('%i').join(source).split('%m').join(args.join(' ')));
            SendMessagePublic(-1, Message);
            if (Config.Commands.public.Tweet.logging.enabled) {
                emit(Config.Commands.public.Tweet.logging.eventName, source, args.join(' '), false); // to the logging system
            }
        }
        else {
            SendMessagePublic(source, Config.Commands.public.Tweet.messages['neMessage']);
        }
    });
}

// -------------------------------------------------------------------------------
// -----------------------------------[ TWEET ]-----------------------------------
// -------------------------------------------------------------------------------

if (Config.Commands.public.Tweet.enabled) {
    RegisterCommand('antweet', (source, args) => {
        if (args[0]) {
            const Message = [];
            Message.push(Config.Commands.public.Tweet.messages['sentAnonymous'][0]);
            Message.push(Config.Commands.public.Tweet.messages['sentAnonymous'][1].split('%m').join(args.join(' ')));
            SendMessagePublic(-1, Message);
            if (Config.Commands.public.Tweet.logging.enabled) {
                emit(Config.Commands.public.Tweet.logging.eventName, source, args.join(' '), true); // to the logging system
            }
        }
        else {
            SendMessagePublic(source, Config.Commands.public.Tweet.messages['neMessage']);
        }
    });
}

// -------------------------------------------------------------------------------
// ------------------------------------[ DW ]------------------------------------
// -------------------------------------------------------------------------------

if (Config.Commands.public.DW.enabled) {
    RegisterCommand('dw', (source, args) => {
        if (args[0]) {
            const Message = [];
            Message.push(Config.Commands.public.DW.messages['sent'][0]);
            Message.push(Config.Commands.public.DW.messages['sent'][1].split('%n').join(GetPlayerName(source)).split('%i').join(source).split('%m').join(args.join(' ')));
            SendMessagePublic(-1, Message);
            if (Config.Commands.public.DW.logging.enabled) {
                emit(Config.Commands.public.DW.logging.eventName, source, args.join(' ')); // to the logging system
            }
        }
        else {
            SendMessagePublic(source, Config.Commands.public.DW.messages['neMessage']);
        }
    });
}

// -------------------------------------------------------------------------------
// ------------------------------------[ PM ]------------------------------------
// -------------------------------------------------------------------------------

if (Config.Commands.public.PM.enabled) {
    RegisterCommand('pm', (source, args) => {
        const Player = parseFloat(args[0]);
        CheckPlayerPublic(source, Player, 'PM', isValid => { // check if the player variable is an actual player
            if (isValid) { // self-explaintory
                if (args[0]) {
                    const MessageA = [];
                    MessageA.push(Config.Commands.public.PM.messages['sent'][0]);
                    MessageA.push(Config.Commands.public.PM.messages['sent'][1].split('%n').join(GetPlayerName(Player)).split('%i').join(Player).split('%m').join(args.slice(1).join(' ')));
                    SendMessagePublic(source, MessageA);

                    const MessageB = [];
                    MessageB.push(Config.Commands.public.PM.messages['received'][0]);
                    MessageB.push(Config.Commands.public.PM.messages['received'][1].split('%n').join(GetPlayerName(source)).split('%i').join(source).split('%m').join(args.slice(1).join(' ')));
                    SendMessagePublic(Player, MessageB);
                    if (Config.Commands.public.PM.logging.enabled) {
                        emit(Config.Commands.public.PM.logging.eventName, source, Player, args.join(' ')); // to the logging system
                    }
                }
                else {
                    SendMessagePublic(source, Config.Commands.public.PM.messages['neMessage']);
                }
            }
        });

    });
}

// -------------------------------------------------------------------------------
// ------------------------------------[ 911 ]------------------------------------
// -------------------------------------------------------------------------------

if (Config.Commands.public['911'].enabled) {
    RegisterCommand('911', (source, args, raw) => {
        if (args[0]) {
            const Message = [];
            Message.push(Config.Commands.public['911'].messages['toOnduty'][0]);
            Message.push(Config.Commands.public['911'].messages['toOnduty'][1].split('%n').join(GetPlayerName(source)).split('%i').join(source).split('%m').join(args.join(' ')));
            emitNet('DiscordFramework:Commands:Public:911', -1, source, Message);
            emit('Sonoran:911', source, args, raw);

            if (Config.Commands.public['911'].logging.enabled) {
                emit(Config.Commands.public['911'].logging.eventName, source, args.join(' '), false); // to the logging system
            }
        }
        else {
            SendMessagePublic(source, Config.Commands.public['911'].messages['neMessage']);
        }
    });
}

// -------------------------------------------------------------------------------
// ------------------------------------[ AN911 ]------------------------------------
// -------------------------------------------------------------------------------

if (Config.Commands.public['911'].enabled) {
    RegisterCommand('an911', (source, args, raw) => {
        if (args[0]) {
            const Message = [];
            Message.push(Config.Commands.public['911'].messages['toOnduty'][0]);
            Message.push(Config.Commands.public['911'].messages['toOnduty'][1].split('%n').join('Anonymous').split('%i').join('Anonymous').split('%m').join(args.join(' ')));
            emitNet('DiscordFramework:Commands:Public:911', -1, source, Message);
            emit('Sonoran:911', source, args, raw);

            if (Config.Commands.public['911'].logging.enabled) {
                emit(Config.Commands.public['911'].logging.eventName, source, args.join(' '), true); // to the logging system
            }
        }
        else {
            SendMessagePublic(source, Config.Commands.public['911'].messages['neMessage']);
        }
    });
}

// -------------------------------------------------------------------------------
// ------------------------------------[ 511 ]------------------------------------
// -------------------------------------------------------------------------------

if (Config.Commands.public['511'].enabled) {
    RegisterCommand('511', (source, args, raw) => {
        if (args[0]) {
            const Message = [];
            Message.push(Config.Commands.public['511'].messages['toOnduty'][0]);
            Message.push(Config.Commands.public['511'].messages['toOnduty'][1].split('%n').join(GetPlayerName(source)).split('%i').join(source).split('%m').join(args.join(' ')));
            emitNet('DiscordFramework:Commands:Public:511', -1, source, Message);
            emit('Sonoran:511', source, args, raw);

            if (Config.Commands.public['511'].logging.enabled) {
                emit(Config.Commands.public['511'].logging.eventName, source, args.join(' '), false); // to the logging system
            }
        }
        else {
            SendMessagePublic(source, Config.Commands.public['511'].messages['neMessage']);
        }
    });
}

// -------------------------------------------------------------------------------
// ------------------------------------[ AN511 ]------------------------------------
// -------------------------------------------------------------------------------

if (Config.Commands.public['511'].enabled) {
    RegisterCommand('an511', (source, args, raw) => {
        if (args[0]) {
            const Message = [];
            Message.push(Config.Commands.public['511'].messages['toOnduty'][0]);
            Message.push(Config.Commands.public['511'].messages['toOnduty'][1].split('%n').join('Anonymous').split('%i').join('Anonymous').split('%m').join(args.join(' ')));
            emitNet('DiscordFramework:Commands:Public:511', -1, source, Message);
            emit('Sonoran:511', source, args, raw);

            if (Config.Commands.public['511'].logging.enabled) {
                emit(Config.Commands.public['511'].logging.eventName, source, args.join(' '), true); // to the logging system
            }
        }
        else {
            SendMessagePublic(source, Config.Commands.public['511'].messages['neMessage']);
        }
    });
}

// -------------------------------------------------------------------------------
// ------------------------------------[ 311 ]------------------------------------
// -------------------------------------------------------------------------------

if (Config.Commands.public['311'].enabled) {
    RegisterCommand('311', (source, args, raw) => {
        if (args[0]) {
            const Message = [];
            Message.push(Config.Commands.public['311'].messages['toOnduty'][0]);
            Message.push(Config.Commands.public['311'].messages['toOnduty'][1].split('%n').join(GetPlayerName(source)).split('%i').join(source).split('%m').join(args.join(' ')));
            emitNet('DiscordFramework:Commands:Public:311', -1, source, Message);
            emit('Sonoran:311', source, args, raw);

            if (Config.Commands.public['311'].logging.enabled) {
                emit(Config.Commands.public['311'].logging.eventName, source, args.join(' '), false); // to the logging system
            }
        }
        else {
            SendMessagePublic(source, Config.Commands.public['311'].messages['neMessage']);
        }
    });
}

// -------------------------------------------------------------------------------
// ------------------------------------[ AN311 ]------------------------------------
// -------------------------------------------------------------------------------

if (Config.Commands.public['311'].enabled) {
    RegisterCommand('an311', (source, args, raw) => {
        if (args[0]) {
            const Message = [];
            Message.push(Config.Commands.public['311'].messages['toOnduty'][0]);
            Message.push(Config.Commands.public['311'].messages['toOnduty'][1].split('%n').join('Anonymous').split('%i').join('Anonymous').split('%m').join(args.join(' ')));
            emitNet('DiscordFramework:Commands:Public:311', -1, source, Message);
            emit('Sonoran:311', source, args, raw);

            if (Config.Commands.public['311'].logging.enabled) {
                emit(Config.Commands.public['311'].logging.eventName, source, args.join(' '), true); // to the logging system
            }
        }
        else {
            SendMessagePublic(source, Config.Commands.public['311'].messages['neMessage']);
        }
    });
}

if (Config.Commands.public['Dispatch'].enabled) {
    RegisterCommand('jd', (source, args) => {
        exports.DiscordFramework.CheckPermission(source, Config.Commands.administration.Kick.roles, hasPermission => { // An export that checks if a player has a specific role
            if(hasPermission) { // self-explaintory
                if (args[0]) {
                    const Message = [];
                    Message.push(Config.Commands.public['Dispatch'].messages['sent'][0]);
                    Message.push(Config.Commands.public['Dispatch'].messages['sent'][1].split('%m').join(args.join(' ')));
                    SendMessagePublic(-1, Message);
                    if (Config.Commands.public['Dispatch'].logging.enabled) {
                        emit(Config.Commands.public['Dispatch'].logging.eventName, source, args.join(' '), true); // to the logging system
                    }
                }
                else {
                    SendMessagePublic(source, Config.Commands.public['Dispatch'].messages['neMessage']);
                }
            }
            else {
                SendMessagePublic(source, Config.Commands.public['Dispatch'].messages['noPermission']);
            }
        });
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

function SendMessagePublic(player, message) {
    emitNet('chat:addMessage', player, { args: message });
}

function randomNumberGenerator() {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function CheckPlayerPublic(source, player, command, callback) {
    if (player) {
        if (!isNaN(player)) {
            if (GetPlayerEndpoint(player)) {
                if (!Config.Commands.actionAgainstSelf.enabled || Config.Commands.actionAgainstSelf.enabled && source !== player) {
                    callback(true);
                }
                else {
                    SendMessagePublic(source, Config.Commands.actionAgainstSelf.message);
                }
            }
            else {
                SendMessagePublic(source, Config.Commands.public[command].messages['notFound']);
            }
        }
        else {
            SendMessagePublic(source, Config.Commands.public[command].messages['idNumber']);
        }
    }
    else {
        SendMessagePublic(source, Config.Commands.public[command].messages['usage']);
    }
}