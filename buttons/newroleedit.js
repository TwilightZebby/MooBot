// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Button's Name, used as start of its Custom ID
    name: 'newroleedit',
    // Button's description, purely for documentation
    description: `Used to edit a Role Button on during Menu creation`,

    // Button's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 5,



    /**
     * Main function that runs this Button
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction Button Interaction
     */
    async execute(buttonInteraction)
    {
        let roleCache = client.roleMenu.get(`createMenuRoleCache_${buttonInteraction.guildId}`);

        // Fetch current details
        let roleID = buttonInteraction.customId.split("_").pop();
        let currentLabel = null;
        let currentEmoji = null;
        for ( let i = 0; i <= roleCache.length - 1; i++ )
        {
            if ( roleCache[i].roleID === roleID )
            {
                currentLabel = roleCache[i].label;
                currentEmoji = roleCache[i].emoji;
                break;
            }
        }

        // Construct & Display Modal
        let editRoleModal = new Discord.Modal().setCustomId(`createeditrolebutton_${roleID}`).setTitle("Edit Role Button").addComponents([
            new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("buttonlabel").setLabel("Role's Button Label (Required if no emoji)").setMaxLength(80).setStyle("SHORT").setValue(currentLabel !== null ? currentLabel : "") ),
            new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("buttonemoji").setLabel("Role's Button Emoji (Required if no label)").setStyle("SHORT").setPlaceholder("Example: <:grass_block:601353406577246208> or ✨").setValue(currentEmoji !== null ? currentEmoji : "") )
            //new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("buttondisabled").setLabel("Should Button be disabled? (Y/N)").setMaxLength("1").setStyle("SHORT") )
        ]);
        await buttonInteraction.showModal(editRoleModal);

        return;
    }
};
