module.exports = async (Callback) => {

    const { readFileSync } = require('fs');
    const https = require('https');

    const LocalPackage = await readFileSync(`${GetResourcePath(GetCurrentResourceName())}/package.json`, 'utf-8');
    const LocalVersion = JSON.parse(LocalPackage).version;

    const link = 'https://raw.githubusercontent.com/ItsAmmarB/DiscordFramework/master/package.json';

    https.get(link, (res) => {

        let RemotePackage = '';

        // A chunk of data has been received.
        res.on('data', (chunk) => {
            RemotePackage += chunk;
        });

        // The whole resonse has been received. Print out the result.
        res.on('end', () => {
            RemotePackage = JSON.parse(RemotePackage);
            const RemoteVersion = RemotePackage.version;

            const lVersion = LocalVersion.includes('-') ? LocalVersion.split('-')[0].split('.').join('') : LocalVersion.split('.').join('');
            const rVersion = RemoteVersion.includes('-') ? RemoteVersion.split('-')[0].split('.').join('') : RemoteVersion.split('.').join('');

            let isUpToDate = null;
            if(rVersion > lVersion) {
                isUpToDate = false;
            }
            else {
                isUpToDate = true;
            }

            Callback({
                local: LocalVersion,
                remote: RemoteVersion,
                upToDate: isUpToDate
            });
        });

    }).on('error', () => {
        Callback(false);
    });
};