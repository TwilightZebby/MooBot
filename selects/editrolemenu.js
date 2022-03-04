// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Select's Name, used as start of its Custom ID
    name: 'editrolemenu',
    // Select's description, purely for documentation
    description: `Handles Select for editing an existing Role Menu`,

    // Select's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 5,



    /**
     * Main function that runs this Select
     * 
     * @param {Discord.SelectMenuInteraction} selectInteraction Select Interaction
     */
    async execute(selectInteraction)
    {
        // Grab value
        let editOption = selectInteraction.values.shift();

        switch(editOption)
        {
            case "edit_embed":
                // Edit the Embed

            case "add_role":
                // Add a new Role

            //case "edit_role_button":
                // Edit the Emoji/Label or Disabled State of an existing Button

            case "remove_role":
                // Remove a Role from a Menu

            default:
                return await selectInteraction.reply({ content: CONSTANTS.errorMessages.GENERIC, ephemeral: true });
        }
    }
};
