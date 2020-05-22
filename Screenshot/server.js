/* eslint-disable no-undef */
exports('GetScreenshot', (Moderator, Player) => {
    exports['screenshot'].requestClientScreenshot(Player, {
        fileName: 'resources/DiscordFramework/Screenshot/Screenshots/screenshot.jpg'
    }, () => {
        const image = fs.readFileSync(`${GetResourcePath(GetCurrentResourceName())}/Screenshot/Screenshots/screenshot.jpg`, 'base64');
        emitNet('chat:addMessage', Moderator, { template: '<img src="{0}" style="max-width: 300px;" />', args: [`data:image/jpeg;base64, ${image}`] });
    });
});