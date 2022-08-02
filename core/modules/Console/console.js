let CoreStatus = false;
const Delay = async (MS) => await new Promise(resolve => setTimeout(resolve, MS));

module.exports = {
    Core: async () => {
        const { Client: DiscordClient } = require('../discord');
        const { Client: MongoClient } = require('../MongoDB');
        const { Extensions } = require('../../core');

        // This loop makes sure all extensions are registered
        let counter = 0;
        while (Extensions.size !== Extensions.toArray().filter(_module => _module.State !== 'Validating').length) {
            await Delay(500);
            counter++;
            if (counter === 40) { // A fail-safe to not crash the server
                console.warn('Some extensions failed to load!');
                break;
            }
        }

        if(global.DebugMode) console.debug(`Extensions took ${counter / 2} second(s) to load!`); // just for debuging

        const ExtensionsLog = Extensions.toArray().sort((a, b) => a.status.localeCompare(b.status)).map((e, i) => ({
            ' ^3# ': ` ^9${i + 1} `,
            ' ^3NAME ': ` ^4${e.name} `,
            ' ^3STATE ': ` ${e.status !== 'Enabled' ? e.status === 'Template' ? `^9${e.status}` : `^1${e.status}` : `^2${e.status}`} `,
            ' ^3VERSION ': ` ^4${e.version} `,
            ' ^3AUTHOR ':  ` ^6${e.author} `
        }));

        // Database information
        const dbInfo = await MongoClient.db(GetCurrentResourceName()).stats();
        const dbCollections = dbInfo.collections;
        const dbDocuments = dbInfo.objects;
        const dbSize = dbInfo.dataSize;

        CoreStatus = true;

        // Console Logs
        console.log('^3|================================[DISCORDFRAMEWORK]================================|^0');
        console.log('^3Discord API Client: ^4' + DiscordClient.user.tag + ' ^6(' + DiscordClient.user.id + ')');
        console.log('^3Discord Users: ^4' + DiscordClient.users.cache.size + (DiscordClient.users.cache.size === 1 ? ' User' : ' Users'));
        console.log('^3Discord Guilds: \n' + DiscordClient.guilds.cache.map(guild => `     ^4${guild.id} ^3| ^6${guild.name} ^3| ^4${guild.members.cache.size} ${guild.members.cache.size === 1 ? 'member' : 'members'}`).join('\n'));
        console.log('^3|--------------------------------[DISCORDFRAMEWORK]--------------------------------|^0');
        console.log('^3Mongo Datebase Name: ^4' + GetCurrentResourceName());
        console.log('^3MongoDB Collections: ^4' + dbCollections);
        console.log('^3MongoDB Documents: ^4' + dbDocuments);
        console.log('^3MongoDB Size: ^4' + `${Math.round(((dbSize / 1024) + Number.EPSILON) * 100) / 100} MB ^9(${dbSize} KB)`);
        console.log('^3|--------------------------------[DISCORDFRAMEWORK]--------------------------------|^0');
        console.log('^3Extensions:');
        console.table(ExtensionsLog);
        console.log('^3|================================[DISCORDFRAMEWORK]================================|^0');
    },
    PrintError: async Err => {

        while (!CoreStatus) {
            await Delay(1500);
        }

        setTimeout(() => {
            console.error(Err);
        }, 2000);
    }
};

/**
 * @credits Neil Mitchell
 * @link https://stackoverflow.com/questions/11026475/implement-firebugs-console-table-in-chrome
 */
console.table = (xs) => {
    if (xs.length === 0) {console.log('No extensions found');} else {
        const widths = [];
        const cells = [];
        for (let i = 0; i <= xs.length; i++) {cells.push([]);}
        for (const s in xs[0]) {
            let len = s.length;
            cells[0].push(s);
            for (let i = 0; i < xs.length; i++) {
                const ss = '' + xs[i][s];
                len = Math.max(len, ss.length);
                cells[i + 1].push(ss);
            }
            widths.push(len);
        }
        let s = '';
        for (let x = 0; x < cells.length; x++) {
            for (let y = 0; y < widths.length; y++) {s += '^3  |  ' + pad(widths[y], cells[x][y]);}
            s += '^3  |\n';
        }
        console.log(s);
    }

    function pad(n, s) {
        let res = s;
        for (let i = s.length; i < n; i++) {res += ' ';}
        return res;
    }
};

