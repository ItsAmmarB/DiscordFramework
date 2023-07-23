const Discord = require('../../discord/index');
const MongoDB = require('../../mongodb/index');
const Extensions = require('./extensions');

const Utilities = require('../../../../utilities');



class Extension {

    // Configurable class variables

    /**
     * The name of the extension
     */
    name = 'Extension';
    /**
     * The description of the extension
     */
    description = '';
    /**
     * Whether the extension should run by default
     */
    toggle = false;
    /**
     * The current status of the extension
     */
    status = '';
    /**
     * An array of the extensions dependencies
     */
    dependencies = [];
    /**
     * The version of the extension
     */
    version = '';
    /**
     * The author(s) of the extension
     */
    author = '';
    /**
     * The configuration parameters related to the extension
     */
    config = {};

    /**
     * The main runtime function
     */
    _cfxExports = {};

    // Non-Configurable class variables


    /**
     * The main extension function to be executed whenever the framework core ready event is triggered
     */
    #_function = null;
    /**
     * Whether an error had occured in this extension or not
     * @private
     */
    #_error = false;

    /**
     *
     * @param {Object} extension - The extension's details such as name, description, verion, author, etc..
     * @param {string} extension.name - Extension name; must be a string
     * @param {string|null} extension.description - Extension description; must be a string (optional)
     * @param {boolean} extension.toggle - Extension toggle; must be a boolean (optional; false by default)
     * @param {string[]|null} extension.dependencies - Extension dependencies; must be an array of strings (optional)
     * @param {string|null} extension.version - Extension version; must be a string (optional)
     * @param {string|null} extension.author - Extension author; must be a string (optional)
     * @param {object} extension.config - Extension config; must be an object (optional)
     */
    constructor({ name, description, toggle, dependencies, version, author, config }) {

        // This line was commented because this class can be used in both ways just as equally
        if(Extension.prototype.constructor !== this.constructor) console.log(`The Extension class was meant to be invoked as a new instance for each extension; using it as a parent class for an extended class for ${name ? 'the "' + name + '"' : 'an'} extension will lose some of its useful methods/methods' parameters such as Extension.setFunction() parameters and Extension.setCFXExports()`);

        // Check Extension name
        if(!name) return this.#flagError('REG_EXTENSION: attempted to register an extension without a name!');
        if(typeof name !== 'string') this.#flagError(`REG_EXTENSION: Extension "name" type must be "String", received "${typeof name}"!`);
        this.name = name;

        // Check Extension description if available
        if(description) {
            if(typeof description === 'string') {
                this.description = description;
            }
            else {
                this.#flagError(`REG_EXTENSION: Extension "description" type must be "String", received "${typeof description}"!`);
            }
        }

        // Check Extension toggle
        if(typeof toggle !== typeof undefined) {
            if(typeof toggle === 'boolean') {
                this.toggle = toggle;
            }
            else {
                this.#flagError(`REG_EXTENSION: Extension "Toggle" type must be "Boolean"; received "${typeof toggle}"!`);
            }
        };


        // Check Extension dependencies if available
        if(dependencies) {
            if(Array.isArray(dependencies)) {
                this.dependencies = dependencies;
            }
            else {
                this.#flagError(`REG_EXTENSION: Extension "Dependencies" type must be "Array", received "${typeof dependencies}"!`);
            }
        };

        // Check Extension author if available
        if(author) {
            if(typeof author === 'string') {
                this.author = author;
            }
            else {
                this.#flagError(`REG_EXTENSION: Extension "Author" type must be "String", received "${typeof author}"!`);
            }
        }

        // Check Extension version if available
        if(version) {
            if(typeof version === 'string') {
                this.version = version;
            }
            else {
                this.#flagError(`REG_EXTENSION: Extension "Version" type must be "String", received "${typeof version}"!`);
            }
        }

        // Check Extension config if available
        if(config) {
            if(typeof config === 'object' && !Array.isArray(config)) {
                this.config = config;
            }
            else {
                this.#flagError(`REG_EXTENSION: Extension "Config" type must be "Object", received "${typeof config}"!`);
            }
        }

        if(Extensions.get(this.name)) return this.#flagError(`REG_EXTENSION: Attempting to register an extension with a duplicate name "${this.name}"!`);

        Extensions.add(this);
        this.#register(Extensions);
    }


    /**
     * The registration step of making an extensions
     * @private
     * @async
     */
    async #register() {

        // Check if the extension is supposed to be toggle and if not then #register it as disabled
        if(!this.toggle) {
            this.setStatus('Disabled');
        }

