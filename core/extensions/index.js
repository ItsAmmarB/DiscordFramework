class Extensions {

    constructor(Extension) {

        // Check Extension name
        if (Extension.Name) {
            if (typeof Extension.Name !== 'string') {
                this.#Register(2);
                return this.#PrintError('UNKNOWN_EXTENTION: Extension "Name" must be typeof String')
            };
            this.Name = Extension.Name;
        } else {
            this.#Register(2);
            return this.#PrintError('UNKNOWN_EXTENTION: attempted to #register a nameless extension');
        }

        // Check Extension description if available
        if (Extension.Description) {
            if (typeof Extension.Description !== 'string') {
                this.#Register(2);
                return this.#PrintError('UNKNOWN_EXTENTION: Extension "Description" must be typeof string')
            };
            this.Description = Extension.Description;
        }

        // Check Extension toggle
        if (Extension.Enabled && typeof Extension.Enabled !== 'undefined') {
            if (typeof Extension.Enabled !== 'boolean') return this.#PrintError('UNKNOWN_EXTENTION: Extension "Enabled" must be typeof Boolean');
            this.Enabled = Extension.Enabled;
        } else {
            this.#Register(2);
            return this.#PrintError('UNKNOWN_EXTENTION: attempted to #register an extension without a toggle "Enabled"');
        }

        // Check Extension dependencies if available
        if (Extension.Dependencies) {
            if (typeof Extension.Dependencies !== 'object' || !Array.isArray(Extension.Dependencies)) return this.#PrintError('UNKNOWN_EXTENTION: Extension "Dependencies" must be typeof Array');
            this.Dependencies = Extension.Dependencies;
        }

        // Check Extension author if available
        if (Extension.Author) {
            if (typeof Extension.Author !== 'string') return this.#PrintError('UNKNOWN_EXTENTION: Extension "Author" must be typeof string');
            this.Author = Extension.Author;
        }

        // Check Extension version if available
        if (Extension.Version) {
            if (typeof Extension.Version !== 'string') return this.#PrintError('UNKNOWN_EXTENTION: Extension "Version" must be typeof string');
            this.Version = Extension.Version;
        }

        this.Status = null;
        this.#Initialize()

    }

    // This method is private and only accessible from this class
    async #Initialize() {

        // Wrap everything in a try-catch incase something goes wrong
        try {

            // Check if the extension is a mere template and #register it as 'Template'
            if (this.Name === 'Template') {
                return this.#Register(7);
            }

            // Check if the extension is supposed to be enabled and if not then #register it as disabled
            if (!this.Enabled) {
                return this.#Register(0);
            }

            // Check the extension's dependencies and if all dependencies are enabled and active
            if (this.Dependencies.length > 0) {
                const Dependencies = this.Dependencies.map(dependency => ({ name: dependency, state: null }));

                await this.Delay(100);

                for (let i = 0; i < Dependencies.length; i++) {
                    const dependency = Dependencies[i];
                    if (this.#CheckDependency(dependency.name) === 1) return Dependencies[i].state = 1;

                    let counter = 0;
                    while (this.#CheckDependency(dependency.name) !== 1) {
                        await this.Delay(100);

                        const Dependency = this.#CheckDependency(dependency);
                        if (Dependency === 1) {
                            Dependencies[i].state = 1;
                            break;
                        }
                        if (Dependency === 7) {
                            console.warn(`Template cannot be a dependency for an extension!\n         Dependency was ignored in the "${this.Name}" extension`);
                            Dependencies[i].state = 1;
                            break;
                        }
                        if (counter === 5) {
                            Dependencies[i].state = Dependency;
                            break;
                        }

                        counter++;
                    }

                }

                if (Dependencies.find(dependency => dependency.state !== 1)) return this.#Register(5);
            }

            this.Run();
            this.#DeflectEvent(this.Name);
            await this.Delay(75);
            this.#Register(1);

        } catch (err) {
            this.#Register(2);
            this.#PrintError(err);
        }

    }

    #Register(State) {
        this.State = State;
        if (SV_Config.Extensions.filter(extension => extension.name === this.Name).length > 1) {
            SV_Config.Extensions.filter(extension => extension.name === this.Name).forEach(extension => extension.state = 2);
            return this.#PrintError(new Error(`EXTEN_DUPLIC: Duplicate extension config names were found "${this.Name}"`));
        }

        if (SV_Config.Extensions.find(extension => extension.name === this.Name)) {
            const Config = {
                name: this.Name,
                description: this.Description,
                enabled: this.Enabled,
                dependencies: this.Dependencies,
                state: this.State,
                version: this.Version,
                author: this.Author,
                config: SV_Config.Extensions.find(extension => extension.name === this.Name).config
            };
            SV_Config.Extensions = SV_Config.Extensions.map(extension => Config.name === extension.name ? Config : extension);
        } else {
            const Config = {
                name: this.Name,
                description: this.Description,
                enabled: this.Enabled,
                dependencies: this.Dependencies,
                state: this.State,
                version: this.Version,
                author: this.Author,
                config: {}
            };
            SV_Config.Extensions.push(Config);
        }
        if (SV_Config.Extensions.find(extension => extension === null)) SV_Config.Extensions = SV_Config.Extensions.filter(extension => extension !== null);
        emit('DiscordFramework:Extensions:Registered', this.Name, this.State)
    }

    #CheckDependency(Dependency) {
        const Extension = SV_Config.Extensions.find(extension => extension.name === Dependency.name);
        if (!Extension) {
            return 5;
        } else if (Extension.state === 0) {
            return 4;
        } else if (Extension.state === 2) {
            return 6;
        } else if (Extension.state === 7) {
            return 7;
        } else {
            return 1;
        }
    }


    /**
     * this needs so revisions to work a better way to execute
     *
     * PS: Every extension should handle its client runners and on player connected on it own
     */
    #DeflectEvent(exName) {
        on(`DiscordFramework:Extensions:RunClientSide:${exName}`, (extensionName, playerId) => {
            emitNet(`DiscordFramework:Extensions:RunClientSide:${extensionName}`, playerId, extensionName);
            emitNet('DiscordFramework:Core:Console', playerId, `^2[^0Extensions^2]^3: ^4${extensionName} loaded!`);
        });
    }

    /**
     * This method was discontinued due to possible inconsistencies
     * acroess extensions, thus; leaving the extensions to handle player connections
     * on it's own for the better
     */
    // PlayerConnected() {
    //     on('DiscordFramework:Player:Connected', async PlayerId => {
    //         for (let i = 0; i < SV_Config.Extensions.length; i++) {
    //             const extension = SV_Config.Extensions[i];
    //             if(extension.state === 1) {
    //                 console.log(extension.name, i);
    //                 await this.Delay(500);
    //                 emitNet(`DiscordFramework:Extensions:RunClientSide:${extension.name}`, PlayerId, extension.name);
    //                 emitNet('DiscordFramework:Extensions:ClientSideLoaded', PlayerId, extension.name);
    //             }
    //         }
    //     });
    // }

    async Run() {
        await this.Delay(1000);
        this.#Register(2);
        this.#PrintError(new Error(`${this.Name} Extension doesn't have a Run() method.`));
    }

    async #PrintError(Err) {

        while (!IsCoreReady) {
            console.log('Extensions: Core is not ready!!!');
            await Extensions.prototype.Delay(1500);
        }

        setTimeout(() => {
            console.error(Err);
        }, 1500);
    }

    async Delay(WaitMS) {
        return await new Promise(resolve => setTimeout(resolve, WaitMS));
    }

    get Info() {
        const info = {}
        if (this.Name) info.Name = this.Name;
        if (this.Description) info.Description = this.Description;
        if (this.Enabled) info.Enabled = this.Enabled;
        if (this.Status) info.Status = this.Status;
        if (this.Dependencies) info.Dependencies = this.Dependencies;
        if (this.Author) info.Author = this.Author;
        if (this.Version) info.Version = this.Version;
        return info
    }

    get Config() {
        return SV_Config.Extensions.find(extension => extension.name === this.Name).config || {};
    }

}

const GetExtension = (ExtentionName) => {
    if (!ExtentionName) return null;
    return SV_Config.Extensions.find(extention => extention.name === ExtentionName);
};

const GetExtensionsCount = () => {
    const Enabled = SV_Config.Extensions.filter(Extension => Extension.state === 1);
    const Disabled = SV_Config.Extensions.filter(Extension => Extension.state !== 1);
    return { enabled: Enabled, disabled: Disabled, total: SV_Config.Extensions };
};

const TranslateState = (state) => {
    const ExtensionState = {
        0: 'Disabled',
        1: 'Enabled',
        2: 'Error',
        3: 'Duplicate',
        4: 'Dependency Disabled',
        5: 'Dependency Missing',
        6: 'Dependency Error',
        7: 'Template'
    };
    return ExtensionState[state];
};


module.exports = {
    Extension: Extensions,
    GetExtensionsCount: GetExtensionsCount,
    TranslateState: TranslateState,
    GetExtension: (extentionName) => GetExtension(extentionName)
};

