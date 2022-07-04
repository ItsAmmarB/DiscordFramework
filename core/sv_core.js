const PrettyMS = require('pretty-ms');
const MomentTimezone = require('moment-timezone');

// Declares the resource path to be used in both server and client
SV_Config.resourceDirectory = GetResourcePath(GetCurrentResourceName());

const Config = require(SV_Config.resourceDirectory + '/core/config');
const Discord = require(SV_Config.resourceDirectory + '/core/discord/index');
const MongoDB = require(SV_Config.resourceDirectory + '/core/mongodb/index');
const Extensions = require(SV_Config.resourceDirectory + '/core/extensions/index');

let IsDiscordReady = false;
let IsMongoDBReady = false;
let IsCoreReady = false;

// ------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------ CORE FUNCTIONS --------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------

const ClientReady = Client => {
    if(Client.toLowerCase() === 'discord') {
        IsDiscordReady = true;
    } else if(Client.toLowerCase() === 'mongodb') {
        IsMongoDBReady = true;
    }
    console.log(Client + ' client is ready!');
    if(IsDiscordReady && IsMongoDBReady) {
        IsCoreReady = true;
        console.log('Core is now ready!');
        emit('DiscordFramework:Core:Ready');
        PlaytimeInterval(); // commented out for development
    }
};

const PlayerConnecting = async (PlayerConnId, Deferrals) => {

    if(!IsCoreReady) { // if core not ready then don't allow connections
        Deferrals.done('[DiscordFramework] Core is not ready yet, please try again in a few minutes!');
    } else {

        // Fetching identifiers
        Deferrals.update('[DiscordFramework] Checking identifiers...');

        const Identifiers = GetPlayerIdentifiers(PlayerConnId);
        const DiscordID = Identifiers.find(identifier => identifier.includes('discord:')).split(':')[1];

        // Check if discord id is present within the identifiers if not then don't allow connection
        await Delay(200);
        if(!DiscordID) return Deferrals.done('[DiscordFramework] Discord ID could be detected!');

        Deferrals.update('[DiscordFramework] Checking community membership...');
        await Delay(300);
        const Member = Discord.GetMember(DiscordID);
        if(!Member) return Deferrals.done('[DiscordFramework] You are not a member of the community!');

        if(Config.whitelist.enabled) {
            Deferrals.update('[DiscordFramework] Checking whitelist...');
            if(!Member.roles.cache.find(role => Config.whitelist.roles.find(role.id))) return Deferrals.done('[DiscordFramework] You are not whitelisted!');
        }

        // Check if the player is banned
        try {
            await CheckBan(DiscordID, Deferrals).then(async IsPlayerBanned => {
                await Delay(200);
                if(!IsPlayerBanned) {
                    Deferrals.done();
                }
            });
        } catch(err) {console.log(err);}

    }
};

