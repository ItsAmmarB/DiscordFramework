require('../version')(async Result => {
    const Config = require('../config');

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
        Debug('Discord Module Ready!');

        discordPrintable =
                '\n^9Discord' +
                `\n         ^3Client Details: ^4${Discord.client.user.tag + ' ^6(' + Discord.client.user.id + ')'}` +
                `\n         ^3Client Invite: ^4${Discord.client.generateInvite({ scopes: ['bot'] })}` +
                `\n         ^3Discord Users: ^4${Discord.client.users.cache.size + (Discord.client.users.cache.size === 1 ? ' User' : ' Users')}` +
                `\n         ^3Discord Guilds: \n${Discord.client.guilds.cache.map(guild => `                ^3- ^4${guild.name} ^6(${guild.id})`).join('\n')}` +
                '\n^0';
    });
    const Discord = require('./lib/discord/index');



    let mongoStatus = 0;
    let mongoPrintable = '';
    on('DiscordFramework:Core:MongoDB:Ready', async () => {
        mongoStatus = 1;
        Debug('MongoDB Module ready!');

        const dbInfo = await MongoDB.client.db(Config.core.mongo.databaseName).stats();
        mongoPrintable =
                '\n^9MongoDB' +
                `\n         ^3Datebase Name: ^4${Config.core.mongo.databaseName}` +
                `\n         ^3MongoDB Collections: ^4${dbInfo.collections}` +
                `\n         ^3MongoDB Documents: ^4${dbInfo.objects}` +
                `\n         ^3MongoDB Size: ^4${Math.round(((dbInfo.dataSize / 1024) + Number.EPSILON) * 100) / 100} MB ^6(${dbInfo.dataSize} KB)` +
                '\n^0';
    });
    const MongoDB = require('./lib/mongodb/index');


    let extensionsStatus = 0;
    let extensionsPrintable = '';
    on('DiscordFramework:Core:Extensions:Ready', () => {
        extensionsStatus = 1;
        Debug('Extensions Module ready!');

        const ReadyExtensions = Extensions.Extensions.toArray().filter(e => e.status === 'Ready');
        const EnabledExtensions = Extensions.Extensions.toArray().filter(e => e.status === 'Enabled');
        const NoneEnabledExtensions = Extensions.Extensions.toArray().filter(e => e.status !== 'Ready' && e.status !== 'Enabled' && e.status !== 'Template');
        const TemplateExtensions = Extensions.Extensions.toArray().filter(e => e.status === 'Template');

        const SortedExtensions = [...ReadyExtensions, ...EnabledExtensions, ...NoneEnabledExtensions, ...TemplateExtensions ];

        const Console = require('../components/console');

        extensionsPrintable =
                '\n^9Extensions' +
                `\n         ^3Extensions Count: ^4${SortedExtensions.length}` +
                `\n         ^3Extensions: \n${Console.Table(SortedExtensions.map((extension, index) => {
                    index = index + 1;
                    const color = Number.isInteger(index / 2) ? '^4' : '^9';
                    const result = {};
                    result['^3Index'] = (extension.status === 'Template' ? '^6' : color) + index;
                    result['^3Name'] = (extension.status === 'Template' ? '^6' : color) + extension.name;
                    result['^3Status'] = extension.status === 'Template' ? '^6' + extension.status : extension.status !== 'Enabled' ? '^8' + extension.status : '^2' + extension.status;
                    result['^3Author'] = (extension.status === 'Template' ? '^6' : color) + (extension.author ? extension.author : 'Unknown');
                    result['^3Version'] = (extension.status === 'Template' ? '^6' : color) + (extension.version ? extension.version : 'Unknown');
                    return result;
                }))}` +
                '\n^0';
    });
    const Extensions = require('./lib/extensions/index');

    let counter = 0;
    while(discordStatus + mongoStatus + extensionsStatus !== 3) {
        if(counter > 60) {
            console.error('DiscordFramework: Core status timed out after 15s!');
            if(!discordStatus) console.error('Discord Module timed out!');
            if(!mongoStatus) console.error('MongoDB Module timed out!');
            if(!extensionsStatus) console.error('Extensions Module timed out!');
            return;
        }
        await Delay(250);
        counter++;
    }

    module.exports = {
        Discord,
        MongoDB,
        Extensions
    };

    console.log(discordPrintable + mongoPrintable + extensionsPrintable);

    emit('DiscordFramework:Core:Ready');
    Debug('DiscordFramework Core ready!');
});
