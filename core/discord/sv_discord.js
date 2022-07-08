exports('GetGuild', (GuildId) => IsCoreReady ? new Promise(resolve => resolve(GetGuild(GuildId))) : null),
exports('GetMember', (PlayerId, GuildId = null) => IsCoreReady ? new Promise(resolve => resolve(GetMember(PlayerId, GuildId))) : null),
exports('GetRole', (RoleId, GuildId = null) => IsCoreReady ? new Promise(resolve => resolve(GetRole(RoleId, GuildId))) : null);


/**
 * This was made to provide resource exports only
 */