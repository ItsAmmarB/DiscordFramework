/**
 * This registers exports without changing the environment behavior of the calling file
 */
on('DiscordFramework:Export:Create', (Name, Function) => {
    Debug(`Exporting Exports.${Name}`);
    exports(Name, Function);
});
require(`${GetResourcePath(GetCurrentResourceName())}/src/index`);
