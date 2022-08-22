// Always keep your code inside this anonymous function to prevent an uncontrolled code execution and to prevent cross-declaration from other scopes
on('DiscordFramework:Extensions:Extension:Load', () => {

    // Always keep your code inside this event listener to prevent an uncontrolled code execution and to prevent cross-declaration from another scope
    const { Extension } = require(GetResourcePath(GetCurrentResourceName()) + '/core/modules/extensions/index');

    new class Template extends Extension {
        constructor() {
            super({
                name: 'Template', // Change to extension name
                description: 'A mere template for future extensions', // A brief decription of what does the extension do
                toggle: true, // Whether the extension is supposed to be enabled or disabled by default
                dependencies: [], // The dependencies/other extensions needed for this extension to be working correctly
                version: '1.0', // The current version of the extension if you'd like to keep track of it (can be removed)
                author: 'ItsAmmarB', // The person(s) who have made the extension and deserved credits (can be removed)
                config: {
                    /**
                     * This is the config of the extension.
                     * The config must be an object if utilized and can either be here
                     * or in a separate file and called by require(), either of em' works
                     *
                     * If you do not need it you can just leave it empty
                     * or remove the variable from the super() object
                     */
                }
            });
        }

        // Or replace this line with just Run() only; to avoid errors/warnings
        Run() {
            // CORE HERE
        }

    };

    module.exports = {
        Extension: Extension // keep this here if you have a server side code to execute
    };

});


/**
 * I'm glad you're interested in making an extension, below you will find a detailed explanation on how to make on work
 * and a list of everything the framework provides to you.
 *
 * for starters, the above template will not work as-is, to make it so it at least gets recognized by the by the framework
 * all you need to do is, change every "Template" word with your desired extension name.
 * Once you do that; after restarting the resource, the framework will immediately recognize the extension and will start
 * validating the super() variables.
 *
 * Now, let's get "those" super() variables setup correctly, you will find comments next to each variables explaining what it
 * does briefly, you will notice a "(can be removed)" next to some variables, only those you can remove and will not cause any
 * errors or warnings.
 *
 * Awesome; now that the extension super() variables are changed to the proper ones, let's talk about
 * functions, methods, properties, exports, and etc..
 *
 * first off; as you can see the Run() method has a comment reminding you that it must be present, that is true for core validation
 * where if there were to be an error the framework module detects it and marks the extensions as Error, so make sure to have it at
 * all time, even if it's not needed, have a space holder or just a comment just like how it is right now.
 *
 * now that that's out of the way; let's get started;
 *
 *          @METHODS
 *
 * @method this.GetInfo()
 * @return {object}
 * This will return all the information you've passed in super()
 *
 * @method this.GetConfig()
 * @return {object}
 * This will return the config you've passed in super()
 *
 * @method this.Delay(WaitMS)
 * @return {Promise}
 * This can be used instead of setTimeout() but will require the scoped function to be asynchronous and method must be awaited
 *
 * @method this.LoadClient(PlayerId)
 * @return {undefined}
 * This is a Extension class method, you can use this to trigger the event present in the cl_index.js by default
 * you could always use your own way to do it.
 * Also keep in mind, you are responsible to handle players joining and leaving, the framework doesn't not update extensions
 * more on that in the following sections.
 *
 *      @EVENTS
 *
 * @event on('DiscordFramework:Player:Connecting')
 * @param PlayerId The Player network ID (not the same as the server id)
 * @param Deferrals The object to control deferrals
 * @type Server-Side
 * This even will be triggered whenever a player is trying to connect to the server
 * @example
 * on('DiscordFramework:Player:Connecting', (PlayerId, Deferrals) => {
 *      if(ProhibitedName.includes(GetPlayerName(PlayerId))) {
 *          Deferrals.done('You are using a prohibited name, please change your name and try again!')
 *      }
 * })
 *
 * @event on('DiscordFramework:Player:Connected')
 * @param PlayerId The Player network ID (not the same as the server id)
 * @type Server-Side
 * This even will be triggered when a player is fully connected and the client side had started
 * @example
 * on('DiscordFramework:Player:Connected', PlayerId => {
 *      emit('chat:addMessage', PlayerId, { args: ['DiscordFramework', 'Welcome to the server!'] })
 * })
 *
 * @event on('DiscordFramework:Player:Disconnected')
 * @param PlayerId The Player Idea
 * @param Reason The generated network reason
 * @type Server-Side
 * This even will be triggered every time a player leaves the server
 * @example
 * on('DiscordFramework:Player:Disconnected', (PlayerId, Reason) => {
 *      console.log(GetPlayerName(PlayerId) + 'has left! \nReason: ' + Reason)
 * })
 *
 *      @FUNCTIONS
 *
 * @function Export()
 * This is custom Export function, it's that same as the original CFX.re exports() it and does the exact same.
 * It was made to enable extensions to use both types of exports:
 * The JS module.exports and CFX.re exports() in the same file; although I don't see myself or anyone using both all at once,
 * but it's one of those things that you don't need everyday but when you do it's there.
 *
 *
 *
 *
 *
 *      This is a server side file and can only be used for server sided functions/natives
 *      refer to https://docs.fivem.net/natives/ to see 'Server' functions/natives
 *
 *      this file can not be removed, and it is essential for the extension to work as of now, version; v4.0-indev
 *
 *      you
 *
*
    *
    *      also make sure that you change the event in the client side to match the server side more on it in the 'cl_index.js'
    */
