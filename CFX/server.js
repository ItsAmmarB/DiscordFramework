const Config = require(`${GetResourcePath(GetCurrentResourceName())}/src/config`);
emitNet('DiscordFramework:DebuggingMode', Config.development.debuggingMode);
global.debug = msg => {
    if(!Config.development.debuggingMode) return;
    console.log(`^5[DEBUG] ^3${msg}^0`);
};

global.Delay = async MS => await new Promise(resolve => setTimeout(resolve, MS));

/**
 * This registers exports without changing the environment behavior of the calling file
 */
on('DiscordFramework:Export:Create', (Name, Function) => {
    exports(Name, Function);
    if(global.DebugMode) console.debug(Name, 'export was create!');
});

require(`${GetResourcePath(GetCurrentResourceName())}/src/index`);