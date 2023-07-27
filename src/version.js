module.exports = async () => {

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

            if(rVersion > lVersion) {
                console.log(`^3[DiscordFramework] A newer version '${RemoteVersion}' was released! currently running ${LocalVersion}^0`);
            }
            else {
                console.log(`^2[DiscordFramework] Running the latest version! ${LocalVersion}^0`);
            }

        });

    });
};