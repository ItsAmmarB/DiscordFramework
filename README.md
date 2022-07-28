# DiscordFramework - Indev

A modular and customizable framework that utilizes Discord for player identification and MongoDB as a database.


## Requirements

- A working FiveM server using [artifacts](https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/) v4558 or higher
- A discord bot token | [discord.com](https://discord.com/developers/)
- MongoDB service _(preferably community version )_ | [mongodb.com](https://www.mongodb.com/try/download/community)
- Basic knowledge of JavaScript _(Recommended)_
- Basic knowledge of how FiveM works _(Recommended)_


## How does it works?

The framework was designed to provide a simple yet comprehensive evniornment with added functions, method, variables, and more.

Upon starting the resource, the framework will immediatelly start logging basic player information such as player ID, discord ID, connection timestamp and disconnection timestmap and store it as an element in a array for an easy and fast access to be utilized by the extensions or external resources.

It will also log even more information about the player and store it in a MongoDB database; such as discord ID, last server ID, playtime, last seen timestamp, all identifiers [^1], all names [^2], and geo location [^3] for better identification, some detail are updated constantly to improve identification such as names, identifiers, and geo location are updated every time the player connects to the server, also playtime and last seen timestamp are updated every minute.

_NOTE: The resource will require players to have discord linked with their game, otherwise it will reject their connection_


## Why Discord and MongoDB?

The main reason why Discord and MongoDB is, because Discord is the most trusted and used communication platform for gaming on the internet as of now and it's being used as the primary communication method for most communities, and MongoDB because; it's easy to used and has its GUI [MongoDBCompass](https://www.mongodb.com/products/compass) for better readability.


## How to maintain?

You simply don't :D

If you ever face a bug or an issue caused by the framework core, make sure to create an issue card in the GitHub [repository](https://github.com/ItsAmmarB/DiscordFramework).

otherwise, report the bug to the respective extension author.


## How do I make an extension?

I'm glad you're intersted, first off; you would need some basic knowledge in JavaScript, then head over to the [Template](https://github.com/ItsAmmarB/DiscordFramework/tree/master/extensions/Template) folder located in the extensions folder, there you will find a decently detailed guide on how to create your own extension, with all the functions, method, event, and export the framework provides to make it easier for you to navigate.

Am I allowed to share or publish the extension I created? you might ask, the short answer is; Yes, you have all the right to do whatever you want with it, as long as you do not start to cause harm/damage otherwise; the extension will be blocked
---

<details>
<summary>Core</summary>

## Server Events:

```js
emit('DiscordFramework:Core:Ready')
```

```js
emit('DiscordFramework:Player:Connecting', PlayerConnId, Deferrals);
```

```js
emit('DiscordFramework:Player:Connected', PlayerId)
```

```js
emit('DiscordFramework:Player:Disconnected', global.source, Reason)
```


## Server Exports

```js
exports('Ready', () => IsCoreReady);
```

```js
// PlayerId can be server ID or discord ID
exports('GetPlayerInfo', (PlayerId, fromNetwork = false) => fromNetwork ? SV_Config.Core.Players.Network.find(p => p.serverId === PlayerId) : SV_Config.Core.Players.Connected.find(p => p.serverId === PlayerId) || null);
```

```js
exports('GetPlayerIdentifiers', (PlayerId) => GetPlayerIdentifiers(PlayerId));
```

```js 
exports('GetPlayers', () => SV_Config.Core.Players);
```

---

## Client Events

_None_


## Client Exports

_None_


</details>

<details>
<summary>Discord</summary>

## Server Events:

_None_


## Server Exports

```js
exports('GetGuild', (GuildId) => IsCoreReady ? new Promise(resolve => resolve(GetGuild(GuildId))) : null),
```

```js
// PlayerId can be server ID or discord ID
exports('GetMember', (PlayerId, GuildId = null) => IsCoreReady ? new Promise(resolve => resolve(GetMember(PlayerId, GuildId))) : null),
```

```js
exports('GetRole', (RoleId, GuildId = null) => IsCoreReady ? new Promise(resolve => resolve(GetRole(RoleId, GuildId))) : null);
```

---

## Client Events

_None_


## Client Exports

_None_


</details>

<details>
<summary>Extensions</summary>

## Server Events:

```js
emit('DiscordFramework:Extensions:Registered', this.Name, this.State)
```


## Server Exports

```js
exports('Extension', () => Extensions);
```

```js
exports('GetExtension', extentionName => IsCoreReady ? GetExtension(extentionName) : null);
```

```js
exports('GetExtensionsCount', () => GetExtensionsCount());
```

```js
exports('TranslateState', (State) => TranslateState(State));
```

---

## Client Events

_None_


## Client Exports

_None_


</details>

<details>
<summary>MongoDB</summary>

## Server Events:

```js
    emit('DiscordFramework:MongoDB:DatabaseInsertOne', Collection, Data, Callback)
```

```js
    emit('DiscordFramework:MongoDB:DatabaseInserMany', Collection, Data, Callback)
```

```js
    emit('DiscordFramework:MongoDB:DatabaseFindOne', Collection, Query, Callback)
```

```js
    emit('DiscordFramework:MongoDB:DatabaseFind', Collection, Query, Callback)
```

```js
    emit('DiscordFramework:MongoDB:DatabaseDeleteOne', Collection, Query, Callback)
```

```js
    emit('DiscordFramework:MongoDB:DatabaseDeleteMany', Collection, Query, Callback)
```

```js
    emit('DiscordFramework:MongoDB:DatabaseUpdateOne', Collection, Query, Data, Callback)
```

```js
    emit('DiscordFramework:MongoDB:DatabaseUpdateMany', Collection, Query, Data, Callback)
```


## Server Exports

```js
exports('DatabaseInsertOne', (Collection, Query, Callback) => IsCoreReady ? DatabaseInsertOne(Collection, Query, _Callback => Callback(_Callback)) : null),
```

```js
exports('DatabaseInserMany', (Collection, Query, Callback) => IsCoreReady ? DatabaseInserMany(Collection, Query, _Callback => Callback(_Callback)) : null),
```

```js
exports('DatabaseFindOne', (Collection, Query, Callback) => IsCoreReady ? DatabaseFindOne(Collection, Query, _Callback => Callback(_Callback)) : null),
```

```js
exports('DatabaseFind', (Collection, Query, Callback) => IsCoreReady ? DatabaseFind(Collection, Query, _Callback => Callback(_Callback)) : null),
```

```js
exports('DatabaseDeleteOne', (Collection, Query, Callback) => IsCoreReady ? DatabaseDeleteOne(Collection, Query, _Callback => Callback(_Callback)) : null),
```

```js
exports('DatabaseDeleteMany', (Collection, Query, Callback) => IsCoreReady ? DatabaseDeleteMany(Collection, Query, _Callback => Callback(_Callback)) : null),
```

```js
exports('DatabaseUpdateOne', (Collection, Query, Data, Callback) => IsCoreReady ? DatabaseUpdateOne(Collection, Query, Data, _Callback => Callback(_Callback)) : null),
```

```js
exports('DatabaseUpdateMany', (Collection, Query, Data, Callback) => IsCoreReady ? DatabaseUpdateMany(Collection, Query, Data, _Callback => Callback(_Callback)) : null);
```

---

## Client Events

_None_


## Client Exports

_None_


</details>


[^1]: Meaning, if new identifiers were to appear, those will also be added to the pre-existing identifiers.

[^2]: Meaning, if the player were to join using a different name, it will be added to the pre-existing names.

[^3]: Geo location will only output the country and the region of the player using their IP address for web usage, such as languages and webpanels
