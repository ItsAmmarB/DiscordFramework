exports('Extension', () => Extensions);
exports('GetExtension', extentionName => IsCoreReady ? GetExtension(extentionName) : null);
exports('GetExtensionsCount', () => GetExtensionsCount());
exports('TranslateState', (State) => TranslateState(State));

/**
 * This was made to provide resource exports only
 */