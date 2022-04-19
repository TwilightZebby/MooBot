// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');

module.exports = {
    /**
     * Main function for Autocomplete Handler
     * 
     * @param {Discord.AutocompleteInteraction} autocompleteInteraction
     * 
     * @returns {Promise<*>}
     */
    async Main(autocompleteInteraction)
    {
        // Find Slash Command with matching Command name
        const slashCommand = client.slashCommands.get(autocompleteInteraction.commandName);

        if ( !slashCommand ) { return await autocompleteInteraction.respond([]); }

        // Pass to Command's Autocomplete method
        return await slashCommand.autocomplete(autocompleteInteraction);
    }
}
