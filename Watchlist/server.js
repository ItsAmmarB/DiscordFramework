/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const AllPlayers = {};

const IdentifiersTypes = {
    'discord': { numbers: true, letters:false, length: 18 },
    'license': { numbers: true, letters:true, length: 40 },
    'steam': { numbers: true, letters:true, length: 15 },
    'xbl': { numbers: true, letters:false, length: 16 },
    'live': { numbers: true, letters:false, length: 15 },
    'fivem': { numbers: true, letters:false, length: 0 }
};

if(Config.Watchlist.command.enabled) {
    RegisterCommand('watchlist', (source, args) => {
        if(args[0]) {
            const Action = args[0].toLowerCase();
            if(Action === 'add') {
                if(Config.Watchlist.command.sections.add.enabled) {
                    exports.DiscordFramework.CheckPermission(source, Config.Watchlist.command.sections.add.roles, hasPermission => { // An export that checks if a player has a specific role
                        if(hasPermission) {
                            if(args[1]) {
                                if(AllPlayers[args[1]]) {
                                    if(args[2]) {
                                        const WatchlistDB = JSON.parse(readFileSync(GetResourcePath(GetCurrentResourceName()) + '/Watchlist/database.json', 'utf-8'));
                                        const Reason = args.find(arg => arg.toLowerCase() === '-tban' || arg.toLowerCase() === '-pban') ? args.slice(2, args.findIndex(arg => arg.toLowerCase() === '-tban' || arg.toLowerCase() === '-pban')).join(' ') : args.slice(2).join(' ');
                                        const Player = AllPlayers[args[1]];
                                        if(!WatchlistDB.find(player => player.identifiers.find(identifier => Player.identifiers.includes(identifier)))) {
                                            const PlayerObject = {
                                                name: Player.name,
                                                reason: Reason,
                                                identifiers: Player.identifiers,
                                                addedBy: GetPlayerName(source)
                                            };
                                            if(args.join(' ').toLowerCase().includes('-pban')) {
                                                PlayerObject.pban = true;
                                            }
                                            else if(args.join(' ').toLowerCase().includes('-tban')) {
                                                PlayerObject.tban = true;
                                                if(args.join(' ').split('-tban')[1]) {
                                                    PlayerObject.tbanTime = args.join(' ').split('-tban')[1];
                                                }
                                                else {
                                                    SendMessageWatchlist(source, Config.Watchlist.command.sections.add.messages['tbanReason']);
                                                }
                                            }
                                            WatchlistDB.push(PlayerObject);
                                            writeFileSync(GetResourcePath(GetCurrentResourceName()) + '/Watchlist/database.json', JSON.stringify(WatchlistDB));
                                            const Message = [];
                                            Message.push(Config.Watchlist.command.sections.add.messages['added'][0]);
                                            Message.push(Config.Watchlist.command.sections.add.messages['added'][1].split('%n').join(Player.name));
                                            SendMessageWatchlist(source, Message);
                                        }
                                        else {
                                            const Message = [];
                                            Message.push(Config.Watchlist.command.sections.add.messages['already'][0]);
                                            Message.push(Config.Watchlist.command.sections.add.messages['already'][1].split('%n').join(Player.name ? Player.name : '?Player?').split('%r').join(WatchlistDB.find(player => player.identifiers.find(identifier => Player.identifiers.includes(identifier))).reason));
                                            SendMessageWatchlist(source, Message);
                                        }
                                    }
                                    else {
                                        SendMessageWatchlist(source, Config.Watchlist.command.sections.add.messages['reason']);
                                    }
                                }
                                else if(IsIdentifierValid(args[1])) {
                                    if(args[2]) {
                                        const WatchlistDB = JSON.parse(readFileSync(GetResourcePath(GetCurrentResourceName()) + '/Watchlist/database.json', 'utf-8'));
                                        const Reason = args.find(arg => arg.toLowerCase() === '-tban' || arg.toLowerCase() === '-pban') ? args.slice(2, args.findIndex(arg => arg.toLowerCase() === '-tban' || arg.toLowerCase() === '-pban')).join(' ') : args.slice(2).join(' ');
                                        const Identifier = args[1];
                                        if(!WatchlistDB.find(player => player.identifiers.includes(Identifier))) {
                                            const PlayerObject = {
                                                reason: Reason,
                                                identifiers: [Identifier],
                                                addedBy: GetPlayerName(source)
                                            };
                                            if(args.join(' ').toLowerCase().includes('-pban')) {
                                                PlayerObject.pban = true;
                                            }
                                            else if(args.join(' ').toLowerCase().includes('-tban')) {
                                                PlayerObject.tban = true;
                                                if(args.join(' ').toLowerCase().split('-tban')[1]) {
                                                    PlayerObject.tbanTime = args.join(' ').toLowerCase().split('-tban')[1];
                                                }
                                                else {
                                                    SendMessageWatchlist(source, Config.Watchlist.command.sections.add.messages['tbanReason']);
                                                }
                                            }
                                            WatchlistDB.push(PlayerObject);
                                            writeFileSync(GetResourcePath(GetCurrentResourceName()) + '/Watchlist/database.json', JSON.stringify(WatchlistDB));
                                            const Message = [];
                                            Message.push(Config.Watchlist.command.sections.add.messages['added'][0]);
                                            Message.push(Config.Watchlist.command.sections.add.messages['added'][1].split('%n').join(Identifier));
                                            SendMessageWatchlist(source, Message);
                                        }
                                        else {
                                            const Message = [];
                                            Message.push(Config.Watchlist.command.sections.add.messages['already'][0]);
                                            Message.push(Config.Watchlist.command.sections.add.messages['already'][1].split('%n').join(Player.name ? Player.name : '?Player?').split('%r').join(WatchlistDB.find(player => player.identifiers.find(identifier => Player.identifiers.includes(identifier))).reason));
                                        }
                                    }
                                    else {
                                        SendMessageWatchlist(source, Config.Watchlist.command.sections.add.messages['reason']);
                                    }
                                }
                                else {
                                    SendMessageWatchlist(source, Config.Watchlist.command.sections.add.messages['invalidIdentifier']);
                                }
                            }
                            else {
                                SendMessageWatchlist(source, Config.Watchlist.command.sections.add.messages['identifier']);
                            }
                        }
                        else{
                            SendMessageWatchlist(source, Config.Watchlist.command.sections.add.messages['noPermission']);
                        }
                    });
                }
                else{
                    SendMessageWatchlist(source, Config.Watchlist.command.sections.add.messages['disabled']);
                }
            }
            else if(Action === 'remove') {
                if(Config.Watchlist.command.sections.remove.enabled) {
                    exports.DiscordFramework.CheckPermission(source, Config.Watchlist.command.sections.remove.roles, hasPermission => { // An export that checks if a player has a specific role
                        if(hasPermission) {
                            if(args[1]) {
                                const Identifier = args[1];
                                if(AllPlayers[args[1]]) {
                                    const WatchlistDB = JSON.parse(readFileSync(GetResourcePath(GetCurrentResourceName()) + '/Watchlist/database.json', 'utf-8'));
                                    const Player = AllPlayers[args[1]];
                                    if(WatchlistDB.find(player => player.identifiers.find(identifier => Player.identifiers.includes(identifier)))) {
                                        const NewWatchlistDB = WatchlistDB.filter(player => !player.identifiers.includes(Identifier));
                                        const name = WatchlistDB.find(player => player.identifiers.find(identifier => Player.identifiers.includes(identifier))).name ? WatchlistDB.find(player => player.identifiers.find(identifier => Player.identifiers.includes(identifier))).name : Player.name;
                                        writeFileSync(GetResourcePath(GetCurrentResourceName()) + '/Watchlist/database.json', JSON.stringify(NewWatchlistDB));
                                        const Message = [];
                                        Message.push(Config.Watchlist.command.sections.remove.messages['removed'][0]);
                                        Message.push(Config.Watchlist.command.sections.remove.messages['removed'][1].split('%n').join(name));
                                        SendMessageWatchlist(source, Message);
                                    }
                                    else {
                                        SendMessageWatchlist(source, Config.Watchlist.command.sections.remove.messages['noMatch']);
                                    }
                                }
                                else if(IsIdentifierValid(Identifier)) {
                                    const WatchlistDB = JSON.parse(readFileSync(GetResourcePath(GetCurrentResourceName()) + '/Watchlist/database.json', 'utf-8'));
                                    if(WatchlistDB.find(player => player.identifiers.includes(Identifier))) {
                                        const NewWatchlistDB = WatchlistDB.filter(player => !player.identifiers.includes(Identifier));
                                        const name = WatchlistDB.find(player => player.identifiers.includes(Identifier)).name ? WatchlistDB.find(player => player.identifiers.includes(Identifier)).name : WatchlistDB.find(player => player.identifiers.includes(Identifier)).identifiers[0];
                                        writeFileSync(GetResourcePath(GetCurrentResourceName()) + '/Watchlist/database.json', JSON.stringify(NewWatchlistDB));
                                        const Message = [];
                                        Message.push(Config.Watchlist.command.sections.remove.messages['removed'][0]);
                                        Message.push(Config.Watchlist.command.sections.remove.messages['removed'][1].split('%n').join(name));
                                        SendMessageWatchlist(source, Message);
                                    }
                                    else {
                                        SendMessageWatchlist(source, Config.Watchlist.command.sections.remove.messages['noMatch']);
                                    }
                                }
                                else {
                                    SendMessageWatchlist(source, Config.Watchlist.command.sections.remove.messages['invalidIdentifier']);
                                }
                            }
                            else {
                                SendMessageWatchlist(source, Config.Watchlist.command.sections.remove.messages['identifier']);
                            }
                        }
                        else{
                            SendMessageWatchlist(source, Config.Watchlist.command.sections.remove.messages['noPermission']);
                        }
                    });
                }
                else {
                    SendMessageWatchlist(source, Config.Watchlist.command.sections.remove.messages['disabled']);
                }
            }
            else if (Action === 'show') {
                if(Config.Watchlist.command.sections.show.enabled) {
                    exports.DiscordFramework.CheckPermission(source, Config.Watchlist.command.sections.show.roles, hasPermission => { // An export that checks if a player has a specific role
                        if(hasPermission) {
                            if(args[1]) {
                                const Identifier = args[1];
                                if(AllPlayers[args[1]]) {
                                    const WatchlistDB = JSON.parse(readFileSync(GetResourcePath(GetCurrentResourceName()) + '/Watchlist/database.json', 'utf-8'));
                                    const Player = AllPlayers[args[1]];
                                    if(WatchlistDB.find(player => player.identifiers.find(identifier => Player.identifiers.includes(identifier)))) {
                                        const Name = WatchlistDB.find(player => player.identifiers.find(identifier => Player.identifiers.includes(identifier))).name ? WatchlistDB.find(player => player.identifiers.find(identifier => Player.identifiers.includes(identifier))).name : Player.name;
                                        const PBan = WatchlistDB.find(player => player.identifiers.find(identifier => Player.identifiers.includes(identifier))).pban ? Config.Watchlist.command.sections.show.messages.options['pban'] : undefined;
                                        const TBan = WatchlistDB.find(player => player.identifiers.find(identifier => Player.identifiers.includes(identifier))).tban ? Config.Watchlist.command.sections.show.messages.options['tban'] + ms(WatchlistDB.find(player => player.identifiers.find(identifier => Player.identifiers.includes(identifier))).tbanTime, { compact: true }) : undefined;
                                        const Reason = WatchlistDB.find(player => player.identifiers.find(identifier => Player.identifiers.includes(identifier))).reason;
                                        const Administrator = WatchlistDB.find(player => player.identifiers.find(identifier => Player.identifiers.includes(identifier))).addedBy;
                                        const Message = [];
                                        Message.push(Config.Watchlist.command.sections.show.messages['found'][0]);
                                        Message.push(Config.Watchlist.command.sections.show.messages['found'][1].split('%n').join(Name).split('%r').join(Reason).split('%o').join(PBan ? PBan : TBan ? TBan : '').split('%a').join(Administrator));
                                        SendMessageWatchlist(source, Message);
                                    }
                                    else {
                                        SendMessageWatchlist(source, Config.Watchlist.command.sections.show.messages['noMatch']);
                                    }
                                }
                                else if(IsIdentifierValid(Identifier)) {
                                    const WatchlistDB = JSON.parse(readFileSync(GetResourcePath(GetCurrentResourceName()) + '/Watchlist/database.json', 'utf-8'));
                                    if(WatchlistDB.find(player => player.identifiers.includes(Identifier))) {
                                        const Player = WatchlistDB.find(player => player.identifiers.includes(Identifier));
                                        const Name = Player.name ? Player.name : 'Unknown';
                                        const PBan = Player.pban ? Config.Watchlist.command.sections.show.messages.options['pban'] : undefined;
                                        const TBan = Player.tban ? Config.Watchlist.command.sections.show.messages.options['tban'] + ms(Player.tbanTime, { compact: true }) : undefined;
                                        const Reason = Player.reason;
                                        const Administrator = Player.addedBy;
                                        const Message = [];
                                        Message.push(Config.Watchlist.command.sections.show.messages['found'][0]);
                                        Message.push(Config.Watchlist.command.sections.show.messages['found'][1].split('%n').join(Name).split('%r').join(Reason).split('%o').join(PBan ? PBan : TBan ? TBan : '').split('%a').join(Administrator));
                                        SendMessageWatchlist(source, Message);
                                    }
                                    else {
                                        SendMessageWatchlist(source, Config.Watchlist.command.sections.show.messages['noMatch']);
                                    }
                                }
                                else {
                                    SendMessageWatchlist(source, Config.Watchlist.command.sections.show.messages['invalidIdentifier']);
                                }
                            }
                            else {
                                SendMessageWatchlist(source, Config.Watchlist.command.sections.show.messages['identifier']);
                            }
                        }
                        else{
                            SendMessageWatchlist(source, Config.Watchlist.command.sections.show.messages['noPermission']);
                        }
                    });
                }
                else {
                    SendMessageWatchlist(source, Config.Watchlist.command.sections.show.messages['disabled']);
                }
            }
            else {
                SendMessageWatchlist(source, Config.Watchlist.command.messages['invalidAction']);
            }
        }
        else {
            SendMessageWatchlist(source, Config.Watchlist.command.messages['usage']);
        }

    });
}

