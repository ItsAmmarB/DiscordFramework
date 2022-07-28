const { MongoClient } = require('mongodb');

const Client = new MongoClient('mongodb://localhost:27017/', { useUnifiedTopology: true, useNewUrlParser: true, keepAlive: true });

Client.connect(err => {
    if (err) return new Error(err);
    emit('DiscordFramework:Module:Ready', 'MongoDB');
});

// --------------------------------------
//              FUNCTIONS
// --------------------------------------

const DatabaseInsertOne = (Collection, Data, Callback) => {
    Client.connect();
    emit('DiscordFramework:MongoDB:DatabaseInsertOne', Collection, Data, Callback);
    Client.db(GetCurrentResourceName()).collection(Collection).insertOne(Data, Callback ? err => Callback(err) : undefined);
};

const DatabaseInserMany = (Collection, Data, Callback) => {
    Client.connect();
    emit('DiscordFramework:MongoDB:DatabaseInserMany', Collection, Data, Callback);
    Client.db(GetCurrentResourceName()).collection(Collection).insertMany(Data, Callback ? err => Callback(err) : undefined);
};

const DatabaseFindOne = (Collection, Query, Callback) => {
    Client.connect();
    emit('DiscordFramework:MongoDB:DatabaseFindOne', Collection, Query, Callback);
    Client.db(GetCurrentResourceName()).collection(Collection).findOne(Query).then(Callback ? Result => Callback(Result) : undefined);
};

const DatabaseFind = (Collection, Query, Callback) => {
    Client.connect();
    emit('DiscordFramework:MongoDB:DatabaseFind', Collection, Query, Callback);
    const cursor = Client.db(GetCurrentResourceName()).collection(Collection).find(Query);
    cursor.count().then(count => {
        if (count > 0) {
            cursor.toArray().then(arr => {
                Callback(arr);
            });
        } else {
            Callback([]);
        }
    });
};

const DatabaseDeleteOne = (Collection, Query, Callback) => {
    Client.connect();
    emit('DiscordFramework:MongoDB:DatabaseDeleteOne', Collection, Query, Callback);
    Client.db(GetCurrentResourceName()).collection(Collection).deleteOne(Query, Callback ? err => Callback(err) : undefined);
};

const DatabaseDeleteMany = (Collection, Query, Callback) => {
    Client.connect();
    emit('DiscordFramework:MongoDB:DatabaseDeleteMany', Collection, Query, Callback);
    Client.db(GetCurrentResourceName()).collection(Collection).deleteMany(Query, Callback ? err => Callback(err) : undefined);
};

const DatabaseUpdateOne = (Collection, Query, Data, Callback) => {
    Client.connect();
    emit('DiscordFramework:MongoDB:DatabaseUpdateOne', Collection, Query, Data, Callback);
    Client.db(GetCurrentResourceName()).collection(Collection).updateOne(Query, Data, Callback ? err => Callback(err) : undefined);
};

const DatabaseUpdateMany = (Collection, Query, Data, Callback) => {
    Client.connect();
    emit('DiscordFramework:MongoDB:DatabaseUpdateMany', Collection, Query, Data, Callback);
    Client.db(GetCurrentResourceName()).collection(Collection).updateMany(Query, Data, Callback ? err => Callback(err) : undefined);
};

// --------------------------------------
//                EXPORTS
// --------------------------------------

module.exports = {
    Client: Client,
    DatabaseInsertOne: DatabaseInsertOne,
    DatabaseInserMany: DatabaseInserMany,
    DatabaseFindOne: DatabaseFindOne,
    DatabaseFind: DatabaseFind,
    DatabaseDeleteOne: DatabaseDeleteOne,
    DatabaseDeleteMany: DatabaseDeleteMany,
    DatabaseUpdateOne: DatabaseUpdateOne,
    DatabaseUpdateMany: DatabaseUpdateMany
};