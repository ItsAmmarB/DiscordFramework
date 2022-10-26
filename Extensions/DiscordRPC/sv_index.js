on('DiscordFramework:Extensions:Extension:Load', () => {

    const { Extension } = require(GetResourcePath(GetCurrentResourceName()) + '/Core/Modules/Extensions/index');

    new class DiscordRPC extends Extension {
        constructor() {
            super({
                name: 'DiscordRPC', // Change to extension name
                description: 'A discord rich presence extension', // Add a brief decription of what does the extension do
                toggle: true, // Whether the extension is supposed to be enabled or disabled
                dependencies: [], // Add the dependencies/other extensions needed for this extension to be usable
                version: '1.0', // The current version of the extension if available
                author: 'ItsAmmarB',
                config: {}
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