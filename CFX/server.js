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

// Credit: https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
if (!String.prototype.format) {
    String.prototype.format = function format() {
        const args = arguments[0];
        let text = this;
        for (const elm in args) {
            text = text.replace(`{${elm}}`, match => args[elm] != 'undefined' ? args[elm] : match);
        }
        return text;
    };
}