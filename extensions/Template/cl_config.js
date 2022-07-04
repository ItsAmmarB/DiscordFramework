onNet('DiscordFramework:Extensions:RunClientSide:Template', (Extension) => {
    CL_Config.Extensions.push({
        name: 'Template', // Extension name here, and make sure it the same as the one in the extension class in the 'sv_index.js'
        config: {

        }
    });
});

/**
 * MAKE SURE TO CHANGE THE "Template" IN THE EVENT TO THE EXTENSION NAME ELSE IT WILL NEVER BE TRIGGERED BY DEFAULT.
 *
 * This is a client side config file and can only be used for client sided variables
 *
 * this file can be removed if not needed, it was created to let people know that it can be used
 */