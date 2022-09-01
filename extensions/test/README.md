### Permissions Extension 

> Made by ItsAmmarB (ItsAmmarB#7897) 

<b> A Discord Roles based permissions system across multiple discord servers.</b>

## Features
-   Real-Time roles updates. [^1] 
-   Multi-Guild permissions. [^2]
-   Server & Client side exports for external use.
-   Fast and lightweight.
-   Ability to use users' IDs as a permission. 
-   AcePermission Supported[^3]

## Exports (Server)

<details>
  <summary>CheckPermission</summary>
  
### Export
```js 
    /**
     * @description Used to match provided roles IDs and/or users' IDs against players' roles' IDs and/or players' IDs
     * @param PlayerId The player's server ID, or Discord ID
     * @param Roles An array or roles' IDs or users' IDs
     * @param Guild A guild ID (Optional)
     * @returns boolean
     */
    exports('Permissions.CheckPermission', (PlayerId, Roles, Guild = null) => this.CheckPermission(PlayerId, Roles, Guild));
```
### Example 
```js
    
    const source = global.source;
    const roles = [
        '661729283479175226', // "AltIdentifier" role ID in "The WM Project" server
        '613189574029606917', // "Moderator" role ID in "The WM Project" server
        '357877475310733186' // A Random user ID
    ];
    const guild = '572196487222685962' // A Random Discord server ID

    console.log(exports.DiscordFramework['Permissions.CheckPermission'](source, roles, guild))
```
Outcome
```js
    false
```
</details>

<details>
  <summary>GetGuilds</summary>
  
### Export
```js
    /**
     * @description Gets all players' guild/roles
     * @param PlayerId The player's server ID, or Discord ID
     * @param Guild A guild ID (Optional)
     * @returns array
     */
    exports('Permissions.GetGuilds', (PlayerId, Guild = null) => {
        const LocalPlayer = this.players.find(player => player.serverId === PlayerId || player.discordId === PlayerId);
        if(!LocalPlayer) return null;
        if(Guild) {
            return LocalPlayer.guilds.filter(guild => guild.id === guild);
        } else {
            return LocalPlayer.guilds;
        }
    });
```

### Example 1
```js
    const source = global.source;
    const guilds = exports.DiscordFramework['Permissions.GetGuilds'](source)
   
   console.log(guilds)
```
### Outcome 1
```js 
[
    {
        id: GUILD_ID,
        roles: [
            {
                id: ROLE_ID,
                name: ROLE_NAME
            },
            {
                id: ROLE_ID,
                name: ROLE_NAME
            }
        ]
    },
    {
        id: GUILD_ID,
        roles: [
            {
                id: ROLE_ID,
                name: ROLE_NAME
            },
            {
                id: ROLE_ID,
                name: ROLE_NAME
            }
        ]
    }
]
```

### Example 2
```js
    const source = global.source;
    const guild = '572196487222685962' // A random Discord server ID
    const guilds = exports.DiscordFramework['Permissions.GetGuilds'](source, guild)
   
   console.log(guilds)
```
### Outcome 2
```js 
    []
```
</details>

<details>
  <summary>GetAllowedGuilds</summary>
  
### Export
```js 
     /**
     * @description Used to get all of the allowed guilds or search for one within the allowed guilds for the members' roles to be fetched from; guilds must be registered in the config
     * @param GuildID The guild ID (Option)
     * @return object
     */
    exports('Permissions.GetAllowedGuilds', (Guild = null) => this.GetAllowedGuilds(Guild));
```
### Example 1
```js
    console.log(exports.DiscordFramework['Permissions.GetAllowedGuilds']())
```
### Outcome 1
```js
    [
        {
            id: '572195744652685962',
            name: 'COMMUNITY NAME',
            main: true
        },
        {
            id: '572194787882610962',
            name: 'COMMUNITY NAME'
        }
    ]
```

### Example 2
```js
    const Guild = '572196487222685962' // A random Discord server ID

    console.log(exports.DiscordFramework['Permissions.GetAllowedGuilds'](Guild))
```
### Outcome 2
```js
    []
```
</details>

<details>
  <summary>GetDiscordID</summary>
  
### Export
```js 
     /**
     * @description Get the players' discord ID from the server ID
     * @param PlayerId The player's server ID, or Discord ID
     * @return string
     */
    exports('Permissions.GetDiscordID', PlayerId => {
        const LocalPlayer = this.players.find(player => player.serverId === PlayerId || player.discordId === PlayerId);
        if(!LocalPlayer) return null;
        return LocalPlayer.discordId;
    });
```
### Example
```js
    const source = global.source;

    console.log(exports.DiscordFramework['Permissions.GetDiscordID'](source))
```
### Outcome
```js
    'DISCORD USER ID'
```

</details>

<details>
  <summary>GetServerID</summary>
  
### Export
```js 
     /**
     * @description Get the players' server ID from the discord ID
     * @param PlayerId The player's server ID, or Discord ID
     * @return number
     */
    exports('Permissions.GetServerID', PlayerId => {
        const LocalPlayer = this.players.find(player => player.serverId === PlayerId || player.discordId === PlayerId);
        if(!LocalPlayer) return null;
        return LocalPlayer.serverId;
    });
```
### Example
```js
    const source = 'DISCORD USER ID';

    console.log(exports.DiscordFramework['Permissions.GetDiscordID'](source))
```
### Outcome

```js
    'PLAYER SERVER ID'
```
</details>

<br/>

## Exports (Client)

<details>
  <summary>CheckPermission</summary>
  
### Export
```js 
    /**
     * @description Used to match provided roles IDs and/or users' IDs against players' roles' IDs and/or players' IDs
     * @param Roles An array or roles' IDs or users' IDs
     * @param Guild A guild ID (Optional)
     * @returns boolean
     */
    exports('Permissions.CheckPermission', (Roles, Guild = null) => CheckPermission(Roles, Guild));
```
### Example 
```js
    
    const roles = [
        '661729283479175226', // "AltIdentifier" role ID in "The WM Project" server
        '613189574029606917', // "Moderator" role ID in "The WM Project" server
        '357877475310733186' // A Random user ID
    ];
    const guild = '572196487222685962' // A Random Discord server ID

    console.log(exports.DiscordFramework['Permissions.CheckPermission'](roles, guild))
```
Outcome
```js
    false
```
</details>

<details>
  <summary>GetGuilds</summary>
  
### Export
```js
    /**
     * @description Gets all players' guild/roles
     * @param Guild A guild ID (Optional)
     * @returns array
     */
    exports('Permissions.GetGuilds', (Guild = null) => Guild ? Guilds.filter(guild => guild.id === Guild) : Guilds);
```

### Example 1
```js
    const guilds = exports.DiscordFramework['Permissions.GetGuilds']()
   
   console.log(guilds)
```
### Outcome 1
```js 
[
    {
        id: GUILD_ID,
        roles: [
            {
                id: ROLE_ID,
                name: ROLE_NAME
            },
            {
                id: ROLE_ID,
                name: ROLE_NAME
            }
        ]
    },
    {
        id: GUILD_ID,
        roles: [
            {
                id: ROLE_ID,
                name: ROLE_NAME
            },
            {
                id: ROLE_ID,
                name: ROLE_NAME
            }
        ]
    }
]
```

### Example 2
```js
    const guild = '572196487222685962' // A random Discord server ID
    const guilds = exports.DiscordFramework['Permissions.GetGuilds'](guild)
   
   console.log(guilds)
```
### Outcome 2
```js 
    []
```
</details>

<details>
  <summary>GetAllowedGuilds</summary>
  
### Export
```js 
     /**
     * @description Used to get all of the allowed guilds or search for one within the allowed guilds for the members' roles to be fetched from; guilds must be registered in the config
     * @param GuildID The guild ID (Option)
     * @return object
     */
    exports('Permissions.GetAllowedGuilds', (Guild = null) => GetAllowedGuilds(Guild));
```
### Example 1
```js
    console.log(exports.DiscordFramework['Permissions.GetAllowedGuilds']())
```
### Outcome 1
```js
    [
        {
            id: '572195744652685962',
            name: 'COMMUNITY NAME',
            main: true
        },
        {
            id: '572194787882610962',
            name: 'COMMUNITY NAME'
        }
    ]
```

### Example 2
```js
    const Guild = '572196487222685962' // A random Discord server ID

    console.log(exports.DiscordFramework['Permissions.GetAllowedGuilds'](Guild))
```
### Outcome 2
```js
    []
```
</details>

<details>
  <summary>GetDiscordID</summary>
  
### Export
```js 
     /**
     * @description Get the players' discord ID from the server ID
     * @return string
     */
    exports('Permissions.GetDiscordID', () => DiscordID);
```
### Example
```js
    console.log(exports.DiscordFramework['Permissions.GetDiscordID']())
```
### Outcome
```js
    'DISCORD USER ID'
```

</details>

<details>
  <summary>GetServerID</summary>
  
### Export
```js 
     /**
     * @description Get the players' server ID from the discord ID
     * @return number
     */
    exports('Permissions.GetServerID', () => ServerID);
```
### Example
```js
    console.log(exports.DiscordFramework['Permissions.GetDiscordID']())
```
### Outcome
```js
    'PLAYER SERVER ID'
```

</details>

<br/>

## Server Config
The server config has very detailed comments, make sure to go through them before making any changes.

## Client Config
There isn't one :P

<br/>

---

[^1]: Using the "guildMemberUpdate" event from the discord client to update both server and client side upon changes instantly.

[^2]: Roles can be used from different discord servers as long as the discord bot is present in the server and posses the correct permissions.

[^3]: The extension can be used to add/remove certain aces and principals, but cannot use AcePermission to check for a permission.
