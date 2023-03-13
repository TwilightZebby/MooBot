const { Client, GatewayIntentBits, Collection, Partials, EmbedBuilder, StringSelectMenuInteraction, ButtonBuilder } = require("discord.js");
const { StatuspageUpdates } = require("statuspage.js");
const { DiscordStatusPageID } = require("./config.js");

module.exports =
{
    // Discord Client representing the Bot/App
    DiscordClient: new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.MessageContent ], partials: [ Partials.Message ] }),
    // StatusPage Client
    DiscordStatusClient: new StatuspageUpdates(DiscordStatusPageID, 10000),

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

        /** @type {Collection<String, {type: String, embed: EmbedBuilder, roles: Array<{id: String, style: String, emoji: ?String, label: ?String}>, buttons: Array<ButtonBuilder>, interaction: ?StringSelectMenuInteraction, timeout: NodeJS.Timeout}>} */
        RoleMenuCreation: new Collection(),
        /** @type {Collection<String, {type: String, originMessageId: String, embed: EmbedBuilder, roles: Array<{id: String, style: String, emoji: ?String, label: ?String}>, buttons: Array<ButtonBuilder>, interaction: ?StringSelectMenuInteraction, timeout: NodeJS.Timeout}>} */
        RoleMenuConfiguration: new Collection(),

        /** @type {Collection<String, {type: String, embed: EmbedBuilder, choices: Array<{label: String, emoji: ?String}>, interaction: ?StringSelectMenuInteraction, timeout: NodeJS.Timeout}>} */
        PollCreation: new Collection(),

        /** Contains Message IDs for each Incident, mapped by Webhook IDs, all mapped by Incident IDs
         * @type {Collection<String, Collection<String, String>} */
        DiscordStatusUpdates: new Collection()
    }
}
