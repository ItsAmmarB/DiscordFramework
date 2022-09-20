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
         * @param {object} extension Class details
         * @returns {object} Extension details
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
            if (!extension.name) throw new Error('REG_EXTENSION: attempted to register a nameless extension');
            if (typeof extension.name !== 'string') {
                throw new Error('REG_EXTENSION: Extension "Name" must be typeof String');
            }
            this.name = extension.name;

            // Check Extension description if available
            if (extension.description) {
                if (typeof extension.description !== 'string') {
                    this.#Register('Error');
                    throw new Error('REG_EXTENSION: Extension "Description" must be typeof string');
                }
                this.description = extension.description;
            } else {
                this.description = 'anonymous';
            }

            // Check Extension toggle
            if (!extension.toggle && typeof extension.toggle === 'undefined') throw new Error('REG_EXTENSION: attempted to register an extension without a toggle "Enabled"');
            if (typeof extension.toggle !== 'boolean') throw new Error('REG_EXTENSION: Extension "Toggle" must be typeof Boolean');
            this.toggle = extension.toggle;

            // Check Extension dependencies if available
            if (extension.dependencies) {
                if (typeof extension.dependencies !== 'object' || !Array.isArray(extension.dependencies)) throw new Error('REG_EXTENSION: Extension "Dependencies" must be typeof Array');
                this.dependencies = extension.dependencies;
            } else {
                this.dependencies = [];
            }

            // Check Extension author if available
            if (extension.author) {
                if (typeof extension.author !== 'string') throw new Error('REG_EXTENSION: Extension "Author" must be typeof string');
                this.author = extension.author;
            } else {
                this.author = 'unknown';
            }

            // Check Extension version if available
            if (extension.version) {
                if (typeof extension.version !== 'string') throw new Error('REG_EXTENSION: Extension "Version" must be typeof string');
                this.version = extension.version;
            } else {
                this.version = 'unknown';
            }

            // Check Extension config if available
            if (extension.config) {
                if (typeof extension.config !== 'object') throw new Error('REG_EXTENSION: Extension "Config" must be typeof object');
                this.config = extension.config;
            } else {
                this.config = {};
            }

            this.status = null;
            this.#Initialize();

        }

        /**
         * Initializes the extensions and start a series of checks to validate variables as much as possible
         */
        #Initialize() {
            try {

                // Check if the extension is a mere template and #register it as 'Template'
                if (this.name === 'Template') {
                    return this.#Register('Template');
                }

                // Check if the extension is supposed to be toggle and if not then #register it as disabled
                if (!this.toggle) {
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
        #Register(status) {

            this.status = status;

            const extension = {
                name: this.name,
                description: this.description,
                toggle: this.toggle,
                dependencies: this.dependencies,
                status: this.status,
                version: this.version,
                author: this.author,
                config: this.config
            };

            const Extensions = require('./index').Extensions;

            if(this.dependencies.length > 0) {

                let dependencies = this.#CheckDependencies(Extensions);
                if(dependencies.find(d => d.status === 'Template')) {
                    dependencies = dependencies.filter(d => d.status !== 'Template');
                    console.warn(`Template cannot be a dependency for an extension; Dependency was ignored in the "${this.name}" extension`);
                }
                if(dependencies.find(d => d.name === this.name)) {
                    dependencies = dependencies.filter(d => d.name !== this.name);
                    console.warn(`An extension cannot be a dependency for itself; Dependency was ignored in the "${this.name}" extension`);
                }
                if(dependencies.find(d => d.status !== 'Enabled')) {
                    emit('DiscordFramework:Extension:Registered', this);
                    this.status = dependencies.status;
                    Extensions.add(extension);
                }
            } else {
                Extensions.add(extension);
            }

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
            this.dependencies.map(Dependency => {
                const dependency = Extensions.get(Dependency);
                if (!dependency) {
                    returnable.push({ name: Dependency, status: 'Dependency Missing' });
                } else if (dependency.status === 'Disabled') {
                    returnable.push({ name: Dependency, status: 'Dependency Disabled' });
                } else if (dependency.status === 'Error') {
                    returnable.push({ name: Dependency, status: 'Dependency Error' });
                } else if (dependency.status === 'Template') {
                    returnable.push({ name: Dependency, status: 'Template' });
                } else {
                    returnable.push({ name: Dependency, status: 'Enabled' });
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
            if(Errorable) console.error(new Error(`${this.name} Extension doesn't have a Run() method.`));
            if(global.DebugMode) {console.debug(`${this.name} Extension has an empty Run() method.`);} // this isn't an error or a warning but a mere console log for debugging reasons
        }

        RunClient(PlayerId) {
            emitNet('DiscordFramework:Extensions:RunClientSide:' + this.name, PlayerId ? PlayerId : -1);
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
                name: this.name,
                description: this.description,
                toggle: this.toggle,
                status: this.status,
                dependencies: this.dependencies,
                author: this.author,
                version: this.version
            };
        }

        /**
         * A config getter method that returns the extensions configuration
         * @return {object} The provided config object provided in super()
         * @example this.Config // output: {}
         */
        get Config() {
            return this.config;
        }

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
            return this.toArray().find(e => e.name === name);
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