/* eslint-disable no-undef */
let FreezeLocation;
onNet('DiscordFramework:Commands:Administration:ShowNotification', Message => ShowNotification(Message)); // To send notification from server side

function ShowNotification(message) {
    SetNotificationTextEntry('STRING');
    AddTextComponentString(message);
    DrawNotification(true, false);
}

// -------------------------------------------------------------------------------
// -----------------------------------[ CRASH ]-----------------------------------
// -------------------------------------------------------------------------------

onNet('DiscordFramework:Commands:Administration:Crash', () => { // This belongs to the 'crash' command, it runs in an infinite loop till the client crashes; which is in about 0.0000001ms
    // eslint-disable-next-line no-constant-condition
    while (true) { // This loop will crash anything; including the server if ran on the server side
        true; // just to keep the loop occupied
    }
});

// ------------------------------------------------------------------------------
// -----------------------------[ CRASH//ANNOUNCE ]------------------------------
// ------------------------------------------------------------------------------

onNet('DiscordFramework:Commands:Administration:Executives:Announce', (source, roles, message) => { // This belongs to the 'crash' it sends a message to all executives when someoen gets crashed
    if(GetPlayerServerId(GetPlayerIndex()) !== source) {
        if(!exports.DiscordFramework.CheckPermission(roles)) return;
        emit('chat:addMessage', { args: message });
    }
});

// ------------------------------------------------------------------------------
// -----------------------------------[ kill ]-----------------------------------
// ------------------------------------------------------------------------------

onNet('DiscordFramework:Commands:Administration:Kill', () => { // This obiously belongs to the 'kill' command
    SetEntityHealth(PlayerPedId(), 0);
});

// ------------------------------------------------------------------------------
// ----------------------------------[ FREEZE ]----------------------------------
// ------------------------------------------------------------------------------

onNet('DiscordFramework:Commands:Administration:Freeze', () => { // This also belongs to the 'freeze' where it uses the SetPedConfigFlag as a main native;
    if(!GetPedConfigFlag(PlayerPedId(), 292, true)) { // checks if player is frozen using 292 flag
        SetEntityInvincible(PlayerPedId(), true); // Sets Ped invincible
        FreezeLocation = GetEntityCoords(PlayerPedId(), false); // Gets player's coord on command usage
        SetPedConfigFlag(PlayerPedId(), 292, true); // sets the 292 'Freeze_Ped' flag to true
        SetPedConfigFlag(PlayerPedId(), 62, true); // sets the 62 'No_Ped_Collisions' to true
        SetPedConfigFlag(PlayerPedId(), 331, true); // sets the 331 'No_Ped_Collide' to true;
        ClearPedTasksImmediately(PlayerPedId()); // Clears any task in the ped's tasks
    }
});

// ------------------------------------------------------------------------------
// ---------------------------------[ UNFREEZE ]---------------------------------
// ------------------------------------------------------------------------------

onNet('DiscordFramework:Commands:Administration:Unfreeze', () => { // This belong to the 'unfreeze' command as it says in the event name; duhh
    if(GetPedConfigFlag(PlayerPedId(), 292)) { // checks if player is frozen using 292 flag
        SetEntityInvincible(PlayerPedId(), false); // Sets Ped un-invincible
        SetPedConfigFlag(PlayerPedId(), 292, false); // sets the 292 'Freeze_Ped' flag to false
        SetPedConfigFlag(PlayerPedId(), 62, false);// sets the 62 'No_Ped_Collisions' to false
        SetPedConfigFlag(PlayerPedId(), 331, false);// sets the 331 'No_Ped_Collide' to false;

    }
});

setInterval(() => { // Freeze loop to keep him from moving
    if(GetPedConfigFlag(PlayerPedId(), 292, true)) { // checks if player is frozen using 292 flag
        if(IsPedInAnyVehicle(PlayerPedId(), true)) { // checks if player in a vehicle
            SetEntityAsMissionEntity(GetVehiclePedIsIn(PlayerPedId(), false), true, true); // Makes the vehicle a recognizable entity
            DeleteVehicle(GetVehiclePedIsIn(PlayerPedId(), false)); // Deletes the recognized vehicle
        }
        const [aX, aY, aZ] = GetEntityCoords(PlayerPedId(), false); // Player's current coords
        const [bX, bY, bZ] = FreezeLocation; // The coords gathered from the line 32

        if(aX !== bX || aY !== bY || aZ !== bZ) { // Compares current coord with the cached coords
            SetEntityCoords(PlayerPedId(), bX, bY, bZ, false, false, false, true); // If coords don't match then set their coords to the cached coords
        }
    }
}, 1);

