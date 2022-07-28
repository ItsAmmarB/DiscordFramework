const Load = () => {
    const { readdirSync } = require('fs');
    const Directory = GetResourcePath(GetCurrentResourceName()) + '/extensions';
    const Folders = readdirSync(Directory);
    const ServerFiles = ['server.js', 'sv_index.js'];
    for (const Folder of Folders) {
        const Files = readdirSync(Directory + '/' + Folder);
        let ServerFile = Files.find(file => ServerFiles.includes(file.toLowerCase()));
        if(!ServerFile) return;
        ServerFile = require(Directory + '/' + Folder + '/' + ServerFile.split('.')[0]);
        if(typeof ServerFile.Extension !== 'function') return;
        new ServerFile.Extension();
    }
};

module.exports = {
    Load: Load
};