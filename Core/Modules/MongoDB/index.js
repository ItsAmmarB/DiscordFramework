const { Module: Modules } = require('../../modules');

module.exports.Module = class MongoDB extends Modules {
    constructor(modules) {
        super(modules, {
            name: 'MongoDB',
            description: 'MongoDB integration module',
            toggle: true,
            version: '1.0',
            author: 'ItsAmmarB',
            config: {
                nameOfDatabase: GetCurrentResourceName()
            }
        });

        const { MongoClient } = require('mongodb');
        // const uri = 'mongodb+srv://ItsAmmarB:amooreksa@cluster0.wz7ij.mongodb.net/?retryWrites=true&w=majority';
        const uri = 'mongodb://localhost:27017';
        this.Client = new MongoClient(uri, { useUnifiedTopology: true, maxIdleTimeMS: 0, serverSelectionTimeoutMS: 0, socketTimeoutMS: 0, connectTimeoutMS: 0 });
        this.Run();
    }

    Run() {
        this.Client.connect(err => {
            if(err) throw new Error(err);
            this.Client.db(this.Config.nameOfDatabase).collection('Players').findOne({ _id: 0 }, async (_err, Server) => {
                if(_err) throw new Error(_err);
                if(Server) {
                    this.Client.db(this.Config.nameOfDatabase).collection('Players').updateOne({ _id: 0 }, {
                        $set: {
                            startedAt: Date.now()
                        }
                    });
                } else {
                    const server = {
                        _id: 0,
                        startedAt: Date.now()
                    };
                    this.Client.db(this.Config.nameOfDatabase).collection('Players').insertOne(server);
                }

                const { AddPrint } = require('../Console/index');

                const dbInfo = await this.Client.db(this.Config.nameOfDatabase).stats();

                AddPrint('MongoDB', `
    ^3Datebase Name: ^4${this.Config.nameOfDatabase}
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
        this.Client.connect(err => {
            if(err) throw new Error(err);
            emit('DiscordFramework:MongoDB:DatabaseInsertOne', Collection, Data, Callback);
            this.Client.db(this.Config.nameOfDatabase).collection(Collection).insertOne(Data, Callback ? err => Callback(err) : undefined);
            // this.Client.close();
        });
    }

    /**
     * Inserts an array of documents into MongoDB. If documents passed in do not contain the _id field, one will be added to each of the documents missing it by the driver, mutating the document.
     * @param {string} Collection The name of the collection
     * @param {Array<Object>} Data The data/document
     * @param {(void|any)} Callback An optional callback
     */
    InserMany(Collection, Data, Callback) {
        this.Client.connect(err => {
            if(err) throw new Error(err);
            emit('DiscordFramework:MongoDB:DatabaseInserMany', Collection, Data, Callback);
            this.Client.db(this.Config.nameOfDatabase).collection(Collection).insertMany(Data, Callback ? err => Callback(err) : undefined);
            // this.Client.close();
        });
    }

    /**
     * Fetches the first document that matches the filter
     * @param {string} Collection The name of the collection
     * @param {object} Filter Query for find Operation
     * @param {(void|any)} Callback An optional callback
     */
    FindOne(Collection, Filter, Callback) {
        this.Client.connect(err => {
            if(err) throw new Error(err);
            emit('DiscordFramework:MongoDB:DatabaseFindOne', Collection, Filter, Callback);
            this.Client.db(this.Config.nameOfDatabase).collection(Collection).findOne(Filter).then(Callback ? Result => Callback(Result) : undefined);
            // this.Client.close();
        });
    }

    /**
     * Fetches multiple documents that matches the filter
     * @param {string} Collection The name of the collection
     * @param {object} Filter Query for find Operation
     * @param {(void|any)} Callback An optional callback
     */
    Find(Collection, Filter, Callback) {
        this.Client.connect(err => {
            if(err) throw new Error(err);
            emit('DiscordFramework:MongoDB:DatabaseFind', Collection, Filter, Callback);
            const cursor = Client.db(this.Config.nameOfDatabase).collection(Collection).find(Filter);
            cursor.count().then(count => {
                if (count > 0) {
                    cursor.toArray().then(arr => {
                        Callback(arr);
                    });
                } else {
                    Callback([]);
                }
            });
            // this.Client.close();
        });
    }

    /**
     * Delete a document from a collection
     * @param {string} Collection The name of the collection
     * @param {object} Filter Query for find Operation
     * @param {(void|any)} Callback An optional callback
     */
    DeleteOne(Collection, Filter, Callback) {
        this.Client.connect(err => {
            if(err) throw new Error(err);
            emit('DiscordFramework:MongoDB:DatabaseDeleteOne', Collection, Filter, Callback);
            this.Client.db(this.Config.nameOfDatabase).collection(Collection).deleteOne(Filter, Callback ? err => Callback(err) : undefined);
            // this.Client.close();
        });
    }

    /**
     * Delete multiple documents from a collection
     * @param {string} Collection The name of the collection
     * @param {object} Filter Query for find Operation
     * @param {(void|any)} Callback An optional callback
     */
    DeleteMany(Collection, Filter, Callback) {
        this.Client.connect(err => {
            if(err) throw new Error(err);
            emit('DiscordFramework:MongoDB:DatabaseDeleteMany', Collection, Filter, Callback);
            this.Client.db(this.Config.nameOfDatabase).collection(Collection).deleteMany(Filter, Callback ? err => Callback(err) : undefined);
            // this.Client.close();
        });
    }

    /**
     * Update a single document in a collection
     * @param {string} Collection The name of the collection
     * @param {object} Filter Query for find Operation
     * @param {object} Update The update operations to be applied to the document
     * @param {(void|any)} Callback An optional callback
     */
    UpdateOne(Collection, Filter, Update, Callback) {
        this.Client.connect(err => {
            if(err) throw new Error(err);
            emit('DiscordFramework:MongoDB:DatabaseUpdateOne', Collection, Filter, Update, Callback);
            this.Client.db(this.Config.nameOfDatabase).collection(Collection).updateOne(Filter, Update, Callback ? err => Callback(err) : undefined);
            // this.Client.close();
        });
    }

    /**
     * Update multiple documents in a collection
     * @param {string} Collection The name of the collection
     * @param {object} Filter Query for find Operation
     * @param {object} Update The update operations to be applied to the document
     * @param {(void|any)} Callback An optional callback
     */
    UpdateMany(Collection, Filter, Update, Callback) {
        this.Client.connect(err => {
            if(err) throw new Error(err);
            emit('DiscordFramework:MongoDB:DatabaseUpdateMany', Collection, Filter, Update, Callback);
            this.Client.db(this.Config.nameOfDatabase).collection(Collection).updateMany(Filter, Update, Callback ? err => Callback(err) : undefined);
            // this.Client.close();
        });
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
        module.exports.InsertOne = (Collection, Data, Callback) => this.InsertOne(Collection, Data, _Callback => _Callback ? Callback(_Callback) : undefined);

        /**
         * Inserts an array of documents into MongoDB. If documents passed in do not contain the _id field, one will be added to each of the documents missing it by the driver, mutating the document.
         * @param {string} Collection The name of the collection
         * @param {Array<Object>} Data The data/document
         * @param {(void|any)} Callback An optional callback
         */
        module.exports.InserMany = (Collection, Data, Callback) => this.InserMany(Collection, Data, _Callback => _Callback ? Callback(_Callback) : undefined);

        /**
         * Fetches the first document that matches the filter
         * @param {string} Collection The name of the collection
         * @param {object} Filter Query for find Operation
         * @param {(void|any)} Callback An optional callback
         */
        module.exports.FindOne = (Collection, Filter, Callback) => this.FindOne(Collection, Filter, _Callback => _Callback ? Callback(_Callback) : undefined);

        /**
         * Fetches multiple documents that matches the filter
         * @param {string} Collection The name of the collection
         * @param {object} Filter Query for find Operation
         * @param {(void|any)} Callback An optional callback
         */
        module.exports.Find = (Collection, Filter, Callback) => this.Find(Collection, Filter, _Callback => _Callback ? Callback(_Callback) : undefined);

        /**
         * Delete a document from a collection
         * @param {string} Collection The name of the collection
         * @param {object} Filter Query for find Operation
         * @param {(void|any)} Callback An optional callback
         */
        module.exports.DeleteOne = (Collection, Filter, Callback) => this.DeleteOne(Collection, Filter, _Callback => _Callback ? Callback(_Callback) : undefined);

        /**
         * Delete multiple documents from a collection
         * @param {string} Collection The name of the collection
         * @param {object} Filter Query for find Operation
         * @param {(void|any)} Callback An optional callback
         */
        module.exports.DeleteMany = (Collection, Filter, Callback) => this.DeleteMany(Collection, Filter, _Callback => _Callback ? Callback(_Callback) : undefined);

        /**
         * Update a single document in a collection
         * @param {string} Collection The name of the collection
         * @param {object} Filter Query for find Operation
         * @param {object} Update The update operations to be applied to the document
         * @param {(void|any)} Callback An optional callback
         */
        module.exports.UpdateOne = (Collection, Filter, Data, Callback) => this.UpdateOne(Collection, Filter, Data, _Callback => _Callback ? Callback(_Callback) : undefined);

        /**
         * Update multiple documents in a collection
         * @param {string} Collection The name of the collection
         * @param {object} Filter Query for find Operation
         * @param {object} Update The update operations to be applied to the document
         * @param {(void|any)} Callback An optional callback
         */
        module.exports.UpdateMany = (Collection, Filter, Data, Callback) => this.UpdateMany(Collection, Filter, Data, _Callback => _Callback ? Callback(_Callback) : undefined);

        // CFX Exports
        emit('DiscordFramework:Export:Create', 'MongoDB', () => {
            return {
                InsertOne: (Collection, Data, Callback) => {
                    return this.InsertOne(Collection, Data, _Callback => _Callback ? Callback(_Callback) : undefined);
                },
                InserMany: (Collection, Data, Callback) => {
                    return this.InserMany(Collection, Data, _Callback => _Callback ? Callback(_Callback) : undefined);
                },
                FindOne: (Collection, Filter, Callback) => {
                    return this.FindOne(Collection, Filter, _Callback => _Callback ? Callback(_Callback) : undefined);
                },
                Find: (Collection, Filter, Callback) => {
                    return this.Find(Collection, Filter, _Callback => _Callback ? Callback(_Callback) : undefined);
                },
                DeleteOne: (Collection, Filter, Callback) => {
                    return this.DeleteOne(Collection, Filter, _Callback => _Callback ? Callback(_Callback) : undefined);
                },
                DeleteMany: (Collection, Filter, Callback) => {
                    return this.DeleteMany(Collection, Filter, _Callback => _Callback ? Callback(_Callback) : undefined);
                },
                UpdateOne: (Collection, Filter, Data, Callback) => {
                    return this.UpdateOne(Collection, Filter, Data, _Callback => _Callback ? Callback(_Callback) : undefined);
                },
                UpdateMany: (Collection, Filter, Data, Callback) => {
                    return this.UpdateMany(Collection, Filter, Data, _Callback => _Callback ? Callback(_Callback) : undefined);
                }
            };
        });
    }
};