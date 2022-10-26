onNet('DiscordFramework:Extensions:RunClientSide:Chat', () => {
    console.log('^2[^0Extensions^2:^0Chat^2]^6: ^3Client script initialized!');

    onNet('DiscordFramework:Chat:AddProximityMessage', (RemotePlayerCoords, Message, ProximityRadius) => {
        const LocalPlayerCoords = GetEntityCoords(PlayerPedId(-1));

        const DistanceDifferance = Vdist(... LocalPlayerCoords, ... RemotePlayerCoords);
        console.log(DistanceDifferance);
        if (DistanceDifferance <= ProximityRadius) {
            emit('chat:addMessage', { args: Message });
        }
    });

});

