const Config = require(SH_Config.resourceDirectory + '/core/mongodb/config');

const MongoDB = require('mongodb');

const Client = new MongoDB.MongoClient('mongodb://localhost:27017/', { useUnifiedTopology: true, useNewUrlParser: true, keepAlive: true });
Client.connect(err => {
    if(err) return new Error(err);
    emit('DiscordFramework:MongoDB:Client:Ready');
});

const DatabaseInsertOne = (Collection, Data, Callback) => {
    const client = new MongoDB.MongoClient('mongodb://localhost:27017/', { useUnifiedTopology: true, useNewUrlParser: true, keepAlive: true });
    client.connect(async err => {
        if(err) return new Error(err);
        client.db(Config.databaseName).collection(Collection).insertOne(Data, Callback ? err => Callback(err) : undefined);
        await Delay(50);
        client.close();
    });
};

const DatabaseInserMany = (Collection, Data, Callback) => {
    const client = new MongoDB.MongoClient('mongodb://localhost:27017/', { useUnifiedTopology: true, useNewUrlParser: true, keepAlive: true });
    client.connect(async err => {
        if(err) return new Error(err);
        client.db(Config.databaseName).collection(Collection).insertMany(Data, Callback ? err => Callback(err) : undefined);
        await Delay(50);
        client.close();
    });
};

const DatabaseFindOne = (Collection, Query, Callback) => {
    const client = new MongoDB.MongoClient('mongodb://localhost:27017/', { useUnifiedTopology: true, useNewUrlParser: true, keepAlive: true });
    client.connect(async err => {
        if(err) return new Error(err);
        client.db(Config.databaseName).collection(Collection).findOne(Query).then(Callback ? Result => Callback(Result) : undefined);
        await Delay(50);
        client.close();
    });
};

const DatabaseFind = (Collection, Query, Callback) => {
    const client = new MongoDB.MongoClient('mongodb://localhost:27017/', { useUnifiedTopology: true, useNewUrlParser: true, keepAlive: true });
    client.connect(err => {
        if(err) return new Error(err);
        const cursor = client.db(Config.databaseName).collection(Collection).find(Query);
        cursor.count().then(count => {
            if (count > 0) {
                cursor.toArray().then(arr => {
                    client.close();
                    Callback(arr);
                });
            } else {
                client.close();
                Callback([]);
            }
        });
    });
};

const DatabaseDeleteOne = (Collection, Query, Callback) => {
    const client = new MongoDB.MongoClient('mongodb://localhost:27017/', { useUnifiedTopology: true, useNewUrlParser: true, keepAlive: true });
    client.connect(async err => {
        if(err) return new Error(err);
        client.db(Config.databaseName).collection(Collection).deleteOne(Query, Callback ? err => Callback(err) : undefined);
        await Delay(50);
        client.close();
    });
};

const DatabaseDeleteMany = (Collection, Query, Callback) => {
    const client = new MongoDB.MongoClient('mongodb://localhost:27017/', { useUnifiedTopology: true, useNewUrlParser: true, keepAlive: true });
    client.connect(async err => {
        if(err) return new Error(err);
        client.db(Config.databaseName).collection(Collection).deleteMany(Query, Callback ? err => Callback(err) : undefined);
        await Delay(50);
        client.close();
    });
};

const DatabaseUpdateOne = (Collection, Query, Data, Callback) => {
    const client = new MongoDB.MongoClient('mongodb://localhost:27017/', { useUnifiedTopology: true, useNewUrlParser: true, keepAlive: true });
    client.connect(async err => {
        if(err) return new Error(err);
        client.db(Config.databaseName).collection(Collection).updateOne(Query, Data, Callback ? err => Callback(err) : undefined);
        await Delay(50);
        client.close();
    });
};

const DatabaseUpdateMany = (Collection, Query, Data, Callback) => {
    const client = new MongoDB.MongoClient('mongodb://localhost:27017/', { useUnifiedTopology: true, useNewUrlParser: true, keepAlive: true });
    client.connect(async err => {
        if(err) return new Error(err);
        client.db(Config.databaseName).collection(Collection).updateMany(Query, Data, Callback ? err => Callback(err) : undefined);
        await Delay(50);
        client.close();
    });
};

// ------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------- EXPORTS ----------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = {
    Base: MongoDB,
    Client: Client,
    Config: Config,
    DatabaseInsertOne: DatabaseInsertOne,
    DatabaseInserMany: DatabaseInserMany,
    DatabaseFindOne: DatabaseFindOne,
    DatabaseFind: DatabaseFind,
    DatabaseDeleteOne: DatabaseDeleteOne,
    DatabaseDeleteMany: DatabaseDeleteMany,
    DatabaseUpdateOne: DatabaseUpdateOne,
    DatabaseUpdateMany: DatabaseUpdateMany
};