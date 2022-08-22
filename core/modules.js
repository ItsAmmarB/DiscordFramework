const { Module, Modules } = require('./handlers/modules');

const ModulesNestedFiles = [];
const ModulesSet = new Modules();

module.exports = {
    Module: Module,
    /**
     * Returns all registered modules
     * @return {Set<ModulesSet>} A Set() of modules
     */
    Modules: ModulesSet,
    Load: () => {
        const { readdirSync } = require('fs');
        const Directory = GetResourcePath(GetCurrentResourceName()) + '/core/modules/';
        const Folders = readdirSync(Directory);
        for (const Folder of Folders) {
            const Files = readdirSync(Directory + '/' + Folder);
            ModulesNestedFiles.push({ module: Folder, files: Files });
            let ServerFile = Files.find(file => file.toLowerCase() === 'index.js');
            if(ServerFile) {
                ServerFile = require(Directory + '/' + Folder + '/' + ServerFile.split('.')[0]);
                if(typeof ServerFile.Module === 'function') new ServerFile.Module(ModulesSet);
            }
        }
    },
    Ready: () => {
        return (ModulesNestedFiles.filter(m => m.files.includes('index.js') && m.files.length > 0).length === ModulesSet.size) && !ModulesSet.toArray().find(m => m.status !== 'Running');
    }
};