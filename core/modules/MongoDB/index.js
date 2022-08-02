const { Module } = require('../../handlers/modules');

module.exports.Module = class MongoDB extends Module {
    constructor(modules) {
        super(modules, {
            name: 'MongoDB',
            description: 'MongoDB integration module',
            toggle: true,
            quickStart: false,
            version: '1.0',
            author: 'ItsAmmarB',
            config: {
                nameOfDatabase: GetCurrentResourceName()
            }
        });

        const { MongoClient, ServerApiVersion } = require('mongodb');
        // const uri = 'mongodb+srv://ItsAmmarB:amooreksa@cluster0.wz7ij.mongodb.net/?retryWrites=true&w=majority';
        const uri = 'mongodb://localhost:27017';
        this.client = new MongoClient(uri, { useUnifiedTopology: true, serverApi: ServerApiVersion.v1, maxIdleTimeMS: 0, serverSelectionTimeoutMS: 0, socketTimeoutMS: 0, connectTimeoutMS: 0 });
        this.Run();
    }

    Run() {
        this.client.connect(err => {
            if(err) throw new Error(err);
            this.client.db(this.Config.nameOfDatabase).collection('Players').findOne({ _id: 0 }, (_err, Server) => {
                if(_err) throw new Error(_err);
                if(Server) {
                    this.client.db(this.Config.nameOfDatabase).collection('Players').updateOne({ _id: 0 }, {
                        $set: {
                            startedAt: Date.now()
                        }
                    }, () => this.client.close());
                } else {
                    const server = {
                        _id: 0,
                        startedAt: Date.now()
                    };
                    this.client.db(this.Config.nameOfDatabase).collection('Players').insertOne(server);
                }
            }, () => this.client.close());
            this.#Exports();
            this.Ready();
        });
    }

    DatabaseInsertOne(Collection, Data, Callback) {
        this.client.connect(err => {
            if(err) throw new Error(err);
            emit('DiscordFramework:MongoDB:DatabaseInsertOne', Collection, Data, Callback);
            this.client.db(this.Config.nameOfDatabase).collection(Collection).insertOne(Data, Callback ? err => Callback(err) : undefined);
            this.client.close();
        });
    }

    DatabaseInserMany(Collection, Data, Callback) {
        this.client.connect(err => {
            if(err) throw new Error(err);
            emit('DiscordFramework:MongoDB:DatabaseInserMany', Collection, Data, Callback);
            this.client.db(this.Config.nameOfDatabase).collection(Collection).insertMany(Data, Callback ? err => Callback(err) : undefined);
            this.client.close();
        });
    }

    DatabaseFindOne(Collection, Query, Callback) {
        this.client.connect(err => {
            if(err) throw new Error(err);
            emit('DiscordFramework:MongoDB:DatabaseFindOne', Collection, Query, Callback);
            this.client.db(this.Config.nameOfDatabase).collection(Collection).findOne(Query).then(Callback ? Result => Callback(Result) : undefined);
            this.client.close();
        });
    }

    DatabaseFind(Collection, Query, Callback) {
        this.client.connect(err => {
            if(err) throw new Error(err);
            emit('DiscordFramework:MongoDB:DatabaseFind', Collection, Query, Callback);
            const cursor = Client.db(this.Config.nameOfDatabase).collection(Collection).find(Query);
            cursor.count().then(count => {
                if (count > 0) {
                    cursor.toArray().then(arr => {
                        Callback(arr);
                    });
                } else {
                    Callback([]);
                }
            });
            this.client.close();
        });
    }

    DatabaseDeleteOne(Collection, Query, Callback) {
        this.client.connect(err => {
            if(err) throw new Error(err);
            emit('DiscordFramework:MongoDB:DatabaseDeleteOne', Collection, Query, Callback);
            this.client.db(this.Config.nameOfDatabase).collection(Collection).deleteOne(Query, Callback ? err => Callback(err) : undefined);
            this.client.close();
        });
    }

    DatabaseDeleteMany(Collection, Query, Callback) {
        this.client.connect(err => {
            if(err) throw new Error(err);
            emit('DiscordFramework:MongoDB:DatabaseDeleteMany', Collection, Query, Callback);
            this.client.db(this.Config.nameOfDatabase).collection(Collection).deleteMany(Query, Callback ? err => Callback(err) : undefined);
            this.client.close();
        });
    }

    DatabaseUpdateOne(Collection, Query, Data, Callback) {
        this.client.connect(err => {
            if(err) throw new Error(err);
            emit('DiscordFramework:MongoDB:DatabaseUpdateOne', Collection, Query, Data, Callback);
            this.client.db(this.Config.nameOfDatabase).collection(Collection).updateOne(Query, Data, Callback ? err => Callback(err) : undefined);
            this.client.close();
        });
    }

    DatabaseUpdateMany(Collection, Query, Data, Callback) {
        this.client.connect(err => {
            if(err) throw new Error(err);
            emit('DiscordFramework:MongoDB:DatabaseUpdateMany', Collection, Query, Data, Callback);
            this.client.db(this.Config.nameOfDatabase).collection(Collection).updateMany(Query, Data, Callback ? err => Callback(err) : undefined);
            this.client.close();
        });
    }

    #Exports() {
        module.exports = {
            Client: () => {
                return this.client;
            },
            DatabaseInsertOne: (Collection, Data, Callback) => {
                return DatabaseInsertOne(Collection, Data, _Callback => _Callback(Callback));
            },
            DatabaseInserMany: (Collection, Data, Callback) => {
                return DatabaseInserMany(Collection, Data, _Callback => _Callback(Callback));
            },
            DatabaseFindOne: (Collection, Query, Callback) => {
                return DatabaseFindOne(Collection, Query, _Callback => _Callback(Callback));
            },
            DatabaseFind: (Collection, Query, Callback) => {
                return DatabaseFind(Collection, Query, _Callback => _Callback(Callback));
            },
            DatabaseDeleteOne: (Collection, Query, Callback) => {
                return DatabaseDeleteOne(Collection, Query, _Callback => _Callback(Callback));
            },
            DatabaseDeleteMany: (Collection, Query, Callback) => {
                return DatabaseDeleteMany(Collection, Query, _Callback => _Callback(Callback));
            },
            DatabaseUpdateOne: (Collection, Query, Data, Callback) => {
                return DatabaseUpdateOne(Collection, Query, Data, _Callback => _Callback(Callback));
            },
            DatabaseUpdateMany: (Collection, Query, Data, Callback) => {
                return DatabaseUpdateMany(Collection, Query, Data, _Callback => _Callback(Callback));
            }
        };
    }
};