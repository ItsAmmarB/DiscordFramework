const { PrintError } = require('../modules/console');
/**
 * A map containing all registered extensions
 */

// --------------------------------------
//                EXPORTS
// --------------------------------------

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

            if(typeof extension !== 'object') return PrintError(new Error(`Class constructor param must be an object, "${typeof extension}" was provided!`));

            // Check Extension name
            if (extension.name) {
                if (typeof extension.name !== 'string') {
                    return PrintError(new Error('UNKNOWN_EXTENTION: Extension "Name" must be typeof String'));
                }
                this.name = extension.name;
            } else {
                return PrintError(new Error('UNKNOWN_EXTENTION: attempted to register a nameless extension'));
            }

            // Check Extension description if available
            if (extension.description) {
                if (typeof extension.description !== 'string') {
                    this.#Register('Error');
                    return PrintError(new Error('UNKNOWN_EXTENTION: Extension "Description" must be typeof string'));
                }
                this.description = extension.description;
            } else {
                this.description = 'anonymous';
            }

            // Check Extension toggle
            if (extension.toggle && typeof extension.toggle !== 'undefined') {
                if (typeof extension.toggle !== 'boolean') return PrintError('UNKNOWN_EXTENTION: Extension "Toggle" must be typeof Boolean');
                this.toggle = extension.toggle;
            } else {
                this.#Register('Error');
                return PrintError(new Error('UNKNOWN_EXTENTION: attempted to register an extension without a toggle "Enabled"'));
            }

            // Check Extension dependencies if available
            if (extension.dependencies) {
                if (typeof extension.dependencies !== 'object' || !Array.isArray(extension.dependencies)) return PrintError('UNKNOWN_EXTENTION: Extension "Dependencies" must be typeof Array');
                this.dependencies = extension.dependencies;
            } else {
                this.dependencies = [];
            }

            // Check Extension author if available
            if (extension.author) {
                if (typeof extension.author !== 'string') return PrintError(new Error('UNKNOWN_EXTENTION: Extension "Author" must be typeof string'));
                this.author = extension.author;
            } else {
                this.author = 'unknown';
            }

            // Check Extension version if available
            if (extension.version) {
                if (typeof extension.version !== 'string') return PrintError(new Error('UNKNOWN_EXTENTION: Extension "Version" must be typeof string'));
                this.version = extension.version;
            } else {
                this.version = 'unknown';
            }

            // Check Extension config if available
            if (extension.config) {
                if (typeof extension.config !== 'object') return PrintError(new Error('UNKNOWN_EXTENTION: Extension "Config" must be typeof object'));
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

                this.#Register('Enabled');

            } catch (err) {
                this.#Register('Error');
                PrintError(err);
            }
        }

        /**
         * The registration step of making an extensions
         * @param {string} State The state to register the extension as
         */
        #Register(State) {
            this.state = State;
            const extension = {
                name: this.name,
                description: this.description,
                toggle: this.toggle,
                dependencies: this.dependencies,
                state: this.state,
                version: this.version,
                author: this.author,
                config: this.config
            };
            on('DiscordFramework:Extension:Run', async name => {
                if(name === this.name) {
                    if(this.name === 'Template') return;
                    await this.Delay(300);
                    this.Run(true);
                }
            });
            on('DiscordFramework:Extension:Register:Return', (name, state) => {
                if(name === this.name) {
                    this.state = state;
                }
            });

            emit('DiscordFramework:Extension:Register', extension);
        }

        /**
         *
         * @param {Set<object>} Extensions The set of extensions
         * @param {Array<string>} Dependencies An array of string
         * @returns {Array<string>} array of dependencies' status
         * @example Extension.CheckDependencies(new Extension(), ['CFX.re', 'FiveM']) // output: ['Missing Dependency', 'Missing Dependency']
         */
        static CheckDependencies(Extensions, Dependencies) {
            const returnable = [];
            Dependencies.map(Dependency => {
                const dependency = Extensions.get(Dependency);
                if (!dependency) {
                    returnable.push({ name: Dependency, state: 'Dependency Missing' });
                } else if (dependency.state === 'Disabled') {
                    returnable.push({ name: Dependency, state: 'Dependency Disabled' });
                } else if (dependency.state === 'Error') {
                    returnable.push({ name: Dependency, state: 'Dependency Error' });
                } else if (dependency.state === 'Template') {
                    returnable.push({ name: Dependency, state: 'Template' });
                } else {
                    returnable.push({ name: Dependency, state: 'Enabled' });
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
            if(Errorable) PrintError(new Error(`${this.name} Extension doesn't have a Run() method.`));
            if(global.DebugMode) {console.debug(`${this.name} Extension has an empty Run() method.`);} // this isn't an error or a warning but a mere console log for debugging reasons
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