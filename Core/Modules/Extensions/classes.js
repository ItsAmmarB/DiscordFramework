module.exports = {
    /**
     * A class constructor with custom method made for extensions.
     *
     * The constructor only accepts one parameter and it must be an [object object]; "{}".
     *
     * The constructor parameter must contain name, toggle at least to be successfully registered
     * otherwise; an error will be thrown.
     *
     * To register an extension; do not use the class directly, instead; make a new class that extends from this
     * and make sure it has a Run() method, otherwise; an error will be thrown
     *
     * @constructor Only accepts one parameter and it must be an object containing name and toggle at least
     * @super {string} name the name of the extension
     * @example
     * new class Blacklist extends Extension {
     *     constructor() {
     *         super({
     *             name: 'Blacklist',
     *             description: 'Blacklists players without permissions from certain weapons and vehicles',
     *             toggle: true,
     *             dependencies: ['Permissions'],
     *             config: {
     *                 allowAll: false,
     *                 aces: [
     *                     {
     *                         ace: 'blacklists.sports',
     *                         vehicles: [
     *                             'adder',
     *                             'voltic',
     *                             ''
     *                         ]
     *                     }
     *                 ]
     *             }
     *         });
     *     }
     *
     *     Run() {
     *          // SOME CODE HERE
     *     }
     *
     * };
     */

    Extension: class Extension {

        /**
         *
         * @example
         * constructor() {
         *     super({
         *          name: 'Template', // Change to extension name
         *          description: 'A mere template for future extensions', // A brief decription of what does the extension do
         *          toggle: true, // Whether the extension is supposed to be enabled or disabled by default
         *          dependencies: [], // The dependencies/other extensions needed for this extension to be working correctly
         *          version: '1.0', // The current version of the extension if you'd like to keep track of it (can be removed)
         *          author: 'ItsAmmarB', // The person(s) who have made the extension and deserved credits (can be removed)
         *          config: {}
         *     })
         * }
         */
        constructor(extension) {

            if(typeof extension !== 'object') throw new Error(`Class constructor param must be an object, "${typeof extension}" was provided!`);

            // Check Extension name
            if (!extension.Name) throw new Error('REG_EXTENSION: attempted to register a nameless extension');
            if (typeof extension.Name !== 'string') {
                throw new Error('REG_EXTENSION: Extension "Name" must be typeof String');
            }
            /**
             * name The name of the extension
             */
            this.Name = extension.Name;

            // Check Extension description if available
            if (extension.Description) {
                if (typeof extension.Description !== 'string') {
                    this.#Register('Error');
                    throw new Error('REG_EXTENSION: Extension "Description" must be typeof string');
                }
                this.Description = extension.Description;
            } else {
                this.Description = 'anonymous';
            }

            // Check Extension toggle
            if (!extension.Enabled && typeof extension.Enabled === 'undefined') throw new Error('REG_EXTENSION: attempted to register an extension without a toggle "Enabled"');
            if (typeof extension.Enabled !== 'boolean') throw new Error('REG_EXTENSION: Extension "Toggle" must be typeof Boolean');
            this.Enabled = extension.Enabled;

            // Check Extension dependencies if available
            if (extension.Dependencies) {
                if (typeof extension.Dependencies !== 'object' || !Array.isArray(extension.Dependencies)) throw new Error('REG_EXTENSION: Extension "Dependencies" must be typeof Array');
                this.Dependencies = extension.Dependencies;
            } else {
                this.Dependencies = [];
            }

            // Check Extension author if available
            if (extension.Author) {
                if (typeof extension.Author !== 'string') throw new Error('REG_EXTENSION: Extension "Author" must be typeof string');
                this.Author = extension.Author;
            } else {
                this.Author = 'unknown';
            }

            // Check Extension version if available
            if (extension.Version) {
                if (typeof extension.Version !== 'string') throw new Error('REG_EXTENSION: Extension "Version" must be typeof string');
                this.Version = extension.Version;
            } else {
                this.Version = 'unknown';
            }

            // Check Extension config if available
            if (extension.Config) {
                if (typeof extension.Config !== 'object') throw new Error('REG_EXTENSION: Extension "Config" must be typeof object');
                this.Config = extension.Config;
            } else {
                this.Config = {};
            }

            this.Status = null;
            this.#Initialize();

        }

        /**
         * Initializes the extensions and start a series of checks to validate variables as much as possible
         */
        #Initialize() {
            try {

                // Check if the extension is a mere template and #register it as 'Template'
                if (this.Name === 'Template') {
                    return this.#Register('Template');
                }

                // Check if the extension is supposed to be toggle and if not then #register it as disabled
                if (!this.Enabled) {
                    return this.#Register('Disabled');
                }

                on('DiscordFramework:Core:Ready', () => this.Run());
                this.#Register('Enabled');

            } catch (err) {
                this.#Register('Error');
                console.error(err);
            }
        }

        /**
         * The registration step of making an extensions
         * @param {string} status The status to register the extension as
         */
        async #Register(status) {

            this.Status = status;

            const Extensions = require('./index').Extensions;

            if(this.Dependencies.length > 0) {

                let dependencies = this.#CheckDependencies(Extensions);
                if(dependencies.filter(d => d.Status !== 'Enabled').length > 0) {

                    let counter = 0;
                    while(dependencies.filter(d => d.Status !== 'Enabled').length > 0) {
                        dependencies = this.#CheckDependencies(Extensions);

                        if(dependencies.find(d => d.Status === 'Template')) {
                            dependencies = dependencies.filter(d => d.Status !== 'Template');
                            console.warn(`Template cannot be a dependency for an extension; Dependency was ignored in the "${this.Name}" extension`);
                        }
                        if(dependencies.find(d => d.Status === 'Disabled')) {
                            emit('DiscordFramework:Extension:Registered', this);
                            this.Status = 'Dependency Disabled';
                            break;
                        }
                        if(dependencies.find(d => d.Name === this.Name)) {
                            dependencies = dependencies.filter(d => d.Name !== this.Name);
                            console.warn(`An extension cannot be a dependency for itself; Dependency was ignored in the "${this.Name}" extension`);
                        }

                        if(counter === 20) {
                            this.Status = dependencies[0].Status;
                            break;
                        }
                        await this.Delay(100);
                        counter++;
                    }

                }

            }

            const extension = {
                Name: this.Name,
                Description: this.Description,
                Enabled: this.Enabled,
                Dependencies: this.Dependencies,
                Status: this.Status,
                Version: this.Version,
                Author: this.Author,
                Config: this.Config
            };

            Extensions.add(extension);

            emit('DiscordFramework:Extensions:Extension:Loaded', extension);
        }

        /**
         *
         * @param {Set<object>} Extensions The set of extensions
         * @param {Array<string>} Dependencies An array of string
         * @returns {Array<string>} array of dependencies' status
         * @example Extension.CheckDependencies(new Extension(), ['CFX.re', 'FiveM']) // output: ['Missing Dependency', 'Missing Dependency']
         */
        #CheckDependencies(Extensions) {
            const returnable = [];
            this.Dependencies.map(Dependency => {
                const dependency = Extensions.get(Dependency);
                if (!dependency) {
                    returnable.push({ Name: Dependency, Status: 'Dependency Missing' });
                } else if (dependency.Status === 'Disabled') {
                    returnable.push({ Name: Dependency, Status: 'Dependency Disabled' });
                } else if (dependency.Status === 'Error') {
                    returnable.push({ Name: Dependency, Status: 'Dependency Error' });
                } else if (dependency.Status === 'Template') {
                    returnable.push({ Name: Dependency, Status: 'Template' });
                } else {
                    returnable.push({ Name: Dependency, Status: 'Enabled' });
                }
            });
            return returnable;
        }

        /**
         * The main runtime method that will automatically be called after extension registration
         * @param {boolean} Errorable Whether this should return an error or not; primarily used to check if an extension has a Run() method or not
         * @example this.Run(true) // this will return in an error "Extension does not have a Run() method!"
         */
        Run(Errorable = false) {
            if(Errorable) console.error(new Error(`${this.Name} Extension doesn't have a Run() method.`));
            if(global.DebugMode) {console.debug(`${this.Name} Extension has an empty Run() method.`);} // this isn't an error or a warning but a mere console log for debugging reasons
        }

        RunClient(PlayerId) {
            emitNet('DiscordFramework:Extensions:RunClientSide:' + this.Name, PlayerId ? PlayerId : -1);
        }

        /**
         * A fancy and a quick way to hold code execution
         * @param {number} WaitMS A wait time in milliseconds
         * @returns {promise<void>}
         * @example await this.Delay(2000) // hold execution for 2 seconds
         */
        async Delay(WaitMS) {
            return await new Promise(resolve => setTimeout(resolve, WaitMS));
        }

        /**
         * An extension info/detail getter method that return extension information
         * @return {object} The provided information provided in super()
         * @example this.Info // output: {name: string, description: string, toggle: boolean, status: string, dependencies: Array, author: string, version: string}
         */
        get Info() {
            return {
                name: this.Name,
                description: this.Description,
                toggle: this.Enabled,
                status: this.Status,
                dependencies: this.Dependencies,
                author: this.Author,
                version: this.Version
            };
        }

        /**
         * A config getter method that returns the extensions configuration
         * @return {object} The provided config object provided in super()
         * @example this.Config // output: {}
         */
        // get Config() {
        //     return this.Config;
        // }

    },
    /**
     * A modified extended class from class Set()
     *
     * @method get(name) Gets the specified extension if available
     * @method toArray() Returns the Set of extensions in an Array form
     *
     * @return {Set} A set of objects
     *
     * @example
     * const Extension = require('../../extensions/some_extension/index')
     * const RegisteredEx = new Extensions()
     *
     * RegisteredEx.add(Extension)
     * RegisteredEx.toArray()
     */
    Extensions: class Extensions extends Set {


        /**
         * Gets the specified extension if available
         * @param {string} name The name of the extension
         * @returns {object} extension details
         */
        get(name) {
            return this.toArray().find(e => e.Name === name);
        }

        /**
         * Returns the players Collection as an array
         * @returns {(Array<object>)} Array of players objects
         */
        toArray() {
            return Array.from(this.values(), element => element);
        }

    }
};