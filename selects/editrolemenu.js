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
                /** @type {Discord.MessageEmbed} */
                let previewEmbed = client.roleMenu.get("editEmbed");

                let embedModal = new Discord.Modal().setCustomId("editembeddata").setTitle("Edit Menu Embed").addComponents([
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("title").setLabel("Embed Title").setMaxLength(256).setStyle("SHORT").setRequired(true).setValue(!previewEmbed?.title ? "" : previewEmbed.title) ),
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("description").setLabel("Embed Description").setMaxLength(3000).setStyle("PARAGRAPH").setValue(!previewEmbed?.description ? "" : previewEmbed.description) ),
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("hexcolour").setLabel("Embed Colour (In Hex Format)").setMaxLength(7).setMinLength(7).setStyle("SHORT").setValue(!previewEmbed?.hexColor ? "" : previewEmbed.hexColor).setPlaceholder("Example: #5865F2") )
                ]);
                await selectInteraction.showModal(embedModal);
                break;

            case "add_role":
                // Add a new Role

            //case "edit_role_button":
                // Edit the Emoji/Label or Disabled State of an existing Button

            case "remove_role":
                // Remove a Role from a Menu

            default:
                return await selectInteraction.reply({ content: CONSTANTS.errorMessages.GENERIC, ephemeral: true });
        }

        return;
    }
};
