on('DiscordFramework:Core:Ready', () => {
    SV_Config.Extensions.push({
        name: 'Template', // Extension name here, and make sure it the same as the one in the extension class in the 'sv_index.js'
        config: {

        }
    });
});


/**
 * This is a Server side config file and can only be used for Server sided variables
 *
 *  add the extension's configurable variables in the 'config' object only otherwise it will be overridden
 *
 * this file can be removed if not needed, it was created to let people know that it can be used
 * or you can make your own config file and call it using "require"
 */