module.exports = {
    Core: async Callback => {
        const fetch = require('node-fetch');
        const fs = require('fs');

        const RemotePackageJSON = await (await fetch('https://raw.githubusercontent.com/ItsAmmarB/DiscordFramework/master/package.json')).json();
        const LatestRemoteVersion = RemotePackageJSON.version;

        const LocalPackageJSON = JSON.parse(fs.readFileSync(GetResourcePath(GetCurrentResourceName()) + '/package.json'));
        const LocalVersion = LocalPackageJSON.version;

        const Comparison = CompareVersions(LatestRemoteVersion.split('-')[0], LocalVersion.split('-')[0]);
        Callback({
            isUpToDate: Comparison.isUpToDate,
            deprecated: (Comparison.remote - 1000) > Comparison.local,
            localVersion: Comparison.local,
            remoteVersion: Comparison.remote
        });
    }
};

const CompareVersions = (RVersion, LVersion) => {
    const [RVa, RVb, RVc] = RVersion.split('.');
    const [LVa, LVb, LVc] = LVersion.split('.');
    const RVParsed = (RVa * 1000) + (RVb * 100) + (RVc * 1);
    const LVParsed = (LVa * 1000) + (LVb * 100) + (LVc * 1);

    return { isUpToDate: LVParsed >= RVParsed, remote: RVParsed, local: LVParsed };
};