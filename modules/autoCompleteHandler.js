// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');

module.exports = {
    /**
     * Main function for the Auto Complete Handler
     * 
     * @param {Discord.AutocompleteInteraction} autoCompleteInteraction 
     * 
     * @returns {Promise<*>}
     */
    async Main(autoCompleteInteraction)
    {
        // Find a Slash Command with the Command Name
        const slashCommand = client.slashCommands.get(autoCompleteInteraction.commandName);

        if ( !slashCommand )
        {
            // Couldn't find Slash Command
            return await autoCompleteInteraction.respond([]);
        }

        // Pass to that Slash Command's Autocomplete method
        return await slashCommand.autocomplete(autoCompleteInteraction);
    }
}
