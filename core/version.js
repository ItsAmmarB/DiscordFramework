module.exports = {
    Core: async Callback => {
        const fetch = require('node-fetch');
        const fs = require('fs');

        const RemotePackageJSON = await (await fetch('https://raw.githubusercontent.com/ItsAmmarB/DiscordFramework/master/package.json')).json();
        const LatestRemoteVersion = RemotePackageJSON.version;

        const LocalPackageJSON = JSON.parse(fs.readFileSync(GetResourcePath(GetCurrentResourceName()) + '/package.json'));
        const CurrentVersion = LocalPackageJSON.version;

        Callback({
            isUpToDate: CurrentVersion === LatestRemoteVersion,
            deprecated: false,
            localVersion: CurrentVersion,
            remoteVersion: LatestRemoteVersion
        });
    }
};