// ------------------------------------------------------------------------------
// -----------------------------------[ ADPM ]-----------------------------------
// ------------------------------------------------------------------------------

onNet('DiscordFramework:Commands:Administration:AdPM:ToAllModerators', (message, roles) => { // This belongs to the 'AdPM' it sends a message to all executives when someoen gets crashed
    if(!exports.DiscordFramework.CheckPermission(roles)) return;
    emit('chat:addMessage', { args: message });
});

// ------------------------------------------------------------------------------
// -----------------------------------[ SLAP ]-----------------------------------
// ------------------------------------------------------------------------------

onNet('DiscordFramework:Commands:Administration:Slap', () => { // This Belongs to the slap command
    let times = 0;
    setInterval(() => { // an interval of 500ms to repeats the function a X = times
        if(times < 10) {
            times++;
            if (IsPedInAnyVehicle(PlayerPedId(), true)) { // check if player is in a vehicle
                const veh = GetVehiclePedIsUsing(PlayerPedId()); // caches the vehicle in a variable
                ApplyForceToEntity(veh, 1, 9500.0, 3.0, 7100.0, 1.0, 0.0, 0.0, 1, false, true, false, false); // applies the slap from on the vehicle
            }
            else{
                ApplyForceToEntity(PlayerPedId(), 1, 3000.0, 3.0, 3000.0, 1.0, 0.0, 0.0, 1, false, true, false, false); // if not in a vehicle; then apply slap force on the ped
            }
        }
    }, 500);
});

// ------------------------------------------------------------------------------
// -----------------------------------[ GOTO ]-----------------------------------
// ------------------------------------------------------------------------------

onNet('DiscordFramework:Commands:Administration:GoTo', (Teleportee) => { // Obviously belongs to the 'goto' command
    const [x, y, z] = GetEntityCoords(GetPlayerPed(GetPlayerFromServerId(Teleportee))); // gets the player's coords
    SetEntityCoords(PlayerPedId(), x, y, z); // sets the admin's coords to the player's coords.... Teleports the admin to the player.
});

// -------------------------------------------------------------------------------
// -----------------------------------[ BRING ]-----------------------------------
// -------------------------------------------------------------------------------

onNet('DiscordFramework:Commands:Administration:Bring', (Moderator, isAll, Message) => { // Belongs to the Bring command; but also does the bring all part too
    if(isAll) { // check if this variable return true; which mean the '/bring all' was used
        if(GetPlayerServerId(GetPlayerIndex()) !== Moderator) { // check if this client's id the same as the moderator who triggered this command
            const [x, y, z] = GetEntityCoords(GetPlayerPed(GetPlayerFromServerId(Moderator))); // if it isn't the same moderator then get the moderator's coordds
            SetEntityCoords(PlayerPedId(), x, y, z); // Then set their's to the moderator's coords; again TP aka. Teleport
            emit('chat:addMessage', { args: Message });
        }
    }
    else { // if isAll return false; then '/bring all' wasn't used
        const [x, y, z] = GetEntityCoords(GetPlayerPed(GetPlayerFromServerId(Moderator))); // Gets the moderator's coords
        SetEntityCoords(PlayerPedId(), x, y, z); // Sets their coords to the moderator's coords; Teleport.
        emit('chat:addMessage', { args: Message });
    }

});

// -----------------------------------------------------------------------------
// -----------------------------------[ ADV ]-----------------------------------
// -----------------------------------------------------------------------------

