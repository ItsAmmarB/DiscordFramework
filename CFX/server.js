setTimeout(() => {
    require(GetResourcePath(GetCurrentResourceName()) + '/Core/index');
}, 500);

// --------------------------------------
//               EXPORTS
// --------------------------------------

/**
 * This registers exports without changing the environment behavior of the calling file
 */
on('DiscordFramework:Export:Create', (Name, Function) => {
    exports(Name, Function);
    if(global.DebugMode) console.debug(Name, 'export was create!');
});