const { Module: Modules } = require('../../modules');

module.exports.Module = class MongoDB extends Modules {
    constructor(modules) {
        super(modules, {
            name: 'MongoDB',
            description: 'MongoDB integration module',
            toggle: true,
            version: '1.0',
            author: 'ItsAmmarB',
            config: require('../../config').MongoDB
        });

        const { MongoClient } = require('mongodb');
        const uri = 'mongodb://localhost:27017';
        this.Client = new MongoClient(uri, { useUnifiedTopology: true, maxIdleTimeMS: 0, serverSelectionTimeoutMS: 0, socketTimeoutMS: 0, connectTimeoutMS: 0 });
        this.Run();
    }

    Run() {
        this.Client.connect(err => {
            if(err) throw new Error(err);
            this.Client.db(this.Config.NameOfDatabase).collection('Players').findOne({ _id: 0 }, async (_err, Server) => {
                if(_err) throw new Error(_err);
                if(Server) {
                    this.Client.db(this.Config.NameOfDatabase).collection('Players').updateOne({ _id: 0 }, {
                        $set: {
                            startedAt: Date.now()
                        }
                    });
                } else {
                    const server = {
                        _id: 0,
                        startedAt: Date.now()
                    };
                    this.Client.db(this.Config.NameOfDatabase).collection('Players').insertOne(server);
                }

                const { AddPrint } = require('../Console/index');

                const dbInfo = await this.Client.db(this.Config.NameOfDatabase).stats();

                AddPrint('MongoDB', `
    ^3Datebase Name: ^4${this.Config.NameOfDatabase}
    ^3MongoDB Collections: ^4${dbInfo.collections}
    ^3MongoDB Documents: ^4${dbInfo.objects}
    ^3MongoDB Size: ^4${Math.round(((dbInfo.dataSize / 1024) + Number.EPSILON) * 100) / 100} MB ^9(${dbInfo.dataSize} KB)
                `);

            });

            this.#Exports();
            this.Ready();
        });
    }

    /**
     * Inserts a single document into MongoDB. If documents passed in do not contain the _id field, one will be added to each of the documents missing it by the driver.
     * @param {string} Collection The name of the collection
     * @param {object} Data The data/document
     * @param {(void|any)} Callback An optional callback
     */
    InsertOne(Collection, Data, Callback) {
        emit('DiscordFramework:MongoDB:DatabaseInsertOne', Collection, Data);
        this.Client.db(this.Config.NameOfDatabase).collection(Collection).insertOne(Data, Callback);
    }

    /**
     * Inserts an array of documents into MongoDB. If documents passed in do not contain the _id field, one will be added to each of the documents missing it by the driver, mutating the document.
     * @param {string} Collection The name of the collection
     * @param {Array<Object>} Data The data/document
     * @param {(void|any)} Callback An optional callback
     */
    InserMany(Collection, Data, Callback) {
        emit('DiscordFramework:MongoDB:DatabaseInserMany', Collection, Data);
        this.Client.db(this.Config.NameOfDatabase).collection(Collection).insertMany(Data, Callback);
    }

    /**
     * Fetches the first document that matches the filter
     * @param {string} Collection The name of the collection
     * @param {object} Filter Query for find Operation
     * @param {(void|any)} Callback An optional callback
     */
    FindOne(Collection, Filter, Callback) {
        emit('DiscordFramework:MongoDB:DatabaseFindOne', Collection, Filter);
        this.Client.db(this.Config.NameOfDatabase).collection(Collection).findOne(Filter).then(Callback);
    }

    /**
     * Fetches multiple documents that matches the filter
     * @param {string} Collection The name of the collection
     * @param {object} Filter Query for find Operation
     * @param {(void|any)} Callback An optional callback
     */
    Find(Collection, Filter, Callback) {
        emit('DiscordFramework:MongoDB:DatabaseFind', Collection, Filter);
        this.Client.db(this.Config.NameOfDatabase).collection(Collection).find(Filter).toArray().then(Callback);
    }

    /**
     * Delete a document from a collection
     * @param {string} Collection The name of the collection
     * @param {object} Filter Query for find Operation
     * @param {(void|any)} Callback An optional callback
     */
    DeleteOne(Collection, Filter, Callback) {
        emit('DiscordFramework:MongoDB:DatabaseDeleteOne', Collection, Filter);
        this.Client.db(this.Config.NameOfDatabase).collection(Collection).deleteOne(Filter, Callback);
    }

    /**
     * Delete multiple documents from a collection
     * @param {string} Collection The name of the collection
     * @param {object} Filter Query for find Operation
     * @param {(void|any)} Callback An optional callback
     */
    DeleteMany(Collection, Filter, Callback) {
        emit('DiscordFramework:MongoDB:DatabaseDeleteMany', Collection, Filter);
        this.Client.db(this.Config.NameOfDatabase).collection(Collection).deleteMany(Filter, Callback);
    }

    /**
     * Update a single document in a collection
     * @param {string} Collection The name of the collection
     * @param {object} Filter Query for find Operation
     * @param {object} Update The update operations to be applied to the document
     * @param {(void|any)} Callback An optional callback
     */
    UpdateOne(Collection, Filter, Update, Callback) {
        emit('DiscordFramework:MongoDB:DatabaseUpdateOne', Collection, Filter, Update);
        this.Client.db(this.Config.NameOfDatabase).collection(Collection).updateOne(Filter, Update, Callback);
    }

    /**
     * Update multiple documents in a collection
     * @param {string} Collection The name of the collection
     * @param {object} Filter Query for find Operation
     * @param {object} Update The update operations to be applied to the document
     * @param {(void|any)} Callback An optional callback
     */
    UpdateMany(Collection, Filter, Update, Callback) {
        emit('DiscordFramework:MongoDB:DatabaseUpdateMany', Collection, Filter, Update);
        this.Client.db(this.Config.NameOfDatabase).collection(Collection).updateMany(Filter, Update, Callback);
    }

    #Exports() {
        // JS Module Exports
        module.exports.Client = this.Client;

        /**
         * Inserts a single document into MongoDB. If documents passed in do not contain the _id field, one will be added to each of the documents missing it by the driver.
         * @param {string} Collection The name of the collection
         * @param {object} Data The data/document
         * @param {(void|any)} Callback An optional callback
         */
        module.exports.InsertOne = (Collection, Data, Callback) => this.InsertOne(Collection, Data, Callback);

        /**
         * Inserts an array of documents into MongoDB. If documents passed in do not contain the _id field, one will be added to each of the documents missing it by the driver, mutating the document.
         * @param {string} Collection The name of the collection
         * @param {Array<Object>} Data The data/document
         * @param {(void|any)} Callback An optional callback
         */
        module.exports.InserMany = (Collection, Data, Callback) => this.InserMany(Collection, Data, Callback);

        /**
         * Fetches the first document that matches the filter
         * @param {string} Collection The name of the collection
         * @param {object} Filter Query for find Operation
         * @param {(void|any)} Callback An optional callback
         */
        module.exports.FindOne = (Collection, Filter, Callback) => this.FindOne(Collection, Filter, Callback);

        /**
         * Fetches multiple documents that matches the filter
         * @param {string} Collection The name of the collection
         * @param {object} Filter Query for find Operation
         * @param {(void|any)} Callback An optional callback
         */
        module.exports.Find = (Collection, Filter, Callback) => this.Find(Collection, Filter, Callback);

        /**
         * Delete a document from a collection
         * @param {string} Collection The name of the collection
         * @param {object} Filter Query for find Operation
         * @param {(void|any)} Callback An optional callback
         */
        module.exports.DeleteOne = (Collection, Filter, Callback) => this.DeleteOne(Collection, Filter, Callback);

        /**
         * Delete multiple documents from a collection
         * @param {string} Collection The name of the collection
         * @param {object} Filter Query for find Operation
         * @param {(void|any)} Callback An optional callback
         */
        module.exports.DeleteMany = (Collection, Filter, Callback) => this.DeleteMany(Collection, Filter, Callback);

        /**
         * Update a single document in a collection
         * @param {string} Collection The name of the collection
         * @param {object} Filter Query for find Operation
         * @param {object} Update The update operations to be applied to the document
         * @param {(void|any)} Callback An optional callback
         */
        module.exports.UpdateOne = (Collection, Filter, Data, Callback) => this.UpdateOne(Collection, Filter, Data, Callback);

        /**
         * Update multiple documents in a collection
         * @param {string} Collection The name of the collection
         * @param {object} Filter Query for find Operation
         * @param {object} Update The update operations to be applied to the document
         * @param {(void|any)} Callback An optional callback
         */
        module.exports.UpdateMany = (Collection, Filter, Data, Callback) => this.UpdateMany(Collection, Filter, Data, Callback);

        // CFX Exports
        emit('DiscordFramework:Export:Create', 'MongoDB', () => {
            return {
                InsertOne: (Collection, Data, Callback) => {
                    return this.InsertOne(Collection, Data, Callback);
                },
                InserMany: (Collection, Data, Callback) => {
                    return this.InserMany(Collection, Data, Callback);
                },
                FindOne: (Collection, Filter, Callback) => {
                    return this.FindOne(Collection, Filter, Callback);
                },
                Find: (Collection, Filter, Callback) => {
                    return this.Find(Collection, Filter, Callback);
                },
                DeleteOne: (Collection, Filter, Callback) => {
                    return this.DeleteOne(Collection, Filter, Callback);
                },
                DeleteMany: (Collection, Filter, Callback) => {
                    return this.DeleteMany(Collection, Filter, Callback);
                },
                UpdateOne: (Collection, Filter, Data, Callback) => {
                    return this.UpdateOne(Collection, Filter, Data, Callback);
                },
                UpdateMany: (Collection, Filter, Data, Callback) => {
                    return this.UpdateMany(Collection, Filter, Data, Callback);
                }
            };
        });
    }
};