onNet('DiscordFramework:Commands:Administration:ADV', (Moderator) => { // belongs to the 'adv' command; aka. Admin Delete Vehicle
    if(IsPedInAnyVehicle(PlayerPedId(), true)) {
        SetEntityAsMissionEntity(GetVehiclePedIsIn(PlayerPedId(), false), true, true); // sets the their vehicle as a recognizable vehicle
        DeleteVehicle(GetVehiclePedIsIn(PlayerPedId(), false)); // deletes the recognized vehicle :D
        emitNet('DiscordFramework:Commands:Administration:ADV:Return', 'deleted', Moderator, GetPlayerServerId(GetPlayerIndex())); // Returning event to send a feedback message to the moderator
    }
    else {
        emitNet('DiscordFramework:Commands:Administration:ADV:Return', 'novehicle', Moderator, GetPlayerServerId(GetPlayerIndex())); // Returning event to send a feedback message to the moderator
    }
});

// ----------------------------------------------------------------------------------------
// -----------------------------------[ AJAIL//AUNJAIL ]-----------------------------------
// ----------------------------------------------------------------------------------------

// ========================================================
// ==============[ AJAIL//AUNJAIL VARIABLES ]==============

let isJailed = false;
let releaseCoords = [0, 0, 0];
let jailCoords = [0, 0, 0];
let jailRadius = 0;
let endTimestamp;
let jailMessage = '';
let releaseMessage = '';
let nextMessageTimestamp = 0;

// ========================================================

onNet('DiscordFramework:Commands:Administration:AJail', (JailCoords, JailRadius, JailTime, Jailmessage, ReleaseCoord, ReleaseMessage) => { // belongs to the 'ajail' command; aka. Admin Delete Vehicle
    jailCoords = JailCoords;
    releaseCoords = ReleaseCoord;
    jailRadius = JailRadius;
    endTimestamp = Date.now() + JailTime;
    jailMessage = Jailmessage;
    releaseMessage = ReleaseMessage;
    isJailed = true;
});

onNet('DiscordFramework:Commands:Administration:AUnjail', Moderator => { // belongs to the 'aunjail' command; aka. Admin Delete Vehicle
    if(isJailed) {
        endJail(); // Aunjail function; so i can use it when the time end, and when the aunjail command
        emitNet('DiscordFramework:Commands:Administration:AUnjail:Return', 'unjailed', Moderator, GetPlayerServerId(GetPlayerIndex())); // Returning event to send a feedback message to the moderator
    }
    else {
        emitNet('DiscordFramework:Commands:Administration:AUnjail:Return', 'notjailed', Moderator, GetPlayerServerId(GetPlayerIndex())); // Returning event to send a feedback message to the moderator
    }
});

setInterval(() => { // Loop to jail time, and sends a message of the time left every 30 seconds
    if(isJailed) { // checks if client is jailed
        const CurrentTimestamp = Date.now(); // Get current timestamp
        if(CurrentTimestamp < endTimestamp) { // checks if the endTimestamp is greater than the current timestamp
            if(nextMessageTimestamp < CurrentTimestamp) { // Checks if the nextMessageTimestamp is less than current timestamp
                nextMessageTimestamp = CurrentTimestamp + 30000; // Adjusts the nextMessageTimestamp
                const Message = []; // Message collector array
                Message.push(jailMessage[0]); // Pushes first part of the message into the Message collector
                Message.push(jailMessage[1].split('%t').join(parseInt((endTimestamp - CurrentTimestamp + 1000) / 1000) + ' Seconds')); // Pushes second part of the message into the Message collector after editting it
                emit('chat:addMessage', { args: Message }); // Send the message to the client; from the client
            }
            const [aX, aY, aZ] = GetEntityCoords(PlayerPedId()); //  Gets the current client coords
            const DiffDistance = Vdist(aX, aY, aZ, jailCoords[0], jailCoords[1], jailCoords[2]); // Calculates the differece between the jailCoords and current client coords
            if(DiffDistance > jailRadius) { // checks if the DiffDistance is greater than the jailRadius
                SetEntityCoords(PlayerPedId(), jailCoords[0], jailCoords[1], jailCoords[2], false, false, false, true); // if greater then set the player's coords to the jailCoords; again, Teleport him back to the middle of the jail/hanger
            }
        }
        else {
            endJail(); // if the endTimestamp is less than the timestamp, then release the jailee
        }
    }
}, 1);

