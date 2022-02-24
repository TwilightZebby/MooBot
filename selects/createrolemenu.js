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
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("description").setLabel("Embed Description").setMaxLength(3000).setStyle("PARAGRAPH").setValue(!embedData?.description ? "" : embedData.description) ),
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("hexcolour").setLabel("Embed Colour (In Hex Format)").setMaxLength(7).setMinLength(7).setStyle("SHORT").setValue(!embedData?.hexColor ? "" : embedData.hexColor).setPlaceholder("Example: #5865F2") )
                ]);
                await selectInteraction.showModal(embedModal);
                break;

            case "add_role":
                // Validate Menu doesn't already have the max of 10 Buttons
                /** @type {Array<Discord.MessageButton>} */
                let fetchedButtons = client.roleMenu.get("createMenuButtons");
                if ( fetchedButtons?.length === 10 ) { return await selectInteraction.reply({ content: `Sorry, but you cannot add more than 10 (ten) Role Buttons to a single Menu!`, ephemeral: true }); }

                // Construct & Display Modal
                let newRoleModal = new Discord.Modal().setCustomId("createaddrole").setTitle("Add Assignable Role").addComponents([
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("roleid").setLabel("Role ID").setMaxLength(19).setMinLength(17).setStyle("SHORT").setRequired(true).setPlaceholder("Example: 5981450330692649077") ),
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("buttonlabel").setLabel("Role's Button Label (Required if no emoji)").setMaxLength(80).setStyle("SHORT") ),
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("buttonemoji").setLabel("Role's Button Emoji (Required if no label)").setStyle("SHORT").setPlaceholder("Example: <:grass_block:601353406577246208>") )
                ]);
                await selectInteraction.showModal(newRoleModal);
                break;

            default:
                return await selectInteraction.reply({ content: CONSTANTS.errorMessages.GENERIC, ephemeral: true });
        }

        return;
    }
};
