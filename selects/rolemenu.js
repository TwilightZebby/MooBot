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
                let createMenuConfig = new Discord.MessageActionRow().addComponents(
                    new Discord.MessageSelectMenu().setCustomId(`createrolemenu`).setMaxValues(1).setMinValues(1).setPlaceholder("Please select an action").setOptions([
                        { label: "Configure Embed", value: "configure_embed", description: "Set the Title, Description, and Colour of the Embed", emoji: "<:IconSettings:778931333459738626>" },
                        { label: "Add Role", value: "add_role", description: "Add a Role to the Menu", emoji: "<:plusGrey:941654979222077490>" },
                        { label: "Remove Role", value: "remove_role", description: "Remove a Role from the Menu", emoji: "<:binGrey:941654671716655154>" },
                        { label: "Save and Display", value: "save", description: "Saves the new Menu, and displays it for members to use", emoji: "<:IconActivity:815246970457161738>" }
                    ])
                );
                // ACK to User
                await selectInteraction.update({ content: `__**Self-Assignable Role Menu Creation**__\nUse the Select Menu to configure the Embed and Role Buttons.\nPlease make sure to have the relevant Role IDs - and Emoji IDs if including in Buttons - ready (such as in a notepad program) as you won't be able to copy from a Discord message while an Input Form is open.\n\nAn auto-updating preview of what your new Self-Assignable Role Menu will look like is shown below.`,
                    components: [createMenuConfig], embeds: [createMenuEmbed] });
                break;

            default:
                return await selectInteraction.update({ content: CONSTANTS.errorMessages.GENERIC, embeds: [], components: [] });
        }
    }
};
