module.exports = {
    /**
     * The framework DOES require a discord bot token to fully function,
     * putting the token here puts it at high risk of being used maliciously
     * hence why it's not present here.
     *
     * To add your bot token, follow this directory path "Modules > Discord > index.js"
     * inside the index.js file at line 22, you will see where you're supposed to put the token
     * make sure to read the comment above it, its very important!!
     */
    Discord: {
        /**
         * MainGuild will be used at the primary discord server for checking players' memberships,
         * players' roles' and discord permissions
         *
         * Change MainGuild.ID to your main/primary discord server's ID in the variables below,
         * NOTE:  it will be used as a fallback/fail-safe where; the discord methods available will
         *        allow for discord guilds to be specified as an option, but if no GuildId was provided, the method will
         *        fallback to the MainGuild, and if no MainGuild.ID is present, or the bot is not in the guild, or MainGuild.ID
         *        is incorrect all Discord functions throw an error IF no GuildId is provided as an optional parameter
         */
        MainGuild: {
            ID: '354062777737936896',
            Name: 'JusticeCommunityRP'
        }
    },
    MongoDB: {
        NameOfDatabase: GetCurrentResourceName() // the name of the database
    },
    Players: {
        RequireDiscord: {
            Enabled: true, // Whether having Discord connect to FiveM is required to join the server
            Message: '[DiscordFramework] Discord ID could be detected!' // The connection rejection message to be shown to the player
        },
        RequireMember: {
            Enabled: true, // Whether the player is required to be in the discord server provided in line 21 { Discord.MainGuild }
            Message: ` 
            [DiscordFramework] You are not a member of the community!
            Join today! discord.gg/invite
            ` // The connection rejection message to be shown to the player
        }
    }
};