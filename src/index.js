require('./version')();

module.exports = {
    /**
     * A pass-through from native JS export to CFX.re exports().
     * This was implemented because requiring a server side file will cause all CFX.re exports() to be nullified/undefined
     * this is a mere workaround to which it provides the ability to use both native JS module.exports and CFX.re export()
     * at the same time.
     *
     * @param {string} Name The desired name of the exports()
     * @param {function} Function The function to be executed upon exports call
     */
    Export: (Name, Function) => {
        emit('DiscordFramework:Export:Create', Name, Function);
    }
};

