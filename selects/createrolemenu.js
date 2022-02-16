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
                /** @type {Discord.MessageEmbed} */
                let embedData = client.roleMenu.get("createEmbed");

                let embedModal = new Discord.Modal().setCustomId("createembeddata").setTitle("Configure Menu Embed").addComponents([
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("title").setLabel("Embed Title").setMaxLength(256).setStyle("SHORT").setRequired(true).setValue(!embedData?.title ? "" : embedData.title) ),
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("description").setLabel("Embed Description").setMaxLength(4000).setStyle("PARAGRAPH").setValue(!embedData?.description ? "" : embedData.description) ),
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("hexcolour").setLabel("Embed Colour (In Hex Format, eg: #5865F2)").setMaxLength(7).setMinLength(7).setStyle("SHORT").setValue(!embedData?.hexColor ? "" : embedData.hexColor).setPlaceholder("#5865F2") )
                ]);
                await selectInteraction.showModal(embedModal);
                break;

            case "add_role":
                let newRoleModal = new Discord.Modal().setCustomId("createaddrole").setTitle("Add Assignable Role").addComponents([
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("roleid").setLabel("Role ID").setMaxLength(20).setMinLength(17).setStyle("SHORT").setRequired(true).setPlaceholder("598145033069264907") ),
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("buttonlabel").setLabel("Role's Button Label (Required if no emoji)").setMaxLength(80).setStyle("SHORT") ),
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("buttonemoji").setLabel("Role's Button Emoji (Required if no label)").setStyle("SHORT").setPlaceholder("<:grass_block:601353406577246208>") )
                ]);
                await selectInteraction.showModal(newRoleModal);
                break;

            default:
                return await selectInteraction.reply({ content: CONSTANTS.errorMessages.GENERIC, ephemeral: true });
        }

        return;
    }
};