function endJail() { // This function releases jailee and resets all the jail variables so it can be used again at a later time
    SetEntityCoords(PlayerPedId(), releaseCoords[0], releaseCoords[1], releaseCoords[2], false, false, false, true);
    emit('chat:addMessage', { args: releaseMessage });
    isJailed = false;
    jailCoords = [0, 0, 0];
    releaseCoords = [0, 0, 0];
    jailRadius = 0;
    endTimestamp;
    jailMessage = '';
    releaseMessage = '';
    nextMessageTimestamp = 0;
}

// ----------------------------------------------------------------------------------------
// ---------------------------------------[ AREPORT ]--------------------------------------
// ----------------------------------------------------------------------------------------

onNet('DiscordFramework:Commands:Administrator:AReport:ToAllModerators', (Message, Roles) => {
    if(exports.DiscordFramework.CheckPermission(Roles)) {
        emit('chat:addMessage', { args: Message });
    }
});

// ----------------------------------------------------------------------------------------
// --------------------------------------[ AIDENSITY ]-------------------------------------
// ----------------------------------------------------------------------------------------

let AIDensity;
onNet('DiscordFramework:Commands:Administrator:AIDensity:Sync', NewAIDensity => {
    AIDensity = NewAIDensity;
});
emitNet('DiscordFramework:Commands:Administrator:AIDensity:Sync:Request', GetPlayerServerId(GetPlayerIndex()));
setInterval(() => {
    SetVehicleDensityMultiplierThisFrame(AIDensity);
    SetPedDensityMultiplierThisFrame(AIDensity);
    SetRandomVehicleDensityMultiplierThisFrame(AIDensity);
    SetParkedVehicleDensityMultiplierThisFrame(AIDensity);
    SetScenarioPedDensityMultiplierThisFrame(AIDensity, AIDensity);
}, 1);


onNet('DiscordFramework:Commands:Administration:SFX', (Group, SFX, _SFX, audio) => {
    PlaySoundFrontend(Group, SFX, _SFX, audio);
});

// ----------------------------------------------------------------------------------------
// ----------------------------------------[ ACMDS ]---------------------------------------
// ----------------------------------------------------------------------------------------

let inUse = false;
let __Config;
let __rank;
let __roleID;

onNet('DiscordFramework:Commands:Administrator:ACMDS', (_Config, _rank, _roleID) => {
    inUse = !inUse;
    __Config = _Config;
    __rank = _rank;
    __roleID = _roleID;
});

function ManageDrawPlist() {
    const Commands = Object.entries(__Config).filter(command => command[1].roles && command[1].roles.includes(__roleID) && command[0].toLowerCase() !== 'acmds');

    const [resx, resy] = GetScreenResolution();


    DrawRect((parseFloat(875) / 1.5) / resx, (parseFloat(624) / 1.5) / resy, (parseFloat(300) / 1.5) / resx, (parseFloat(750) / 1.5) / resy, 0, 0, 0, 200);

    drawText('~w~Admin Commands\n' + __rank + '\n____________', 875, 270, 0.42, true, 0, 119, 146, 173, 255);


    let yoffs = 0.4;
    for (let i = 0; i < Commands.length; i++) {
        const Command = Commands[i];
        const col_na = '~c~';
        drawText(col_na + Command[0].toLowerCase() + ' | ' + Command[1].messages['usage'][1].split(':')[1].split(' |')[0].toLowerCase(), 739, 370 + yoffs, 0.25, false, 0, 119, 146, 173, 255);
        yoffs = yoffs + 21.0;
    }

    const text = '~y~THOSE ARE ALL THE COMMANDS YOU HAVE\nACCESS TO; KEEP IN MIND ALL OF THEM\nARE LOGGED';
    drawText(text, 875, 954, 0.2, true, 0, 255, 255, 255, 255);
}

function drawText(text, x, y, size, center, font) {
    const [resx, resy] = GetScreenResolution();
    SetTextFont(font);
    SetTextScale(size, size);
    SetTextProportional(true);
    SetTextColour(119, 146, 173, 255);
    SetTextCentre(center);
    SetTextDropshadow(0, 0, 0, 0, 0);
    SetTextEntry('STRING');
    AddTextComponentString(text);
    DrawText((parseFloat(x) / 1.5) / resx, ((parseFloat(y) - 6) / 1.5) / resy);
}

setInterval(() => {
    if(inUse) {
        ManageDrawPlist();
    }
}, 1);