onNet('DiscordFramework:Watchlist:PlayerJoined', (PlayerID, PlayerName) => {
    const Identifiers = [];
    for (let i = 0; i < GetNumPlayerIdentifiers(PlayerID); i++) {
        const identifier = GetPlayerIdentifier(PlayerID, i);
        if(!identifier.includes('ip:')) {
            Identifiers.push(identifier);
        }

    }
    AllPlayers[PlayerID] = {
        name: GetPlayerName(PlayerID),
        id: PlayerID,
        joined: Date.now(),
        left: null,
        identifiers: Identifiers
    };
});

on('playerDropped', (reason) => { // Get trigger once a player leaves, gets kicked or banned
    const PlayerID = global.source;
    AllPlayers[PlayerID].left = Date.now();
});

function checkWatchlist(source) {
    const WatchlistDB = JSON.parse(readFileSync(GetResourcePath(GetCurrentResourceName()) + '/Watchlist/database.json', 'utf-8'));

    for (let i = 0; i < GetNumPlayerIdentifiers(source); i++) {
        const Identifier = GetPlayerIdentifier(source, i);
        if(WatchlistDB.find(player => player.identifiers.includes(Identifier))) {
            const Player = WatchlistDB.find(player => player.identifiers.includes(Identifier));
            if(Player.pban) {
                const BanObject = {
                    name: GetPlayerName(source),
                    timestamp: Date.now(),
                    by: Player.addedBy,
                    reason: Player.reason,
                    identifiers: []
                };
                for (let x = 0; x < GetNumPlayerIdentifiers(source); x++) {
                    const identifier = GetPlayerIdentifier(source, x);
                    if(!identifier.includes('ip:')) {
                        BanObject.identifiers.push(identifier);
                    }
                }
                const BansList = JSON.parse(readFileSync(GetResourcePath(GetCurrentResourceName()) + '/bans/banslist.json', 'utf-8'));
                BansList.push(BanObject);
                writeFileSync(GetResourcePath(GetCurrentResourceName()) + '/bans/banslist.json', JSON.stringify(BansList));
                const NewWatchlistDB = WatchlistDB.filter(player => !player.identifiers.includes(Identifier));
                writeFileSync(GetResourcePath(GetCurrentResourceName()) + '/Watchlist/database.json', JSON.stringify(NewWatchlistDB));
                if(Config.Watchlist.function.logging.pban.enabled) {
                    emit(Config.Watchlist.function.logging.pban.eventName, source, Player.reason); // to the logging system
                }
                return;
            }
            else if(Player.tban) {
                const BanObject = {
                    name: GetPlayerName(source),
                    timestamp: Date.now(),
                    by: Player.addedBy,
                    reason: Player.reason,
                    unbanIn: Date.now() + (Player.tbanTime * 3600000),
                    identifiers: []
                };
                for (let x = 0; x < GetNumPlayerIdentifiers(source); x++) {
                    const identifier = GetPlayerIdentifier(source, x);
                    if(!identifier.includes('ip:')) {
                        BanObject.identifiers.push(identifier);
                    }
                }
                const BansList = JSON.parse(readFileSync(GetResourcePath(GetCurrentResourceName()) + '/bans/tempbanslist.json', 'utf-8'));
                BansList.push(BanObject);
                writeFileSync(GetResourcePath(GetCurrentResourceName()) + '/bans/tempbanslist.json', JSON.stringify(BansList));
                const NewWatchlistDB = WatchlistDB.filter(player => !player.identifiers.includes(Identifier));
                writeFileSync(GetResourcePath(GetCurrentResourceName()) + '/Watchlist/database.json', JSON.stringify(NewWatchlistDB));
                if(Config.Watchlist.function.logging.tban.enabled) {
                    emit(Config.Watchlist.function.logging.tban.eventName, source, Player.tbanTime * 3600000, Player.reason); // to the logging system
                }
                return;
            }
            else {
                const Message = [];
                Message.push(Config.Watchlist.function.messages['joined'][0]);
                Message.push(Config.Watchlist.function.messages['joined'][1].split('%n1').join(GetPlayerName(source)).split('%n2').join(Player.name ? Player.name : 'Unknown').split('%r').join(Player.reason));
                emitNet('DiscordFramework:Watchlist:ToModerators', -1, Message, Config.Watchlist.function.roles);
                return;
            }
        }
    }
}


function IsIdentifierValid(Identifier) {
    if(Identifier.includes(':')) {
        if(IdentifiersTypes[Identifier.split(':')[0]]) {
            if(Identifier.split(':')[1].length === IdentifiersTypes[Identifier.split(':')[0]].length) {
                const IdentifierType = IdentifiersTypes[Identifier.split(':')[0]];
                const IdentifierBody = Identifier.split(':')[1].split('');
                if(!IdentifierType.numbers) {
                    for (let i = 0; i < 10; i++) {
                        if(IdentifierBody.includes(i)) {
                            return false;
                        }
                    }
                }
                else if (!IdentifierType.letters) {
                    const letters = ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'][0].split('');
                    for (let i = 0; i < letters.length; i++) {
                        if(IdentifierBody.includes(letters[i])) {
                            return false;
                        }
                    }
                }
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

function SendMessageWatchlist(player, message) {
    emitNet('chat:addMessage', player, { args: message, multiline: true });
}