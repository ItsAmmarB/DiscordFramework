const { Module: Modules } = require('../../modules');
const Handlers = require('./handlers');

/**
 * A custom Set() containing all registered extensions
 */
const Extensions = new Handlers.Extensions();

const Module = class Exetnsions extends Modules {
    constructor(modules) {
        super(modules, {
            name: 'Extensions',
            description: 'A extesnions module that allows the framework to expand',
            toggle: true,
            quickStart: true,
            version: '1.0',
            author: 'ItsAmmarB'
        });
    }

    Load() {
        on('DiscordFramework:Core:Ready', () => {
            const { readdirSync } = require('fs');
            const Directory = GetResourcePath(GetCurrentResourceName()) + '/extensions';
            const Folders = readdirSync(Directory);
            const ServerFiles = ['server.js', 'sv_index.js'];
            for (const Folder of Folders) {
                const Files = readdirSync(Directory + '/' + Folder);
                let ServerFile = Files.find(file => ServerFiles.includes(file.toLowerCase()));
                if(ServerFile) {
                    ServerFile = require(Directory + '/' + Folder + '/' + ServerFile.split('.')[0]);
                    if(typeof ServerFile.Extension === 'function') new ServerFile.Extension();
                }
            }
        });
    }
};

module.exports = {
    Module: Module,
    Extension: Handlers.Extension,
    Extensions: Extensions
};