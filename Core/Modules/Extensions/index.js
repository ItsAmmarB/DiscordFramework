const { Module: Modules } = require('../../modules');
const Classes = require('./classes');

/**
 * A custom Set() containing all registered extensions
 */
const Extensions = new Classes.Extensions();

module.exports.Module = class Exetnsions extends Modules {
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
        setTimeout(() => this.Ready(), 500);
    }

    Run() {
        this.#Exports();

        on('DiscordFramework:Extensions:Extension:Loaded', () => {
            if(Extensions.size !== this.ExtensionsFiles.filter(e => e.files.length > 0).length) return;

            const EnabledExtensions = Extensions.toArray().filter(e => e.Status === 'Enabled');
            const NoneEnabledExtensions = Extensions.toArray().filter(e => e.Status !== 'Enabled' && e.Status !== 'Template');
            const TemplateExtensions = Extensions.toArray().filter(e => e.Status === 'Template');

            const SortedExtensions = [...EnabledExtensions, ...NoneEnabledExtensions, ...TemplateExtensions ];

            const { AddPrint, Table } = require('../Console/index');

            let i = 1;
            AddPrint('Extensions', `
    ^3Extensions Count: ^4${SortedExtensions.length}
    ^3Extensions: \n${Table(SortedExtensions.map((extension, index) => {
        i === 1 ? i++ : i--;
        const color = (i === 1 ? '^4' : '^9');
        const result = {};
        result['^3Index'] = (extension.Status === 'Template' ? '^6' : color) + (index + 1);
        result['^3Name'] = (extension.Status === 'Template' ? '^6' : color) + extension.Name;
        result['^3Status'] = extension.Status === 'Template' ? '^6' + extension.Status : extension.Status !== 'Enabled' ? '^8' + extension.Status : '^2' + extension.Status;
        result['^3Author'] = (extension.Status === 'Template' ? '^6' : color) + (extension.Author ?? 'Unknown');
        result['^3Version'] = (extension.Status === 'Template' ? '^6' : color) + (extension.Version ?? 'Unknown');
        return result;
    }))}
    `);

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
        module.exports.Extension = Classes.Extension,
        module.exports.Extensions = Extensions;

        // CFX Exports
        emit('DiscordFramework:Export:Create', 'Extensions', () => {
            return {
                /**
                 * This export won't work
                 * because CFX only exports mutual data types, ex; numbers, functions, objects, arrays, and etc.
                 * language specific data types aren't allowed, ex; classes, sets, collections, maps
                 * because those wouldn't work in LUA, blame LUA
                 */
                // Extension: () => {
                //     return Classes.Extension;
                // },
                Extensions: () => {
                    return Extensions.toArray();
                }
            };
        });
    }
};