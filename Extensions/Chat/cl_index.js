onNet('DiscordFramework:Chat:AddProximityMessage', (RemotePlayerCoords, Message, ProximityRadius) => {
    const LocalPlayerCoords = GetEntityCoords(PlayerPedId(-1));

    const DistanceDifferance = Vdist(... LocalPlayerCoords, ... RemotePlayerCoords);
    console.log(DistanceDifferance);
    if (DistanceDifferance <= ProximityRadius) {
        emit('chat:addMessage', { args: Message });
    }
});