const { Client, GatewayIntentBits, Collection, Partials } = require("discord.js");

module.exports =
{
    // Discord Client representing the Bot/App
    DiscordClient: new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.MessageContent ], partials: [ Partials.Message ] }),

    // Collections that are used in many locations
    Collections: {
        TextCommands: new Collection(),
        SlashCommands: new Collection(),
        ContextCommands: new Collection(),
        Buttons: new Collection(),
        Selects: new Collection(),
        Modals: new Collection(),

        TextCooldowns: new Collection(),
        SlashCooldowns: new Collection(),
        ContextCooldowns: new Collection(),
        ButtonCooldowns: new Collection(),
        SelectCooldowns: new Collection(),

        /** @type {Collection<String, {type: String, embed: {title: ?String, description: ?String, color: ?String}, roles: ?Array<{id: String, emoji: ?String, label: ?String}>}>} */
        RoleMenuCreation: new Collection(),
        /** @type {Collection<String, {type: String, embed: {title: ?String, description: ?String, color: ?String}, roles: ?Array<{id: String, emoji: ?String, label: ?String}>}>} */
        RoleMenuConfiguration: new Collection()
    }
}
