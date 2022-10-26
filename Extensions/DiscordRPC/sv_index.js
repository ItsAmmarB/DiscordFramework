on('DiscordFramework:Extensions:Extension:Load', () => {

    const { Extension } = require(GetResourcePath(GetCurrentResourceName()) + '/Core/Modules/Extensions/index');

    new class DiscordRPC extends Extension {
        constructor() {
            super({
                Name: 'DiscordRPC', // Change to extension name
                Description: 'A discord rich presence extension', // Add a brief decription of what does the extension do
                Enabled: false, // Whether the extension is supposed to be enabled or disabled
                Dependencies: [], // Add the dependencies/other extensions needed for this extension to be usable
                Version: '1.0', // The current version of the extension if available
                Author: 'ItsAmmarB',
                Config: {}
            });

        }

        Run() {
            on('DiscordFramework:Player:Joined', Player => {
                this.RunClient(Player.Server.ID);
                emitNet('DiscordFramework:DiscordRPC:MaxPlayers', Player.Server.ID, GetConvarInt('sv_maxclients', 0));
            });
        }

    };

});