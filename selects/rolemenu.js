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
                let createMenuEmbed = new Discord.MessageEmbed().setDescription("*Role Menu is currently empty. Please use the Select Menu below to configure this Role Menu*");
                let createMenuConfig = new Discord.MessageActionRow().addComponents(
                    new Discord.MessageSelectMenu().setCustomId(`createrolemenu`).setMaxValues(1).setMinValues(1).setPlaceholder("Please select an action").setOptions([
                        { label: "Configure Embed", value: "configure_embed", description: "Set the Title, Description, and Colour of the Embed" },
                        { label: "Add Role", value: "add_role", description: "Add a Role to the Menu" },
                        { label: "Remove Role", value: "remove_role", description: "Remove a Role from the Menu" }
                    ])
                );
                await selectInteraction.update({ content: `__**Self-Assignable Role Menu Creation**__\n\nAn auto-updating preview of what your new Self-Assignable Role Menu will look like is shown below.\nUse the Select Menu to configure the Embed and Role Buttons`,
                    components: [createMenuConfig], embeds: [createMenuEmbed] });
                break;

            default:
                return await selectInteraction.update({ content: CONSTANTS.errorMessages.GENERIC, embeds: [], components: [] });
        }
    }
};
