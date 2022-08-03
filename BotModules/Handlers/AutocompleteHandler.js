const Discord = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");
const Config = require("../../config.js");

module.exports = {
    /**
     * Handles and runs received Autocomplete Interactions
     * @param {Discord.AutocompleteInteraction} autocompleteInteraction 
     */
    async Main(autocompleteInteraction)
    {
        // Find Slash Command with matching name
        const SlashCommand = Collections.SlashCommands.get(autocompleteInteraction.commandName);
        if ( !SlashCommand ) { return await autocompleteInteraction.respond([{name: LocalizedErrors[autocompleteInteraction.locale].AUTOCOMPLETE_GENERIC_FAILED, value: "ERROR_FAILED"}]); }

        // Pass to Command's Autocomplete Method
        return await SlashCommand.autocomplete(autocompleteInteraction);
    }
}
