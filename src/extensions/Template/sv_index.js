const { Extension } = require('../../core/lib/extensions/index');

const Template = new Extension({
    name: 'Template',
    description: 'A template extension to help with extensions development',
    toggle: false,
    version: '0.0.0',
    author: 'ItsAmmarB',
    config: {
        password: 'Hello World',
        isThisNecessary: false
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
    // Place holder

    /**
     * You could use this to trigger the players' client side if you need some sort of sequencing
     * Ex; triggering the players' client side after fetching some data and doing some magic before triggering the client side
     * providing some sense of sequencing to your code's execution across both server and client sides!
     *
     * The method can be ran without any parameters, triggering all players' clients
     * alternately; you could specify a player ID as a parameter, and it will trigger that
     * player's client only
     */
    Template.executeClient();
});

/**
 * This is a method to set some cfx exports for other resources to use
 * @param {Object} Exports - The exports to set; it must be an object otherwise an error will be throw
 * @example Extension.setCFXExports({
 *      vehicle: {
 *          super: {
 *              nero: 'Nero',
 *              adder: 'Adder'
 *          }
 *      }
 * })
 */
Template.setCFXExports({
    CheckPermission: (name) => {
        return `${name} does not have permission!`;
    }
});