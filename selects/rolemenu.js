// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Select's Name, used as start of its Custom ID
    name: 'rolemenu',
    // Select's description, purely for documentation
    description: `Handles the main menu for managing Role Menus`,

    // Select's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 30,



    /**
     * Main function that runs this Select
     * 
     * @param {Discord.SelectMenuInteraction} selectInteraction Select Interaction
     */
    async execute(selectInteraction)
    {
        // Ping to relevant method
        let selectAction = selectInteraction.values.shift();

        switch(selectAction)
        {
            case "create_menu":
                // Construct stuff
                let createMenuEmbed = new Discord.MessageEmbed().setDescription("*Role Menu is currently empty. Please use the Select Menu below to configure this Role Menu*");
                
                // ACK to User
                await selectInteraction.update({ content: `__**Self-Assignable Role Menu Creation**__\nUse the Select Menu to configure the Embed and Role Buttons.\nPlease make sure to have the relevant Role IDs - and Emoji IDs if including in Buttons - ready (such as in a notepad program) as you won't be able to copy from a Discord message while an Input Form is open.\nFurthermore, if you do wish to include an Emoji, then any Custom Emoji is possible to be used, even if the Bot isn't in that Emoji's Server!\n\nAn auto-updating preview of what your new Self-Assignable Role Menu will look like is shown below.`,
                    components: [CONSTANTS.components.selects.ROLE_MENU_CREATE_NO_EMBED], embeds: [createMenuEmbed] });
                break;

            default:
                return await selectInteraction.update({ content: CONSTANTS.errorMessages.GENERIC, embeds: [], components: [] });
        }
    }
};
