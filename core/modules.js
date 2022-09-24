/**
 * A modified extended class from class Set()
 *
 * @method get(name) Gets the specified module if available
 * @method toArray() Returns the Set of modules in an Array form
 *
 * @return {Set} A set of objects
 *
 * @example
 * const Module = require('../../modules/some_module/index')
 * const RegisteredEx = new Modules()
 *
 * RegisteredEx.add(Module)
 * RegisteredEx.toArray()
 */
const Modules = class Modules extends Set {


    /**
     * Gets the specified module if available
     * @param {String} name The name of the module
     * @returns {Object} module details
     */
    get(name) {
        return this.toArray().find(e => e.name === name);
    }

    /**
     * Returns the modules Collection as an array
     * @returns {(Array<Object>)} Array of modules objects
     */
    toArray() {
        return Array.from(this.values(), element => element);
    }

};

const ModulesNestedFiles = [];
const ModulesSet = new Modules();

module.exports = {
    /**
     * Returns all registered modules
     * @return {Set<Object>} A Set() of modules
     */
    Modules: ModulesSet,
    /**
     * Starting loading modules
     */
    Load: () => {
        const { readdirSync } = require('fs');
        const Directory = GetResourcePath(GetCurrentResourceName()) + '/Core/Modules/';
        const Folders = readdirSync(Directory);
        for (const Folder of Folders) {
            const Files = readdirSync(Directory + '/' + Folder);
            ModulesNestedFiles.push({ module: Folder, files: Files });
            let ServerFile = Files.find(file => file.toLowerCase() === 'index.js');
            if(ServerFile) {
                ServerFile = require(Directory + '/' + Folder + '/' + ServerFile.split('.')[0]);
                if(typeof ServerFile.Module === 'function') new ServerFile.Module(ModulesSet);
            }
        }
    },
    /**
     * @returns {Boolean} Weather all modules were loaded
     */
    Ready: () => {
        return (ModulesNestedFiles.filter(m => m.files.includes('index.js') && m.files.length > 0).length === ModulesSet.size) && !ModulesSet.toArray().find(m => m.status !== 'Running');
    },

    /**
    * A class constructor with custom method made for modules.
    *
    * The constructor only accepts one parameter and it must be an [object object]; "{}".
    *
    * The constructor parameter must contain name, toggle at least to be successfully registered
    * otherwise; an error will be thrown.
    *
    * To register an module; do not use the class directly, instead; make a new class that extends from this.
    *
    * @example
    * new class SQL extends Module {
    *     constructor(modules) {
    *         super(modules, {
    *             name: 'SQL',
    *             description: 'A SQL database integration',
    *             toggle: true,
    *             config: {
    *                 dbName: GetCurrentResourceName()
    *             }
    *         });
    *     }
    *
    *     METHOD() {
    *          // SOME CODE HERE
    *     }
    *
    * };
    */
    Module: class Module {

        /**
         *
         * @param {Set<Object>} modules Set() of all registered modules
         * @param {Object} module Class details
         * @param {String} name the name of the module
         * @returns {Object} Module details
         * @example
         * constructor(modules) {
         *     super(modules, {
         *          name: 'Template', // Change to module name
         *          description: 'A mere template for future modules', // A brief decription of what does the module do
         *          toggle: true, // Whether the module is supposed to be enabled or disabled by default
         *          version: '1.0', // The current version of the module if you'd like to keep track of it (can be removed)
         *          author: 'ItsAmmarB', // The person(s) who have made the module and deserved credits (can be removed)
         *          config: {},
         *     })
         * }
         */
        constructor(modules, module) {
            this.modules = modules;

            if(typeof module !== 'object') throw new Error(`Class constructor param must be an object, "${typeof module}" was provided!`);

            // Check Module name
            if (module.name) {
                if (typeof module.name !== 'string') {
                    throw new Error('REG_MODULE: Module "Name" must be typeof String');
                }
                this.name = module.name;
            } else {
                throw new Error('REG_MODULE: attempted to register a nameless module');
            }

            // Check Module description if available
            if (module.description) {
                if (typeof module.description !== 'string') {
                    this.#Register('Error', modules);
                    throw new Error('REG_MODULE: Module "Description" must be typeof string');
                }
                this.description = module.description;
            } else {
                this.description = 'anonymous';
            }

            // Check Module toggle
            if (module.toggle && typeof module.toggle !== 'undefined') {
                if (typeof module.toggle !== 'boolean') throw new Error('REG_MODULE: Module "Toggle" must be typeof Boolean');
                this.toggle = module.toggle;
            } else {
                this.#Register('Error', modules);
                throw new Error('REG_MODULE: attempted to register an module without a toggle "Enabled"');
            }

            // Check Module author if available
            if (module.author) {
                if (typeof module.author !== 'string') throw new Error('REG_MODULE: Module "Author" must be typeof string');
                this.author = module.author;
            } else {
                this.author = 'unknown';
            }

            // Check Module version if available
            if (module.version) {
                if (typeof module.version !== 'string') throw new Error('REG_MODULE: Module "Version" must be typeof string');
                this.version = module.version;
            } else {
                this.version = 'unknown';
            }

            // Check Module config if available
            if (module.config) {
                if (typeof module.config !== 'object') throw new Error('REG_MODULE: Module "Config" must be typeof object');
                this.config = module.config;
            } else {
                this.config = {};
            }

            this.status = null;
            this.#Initialize(modules);

        }

        /**
         * Initializes the modules and start a series of checks to validate variables as much as possible
         */
        #Initialize(modules) {
            try {

                // Check if the module is a mere template and #register it as 'Template'
                if (this.name === 'Template') {
                    return this.#Register('Template', modules);
                }

                // Check if the module is supposed to be toggle and if not then #register it as disabled
                if (!this.toggle) {
                    return this.#Register('Disabled', modules);
                }

                this.#Register('Ready', modules);

            } catch (err) {
                this.#Register('Error', modules);
                throw new Error(err);
            }
        }

        /**
         * The registration step of making an modules
         * @param {String} status The status to register the module as
         */
        #Register(status, modules) {

            this.status = status;
            const module = {
                name: this.name,
                description: this.description,
                toggle: this.toggle,
                status: this.status,
                version: this.version,
                author: this.author,
                config: this.config
            };

            modules.add(module);
        }

        /**
         * Main runtime method of the module
         */
        Run() {
            this.Ready('Automated');
        }

        /**
         * Triggering this method will mark the module as 'Running" meaning, it's ready to be used
         */
        Ready(quickStart) {
            if(quickStart) console.debug(this.name, 'module is automated!');
            this.status = 'Running';
            this.modules.get(this.name).status = this.status;
            emit('DiscordFramework:Module:Ready', this.name);
        }

        /**
         * A fancy and a quick way to hold code execution
         * @param {Number} WaitMS A wait time in milliseconds
         * @returns {Promise<void>}
         * @example await this.Delay(2000) // hold execution for 2 seconds
         */
        async Delay(WaitMS) {
            return await new Promise(resolve => setTimeout(resolve, WaitMS));
        }

        /**
         * An module info/detail getter method that return module information
         * @return {Object} The provided information provided in super()
         * @example this.Info // output: {name: string, description: string, toggle: boolean, status: string, author: string, version: string}
         */
        get Info() {
            return {
                name: this.name,
                description: this.description,
                toggle: this.toggle,
                status: this.status,
                author: this.author,
                version: this.version
            };
        }

        /**
         * A config getter method that returns the modules configuration
         * @return {Object} The provided config object provided in super()
         * @example this.Config // output: {}
         */
        get Config() {
            return this.config;
        }

    }
};