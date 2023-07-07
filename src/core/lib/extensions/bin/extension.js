const Status = [
    'Ready',
    'Enabled',
    'Disabled',
    'Error',
    'Dependency Disabled',
    'Dependency Error',
    'Dependency Missing',
    'Self-Dependency',
    'Template'
];

class Extension {
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
    /**
     * The current status of the extension
     */
    status = '';

    /**
     * Whether an error had occured in this extension or not
     */
    error = false;

    /**
     *
     * @param {string} name Extension name; must be a string
     * @param {string|null} description Extension description; must be a string (optional; null by default)
     * @param {boolean} toggle Extension toggle; must be a boolean (optional; false by default)
     * @param {string[]|null} dependencies Extension dependencies; must be an array of strings (optional; null by default)
     * @param {string|null} version Extension version; must be a string (optional; null by default)
     * @param {string|null} author Extension author; must be a string (optional; null by default)
     * @param {object} config Extension config; must be an object (optional; null by default)
     */
    constructor(name, description, toggle, dependencies, version, author, config) {

        // Check Extension name
        if(!name) return this.#flagError('REG_EXTENSION: attempted to register an extension without a name!');
        if(typeof name !== 'string') this.#flagError(`REG_EXTENSION: Extension "name" must be typeof String, "${typeof name}" was provided!`);
        this.name = name;

        // Check Extension description if available
        if(description) {
            if(typeof description === 'string') {
                this.description = description;
            }
            else {
                new Error(`REG_EXTENSION: Extension "description" must be typeof string, "${typeof description}" was provided!`);
            }
        }

        // Check Extension toggle
        if(typeof toggle !== typeof undefined) {
            if(typeof toggle === 'boolean') {
                this.toggle = toggle;
            }
            else {
                new Error(`REG_EXTENSION: Extension "Toggle" must be typeof Boolean; "${typeof toggle}" was provided!`);
            }
        };


        // Check Extension dependencies if available
        if(dependencies) {
            if(Array.isArray(dependencies)) {
                this.dependencies = dependencies;
            }
            else {
                new Error(`REG_EXTENSION: Extension "Dependencies" must be typeof Array, "${typeof dependencies}" was provided!`);
            }
        };

        // Check Extension author if available
        if(author) {
            if(typeof author === 'string') {
                this.author = author;
            }
            else {
                new Error(`REG_EXTENSION: Extension "Author" must be typeof string, "${typeof author}" was provided!`);
            }
        }

        // Check Extension version if available
        if(version) {
            if(typeof version === 'string') {
                this.version = version;
            }
            else {
                new Error(`REG_EXTENSION: Extension "Version" must be typeof string, "${typeof version}" was provided!`);
            }
        }

        // Check Extension config if available
        if(config) {
            if(typeof config === 'object' && !Array.isArray(config)) {
                this.config = config;
            }
            else {
                new Error(`REG_EXTENSION: Extension "Config" must be typeof object, "${typeof config}" was provided!`);
            }
        }

        const Extensions = require('./extensions');
        Extensions.add(this);
        this.#register(Extensions);
    }


    /**
     * The registration step of making an extensions
     * @private
     */
    async #register(Extensions) {

        // Check if the extension is a mere template and #register it as 'Template'
        if(this.name === 'Template') {
            this.setStatus('Template');
        }

        // Check if the extension is supposed to be toggle and if not then #register it as disabled
        if(!this.toggle) {
            this.setStatus('Disabled');
        }

        // Whether an error was passed to the method
        if(this.error) {
            this.setStatus('Error');
        }

        if(this.dependencies.length > 0) {
            const dependencies = await this.#checkDependencies(Extensions);

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
    async #checkDependencies(Extensions) {

        const returnable = [];
        await this.dependencies.forEach(async Dependency => {

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
        try {
            /**
             * The run method is only triggered if the status was "Ready"; if not then don't
             * this is especially useful if an author manually changed the extension status to "Enabled" using Extension.setStatus()
             * if the extension is supposed to be enabled before the core is ready; such as a web panel; or an API
             * that way so the Extensions module doesn't run the code twice, or the extension doesn't even have a run method
             * instead it run on file read immediately!
             */
            if(this.status === 'Ready') {
                on('DiscordFramework:Clients:Ready', () => {
                    this.Run();
                    this.setStatus('Enabled');
                });
            }
        }
        catch (err) {
            this.#register('Error');
            console.error(err);
        }
    }

    #flagError(error) {
        this.status = error;
        throw new Error(error);
    }

    // EXTERNALLY ACCESSIBLE METHOD

    /**
     * Sets the extension status to be shown in console
     * This does not need to be changed, and does not functionally effect anything at all
     * @param {string} status The new extension status
     * @returns {Extension}
     */
    setStatus(status) {
        this.status = status;
        return this;
    }

    /**
     * The main runtime method that will automatically be called after extension registration
     */
    run() {
        if(global.DebugMode) console.error(`${this.Name} Extension doesn't have a Run() method.`);
    }

    runClient(PlayerId) {
        emitNet('DiscordFramework:Extensions:RunClientSide:' + this.Name, PlayerId ? PlayerId : -1);
    }

    /**
     * A fancy and a quick way to hold code execution
     * @param {number} WaitMS A wait time in milliseconds
     * @returns {promise<void>}
     * @example await this.delay(2000) // hold execution for 2 seconds
     */
    async delay(WaitMS) {
        return await new Promise(resolve => setTimeout(resolve, WaitMS));
    }

    /**
     * An extension info/detail getter method that return extension information
     * @return {object} The provided information provided in super()
     * @example this.Info // output: {name: string, description: string, toggle: boolean, status: string, dependencies: Array, author: string, version: string}
     */
    getInfo() {
        return {
            name: this.name,
            description: this.description,
            toggle: this.toggle,
            status: this.status,
            dependencies: this.dependencies,
            author: this.author,
            version: this.version,
            config: this.config
        };
    }

    /**
     * A config getter method that returns the extensions configuration
     * @return {object} The provided config object provided in super()
     * @example this.Config // output: {}
     */
    getConfig() {
        return this.config;
    }

}

module.exports = Extension;