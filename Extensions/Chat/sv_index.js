on('DiscordFramework:Extensions:Extension:Load', () => {

    const { Extension } = require(GetResourcePath(GetCurrentResourceName()) + '/Core/Modules/Extensions/index');

    new class Chat extends Extension {
        constructor() {
            const config = require(GetResourcePath(GetCurrentResourceName()) + '/Extensions/Chat/config');
            super({
                Name: 'Chat', // Change to extension name
                Description: 'An extension that provides chat roles and proximity', // Add a brief decription of what does the extension do
                Enabled: true, // Whether the extension is supposed to be enabled or disabled
                Dependencies: [], // Add the dependencies/other extensions needed for this extension to be usable
                Version: '1.0', // The current version of the extension if available
                Author: 'ItsAmmarB',
                Config: config
            });

        }

        Run() {

            on('DiscordFramework:Player:Joined', Player => {
                // Trigger the client side
                this.RunClient(Player.Server.ID);
            });

            const Config = this.Config;

            on('chatMessage', function(source, author, message) {
                if (message[0].split('')[0] !== '/') {

                    CancelEvent();

                    const Players = require(GetResourcePath(GetCurrentResourceName()) + '/Core/players');
                    const Player = new Players.Player(source);
                    const PlayerRoles = [].concat.apply([], Player.Discord.Guilds.map(Guild => Guild.Roles)) ;

                    let RoleName = Config.DefaultRole;

                    if(Player.Discord.ID && Config.Roles[Player.Discord.ID]) {
                        RoleName = Config.Roles[Player.Discord.ID];
                    } else if(PlayerRoles && PlayerRoles.length > 0) {
                        for (const Role of Object.keys(Config.Roles)) {
                            if(PlayerRoles.find(role => role.ID === Role)) {
                                console.log(PlayerRoles.find(role => role.ID === Role));
                                RoleName = Config.Roles[Role];
                                break;
                            }
                        }
                    }

                    emit('DiscordFramework:Chat:AddMessage', Player, message);

                    if (Config.Proximity.Enabled) {
                        emitNet('DiscordFramework:Chat:AddProximityMessage', -1, GetEntityCoords(GetPlayerPed(source)), [
                            Config.Template[0].format({ role: RoleName, name: author, id: source }),
                            Config.Template[1].format({ message: message })
                        ], Config.Proximity.Radius);
                    } else {
                        emitNet('chat:addMessage', -1, {
                            args: [
                                Config.Template[0].format({ role: RoleName, name: author, id: source }),
                                Config.Template[1].format({ message: message })
                            ]
                        });
                    }
                }
            });

        }

    };

});