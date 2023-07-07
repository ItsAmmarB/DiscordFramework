const Extension = require('./bin/extension');
const Extensions = require('./bin/extensions');
const LocalExtensionsFile = [];

on('DiscordFramework:Core:Discord:Ready', async () => {
    const { readdirSync } = require('fs');
    const Directory = GetResourcePath(GetCurrentResourceName()) + '/src/extensions';
    const Folders = readdirSync(Directory);
    for (const Folder of Folders) {
        const Files = readdirSync(Directory + '/' + Folder);
        LocalExtensionsFile.push({ name: Folder, files: Files });
    }

    let counter = 0;
    while(Extensions.toArray.length !== LocalExtensionsFile) {
        if(counter > 20) {
            break;
        }
        await Delay(250);
        counter++;
    }

    if(Extensions.toArray.length !== LocalExtensionsFile) {
        LocalExtensionsFile.filter(lef => !Extensions.toArray().find(e => lef.name.toLowerCase() === e.name.toLowerCase())).forEach(lef => {
            new Extension(lef.name)
                .setStatus('Unknown');
        });
    }

    await Delay(1000);
    emit('DiscordFramework:Core:Extensions:Ready');
});

emit('DiscordFramework:Export:Create', 'Extensions', () => {
    return {
        /**
         * This export won't work
         * because CFX only exports mutual data types, ex; numbers, functions, objects, arrays, and etc.
         * language specific data types aren't allowed, ex; classes, sets, collections, maps
         * because those wouldn't work in LUA, blame LUA
         *
         * Also; there isn't any use for this class outside of the framework as it's only meant to provide
         * a better way to keep track and manage scripts within the framework!
         */
        // Extension: () => {
        //     return Classes.Extension;
        // },

        /** The Extensions map() is exported as an array because CFX events does not support map()
         * because map() is a language specific class and not available in lua!
         */
        Extensions: () => {
            return Extensions.toArray();
        }
    };
});

module.exports = {
    Extension: Extension,
    Extensions: Extensions
};