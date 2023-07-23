const { createWriteStream, mkdirSync, existsSync } = require('fs');

const Directory = GetResourcePath(GetCurrentResourceName()) + '/logs';
if (!existsSync(`${Directory}/players`)) {
    mkdirSync(`${Directory}/players`, {
        recursive: true
    });
}
const Players = createWriteStream(`${Directory}/players/${Date.now()}.txt`, {
    flags: 'a' // 'a' means appending (old data will be preserved)
});

if (!existsSync(`${Directory}/actions`)) {
    mkdirSync(`${Directory}/actions`, {
        recursive: true
    });
}
const Actions = createWriteStream(`${Directory}/actions/${Date.now()}.txt`, {
    flags: 'a' // 'a' means appending (old data will be preserved)
});

if (!existsSync(`${Directory}/debugs`)) {
    mkdirSync(`${Directory}/debugs`, {
        recursive: true
    });
}
const Debug = createWriteStream(`${Directory}/debugs/${Date.now()}.txt`, {
    flags: 'a' // 'a' means appending (old data will be preserved)
});

const getDateAndtime = () => {
    const CurDate = new Date();

    const Year = String(new Date().getFullYear());
    const Month = String(CurDate.getMonth() + 1).length < 2 ? `0${CurDate.getMonth() + 1}` : CurDate.getMonth() + 1;
    const Day = String(CurDate.getDate() + 1).length < 2 ? `0${CurDate.getDate()}` : CurDate.getDate();

    const Hour = String(CurDate.getHours() + 1).length < 2 ? `0${CurDate.getHours()}` : CurDate.getHours();
    const Minute = String(CurDate.getMinutes() + 1).length < 2 ? `0${CurDate.getMinutes()}` : CurDate.getMinutes();
    const Second = String(CurDate.getSeconds() + 1).length < 2 ? `0${CurDate.getSeconds()}` : CurDate.getSeconds();

    return `${Year}-${Month}-${Day} | ${Hour}:${Minute}:${Second}`;
};

module.exports = {
    player: log => Players.write(`\n[${getDateAndtime()}] ${log.split(/\^\d+/).join('')}`),
    actions: log => Actions.write(`\n[${getDateAndtime()}] ${log.split(/\^\d+/).join('')}`),
    debug: log => Debug.write(`\n[${getDateAndtime()}] ${log.split(/\^\d+/).join('')}`)
};
