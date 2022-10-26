on('DiscordFramework:Core:Ready', () => {

    const { Extension } = require(GetResourcePath(GetCurrentResourceName()) + '/Core/Modules/Extensions/index');

    new class Blacklist extends Extension {
        constructor() {
            const Config = require(GetResourcePath(GetCurrentResourceName()) + '/extensions/Blacklist/config');
            super({
                Name: 'Blacklist', // Change to extension name
                Description: 'A weapons/vehicles blacklisting system', // Add a brief decription of what does the extension do
                Enabled: false, // Whether the extension is supposed to be enabled or disabled
                Dependencies: ['Permissions'], // Add the dependencies/other extensions needed for this extension to be usable
                Version: '1.2', // The current version of the extension if available
                Author: 'ItsAmmarB', // The person(s) who have made the extension and deserved credits
                Config: Config
            });
        }

        Run() {
            /**
             * On player connected run the client side and then initialize with config variables from the server side
             * as a security measure; you can never be too safe!    ¯\_(ツ)_/¯
             */
            on('DiscordFramework:Player:Joined', async Player => {
                this.RunClient(Player.Server.ID);
                await this.Delay(500);
                emitNet('DiscordFramework:Extension:Blacklist:Initialize', Player.Server.ID, {
                    AllWeapons: this.Config.AllWeapons,
                    Weapons: this.Config.Weapons,
                    Vehicles: this.Config.Vehicles
                });
            });

            setInterval(() => {
                emitNet('DiscordFramework:Extension:Blacklist:UpdateConfig', -1, {
                    AllWeapons: this.Config.AllWeapons,
                    Weapons: this.Config.Weapons,
                    Vehicles: this.Config.Vehicles
                });
            }, 60000);
        }

    };

});