onNet('DiscordFramework:Extensions:RunClientSide:Template', (Extension) => {

    // CODE HERE

});

/**
 * MAKE SURE TO CHANGE THE "Template" IN THE EVENT TO THE EXTENSION NAME ELSE IT WILL NEVER BE TRIGGERED BY DEFAULT.
 *
 * The "Extension" parameter is the name of the extension, in which can be used if you have a client side config
 * by using this line below as an example
 *
 *          const Config = CL_Config.Extensions.find(extension => extension.name === Extension).config;
 *
 * This is a client side file and can only be used for client sided functions/natives
 * refer to https://docs.fivem.net/natives/ to see 'Client' functions/natives
 *
 * this file can be removed if not needed, it was created to let people know that it can be used
 */