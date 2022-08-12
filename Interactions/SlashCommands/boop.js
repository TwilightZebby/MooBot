const Discord = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");
const LocalizedStrings = require("../../JsonFiles/stringMessages.json");
const ActionCommandModule = require('../../BotModules/ActionModule.js');

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "boop",

    // Command's Description
    Description: `Give someone a boop!`,

    // Command's Category
    Category: "ACTION",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 5,

    // Cooldowns for specific subcommands and/or subcommand-groups
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandCooldown: {
        "example": 3
    },

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "GUILD",

    // Scope of specific Subcommands Usage
    //     One of the following: DM, GUILD, ALL
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandScope: {
        "example": "GUILD"
    },



    /**
     * Returns data needed for registering Slash Command onto Discord's API
     * @returns {Discord.ChatInputApplicationCommandData}
     */
    registerData()
    {
        /** @type {Discord.ChatInputApplicationCommandData} */
        const Data = {};

        Data.name = this.Name;
        Data.description = this.Description;
        Data.type = Discord.ApplicationCommandType.ChatInput;
        Data.dmPermission = false;
        Data.options = [
            {
                type: Discord.ApplicationCommandOptionType.Mentionable,
                name: "person",
                description: "Person you want to boop",
                required: true
            },
            {
                type: Discord.ApplicationCommandOptionType.Boolean,
                name: "gif",
                description: "Should a random GIF be displayed? (default: false)",
                required: false
            },
            {
                type: Discord.ApplicationCommandOptionType.Boolean,
                name: "button",
                description: "Should the \"Return Boop\" Button be included? (default: true)",
                required: false
            },
            {
                type: Discord.ApplicationCommandOptionType.String,
                name: "reason",
                description: "A custom message to be added onto the end of the default message",
                max_length: 500,
                required: false
            }
        ];

        return Data;
    },



    /**
     * Executes the Slash Command
     * @param {Discord.ChatInputCommandInteraction} slashCommand 
     */
    async execute(slashCommand)
    {
        return await ActionCommandModule.main(slashCommand);
    },



    /**
     * Handles given Autocomplete Interactions for any Options in this Slash CMD that uses it
     * @param {Discord.AutocompleteInteraction} autocompleteInteraction 
     */
    async autocomplete(autocompleteInteraction)
    {
        //.
    }
}
