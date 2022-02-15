// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Select's Name, used as start of its Custom ID
    name: 'createrolemenu',
    // Select's description, purely for documentation
    description: `Handles presenting Modals for creating a Role Menu`,

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
        // Grab Value
        let createOption = selectInteraction.values.shift();
        
        switch(createOption)
        {
            case "configure_embed":
                let embedModal = new Discord.Modal().setCustomId("createembeddata").setTitle("Configure Menu Embed").addComponents([
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("title").setLabel("Embed Title").setMaxLength(256).setStyle("SHORT") ),
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("description").setLabel("Embed Description").setMaxLength(4000).setStyle("PARAGRAPH") ),
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("hexcolour").setLabel("Embed Colour (In Hex Format, eg: #5865F2)").setMaxLength(7).setMinLength(7).setStyle("SHORT") )
                ]);
                await selectInteraction.showModal(embedModal);
                break;

            default:
                return await selectInteraction.reply({ content: CONSTANTS.errorMessages.GENERIC, ephemeral: true });
        }
    }
};