        // Whether an error was passed to the method
        if(this.#_error) {
            this.setStatus('Error');
        }

        // Check if the extension is a mere template and #register it as 'Template'
        if(this.name === 'Template' && !this.toggle) {
            this.setStatus('Ready');
        }

        if(this.dependencies.length > 0) {
            const dependencies = this.#checkDependencies(Extensions);

            if(dependencies.length !== this.dependencies.length) {
                while(dependencies.length !== this.dependencies.length) {
                    await Utilities.delay(250);
                }
            }

            if(dependencies.find(d => d.status === 'Template')) {
                dependencies = dependencies.filter(d => d.status !== 'Template');
                console.warn(`The Extensions Template cannot be a dependency for an extension; Dependency was ignored in the "${this.name}" extension`);
            }

            if(dependencies.find(d => d.status === 'Self-Dependency')) {
                dependencies = dependencies.filter(d => d.status !== 'Self-Dependency');
                console.warn(`An extension cannot be a dependency for itself; Dependency was ignored in the "${this.name}" extension`);
            }

            const disabledDependency = dependencies.find(d => d.status === 'Disabled');
            if(disabledDependency) {
                this.setStatus(`Dependency Disabled (${disabledDependency.name})`);
            }

            const erroredDependency = dependencies.find(d => d.status === 'Error');
            if(dependencies.find(d => d.status === 'Error')) {
                this.setStatus(`Dependency Error (${erroredDependency.name})`);
            }

        }

