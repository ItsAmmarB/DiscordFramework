/* eslint-disable no-undef */
let DMConfig = undefined;
let DMConfigRetrieved = false;

let isAlive = true;
let justDied = true;
let reviveTimer = 0;
let respawnTimer = 0;
let reviveMessageTimer = 0;
let respawnMessageTimer = 0;
let isReviveAllowed = false;
let isRespawnAllowed = false;

const colors = [
    [
        '~c~',
        '~r~'
    ],
    [
        '~y~',
        '~y~'
    ]
];

let isWarningInEffect = false;
let currentTimer = 0;
let warningCounter = 0;

const colGray = colors[0][0];
let colRed = colors[0][1];

onNet('onClientMapStart', () => {
    exports.spawnmanager.spawnPlayer();
    setTimeout(() => {
        console.log('test - Net');
        exports.spawnmanager.setAutoSpawn(false);
        emitNet('DiscordFramework:DeathManager:OnJoin:Retrieve', GetPlayerServerId(GetPlayerIndex(-1)));
    }, 3000);
});

on('onClientResourceStart', (resourceName) => {
    if (!DMConfigRetrieved) {
        if (GetCurrentResourceName() === resourceName) {
            emitNet('DiscordFramework:DeathManager:OnJoin:Retrieve', GetPlayerServerId(GetPlayerIndex(-1)));
        }
    }
});

onNet('DiscordFramework:DeathManager:OnJoin:Retrieve:Return', _DMConfig => {
    DMConfig = _DMConfig;
    DMConfigRetrieved = true;
});

onNet('DiscordFramework:DeathManager:ToggleDeathManager', _DMConfig => {
    DMConfig = _DMConfig;
});

onNet('DiscordFramework:DeathManager:Revive', (__Config) => {
    if(GetEntityHealth(PlayerPedId()) <= 2) {
        if(isReviveAllowed) {
            RevivePed(PlayerPedId());
        }
        else {
            PlayWarning();
        }
    }
    else {
        emit('chat:addMessage', { args: __Config['alive'] });
    }
});

onNet('DiscordFramework:DeathManager:Respawn', (__Config) => {
    if(GetEntityHealth(PlayerPedId()) <= 2) {
        if(isRespawnAllowed) {
            RespawnPed(PlayerPedId());
        }
        else {
            PlayWarning();
        }
    }
    else {
        emit('chat:addMessage', { args: __Config['alive'] });
    }
});

onNet('DiscordFramework:DeathManager:AdminRevive', (Moderator, isAll) => {
    if(isAll) {
        if(GetEntityHealth(PlayerPedId()) <= 2) {
            RevivePed(PlayerPedId());
            emitNet('DiscordFramework:DeathManager:Admin:Return', GetPlayerServerId(GetPlayerIndex(-1)), Moderator, 'all', 'AdRev');
        }
    }
    else if(!isAll && GetEntityHealth(PlayerPedId()) <= 2) {
        RevivePed(PlayerPedId());
        emitNet('DiscordFramework:DeathManager:Admin:Return', GetPlayerServerId(GetPlayerIndex(-1)), Moderator, 'revived', 'AdRev');
    }
    else {
        emitNet('DiscordFramework:DeathManager:Admin:Return', GetPlayerServerId(GetPlayerIndex(-1)), Moderator, 'alive', 'AdRev');
    }
});

onNet('DiscordFramework:DeathManager:AdminRespawn', (Moderator, isAll) => {
    if(isAll) {
        if(GetEntityHealth(PlayerPedId()) <= 2) {
            RespawnPed(PlayerPedId());
            emitNet('DiscordFramework:DeathManager:Admin:Return', GetPlayerServerId(GetPlayerIndex(-1)), Moderator, 'all', 'AdRes');
        }
    }
    else if(!isAll && GetEntityHealth(PlayerPedId()) <= 2) {
        RespawnPed(PlayerPedId());
        emitNet('DiscordFramework:DeathManager:Admin:Return', GetPlayerServerId(GetPlayerIndex(-1)), Moderator, 'respawned', 'AdRes');
    }
    else {
        emitNet('DiscordFramework:DeathManager:Admin:Return', GetPlayerServerId(GetPlayerIndex(-1)), Moderator, 'alive', 'AdRes');
    }
});


setInterval(() => {
    if(isWarningInEffect) {
        if(parseInt(Date.now() / 400) > currentTimer) {
            warningCounter++;
            PlaySoundFrontend(-1, 'HACKING_CLICK', 0, 1);
            currentTimer = parseInt(Date.now() / 400);
            colRed = colors[0][1] === colRed ? colors[1][1] : colors[0][1];
            if(warningCounter > 9) {
                warningCounter = 0;
                isWarningInEffect = false;
                colRed = colors[0][1];
            }
        }
    }
}, 1);

