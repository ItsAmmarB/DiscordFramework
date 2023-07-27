require('../components/logger');

const Modules = {
    Players: { ready: false, module: require('./modules/players/index') },
    Extensions: { ready: false, module: require('./modules/extensions/index') },
    Discord: { ready: false, module: require('./modules/discord/index') },
    MongoDB: { ready: false, module: require('./modules/mongodb/index') }
};

on('DiscordFramework:Core:Module:Ready', async (name) => {
    if(name === 'Players') await Checker(); // Start core modules status checker when the players module is ready; which is instantly!
    if(!Modules[name]) return console.error(`Unknow module ${name} called "DiscordFramework:Core:Module:Ready", make sure there is no extension that is trying to register as a module!`);
    Modules[name].ready = true;
    return Debug(`${name} Module is Ready!`);
});

const PrintStatus = async (isCommand = false) => {
    const DiscordPrintable = '\n     ^3 - ^9Discord' + Modules.Discord.module.info();
    const MongoDBPrintable = '\n     ^3 - ^9MongoDB' + await Modules.MongoDB.module.info();
    const ExtensionsPrintable = '\n     ^3 - ^9Extensions' + Modules.Extensions.module.info();
    const Separator = isCommand ? '|===================[DiscordFramework Core Status]===================|^0' : '|==============================================================================|^0';
    console.log(` ${isCommand ? '' : '\n        █▀▄ █ █▀ █▀▀ █▀█ █▀█ █▀▄ █▀▀ █▀█ ▄▀█ █▀▄▀█ █▀▀ █ █ █ █▀█ █▀█ █▄▀\n        █▄▀ █ ▄█ █▄▄ █▄█ █▀▄ █▄▀ █▀  █▀▄ █▀█ █ ▀ █ ██▄ ▀▄▀▄▀ █▄█ █▀▄ █ █'}\n${Separator}\n        ${DiscordPrintable + MongoDBPrintable + ExtensionsPrintable }${Separator}`);
};

const Checker = async () => {
    const { delay } = require('./modules/extensions/utilities');
    let counter = 0;
    while(!Modules.Discord.ready || !Modules.MongoDB.ready || !Modules.Extensions.ready) {
        if(counter > 60) {
            console.error('DiscordFramework: Core status timed out after 15s!');
            if(!Modules.Players || !Modules.Players.ready) console.error('Players Module timed out!');
            if(!Modules.Discord || !Modules.Discord.ready) console.error('Discord Module timed out!');
            if(!Modules.MongoDB || !Modules.MongoDB.ready) console.error('MongoDB Module timed out!');
            if(!Modules.Extensions || !Modules.Extensions.ready) console.error('Extension Module timed out!');
            return;
        }
        await delay(250);
        counter++;
    }

    emit('DiscordFramework:Core:Ready');
    PrintStatus();
    Debug('DiscordFramework Core ready!');
};

module.exports = Modules;

