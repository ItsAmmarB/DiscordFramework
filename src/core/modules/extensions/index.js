const { delay } = require('../../../utils/functions');

const Extension = require('./components/extension');
const Extensions = require('./components/extensions');

const LocalExtensionsFile = [];


on('DiscordFramework:Core:Module:Ready', async (name) => {
    if(name !== 'Discord') return;
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
        await delay(250);
        counter++;
    }

    if(Extensions.toArray().length !== LocalExtensionsFile.filter(f => f.files.length > 0).length) {
        LocalExtensionsFile.filter(lef => !Extensions.toArray().find(e => lef.name.toLowerCase() === e.name.toLowerCase())).forEach(lef => {
            new Extension({ name: lef.name })
                .setStatus('Unknown');
        });
    }

    emit('DiscordFramework:Core:Module:Ready', 'Extensions');
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

/**
 * Return a brief information of the Extensions module
 * @returns {string} Extensions count, and a table of the extension containing their respective name, description, status, author, and version
 */
const GetInfo = () => {
    const ReadyExtensions = Extensions.toArray().filter(e => e.status === 'Ready');
    const EnabledExtensions = Extensions.toArray().filter(e => e.status === 'Enabled');
    const NoneEnabledExtensions = Extensions.toArray().filter(e => e.status !== 'Ready' && e.status !== 'Enabled' && e.status !== 'Template');
    const TemplateExtensions = Extensions.toArray().filter(e => e.status === 'Template');

    const SortedExtensions = [...ReadyExtensions, ...EnabledExtensions, ...NoneEnabledExtensions, ...TemplateExtensions ].map((extension, index) => {
        index = index + 1;
        const color = Number.isInteger(index / 2) ? '^4' : '^9';
        const result = {};
        result['^3Index'] = (extension.status === 'Template' ? '^6' : color) + index;
        result['^3Name'] = (extension.status === 'Template' ? '^6' : color) + extension.name;
        result['^3Description'] = (extension.status === 'Template' ? '^6' : color) + extension.description;
        result['^3Status'] = extension.status === 'Template' ? '^6' + extension.status : extension.status !== 'Enabled' ? '^8' + extension.status : '^2' + extension.status;
        result['^3Author'] = (extension.status === 'Template' ? '^6' : color) + (extension.author ? extension.author : 'Unknown');
        result['^3Version'] = (extension.status === 'Template' ? '^6' : color) + (extension.version ? extension.version : 'Unknown');
        return result;
    });
    const Console = require('../../../components/console');
    return `\n              ^3Extensions Count: ^4${SortedExtensions.length}\n              ^3Extensions: \n${Console.Table(SortedExtensions)}\n^0`;
};

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
    info: GetInfo,
    Extensions: Extensions
};