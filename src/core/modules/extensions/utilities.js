const Players = require('../../../components/player');
const { ConnectionExecutables } = require('../../../index');
const Console = require('../../../components/console');
const Util = require('../../../utils/functions');

module.exports = {
    Players: {
        ...Players,
        Conenctions: ConnectionExecutables
    },
    Console,
    ...Util
};