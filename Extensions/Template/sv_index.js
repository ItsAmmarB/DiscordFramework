on('DiscordFramework:Extensions:Extension:Load', () => {

    const { Extension } = require(GetResourcePath(GetCurrentResourceName()) + '/Core/Modules/Extensions/index');

    new class Template extends Extension {
        constructor() {
            super({
                name: 'Template', // Change to extension name
                description: '', // Add a brief decription of what does the extension do
                toggle: true, // Whether the extension is supposed to be enabled or disabled
                dependencies: [], // Add the dependencies/other extensions needed for this extension to be usable
                version: '', // The current version of the extension if available
                author: '',
                config: { }
            });

        }

        Run() {
            // Code here
        }

    };

});