const { Module } = require('../../modules');
const Handlers = require('./handlers');

/**
 * A custom Set() containing all registered extensions
 */
const Extensions = new Handlers.Extensions();

module.exports.Module = class Exetnsions extends Module {
    constructor(modules) {
        super(modules, {
            name: 'Extensions',
            description: 'A extesnions module that allows the framework to expand',
            toggle: true,
            version: '1.0',
            author: 'ItsAmmarB'
        });

        this.ExtensionsFiles = this.CountExtensions();

        this.Run();
    }

    Run() {
        this.#Exports();

        on('DiscordFramework:Extensions:Extension:Loaded', () => {
            if(Extensions.size !== this.ExtensionsFiles.length) return;

            const { AddPrint, Table } = require('../Console/index');

            let i = 1;
            AddPrint('Extensions', `
    ^3Extensions Count: ^4${Extensions.size}
    ^3Extensions: \n${Table(Extensions.toArray().map((extension, index) => {
        i === 1 ? i++ : i--;
        const color = (i === 1 ? '^4' : '^9');
        const returnal = {};
        returnal['^3Index'] = (color) + index;
        returnal['^3Name'] = (color) + extension.name;
        // returnal['^3Description'] = (color) + (extension.description ?? 'None');
        returnal['^3Status'] = extension.status === 'Template' ? '^6' + extension.status : extension.status !== 'Enabled' ? '^8' + extension.status : '^2' + extension.status;
        returnal['^3Author'] = (color) + (extension.author ?? 'Unknown');
        returnal['^3Version'] = (color) + (extension.version ?? 'Unknown');
        return (returnal);
    }))}
    `);


            this.Ready();

        });

        emit('DiscordFramework:Extensions:Extension:Load');


    }

    CountExtensions() {
        const list = [];
        const { readdirSync } = require('fs');
        const Directory = GetResourcePath(GetCurrentResourceName()) + '/extensions';
        const Folders = readdirSync(Directory);
        for (const Folder of Folders) {
            const Files = readdirSync(Directory + '/' + Folder);
            list.push({ name: Folder, files: Files });
        }
        return list;
    }

    #Exports() {
        // JS Module Exports
        module.exports.Extension = Handlers.Extension,
        module.exports.Extensions = Extensions;

        // CFX Exports
        emit('DiscordFramework:Export:Create', 'Extensions', () => {
            return {
                Extension: () => {
                    return Handlers.Extension;
                },
                Extensions: () => {
                    return Extensions;
                }
            };
        });
    }
};