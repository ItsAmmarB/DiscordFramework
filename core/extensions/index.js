class Extensions {

    constructor(Extension) {

        let error = null;

        if(!Extension.Name) error = 'UNKNOWN_EXTENTION: attempted to register a nameless extension';
        if(!error && typeof Extension.Name !== 'string') error = 'UNKNOWN_EXTENTION: Extension "Name" must be a String';
        if(!error) this.Name = Extension.Name;

        if(Extension.Description) {
            if(!error && typeof Extension.Description !== 'string') error = 'UNKNOWN_EXTENTION: Extension "Description" must be a string';
            if(!error) this.Description = Extension.Description;
        }

        if(!error && typeof Extension.Enabled !== 'boolean') error = 'UNKNOWN_EXTENTION: Extension "Enabled" must be a Boolean';
        if(!error) this.Enabled = Extension.Enabled;

        if(!error && typeof Extension.Dependencies !== 'object' || !Array.isArray(Extension.Dependencies)) error = 'UNKNOWN_EXTENTION: Extension "Dependencies" must be an Array';
        if(!error) this.Dependencies = Extension.Dependencies;

        if(Extension.Author) {
            if(!error && typeof Extension.Author !== 'string') error = 'UNKNOWN_EXTENTION: Extension "Author" must be a string';
            if(!error) this.Author = Extension.Author;
        }

        if(Extension.Version) {
            if(!error && typeof Extension.Version !== 'string') error = 'UNKNOWN_EXTENTION: Extension "Version" must be a string';
            if(!error) this.Version = Extension.Version;
        }

        if(!error) this.State = null;

        if(error) this.Error = error;

    }

    // This method will be triggered automatically unless method was overridden in the extension.
    async Initialize() {

        // Wrap everything in a try-catch incase something goes wrong
        try {

            // Check whether and error occured during constructor validation
            if(this.Error) {
                this.Register(2);
                await this.Delay(5000);
                return this.PrintError(this.Error);
            }

            // Check if the extension is a mere template and register it as 'Template'
            if(this.Name === 'Template') {
                return this.Register(7);
            }

            // Check if the extension is supposed to be enabled and if not then register it as disabled
            if(!this.Enabled) {
                return this.Register(0);
            }

            // Check the extension's dependencies and if all dependencies are enabled and active
            if(this.Dependencies.length > 0) {
                const Dependencies = this.Dependencies.map(dependency => ({ name: dependency, state: null }));

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
                            console.warn(`Template cannot be a dependency for an extension!\n         Dependency was ignored in the "${this.Name}" extension`);
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
            this.DeflectEvent(this.Name);
            await this.Delay(75);
            this.Register(1);

        } catch(err) {
            this.Register(2);
            this.PrintError(err);
        }

    }

    Register(State) {
        this.State = State;
        if(SV_Config.Extensions.filter(extension => extension.name === this.Name).length > 1) {
            SV_Config.Extensions.filter(extension => extension.name === this.Name).forEach(extension => extension.state = 2);
            return this.PrintError(new Error(`EXTEN_DUPLIC: Duplicate extension config names were found "${this.Name}"`));
        }

        if(SV_Config.Extensions.find(extension => extension.name === this.Name)) {
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


    /**
     * this needs so revisions to work a better way to execute
     *
     * PS: Every extension should handle its client runners and on player connected on it own
     */
    DeflectEvent(exName) {
        on(`DiscordFramework:Extensions:RunClientSide:${exName}`, (extensionName, playerId) => {
            emitNet(`DiscordFramework:Extensions:RunClientSide:${extensionName}`, playerId, extensionName);
            emitNet('DiscordFramework:Core:Console', playerId, `^2[^0Extensions^2]^3: ^4${extensionName} loaded!`);
        });
    }

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
        this.Register(2);
        this.PrintError(new Error(`${this.Name} Extension doesn't have a Run() method.`));
    }

    async Delay(WaitMS) {
        return await new Promise(resolve => setTimeout(resolve, WaitMS));
    }

    async PrintError(Err) {

        while(!IsCoreReady) {
            console.log('Extensions: Core is not ready!!!');
            await Extensions.prototype.Delay(1500);
        }

        setTimeout(() => {
            console.error(Err);
        }, 1500);
    }

}

const GetExtension = (ExtentionName) => {
    if(!ExtentionName) return null;
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

global.Extensions = {
    Extension: Extensions
};

module.exports = {
    // Extensions: Extensions,
    GetExtensionsCount: GetExtensionsCount,
    TranslateState: TranslateState,
    GetExtension: (extentionName) => GetExtension(extentionName)
};

