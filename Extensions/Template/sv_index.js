on('DiscordFramework:Extensions:Extension:Load', () => {

    const { Extension } = require(GetResourcePath(GetCurrentResourceName()) + '/Core/Modules/Extensions/index');

    new class Template extends Extension {
        constructor() {
            super({
                Name: 'Template', // Change to extension name
                Description: 'DESCRIPTION', // Add a brief decription of what does the extension do
                Enabled: true, // Whether the extension is supposed to be enabled or disabled
                Dependencies: [], // Add the dependencies/other extensions needed for this extension to be usable
                Version: 'VERSON', // The current version of the extension if available
                Author: 'AUTHOR',
                Config: { }
            });

        }

        Run() {
            // Code here
        }

    };

});