/* eslint-disable no-undef */
let FirstTime = true;

const Interval = setInterval(() => {
    if (FirstTime) {
        if (NetworkIsSessionStarted()) {
            emitNet('DiscordFramework:Queue:Refresh:Server', GetPlayerServerId(GetPlayerIndex()), GetPlayerName(GetPlayerIndex()));
            FirstTime = false;
            clearInterval(Interval);
        }
    }
}, 0);

onNet('DiscordFramework:Queue:Refresh:Client', () => {
    if (NetworkIsSessionStarted()) {
        return emitNet('DiscordFramework:Queue:Refresh:Server', GetPlayerServerId(GetPlayerIndex()), GetPlayerName(GetPlayerIndex()));
    }
});