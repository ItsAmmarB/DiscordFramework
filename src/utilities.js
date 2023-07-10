const Players = require('./components/player');
const onConnection = require('./index').onConnection;
const Console = require('./components/console');

module.exports = {
    Players,
    Connections: {
        onConnection
    },
    Console
};