module.exports = {
    development: {
        debuggingMode: true
    },
    core: {
        discord: {
            /**
             * The framework DOES require a discord bot token to fully function.
             * though keep in mind the framework core    DOES NOT     need any bot permissions to fully function
             * to its fullist capacity.                  ---------
             *
             * you could change this to the token as a string, 'Token'
             * I'm using an environment variable so I can push it to github without Clyde bugging me
             * and changing the token constantly ¯\_(ツ)_/¯
             */
            token: process.env.discord_token,
            /**
             * communityGuild will be used at the primary discord server for checking players' memberships,
             * players' roles' and discord permissions
             *
             * Change communityGuild.ID to your main/primary discord server's ID in the variables below,
             * NOTE:  it will be used as a fallback/fail-safe where; the discord methods that
             *        allow for discord guilds to be specified as an option, but if no GuildId was provided, the method will
             *        fallback to the communityGuild, and if no communityGuild.ID is present, or the bot is not in the guild, or communityGuild.ID
             *        is incorrect all Discord functions throw an error IF no GuildId is provided as an optional parameter
             */
            communityGuild: {
                id: '1116287895263789186',
                name: 'Lix\'s Model Warehouse',
                invite: 'https://discord.gg/cY48f6HdY5'
            }
        },
        mongo: {
            uri: 'mongodb://localhost:27017',
            databaseName: 'DiscordFramework'
        }
    },
    connection: {
        requireMember: {
            enabled: true, // Whether the player is required to be in the discord server provided in { this.core.discord.communityGuild }
            message:
            `[DiscordFramework] You are not a member of the community!
            Join us today! discord.gg/invite` // The connection rejection message to be shown to the player who isn't in the { this.core.discord.communityGuild } discord server
        }
    }
};
