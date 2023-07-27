const { module: { Extension } } = require('../../core/index').Extensions;

const Template = new Extension({
    name: 'Template',
    description: 'A template extension to help with extensions development',
    toggle: true,
    version: '0.0.0',
    author: 'ItsAmmarB',
    config: {
        WordOfToday: 'Hello World',
        isThisNecessary: false,
        canIsavePASSWORDShere: 'Absolutely; do at your own risk',
        isThisLIKEaCACHE: true
    }
});

/**
 * This is how you set the main extension function to be executed whenever the framework core ready event is triggered
 * @param ExtensionInfo - The current extension's provided information on creation such as name, description, toggle, version, author, config and other hidden variables
 * @param Discord - Discord module exports including the Discord client
 * @param MongoDB - MongoDB module exports including the MongoDB client
 * @param Utilities - Some useful functions and networked variables such as Player Class, Players Class, Network Players & their information, Connections, onConnection() (for when a player is connecting) and etc..
 */
Template.setFunction((ExtensionInfo, { Discord, MongoDB, Utilities }) => {
    /**
     * You could use this to trigger the players' client side if you need some sort of sequencing
     * Ex; triggering the players' client side after fetching some data and doing some magic before triggering the client side
     * providing some sense of sequencing to your code's execution across both server and client sides!
     *
     * The method can be ran without any parameters, triggering all players' clients
     * alternately; you could specify a player ID as a parameter, and it will trigger that
     * player's client only
     *
     * Check the method comment for more information
     */
    Template.runClient();


    /**
     * this will return the information you've provided in the Extension class constructor when you created the extension
     * ex;
     {
        name: 'Template',
        description: 'A template extension to help with extensions development',
        toggle: false,
        version: '0.0.0',
        author: 'ItsAmmarB'
    }
     *
     * Note; that the config will not be returned when using getInfo() method, instead you'd need to use getConfig() method
     */
    Template.getInfo();


    /**
     * This will return the config object that you've provided in the Extension class constructor when you created the extensioniv available
     * the config can be manipulated/editted
     */
    Template.getConfig();


    /**
     * This will set this extensions export to be use-able by other resources/extensions
     */
    Template.setCFXExports();

    /**
     * This will return the set CFX exports if available
     */
    Template.getCFXExports();

    /**
     * This will set the extensions status to whatever you want;
     * note that it does not effect anything, but merely a string that will be shown if requested by a user
     */
    Template.setStatus();
});
