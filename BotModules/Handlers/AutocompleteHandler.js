const { AutocompleteInteraction } = require("discord.js");
const { Collections } = require("../../constants.js");

module.exports = {
    /**
     * Handles and runs received Autocomplete Interactions
     * @param {AutocompleteInteraction} autocompleteInteraction 
     */
    async Main(autocompleteInteraction)
    {
        // Find Slash Command with matching name
        const SlashCommand = Collections.SlashCommands.get(autocompleteInteraction.commandName);
        if ( !SlashCommand ) { return await autocompleteInteraction.respond([{name: "ERROR: Unable to process, please contact this Bot's developer.", value: "ERROR_FAILED"}]); }

        // Pass to Command's Autocomplete Method
        return await SlashCommand.autocomplete(autocompleteInteraction);
    }
}
