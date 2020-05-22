/* eslint-disable no-undef */
onNet('DiscordFramework:PrivateChat:ExecuteMessage', (roles, message) => {
    if(!exports.DiscordFramework.CheckPermission(roles)) return;
    emit('chat:addMessage', { args: message });
});

onNet('DiscordFramework:PrivateChat:ShowNotification', (Message) => ShowNotification(Message)); // To send notification from server side


function ShowNotification(message) {
    SetNotificationTextEntry('STRING');
    AddTextComponentString(message);
    DrawNotification(true, false);
}