const PlayerConnected = (PlayerId) => {

    const Identifiers = GetPlayerIdentifiers(PlayerId);
    const DiscordID = Identifiers.find(identifier => identifier.includes('discord:')).split(':')[1];

    const NetworkPlayerObject = {
        serverId: PlayerId,
        discordId: DiscordID,
        connection: {
            connectedAt: Date.now(),
            disconnectedAt: null,
            disconnectReason: null
        }
    };

    SV_Config.Core.Players.Connected.push(NetworkPlayerObject);
    SV_Config.Core.Players.Session.push(NetworkPlayerObject);

    // Database
    MongoDB.DatabaseFindOne('Players', { 'details.discordId': DiscordID }, async Player => {
        if(Player) {

            // Match current player information with database information
            const Query = {};

            // Update serverId and lastSeenTimestamp
            Query.$set = {
                'details.serverId': PlayerId,
                'details.lastSeenTimestamp': Date.now()
            };

            // Check for new Identifiers and update
            const NewIdentifiers = Identifiers.filter(identifier => !Player.details.identifiers.includes(identifier));
            if(NewIdentifiers.length > 0) {
                if(!Query.$push) Query.$push = {};
                Query.$push['details.identifiers'] = { $each: NewIdentifiers };
            }

            // Check for a new name change and update
            const NewName = GetPlayerName(PlayerId);
            if(NewName !== Player.details.names[Player.details.names.length - 1]) {
                if(!Query.$push) Query.$push = {};
                Query.$push['details.names'] = NewName;
            }

            // Check Location
            if(Player.details.location === 'Unknown') {
                const fetch = require('node-fetch');

                let GeoIP = await fetch('http://ip-api.com/json/51.36.218.78');
                GeoIP = await GeoIP.json();
                if(GeoIP.status.toLowerCase() === 'success') {
                    Query.$set['details.location'] = `${GeoIP.country}, ${GeoIP.regionName}, ${GeoIP.city}`;
                }
            }

            await MongoDB.DatabaseUpdateOne('Players', { 'details.discordId': DiscordID }, Query, err => {
                if (err) new Error(err);
            });

        } else {

            // Database player object
            const NewPlayer = {
                details: {
                    discordId: DiscordID,
                    serverId: PlayerId,
                    playtime: 0,
                    lastSeenTimestamp: Date.now(),
                    identifiers: Identifiers,
                    names: [ GetPlayerName(PlayerId) ],
                    location: null
                },
                administrative: {
                    banned: false,
                    muted: false,
                    jailed: false,
                    passive: false
                },
                infractions: []
            };

            // Get the player's country AKA. GeoIP
            const fetch = require('node-fetch');

            let GeoIP = await fetch('http://ip-api.com/json/24.48.0.1');
            GeoIP = await GeoIP.json();
            if(GeoIP.status.toLowerCase() === 'success') {
                NewPlayer.details.location = `${GeoIP.country}, ${GeoIP.regionName}, ${GeoIP.city}`;
            } else {
                NewPlayer.details.location = 'Unknown';
            }

            await MongoDB.DatabaseInsertOne('Players', NewPlayer);

        }
    });

    setTimeout(() => {
        emit('DiscordFramework:Player:Connected', PlayerId);
    }, 200);
};


const PlayerDisconnected = (PlayerId, Reason) => {

    if(SV_Config.Core.Players.Connected.find(player => player.serverId === PlayerId)) {
        SV_Config.Core.Players.Connected = SV_Config.Core.Players.Connected.filter(player => player.serverId !== PlayerId);
    }
    if(SV_Config.Core.Players.Session.find(player => player.serverId === PlayerId)) {
        SV_Config.Core.Players.Session.find(player => player.serverId === PlayerId).connection.disconnectedAt = Date.now();
        SV_Config.Core.Players.Session.find(player => player.serverId === PlayerId).connection.disconnectReason = Reason;
    }

};

