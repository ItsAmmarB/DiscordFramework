/**
 * This registers exports without changing the environment behavior of the calling file
 */
on('DiscordFramework:Export:Create', (Name, Function) => {
    exports(Name, Function);
});

require(`${GetResourcePath(GetCurrentResourceName())}/src/index`);