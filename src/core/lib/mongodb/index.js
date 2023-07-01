// MODULES IMPORTS
const MongoDB = require('mongodb');

// FILES IMPORTS
const Config = require('../../../config');

// FILE CONSTANTS
const Client = new MongoDB.MongoClient(Config.core.mongo.uri, { useUnifiedTopology: true, maxIdleTimeMS: 0, serverSelectionTimeoutMS: 0, socketTimeoutMS: 0, connectTimeoutMS: 0 });

Client.connect().then(() => {
    emit('DiscordFramework:Core:MongoDB:Ready');

    // Check and initialize Players collections if not available
    FindOne('Players', { _id: 'Initializer' }, result => {
        if(!result) {
            InsertOne('Players', { _id: 'Initializer' }, () => DeleteOne('Players', { _id: 'Initializer' }));
        }
        else {
            DeleteOne('Players', { _id: 'Initializer' });
        }
    });
});


/**
 * Inserts a single document into MongoDB. If documents passed in do not contain the _id field, one will be added to each of the documents missing it by the driver.
 * @param {string} Collection The name of the collection
 * @param {object} Data The data/document
 * @param {(void|any)} Callback An optional callback
 */
const InsertOne = async (Collection, Data, Callback) => {
    emit('DiscordFramework:MongoDB:DatabaseInsertOne', Collection, Data);
    if(Callback) {
        Client.db(Config.core.mongo.databaseName).collection(Collection).insertOne(Data, Callback);
    }
    else {
        return await Client.db(Config.core.mongo.databaseName).collection(Collection).insertOne(Data);
    }
};

/**
 * Inserts an array of documents into MongoDB. If documents passed in do not contain the _id field, one will be added to each of the documents missing it by the driver, mutating the document.
 * @param {string} Collection The name of the collection
 * @param {Array<Object>} Data The data/document
 * @param {(void|any)} Callback An optional callback
 */
const InserMany = async (Collection, Data, Callback) => {
    emit('DiscordFramework:MongoDB:DatabaseInserMany', Collection, Data);
    if(Callback) {
        Client.db(Config.core.mongo.databaseName).collection(Collection).insertMany(Data, Callback);
    }
    else {
        return await Client.db(Config.core.mongo.databaseName).collection(Collection).insertMany(Data);
    }
};

/**
 * Fetches the first document that matches the filter
 * @param {string} Collection The name of the collection
 * @param {object} Filter Query for find Operation
 * @param {(void|any)} Callback An optional callback
 */
const FindOne = async (Collection, Filter, Callback) => {
    emit('DiscordFramework:MongoDB:DatabaseFindOne', Collection, Filter);
    if(Callback) {
        Client.db(Config.core.mongo.databaseName).collection(Collection).findOne(Filter).then(Callback);
    }
    else {
        return await Client.db(Config.core.mongo.databaseName).collection(Collection).findOne(Filter);
    }
};

/**
 * Fetches multiple documents that matches the filter
 * @param {string} Collection The name of the collection
 * @param {object} Filter Query for find Operation
 * @param {(void|any)} Callback An optional callback
 */
const FindMany = async (Collection, Filter, Callback) => {
    emit('DiscordFramework:MongoDB:DatabaseFind', Collection, Filter);
    if(Callback) {
        Client.db(Config.core.mongo.databaseName).collection(Collection).find(Filter).toArray().then(Callback);
    }
    else {
        return await Client.db(Config.core.mongo.databaseName).collection(Collection).find(Filter).toArray();
    }
};


/**
 * Update a single document in a collection
 * @param {string} Collection The name of the collection
 * @param {object} Filter Query for find Operation
 * @param {object} Update The update operations to be applied to the document
 * @param {(void|any)} Callback An optional callback
 */
const UpdateOne = async (Collection, Filter, Update, Callback) => {
    emit('DiscordFramework:MongoDB:DatabaseUpdateOne', Collection, Filter, Update);
    if(Callback) {
        Client.db(Config.core.mongo.databaseName).collection(Collection).updateOne(Filter, Update, Callback);
    }
    else {
        return await Client.db(Config.core.mongo.databaseName).collection(Collection).updateOne(Filter, Update);
    }
};

/**
 * Update multiple documents in a collection
 * @param {string} Collection The name of the collection
 * @param {object} Filter Query for find Operation
 * @param {object} Update The update operations to be applied to the document
 * @param {(void|any)} Callback An optional callback
 */
const UpdateMany = async (Collection, Filter, Update, Callback) => {
    emit('DiscordFramework:MongoDB:DatabaseUpdateMany', Collection, Filter, Update);
    if(Callback) {
        Client.db(Config.core.mongo.databaseName).collection(Collection).updateMany(Filter, Update, Callback);
    }
    else {
        return await Client.db(Config.core.mongo.databaseName).collection(Collection).updateMany(Filter, Update);
    }
};

/**
 * Delete a document from a collection
 * @param {string} Collection The name of the collection
 * @param {object} Filter Query for find Operation
 * @param {(void|any)} Callback An optional callback
 */
const DeleteOne = async (Collection, Filter, Callback) => {
    emit('DiscordFramework:MongoDB:DatabaseDeleteOne', Collection, Filter);
    if(Callback) {
        Client.db(Config.core.mongo.databaseName).collection(Collection).deleteOne(Filter, Callback);
    }
    else {
        return await Client.db(Config.core.mongo.databaseName).collection(Collection).deleteOne(Filter);
    }
};

/**
 * Delete multiple documents from a collection
 * @param {string} Collection The name of the collection
 * @param {object} Filter Query for find Operation
 * @param {(void|any)} Callback An optional callback
 */
const DeleteMany = async (Collection, Filter, Callback) => {
    emit('DiscordFramework:MongoDB:DatabaseDeleteMany', Collection, Filter);
    if(Callback) {
        Client.db(Config.core.mongo.databaseName).collection(Collection).deleteMany(Filter, Callback);
    }
    else {
        return await Client.db(Config.core.mongo.databaseName).collection(Collection).deleteMany(Filter);
    }
};


// CFX Exports
emit('DiscordFramework:Export:Create', 'MongoDB', () => {
    return {
        InsertOne: (Collection, Data, Callback) => {
            return InsertOne(Collection, Data, Callback);
        },
        InserMany: (Collection, Data, Callback) => {
            return InserMany(Collection, Data, Callback);
        },
        FindOne: (Collection, Filter, Callback) => {
            return FindOne(Collection, Filter, Callback);
        },
        FindMany: (Collection, Filter, Callback) => {
            return FindMany(Collection, Filter, Callback);
        },
        UpdateOne: (Collection, Filter, Data, Callback) => {
            return UpdateOne(Collection, Filter, Data, Callback);
        },
        UpdateMany: (Collection, Filter, Data, Callback) => {
            return UpdateMany(Collection, Filter, Data, Callback);
        },
        DeleteOne: (Collection, Filter, Callback) => {
            return DeleteOne(Collection, Filter, Callback);
        },
        DeleteMany: (Collection, Filter, Callback) => {
            return DeleteMany(Collection, Filter, Callback);
        }
    };
});


module.exports = {
    client: Client,
    helpers: {
        InsertOne, InserMany,
        FindOne, FindMany,
        UpdateOne, UpdateMany,
        DeleteOne, DeleteMany
    }
};