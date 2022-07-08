exports('DatabaseInsertOne', (Collection, Query, Callback) => IsCoreReady ? DatabaseInsertOne(Collection, Query, _Callback => Callback(_Callback)) : null),
exports('DatabaseInserMany', (Collection, Query, Callback) => IsCoreReady ? DatabaseInserMany(Collection, Query, _Callback => Callback(_Callback)) : null),
exports('DatabaseFindOne', (Collection, Query, Callback) => IsCoreReady ? DatabaseFindOne(Collection, Query, _Callback => Callback(_Callback)) : null),
exports('DatabaseFind', (Collection, Query, Callback) => IsCoreReady ? DatabaseFind(Collection, Query, _Callback => Callback(_Callback)) : null),
exports('DatabaseDeleteOne', (Collection, Query, Callback) => IsCoreReady ? DatabaseDeleteOne(Collection, Query, _Callback => Callback(_Callback)) : null),
exports('DatabaseDeleteMany', (Collection, Query, Callback) => IsCoreReady ? DatabaseDeleteMany(Collection, Query, _Callback => Callback(_Callback)) : null),
exports('DatabaseUpdateOne', (Collection, Query, Data, Callback) => IsCoreReady ? DatabaseUpdateOne(Collection, Query, Data, _Callback => Callback(_Callback)) : null),
exports('DatabaseUpdateMany', (Collection, Query, Data, Callback) => IsCoreReady ? DatabaseUpdateMany(Collection, Query, Data, _Callback => Callback(_Callback)) : null);


/**
 * This was made to provide resource exports only
 */