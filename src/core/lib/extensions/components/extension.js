const Discord = require('../../discord/index');
const MongoDB = require('../../mongodb/index');
const Extensions = require('./extensions');

const Utilities = require('../../../../utilities');


const Status = {
    Ready: 'Ready',
    Enabled: 'Enabled',
    Disabled: 'Disabled',
    Error: 'Error',
    Dependency_Disabled: 'Dependency Disabled',
    Dependency_Error: 'Dependency Error',
    Dependency_Missing: 'Dependency Missing',
    Self_Dependency: 'Self-Dependency',
    Template: 'Template'
};

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

    // Non-*Configurable class variables

    /**
     * The main runtime function
     */
    function = null;
    /**
     * The main runtime function
     */
    cfxExports = {};

    /**
     * The current status of the extension
     */
    status = '';
    /**
     * Whether an error had occured in this extension or not
     */
    #error = false;

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

        // Check if the extension is a mere template and #register it as 'Template'
        if(this.name === 'Template') {
            this.setStatus('Template');
        }

        // Check if the extension is supposed to be toggle and if not then #register it as disabled
        if(!this.toggle) {
            this.setStatus('Disabled');
        }

        // Whether an error was passed to the method
        if(this.#error) {
            this.setStatus('Error');
        }

        if(this.dependencies.length > 0) {
            const dependencies = this.#checkDependencies(Extensions);

            if(dependencies.length !== this.dependencies.length) {
                while(dependencies.length !== this.dependencies.length) {
                    await this.delay(250);
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
                    await this.delay(250);
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
            on('DiscordFramework:Core:Ready', async () => {
                await this.delay(500);
                this.execute(this, { Discord, MongoDB, Utilities });
            });
        }
    }

    #flagError(error) {
        this.status = error;
        console.error(error);
    }

    // EXTERNALLY ACCESSIBLE METHOD

    /**
     * Executes the main runtime function automatically when the framework core is ready if the extension is ready
     * @param {Extension} ExtensionInfo - Some useful untilities to be used in your extension such as discord & MongoDB exports, and other handy functions
     * @param {Object} Utils - Some useful untilities to be used in your extension such as discord & MongoDB exports, and other handy functions
     * @param {Discord} Utils.Discord - The Discord exports
     * @param {MongoDB} Utils.MongoDB - The MongoDB exports
     * @param {Utilities} Utils.Utilities - Some useful untilities and shortcuts to be used in your extension
    */
    execute(ExtensionInfo, Utils) {
        if(!this.function) return;
        try {
            this.function(ExtensionInfo, Utils);
        }
        catch(err) {
            this.#flagError(err);
        }
    }

    executeClient(PlayerId) {
        emitNet('DiscordFramework:Extensions:RunClientSide:' + this.name, PlayerId ? PlayerId : -1);
    }

    /**
     * A fancy and a quick way to hold code execution
     * @readonly
     * @param {number} WaitMS A wait time in milliseconds
     * @returns {promise<void>}
     * @example await this.delay(2000) // hold execution for 2 seconds
     */
    async delay(WaitMS) {
        return await new Promise(resolve => setTimeout(resolve, WaitMS));
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
     * Sets the main runtime function that will automatically be executed when the framework core is ready if the extension is ready
     * @readonly
     * @param {function(Extension, {Discord: Discord, MongoDB: MongoDB, Utilities: Utilities })} Function - The main runtime function
     */
    setFunction(Function) {
        this.function = Function;
        return this;
    }

    /**
     * Sets the extensions's Exports cfx to be used by other resources
     * - Note that any asynchronous function must be converted to a callback function to avoid cfx errors and cfx exports limitations
     * @readonly
     * @param {Object} Exports - An object with the export name as key and the exportable as value
     */
    setCFXExports(Exports) {
        if(typeof Exports !== 'object') return this.#flagError(`Extension<${this.name}>.setCFXExports() Parameter type must be "Object"; received "${typeof Exports}"!`);
        if(Array.isArray(Object)) return this.#flagError(`Extension<${this.name}>.setCFXExports() Parameter type must be "Object"; received "Array"!`);

        this.cfxExports = Exports;
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
        return this.cfxExports;
    }

}

module.exports = Extension;