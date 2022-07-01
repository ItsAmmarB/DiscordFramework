new class Template extends global.Extensions.Extension {
    constructor() {
        super({
            Name: 'Template', // Change to extension name
            Description: 'A mere template for future extensions', // Add a brief decription of what does the extension do
            Enabled: true, // Whether the extension is supposed to be enabled or disabled
            Dependencies: [], // Add the dependencies/other extensions needed for this extension to be usable
            Version: '1.0', // The current version of the extension if available
            Author: 'ItsAmmarB' // The person(s) who have made the extension and deserved credits
        });
    }

    /**
     * This is used to access the extension's "Server" side config with ease
     * to access the config just use "this.Config()" and you're game.. :P
     */
    Config() {
        return SV_Config.Extensions.find(extension => extension.name === this.constructor.name).config;
    }

    /**
     * The main thread of the extension, if this is not present, and error will be thrown and the extension will be disabled and marked as error
     */
    Run() {
        // CODE HERE
    }
}().Initialize();

/**
 *      MAKE SURE TO CHANGE THE ({CHANGE_ME}) OF THE CLASS WITH THE EXTENSION NAME ELSE AN ERROR WILL BE THROWN IN THE CONSOLE
 *
 *      This is a server side file and can only be used for server sided functions/natives
 *      refer to https://docs.fivem.net/natives/ to see 'Server' functions/natives
 *
 *      this file can not be removed, and it is essential for the extension to work as of now, version; v4.0-indev
 *
 *      you can used this event to trigger the client side, not client side can only be useful after you trigger this event
 *      otherwise modification/altering is needed for the template to work
 *
 *           emitNet(`DiscordFramework:Extensions:RunClientSide:${this.constructor.name}`, this.constructor.name);
 *
 *      also make sure that you change the event in the client side to match the server side more on it in the 'cl_index.js'
 */