on('DiscordFramework:Core:Ready', () => {

    const { Extension, Extensions } = require(GetResourcePath(GetCurrentResourceName()) + '/core/modules/extensions/index');

    new class Test extends Extension {
        constructor() {
            super({
                name: 'Test', // Change to extension name
                description: 'A mere testing extension', // Add a brief decription of what does the extension do
                toggle: false, // Whether the extension is supposed to be enabled or disabled
                dependencies: [], // Add the dependencies/other extensions needed for this extension to be usable
                version: '1.0', // The current version of the extension if available
                author: 'ItsAmmarB',
                config: {
                    TestingVariable: 'Testing testing...'
                }
            });
        }

        Run() {

            RegisterCommand('extensions', () => console.log(Extensions));

        }


    };

});