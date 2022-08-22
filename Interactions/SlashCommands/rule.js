const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, ApplicationCommandOptionType } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");
const LocalizedStrings = require("../../JsonFiles/stringMessages.json");
const RulesJson = require("../../JsonFiles/Hidden/serverRules.json");


module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "rule",

    // Command's Description
    Description: `Display a specific rule for this Server`,

    // Command's Category
    Category: "INFORMATIONAL",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 3,

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
     * @returns {ChatInputApplicationCommandData}
     */
    registerData()
    {
        /** @type {ChatInputApplicationCommandData} */
        const Data = {};

        Data.name = this.Name;
        Data.description = this.Description;
        Data.type = ApplicationCommandType.ChatInput;
        Data.options = [{
            type: ApplicationCommandOptionType.String,
            name: "rule",
            description: "The Server Rule to fetch",
            autocomplete: true,
            required: true
        }];

        return Data;
    },



    /**
     * Executes the Slash Command
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async execute(slashCommand)
    {
        // Grab data
        const RuleOption = slashCommand.options.getString("rule", true);
        const FetchedRule = RulesJson["rules"][`${slashCommand.guildId}`][`${RuleOption.trimEnd()}`];
        const FetchedRulesChannel = RulesJson["rulesChannel"][`${slashCommand.guildId}`];
        return await slashCommand.reply({ allowedMentions: { parse: [], repliedUser: false }, content: `${FetchedRule}\n\n*- <#${FetchedRulesChannel}> ${RuleOption}*` });
    },



    /**
     * Handles given Autocomplete Interactions for any Options in this Slash CMD that uses it
     * @param {AutocompleteInteraction} autocompleteInteraction 
     */
    async autocomplete(autocompleteInteraction)
    {
        /** @type {String} */
        const FocusedValue = autocompleteInteraction.options.getFocused();
        /** @type {Array<String>} */
        let filteredRules;

        if ( !FocusedValue || FocusedValue == "" || FocusedValue == " " ) { filteredRules = RulesJson["autocompleteArray"][`${autocompleteInteraction.guildId}`]; }
        else { filteredRules = RulesJson["autocompleteArray"][`${autocompleteInteraction.guildId}`].filter(rule => rule.toLowerCase().startsWith(FocusedValue.toLowerCase()) || rule.toLowerCase().includes(FocusedValue.toLowerCase())); }

        // Keep within 25 choice limit
        if ( filteredRules.length > 25 ) { filteredRules.slice(0, 24); }

        return await autocompleteInteraction.respond(filteredRules.map(rule => ({ name: rule, value: rule.slice(0, 4) })));
    }
}
