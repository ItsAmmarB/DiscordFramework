const Extension = require('./components/extension');
const Extensions = require('./components/extensions');

const LocalExtensionsFile = [];


on('DiscordFramework:Core:Discord:Ready', async () => {
    const { readdirSync } = require('fs');
    const Directory = GetResourcePath(GetCurrentResourceName()) + '/src/extensions';
    const Folders = readdirSync(Directory);
    for (const Folder of Folders) {
        const Files = readdirSync(Directory + '/' + Folder);
        LocalExtensionsFile.push({ name: Folder, files: Files });
        const Sv_File = Files.find(file => file === 'sv_index.js');
        if(Sv_File) {
            try{
                require(`${Directory}/${Folder}/${Sv_File}`);
            }
            catch(err) {
                console.log(err);
            }
        }
    }

    let counter = 0;
    while(Extensions.toArray().length !== LocalExtensionsFile.filter(f => f.files.length > 0).length) {
        if(counter > 20) {
            break;
        }
        await Delay(250);
        counter++;
    }

    if(Extensions.toArray().length !== LocalExtensionsFile.filter(f => f.files.length > 0).length) {
        LocalExtensionsFile.filter(lef => !Extensions.toArray().find(e => lef.name.toLowerCase() === e.name.toLowerCase())).forEach(lef => {
            new Extension({ name: lef.name })
                .setStatus('Unknown');
        });
    }

    emit('DiscordFramework:Core:Extensions:Ready');
});

on('DiscordFramework:Extensions:UpdateCFXExports', () => {
    const Exports = {
        Extensions: () => {
            return Extensions.toArray();
        }
    };
    Extensions.toArray().map(extension => ({ name: extension.name, exports: extension.cfxExports })).forEach(extension => {
        Exports[extension.name] = extension.exports;
    });
    emit('DiscordFramework:Export:Create', 'Extensions', () => {
        return Exports;
    });
});

emit('DiscordFramework:Export:Create', 'Extensions', () => {
    return {
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