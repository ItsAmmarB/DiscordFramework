// const Status = 0; // 0 = Offline/Not Ready, 1 = Online/Ready

require('../version')(async Result => {

    if(Result.checked) {
        if(!Result.upToDate) {
            console.log(`^3[DiscordFramework] A newer version '${Result.remote}' was released! currently running ${Result.local}^0`);
        }
        else {
            console.log(`^2[DiscordFramework] Running the latest version! ${Result.local}^0`);

        };
    }
    else {
        console.error('^1[DiscordFramework] An error occured while checking version! skipping version checking...^0');
    }

    let discordStatus = 0;
    let discordPrintable = '';
    on('DiscordFramework:Core:Discord:Ready', () => {
        discordStatus = 1;
        debug('Discord client Ready!');

        discordPrintable =
                '\n^9Discord' +
                `\n         ^3Client Details: ^4${Discord.client.user.tag + ' ^6(' + Discord.client.user.id + ')'}` +
                `\n         ^3Client Invite: ^4${Discord.client.generateInvite({ scopes: ['bot'] })}` +
                `\n         ^3Discord Users: ^4${Discord.client.users.cache.size + (Discord.client.users.cache.size === 1 ? ' User' : ' Users')}` +
                `\n         ^3Discord Guilds: \n${Discord.client.guilds.cache.map(guild => `                ^3- ^4${guild.name} ^6(${guild.id})`).join('\n')}` +
                '^0';
    });
    const Discord = require('./lib/discord/index');



    let mongoStatus = 0;
    let mongoPrintable = '';
    on('DiscordFramework:Core:MongoDB:Ready', async () => {
        mongoStatus = 1;
        debug('MongoDB client ready!');

        const dbInfo = await MongoDB.client.db(Config.core.mongo.databaseName).stats();
        mongoPrintable =
                '\n^9MongoDB' +
                `\n         ^3Datebase Name: ^4${Config.core.mongo.databaseName}` +
                `\n         ^3MongoDB Collections: ^4${dbInfo.collections}` +
                `\n         ^3MongoDB Documents: ^4${dbInfo.objects}` +
                `\n         ^3MongoDB Size: ^4${Math.round(((dbInfo.dataSize / 1024) + Number.EPSILON) * 100) / 100} MB ^6(${dbInfo.dataSize} KB)` +
                '^0';
    });
    const MongoDB = require('./lib/mongodb/index');


    let extensionsStatus = 0;
    let extensionsPrintable = '';
    on('DiscordFramework:Core:Extensions:Ready', async () => {
        extensionsStatus = 1;
        debug('Exections module ready!');

        const dbInfo = await MongoDB.client.db(Config.core.mongo.databaseName).stats();
        extensionsPrintable =
                '\n^9MongoDB' +
                `\n         ^3Datebase Name: ^4${Config.core.mongo.databaseName}` +
                `\n         ^3MongoDB Collections: ^4${dbInfo.collections}` +
                `\n         ^3MongoDB Documents: ^4${dbInfo.objects}` +
                `\n         ^3MongoDB Size: ^4${Math.round(((dbInfo.dataSize / 1024) + Number.EPSILON) * 100) / 100} MB ^6(${dbInfo.dataSize} KB)` +
                '^0';
    });
    // const Extensions = require('./lib/extensions/index');

    while(discordStatus + mongoStatus !== 2) {
        await Delay(250);
    }

    console.log(discordPrintable + mongoPrintable);
    emit('DiscordFramework:Core:Ready');

});