const CheckBan = async (DiscordID, Deferrals) => {
    return await new Promise(resolve => {
        MongoDB.DatabaseFindOne('Players', { 'details.discordId': DiscordID }, async callback => {
            if(callback) {
                Deferrals.update('[DiscordFramework] Checking ban...');
                await Delay(100);

                // Check if banned
                if(callback.administrative.banned) {
                    const BanDetails = callback.infrations.find(infraction => infraction.id === callback.administrative.banned);

                    if((BanDetails.details.timestamp + BanDetails.details.duration) <= Date.now()) {
                        Deferrals.update('[DiscordFramework] Lifting ban...');
                        MongoDB.DatabaseUpdateOne('Players', { 'details.discordId': DiscordID }, {
                            $set: { 'administrative.banned': false }
                        }, err => {
                            if (err) new Error(err);
                        });
                        await Delay(400);
                        Deferrals.update('[DiscordFramework] Ban lifted!');
                        resolve(false);
                    } else {
                        Deferrals.done(`[DiscordFramework] You are ${BanDetails.details.duration > -1 ? 'temporarily' : 'permanently' } banned!
                    -   Ban ID: ${BanDetails.id}
                    -   Reason: ${BanDetails.details.reason}
                    -   Moderator: ${BanDetails.moderator.server.name} | @ ${BanDetails.moderator.discord.name}
                    -   Banned On: ${MomentTimezone(BanDetails.details.timestamp).tz('America/New_York').format('dddd, MMMM D, YYYY @ H:MM A zz')}
                    ${BanDetails.details.duration > -1 ? `-   Expires in: ${PrettyMS(BanDetails.details.duration, { verbose: true })}` : '\u0008' }
                    `);
                        resolve(true);
                    }
                } else {
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        });
    });
};


const PlaytimeInterval = () => setInterval(async () => {
    if(IsCoreReady) {
        for (let i = 0; i < SV_Config.Core.Players.Connected.length; i++) {
            const Player = SV_Config.Core.Players.Connected[i];
            await Delay(250);
            MongoDB.DatabaseUpdateOne('Players', { 'details.discordId': Player.discordId }, {
                $inc: { 'playtime': 1 },
                $set: { 'lastSeenTimestmap': Date.now() }
            }, err => {
                if (err) new Error(err);
            });
        }
    }
}, 60000);

const Delay = async (MS) => await new Promise(resolve => setTimeout(resolve, MS));


// ------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------- CONSOLE -----------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------


const Interval = setInterval(async () => {
    if(IsCoreReady) {
        clearInterval(Interval);

        // This loop makes sure all extensions are registered
        let counter = 0;
        while (SV_Config.Extensions.length !== SV_Config.Extensions.filter(exten => exten.state).length) {
            await Delay(500);
            counter++;
            if(counter === 40) { // A fail-safe to not crash the server
                console.warn('Some extensions failed to load!');
                break;
            }
        }
        console.debug(`Extensions tool ${counter / 2} second(s) to load!`); // just for debuging

        // Construct extension console log
        const ExtensionsLog = Extensions.GetExtensionsCount().total.map(exten => {
            const name = `     ^4${exten.name} ^3| `;
            const state = exten.state === 1 ? `^2${Extensions.TranslateState(exten.state)}` : exten.state === 7 ? `^9${Extensions.TranslateState(exten.state)}` : `^1${Extensions.TranslateState(exten.state)}`;
            const version = exten.version ? ` ^3| ^4${exten.version}` : '';
            const author = exten.author ? ` ^3| ^6By ${exten.author}` : '';

            return name + state + version + author;
        }).sort((a, b) => { return a.state - b.state; }).join('\n');

        // Database information
        const dbInfo = await MongoDB.Client.db(MongoDB.Config.databaseName).stats();
        const dbCollections = dbInfo.collections;
        const dbDocuments = dbInfo.objects;
        const dbSize = dbInfo.dataSize;

        // Console Logs
        console.log('^3|================================[DISCORDFRAMEWORK]================================|^0');
        console.log('^3Discord API Client: ^4' + Discord.Client.user.tag + ' ^6(' + Discord.Client.user.id + ')');
        console.log('^3Discord Guilds: \n' + Discord.Client.guilds.cache.map(guild => `     ^4${guild.id} ^3| ^6${guild.name}`).join('\n'));
        console.log('^3MongoDB Database Name: ^4' + MongoDB.Config.databaseName);
        console.log('^3MongoDB Database Size: ^4' + `\n     Collections: ^6${dbCollections}^4\n     Documents: ^6${dbDocuments}^4\n     Size: ^6${Math.round(((dbSize / 1024) + Number.EPSILON) * 100) / 100} MB ^9(${dbSize} KB)`);
        console.log('^3Extensions: ^4\n' + ExtensionsLog);
        console.log('^3|================================[DISCORDFRAMEWORK]================================|^0');

    }
}, 500);

// ------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------- EVENT -----------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------

// Always check discord client first, if discord client isn't ready then no need to get database client ready... 'Discord'Framework
on('DiscordFramework:Discord:Client:Ready', () => {
    ClientReady('Discord');
});

on('DiscordFramework:MongoDB:Client:Ready', () => {
    ClientReady('MongoDB');
});

on('playerConnecting', (name, setKickReason, deferral) => {
    deferral.defer();
    emit('DiscordFramework:Player:Connecting', global.source, deferral);
    PlayerConnecting(global.source, deferral);
});

onNet('playerConnected', async (PlayerId) => {

    while(!IsCoreReady) {
        await Delay(1000);
    }

    PlayerConnected(PlayerId);
});

on('playerDropped', (Reason) => {
    emit('DiscordFramework:Player:Disconnected', global.source, Reason);
    PlayerDisconnected(global.source, Reason);
});

// ------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------- CORE EXPORTS ---------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------

// exports('Ready', () => IsCoreReady);
// exports('GetPlayerInfo', (PlayerId) => SV_Config.Core.Players.Session.find(p => p.serverId === PlayerId) || null);
// exports('GetConnectedPlayers', () => SV_Config.Core.Players.Connected);

/**
 * apparently server side exports don't work!!
 */