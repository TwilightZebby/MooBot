// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const RulesJson = require('../hiddenJsonFiles/dr1fterxServerRules.json');


module.exports = {
    // Slash Command's Name, MUST BE LOWERCASE AND NO SPACES
    name: 'rule',
    // Slash Command's description
    description: `Fetch information about a specific Server Rule`,
    // Category of Slash Command, used for Help (text) Command
    category: 'general',

    // Slash Command's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 120,


    /**
     * Returns data used for registering this Slash Command
     * 
     * @returns {Discord.ChatInputApplicationCommandData}
     */
    registerData()
    {
        const data = {};

        // Slash Command's Name, Description, and Application Command Type
        data.name = this.name;
        data.description = this.description;
        data.type = "CHAT_INPUT";
        data.options = [
            {
                type: "STRING",
                name: "rule",
                description: "The Server Rule to fetch",
                autocomplete: true,
                required: true
            }
        ];
        
        return data;
    },




    /**
     * Main function that runs this Slash Command
     * 
     * @param {Discord.CommandInteraction} slashCommand Slash Command Interaction
     */
    async execute(slashCommand)
    {
        // Grab requested Rule
        const requestedRuleId = slashCommand.options.getString("rule", true);
        const requestedRule = RulesJson["rules"][`${requestedRuleId.trimEnd()}`];
        return await slashCommand.reply({ content: `${requestedRule}\n\n*- <#619492028341944320> ${requestedRuleId}*` });
    },







    /**
     * Handles the autocomplete argument(s) of this Slash Command
     * Commented out to possibly use at a later date
     * 
     * @param {Discord.AutocompleteInteraction} autocompleteInteraction 
     */
    async autocomplete(autocompleteInteraction)
    {
        /** @type {String} */
        const focusedValue = autocompleteInteraction.options.getFocused();
        let filteredResults;

        if ( !focusedValue || focusedValue == "" || focusedValue == " " )
        {
            filteredResults = RulesJson["autocompleteArray"];
        }
        else
        {
            filteredResults = RulesJson["autocompleteArray"].filter(rule => rule.toLowerCase().startsWith(focusedValue.toLowerCase()) || rule.toLowerCase().includes(focusedValue.toLowerCase()));
        }

        // Keep within 25 choice limit
        if ( filteredResults.length > 25 ) { filteredResults.slice(0, 24); }

        return await autocompleteInteraction.respond(filteredResults.map(rule => ({ name: rule, value: rule.slice(0, 4) })));
    }
};
