/* eslint-disable no-undef */
onNet('DiscordFramework:Commands:Administration:ShowNotification', (Message) => ShowNotification(Message)); // To send notification from server side

function ShowNotification(message) {
    SetNotificationTextEntry('STRING');
    AddTextComponentString(message);
    DrawNotification(true, false);
}

// ----------------------------------------------------------------------------
// ---------------------------------[ REPORT ]---------------------------------
// ----------------------------------------------------------------------------

onNet('DiscordFramework:Commands:Public:Report:ToAllModerators', (Message, Roles) => {
    if(exports.DiscordFramework.CheckPermission(Roles)) {
        emit('chat:addMessage', { args: Message });
    }
});

// ----------------------------------------------------------------------------
// ----------------------------------[ APM ]-----------------------------------
// ----------------------------------------------------------------------------

onNet('DiscordFramework:Commands:Public:APM:ToAllModerators', (Message, Roles) => {
    if(exports.DiscordFramework.CheckPermission(Roles)) {
        emit('chat:addMessage', { args: Message });
    }
});

// ----------------------------------------------------------------------------
// ---------------------------------[ ME//MEG ]--------------------------------
// ----------------------------------------------------------------------------

onNet('DiscordFramework:Commands:Public:Me:Send', (Source, Message, Radius, IsGlobal) => {
    if(IsGlobal) {
        emit('chat:addMessage', { args: Message });
    }
    else{
        const [aX, aY, aZ] = GetEntityCoords(GetPlayerPed(GetPlayerFromServerId(Source)));
        const [bX, bY, bZ] = GetEntityCoords(PlayerPedId());
        const DiffDistance = Vdist(aX, aY, aZ, bX, bY, bZ); // Calculates the differece between the jailCoords and current client coords
        if(DiffDistance <= Radius) {
            emit('chat:addMessage', { args: Message });
        }
    }
});

// ----------------------------------------------------------------------------
// ---------------------------------[ DO//DOG ]--------------------------------
// ----------------------------------------------------------------------------

onNet('DiscordFramework:Commands:Public:Do:Send', (Source, Message, Radius, IsGlobal) => {
    if(IsGlobal) {
        emit('chat:addMessage', { args: Message });
    }
    else{
        const [aX, aY, aZ] = GetEntityCoords(GetPlayerPed(GetPlayerFromServerId(Source)));
        const [bX, bY, bZ] = GetEntityCoords(PlayerPedId());
        const DiffDistance = Vdist(aX, aY, aZ, bX, bY, bZ); // Calculates the differece between the jailCoords and current client coords
        if(DiffDistance <= Radius) {
            emit('chat:addMessage', { args: Message });
        }
    }
});

// ----------------------------------------------------------------------------
// --------------------------------[ 911/AN911 ]-------------------------------
// ----------------------------------------------------------------------------

onNet('DiscordFramework:Commands:Public:911', (Source, Message) => {
    emit('chat:addMessage', { args: Message });
});

// ----------------------------------------------------------------------------
// --------------------------------[ 511/AN511 ]-------------------------------
// ----------------------------------------------------------------------------

onNet('DiscordFramework:Commands:Public:511', (Source, Message) => {
    emit('chat:addMessage', { args: Message });
});

// ----------------------------------------------------------------------------
// --------------------------------[ 311/AN311 ]-------------------------------
// ----------------------------------------------------------------------------

onNet('DiscordFramework:Commands:Public:311', (Source, Message) => {
    emit('chat:addMessage', { args: Message });
});