setInterval(() => {
    if(DMConfigRetrieved) {
        const Ped = PlayerPedId();
        if(IsEntityDead(Ped) && GetEntityHealth(Ped) <= 1) {
            if(DMConfig.enabled) {
                if(justDied) {
                    justDied = false;
                    isAlive = false;
                    reviveTimer = Date.now() + (DMConfig.reviveWaitTime * 1000);
                    respawnTimer = Date.now() + (DMConfig.respawnWaitTime * 1000);
                }

                SetPlayerInvincible(Ped, true);
                SetEntityHealth(Ped, 1);

                DrawTextOnScreen(`${colGray}Revive: ${parseInt((reviveTimer - Date.now()) / 1000) < 0 ? ' ~g~/Revive' : parseInt((reviveTimer - Date.now()) / 1000) === 1 ? colRed + ' In' + parseInt((reviveTimer - Date.now()) / 1000) + ' second' : colRed + 'In ' + parseInt((reviveTimer - Date.now()) / 1000) + ' seconds'}\n${colGray}Respawn: ${parseInt((respawnTimer - Date.now()) / 1000) < 0 ? ' ~g~/Respawn' : parseInt((respawnTimer - Date.now()) / 1000) === 1 ? colRed + 'In ' + parseInt((respawnTimer - Date.now()) / 1000) + ' second' : colRed + 'In ' + parseInt((respawnTimer - Date.now()) / 1000) + ' seconds'}`);

                const CurrentTimestamp = Date.now();

                if(CurrentTimestamp >= reviveTimer) {
                    if(!isReviveAllowed) {
                        isReviveAllowed = true;
                    }
                }
                else if(CurrentTimestamp >= reviveMessageTimer) {
                    reviveMessageTimer = Date.now() + DMConfig.messagesWaitTimer;
                    if(isReviveAllowed) {
                        isReviveAllowed = false;
                    }
                }

                if(CurrentTimestamp >= respawnTimer) {
                    if(!isRespawnAllowed) {
                        isRespawnAllowed = true;
                    }
                }
                else if(CurrentTimestamp >= respawnMessageTimer) {
                    respawnMessageTimer = Date.now() + DMConfig.messagesWaitTimer;
                    if(isRespawnAllowed) {
                        isRespawnAllowed = false;
                    }
                }

            }
            else {
                RespawnPed(Ped);
            }
        }
        else if(!IsEntityDead(Ped) && !isAlive) {
        // Draw Message here: Stop Cheating
            SetEntityHealth(Ped, 1);
        }
    }
}, 1);

function ResetVariables() {
    isAlive = true;
    justDied = true;
    reviveTimer = 0;
    respawnTimer = 0;
    reviveMessageTimer = 0;
    respawnMessageTimer = 0;
    isReviveAllowed = false;
    isRespawnAllowed = false;
}

function RevivePed(Ped) {
    const [x, y, z] = GetEntityCoords(Ped, true);
    const heading = GetEntityHeading(Ped);
    NetworkResurrectLocalPlayer(x, y, z, heading, true, false);
    SetPlayerInvincible(Ped, false);
    ClearPedBloodDamage(Ped);
    ResetVariables();

}

function RespawnPed(Ped) {
    const [x, y, z, heading] = GetNearestHospital(Ped);
    SetEntityCoordsNoOffset(Ped, x, y, z, false, false, false, true);
    NetworkResurrectLocalPlayer(x, y, z, heading, true, false);

    SetPlayerInvincible(Ped, false);

    TriggerEvent('playerSpawned', x, y, z, heading);
    ClearPedBloodDamage(Ped);
    ResetVariables();
}

function GetNearestHospital(Ped) {
    const Hospitals = DMConfig.hospitals;
    const [aX, aY, aZ] = GetEntityCoords(Ped);
    const Distances = [];
    for (let i = 0; i < Hospitals.length; i++) {
        const [bX, bY, bZ, heading] = Hospitals[i];
        const Diff = Vdist(aX, aY, aZ, bX, bY, bZ);
        Distances.push({ distance: Diff, x: bX, y: bY, z: bZ, heading : heading });
    }
    const closestHospital = Distances.reduce((a, b) => a.distance < b.distance ? a : b);
    delete closestHospital.distance;
    return [closestHospital.x, closestHospital.y, closestHospital.z, closestHospital.heading];
}

function DrawTextOnScreen(text) {
    SetTextFont(4);
    SetTextScale(0.4, 0.4);
    SetTextOutline();
    SetTextEntry('STRING');
    AddTextComponentString(text);
    DrawText(0.01, 0.465);
}

function PlayWarning() {
    isWarningInEffect = true;
    currentTimer = parseInt(Date.now() / 400);
}