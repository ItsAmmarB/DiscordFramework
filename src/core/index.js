require('../components/logger');

let discordIsReady = false;
on('DiscordFramework:Core:Discord:Ready', () => {
    discordIsReady = true;
    Debug('Discord Module Ready!');
});
const Discord = require('./modules/discord/index');

let mongoIsReady = false;
on('DiscordFramework:Core:MongoDB:Ready', () => {
    mongoIsReady = true;
    Debug('MongoDB Module ready!');
});
const MongoDB = require('./modules/mongodb/index');

let extensionsIsReady = false;
on('DiscordFramework:Core:Extensions:Ready', () => {
    extensionsIsReady = true;
    Debug('Extensions Module ready!');
});
const Extensions = require('./modules/extensions/index');

const PrintStatus = async (isCommand = false) => {
    const DiscordPrintable = '\n     ^3 - ^9Discord' + Discord.info();
    const MongoDBPrintable = '\n     ^3 - ^9MongoDB' + await MongoDB.info();
    const ExtensionsPrintable = '\n     ^3 - ^9Extensions' + Extensions.info();
    const Separator = isCommand ? '|===================[DiscordFramework Core Status]===================|^0' : '|==============================================================================|^0';
    console.log(` ${isCommand ? '' : '\n        █▀▄ █ █▀ █▀▀ █▀█ █▀█ █▀▄ █▀▀ █▀█ ▄▀█ █▀▄▀█ █▀▀ █ █ █ █▀█ █▀█ █▄▀\n        █▄▀ █ ▄█ █▄▄ █▄█ █▀▄ █▄▀ █▀  █▀▄ █▀█ █ ▀ █ ██▄ ▀▄▀▄▀ █▄█ █▀▄ █ █'}\n${Separator}\n        ${DiscordPrintable + MongoDBPrintable + ExtensionsPrintable }${Separator}`);
};

const Checker = async callback => {
    const { delay } = require('./modules/extensions/utilities');
    let counter = 0;
    while(!discordIsReady || !mongoIsReady || !extensionsIsReady) {
        if(counter > 60) {
            console.error('DiscordFramework: Core status timed out after 15s!');
            if(!discordIsReady) console.error('Discord Module timed out!');
            if(!mongoIsReady) console.error('MongoDB Module timed out!');
            if(!extensionsIsReady) console.error('Extension Module timed out!');
            return callback(false);
        }
        await delay(250);
        counter++;
    }

    emit('DiscordFramework:Core:Ready');
    PrintStatus();
    Debug('DiscordFramework Core ready!');
    callback(true, { Discord, MongoDB, Extensions });
};

module.exports = {
    initialize: Checker,
    Discord,
    MongoDB,
    Extensions
};

