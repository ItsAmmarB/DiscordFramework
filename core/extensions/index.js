class Extensions {

    constructor(Extension) {

        let error = null;

        if(!Extension.Name) error = 'UNKNOWN_EXTENTION: attempted to register a nameless extension';
        if(!error && typeof Extension.Name !== 'string') error = 'UNKNOWN_EXTENTION: Extension "Name" must be a String';
        if(!error) this.name = Extension.Name;

        if(Extension.Description) {
            if(!error && typeof Extension.Description !== 'string') error = 'UNKNOWN_EXTENTION: Extension "Description" must be a string';
            if(!error) this.description = Extension.Description;
        }

        if(!error && typeof Extension.Enabled !== 'boolean') error = 'UNKNOWN_EXTENTION: Extension "Enabled" must be a Boolean';
        if(!error) this.enabled = Extension.Enabled;

        if(!error && typeof Extension.Dependencies !== 'object' || !Array.isArray(Extension.Dependencies)) error = 'UNKNOWN_EXTENTION: Extension "Dependencies" must be an Array';
        if(!error) this.dependencies = Extension.Dependencies;

        if(Extension.Author) {
            if(!error && typeof Extension.Author !== 'string') error = 'UNKNOWN_EXTENTION: Extension "Author" must be a string';
            if(!error) this.Author = Extension.Author;
        }

        if(!error) this.state = null;

        if(error) this.error = error;

    }

    // This method will be triggered automatically unless method was overridden in the extension.
    async Initialize() {

        // Wrap everything in a try-catch incase something goes wrong
        try {

            // Check whether and error occured during constructor validation
            if(this.error) {
                this.Register(2);
                await this.Delay(5000);
                return PrintError(this.error);
            }

            // Check if the extension is a mere template and register it as 'Template'
            if(this.name === 'Template') {
                return this.Register(7);
            }

            // Check if the extension is supposed to be enabled and if not then register it as disabled
            if(!this.enabled) {
                return this.Register(0);
            }

            // Check the extension's dependencies and if all dependencies are enabled and active
            if(this.dependencies.length > 0) {
                const Dependencies = this.dependencies.map(dependency => ({ name: dependency, state: null }));

                await this.Delay(100);

                for (let i = 0; i < Dependencies.length; i++) {
                    const dependency = Dependencies[i];
                    if(this.CheckDependency(dependency.name) === 1) return Dependencies[i].state = 1;

                    let counter = 0;
                    while (this.CheckDependency(dependency.name) !== 1) {
                        await this.Delay(100);

                        const Dependency = this.CheckDependency(dependency);
                        if(Dependency === 1) {
                            Dependencies[i].state = 1;
                            break;
                        }
                        if(Dependency === 7) {
                            console.warn(`Template cannot be a dependency for an extension!\n         Dependency was ignored in the "${this.name}" extension`);
                            Dependencies[i].state = 1;
                            break;
                        }
                        if(counter === 5) {
                            Dependencies[i].state = Dependency;
                            break;
                        }

                        counter++;
                    }

                }

                if(Dependencies.find(dependency => dependency.state !== 1)) return this.Register(5);
            }

            this.Run();
            this.InitiateClientSide(this.name);
            await this.Delay(75);
            this.Register(1);

        } catch(err) {
            this.Register(2);
            PrintError(err);
        }

    }

    Register(State) {
        this.state = State;
        if(SV_Config.Extensions.filter(extension => extension.name === this.name).length > 1) {
            SV_Config.Extensions.filter(extension => extension.name === this.name).forEach(extension => extension.state = 2);
            return PrintError(new Error(`EXTEN_DUPLIC: Duplicate extension config names were found "${this.name}"`));
        }

        if(SV_Config.Extensions.find(extension => extension.name === this.name)) {
            const Config = {
                name: this.name,
                description: this.description,
                enabled: this.enabled,
                dependencies: this.dependencies,
                state: this.state,
                author: this.Author,
                config: SV_Config.Extensions.find(extension => extension.name === this.name).config
            };
            SV_Config.Extensions = SV_Config.Extensions.map(extension => Config.name === extension.name ? Config : extension);
        } else {
            const Config = {
                name: this.name,
                description: this.description,
                enabled: this.enabled,
                dependencies: this.dependencies,
                state: this.state,
                author: this.Author,
                config: {}
            };
            SV_Config.Extensions.push(Config);
        }
        if(SV_Config.Extensions.find(extension => extension === null)) SV_Config.Extensions = SV_Config.Extensions.filter(extension => extension !== null);

    }

    CheckDependency(Dependency) {
        const Extension = SV_Config.Extensions.find(extension => extension.name === Dependency.name);
        if(!Extension) {
            return 5;
        } else if(Extension.state === 0) {
            return 4;
        } else if(Extension.state === 2) {
            return 6;
        } else if(Extension.state === 7) {
            return 7;
        } else {
            return 1;
        }
    }

    InitiateClientSide(exName) {
        on(`DiscordFramework:Extensions:RunClientSide:${exName}`, async (_exName) => {
            await this.Delay(500);
            emitNet(`DiscordFramework:Extensions:RunClientSide:${_exName}`, -1, _exName);
            emitNet('DiscordFramework:Extensions:ClientSideLoaded', -1, _exName);
        });
    }

    PlayerConnected() {
        onNet('DiscordFramework:Core:PlayerConnected:Client', (PlayerId) => {
            SV_Config.Extensions.forEach(async extension => {
                if(extension.state === 1) {
                    await this.Delay(500);
                    emitNet(`DiscordFramework:Extensions:RunClientSide:${extension.name}`, PlayerId, extension.name);
                    await this.Delay(500);
                    emitNet('DiscordFramework:Extensions:Loaded', PlayerId, extension.name);
                }
            });
        });
    }

    async Run() {
        await this.Delay(1000);
        this.Register(2);
        PrintError(new Error(`${this.name} Extension doesn't have a Run() method.`));
    }

    async Delay(WaitMS) {
        return await new Promise(resolve => setTimeout(resolve, WaitMS));
    }

}

const PrintError = async Err => {

    while(CoreReady !== 2) {
        await Extensions.prototype.Delay(1500);
    }

    setTimeout(() => {
        console.error(Err);
    }, 1500);
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

global.Extensions = {
    Extension: Extensions
};

module.exports = {
    // Extensions: Extensions,
    GetExtensionsCount: GetExtensionsCount,
    TranslateState: TranslateState
};