        if(!this.status) this.setStatus('Ready');
        this.#initialize();
    }


    /**
     * Checks the status and the availability of the required dependencies for the extension
     * @private
     * @returns {string[]} array of dependencies' status
     * @example [ {name: string, status: string}, ... ]
     */
    #checkDependencies() {

        const returnable = [];
        this.dependencies.forEach(async Dependency => {

            if(Dependency === this.name) return returnable.push({ name: dependency.name, status: 'Self-Dependency' });

            let dependency = Extensions.get(Dependency);
            if(!dependency) {

                let counter = 0;
                while(!dependency) {
                    dependency = Extensions.get(Dependency);
                    if(counter === 20) break;
                    await Utilities.delay(250);
                    counter++;
                }

                if(!dependency) return returnable.push({ name: dependency.name, status: 'Dependency Missing' });
            }

            return returnable.push({ name: dependency.name, status: dependency.status });

        });

        return returnable;
    }

    /**
     * Initializes the extensions and start a series of checks to validate variables as much as possible
     * @private
     */
    #initialize() {
        /**
             * The run method is only triggered if the status was "Ready"; if not then don't
             * this is especially useful if an author manually changed the extension status to "Enabled" using Extension.setStatus()
             * if the extension is supposed to be enabled before the core is ready; such as a web panel; or an API
             * that way so the Extensions module doesn't run the code twice, or the extension doesn't even have a run method
             * instead it run on file read immediately!
             */
        if(this.status === 'Ready') {
            this.setStatus('Enabled');
            on('DiscordFramework:Core:Ready', () => {
                try {
                    this.#execute(this, { Discord, MongoDB, Utilities });
                }
                catch(Err) {
                    this.#flagError(Err);
                }
            });
        }
    }

    /**
     * Executes the main runtime function automatically when the framework core is ready if the extension is ready
     * @param {Extension} ExtensionInfo - The current extension's provided information on creation such as name, description, toggle, version, author, config and other hidden variables
     * @param {Object} Utils - A shortcut paramter that provides very useful core module exports and other function, networked objects and connection methods
     * @param {Discord} Utils.Discord - Discord module exports including the Discord client
     * @param {MongoDB} Utils.MongoDB - MongoDB module exports including the MongoDB client
     * @param {Utilities} Utils.Utilities - Some useful functions and networked variables such as Player Class, Players Class, Network Players & their information, Connections, onConnection() (for when a player is connecting) and etc..
     */
    #execute(ExtensionInfo, Utils) {
        if(!this.#_function) return;
        try {
            this.#_function(ExtensionInfo, Utils);
        }
        catch(err) {
            this.#flagError(err);
        }
    }

    #flagError(error) {
        this.status = 'Error';
        console.error(error);
    }

    // EXTERNALLY ACCESSIBLE METHOD

    /**
     * Starts executing client side code with a specific event name!
     * - This can be used as a sequencing method to run the players' client side after fetching/obtaining certain data
     * then using this method is send such data to the client side
     * - Any addtional parameters aside from Payload will not be lost
     * @param {number} [playerId = -1] - The player ID to trigger their client side event; if not provided, will trigger all players' client events
     * @param {any} [payload = null] - A payload to send to the players' client side event
     * @example
     * Extension.executeClient(player.id, {
     *      payload: {
     *          targetedVehicle: {
     *              model: 'nero',
     *              entityId: 144213,
     *              estimateCost: 2100000,
     *              Location: {
     *                  areaName: 'Los Santos Downtown',
     *                  streetName: 'Grove Street',
     *              }
     *          }
     *      }
     * })
     */
    executeClient(playerId = -1, payload = {}) {
        if(!playerId) playerId = -1;
        if(playerId) {
            if(isNaN(playerId)) return this.#flagError(`Extension<${this.name}>.executeClient(playerId, ...) playerId type must be "Number"!`);
        };
        emitNet('DiscordFramework:Extensions:RunClientSide:' + this.name, playerId, payload);
    }

    /**
     * Sets the extension status to be shown in console
     * This does not need to be changed, and does not functionally effect anything at all
     * @readonly
     * @param {string} status The new extension status
     * @returns {Extension}
     */
    setStatus(status) {
        this.status = status;
        return this;
    }

    /**
     * The main extension function to be executed whenever the framework core ready event is triggered
     * @callback ExtensionFunction
     * @param {ExtensionInfo} ExtensionInfo - The current extension's provided information on creation such as name, description, toggle, version, author, config and other hidden variables
     * @param {Utils} Utils - A shortcut paramter that provides very useful core module exports and other function, networked objects and connection methods
     */
    /**
     * @typedef {Extension} ExtensionInfo - The current extension's provided information on creation such as name, description, toggle, version, author, config and other hidden variables
     */
    /**
     * @typedef {Object} Utils - A shortcut paramter that provides very useful core module exports and other function, networked objects and connection methods
     * @property {Discord} Discord - Discord module exports including the Discord client
     * @property {MongoDB} MongoDB - MongoDB module exports including the MongoDB client
     * @property {Utilities} Utilities - Some useful functions and networked variables such as Player Class, Players Class, Network Players & their information, Connections, onConnection() (for when a player is connecting) and etc..
     */
    /**
     * Sets the main runtime function that will automatically be executed when the framework core is ready if the extension is ready
     * @param {ExtensionFunction} Function - The main extension function to be executed whenever the framework core ready event is triggered
     * @returns {Extension}
     * @credits Vitim.us (for the annotation) - https://stackoverflow.com/questions/24214962/whats-the-proper-way-to-document-callbacks-with-jsdoc
     * @example
     * Extension.setFunction((ExtensionInfo, { Discord, MongoDB, Utilities }) => {
     *      Discord.client.user.setActivity('A FiveM Server!', { type: 'WATCHING' });
     * })
     */
    setFunction(Function) {
        this.#_function = Function;
        return this;
    }

    /**
     * Sets the extensions's Exports cfx to be used by other resources
     * - Note that any asynchronous function must be converted to a callback function to avoid cfx errors and cfx exports limitations
     * @param {Object} Exports - An object with the export name as key and the exportable as value
     * @example
     * Cars.setCFXExports({
     *      GetHashFromVehicleModel: (VehicleModel) => {
     *          // Some Code Here
     *      }
     * })
     *
     *
     * // And importing those exports will look something like this;
     * exports.DiscordFramework.Extensions().Cars.GetHashFromVehicleModel('Adder')
     */
    setCFXExports(Exports) {
        if(typeof Exports !== 'object') return this.#flagError(`Extension<${this.name}>.setCFXExports() Parameter type must be "Object"; received "${typeof Exports}"!`);
        if(Array.isArray(Object)) return this.#flagError(`Extension<${this.name}>.setCFXExports() Parameter type must be "Object"; received "Array"!`);

        this._cfxExports = Exports;
        emit('DiscordFramework:Extensions:UpdateCFXExports');
        return this;
    }

    /**
     * An extension info/detail getter method that return extension information
     * @readonly
     * @return {Object} The provided information provided in super()
     */
    getInfo() {
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
     * Gets the extensions Config
     * @readonly
     * @return {Object} The provided config object provided in super()
     */
    getConfig() {
        return this.config;
    }

    /**
     * Gets the extensions CFX Exports
     * @readonly
     * @return {Object} The provided config object provided in super()
     */
    getCFXExports() {
        return this._cfxExports;
    }

}

module.exports = Extension;