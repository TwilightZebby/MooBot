// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const UTILITY = require('../modules/utilityModule.js');

module.exports = {
    // Modal's Name, used as start of its Custom ID
    name: 'editembeddata',
    // Modal's description, purely for documentation
    description: `Handles input for editing an existing Role Menu Embed Data`,



    /**
     * Main function that runs this modal
     * 
     * @param {Discord.ModalMessageModalSubmitInteraction} modalInteraction Modal Interaction
     */
    async execute(modalInteraction)
    {
        // Grab inputs
        let inputEmbedTitle = modalInteraction.fields.getTextInputValue("title");
        let inputEmbedDescription = modalInteraction.fields.getTextInputValue("description");
        let inputEmbedColour = modalInteraction.fields.getTextInputValue("hexcolour");

        // Just for them errors
        let originalModalMessageComponents = modalInteraction.message.components;

        /** @type {Discord.MessageEmbed} */
        let menuEmbed = client.roleMenu.get(`editEmbed_${modalInteraction.guildId}`);

        if ( !menuEmbed ) { menuEmbed = new Discord.MessageEmbed(); }

        // Set Embed data, if given, while also doing validation checks
        if ( inputEmbedTitle !== "" && inputEmbedTitle !== " " && inputEmbedTitle !== null && inputEmbedTitle !== undefined ) { menuEmbed.setTitle(inputEmbedTitle); }
        else { delete menuEmbed.title; }

        if ( inputEmbedDescription !== "" && inputEmbedDescription !== " " && inputEmbedDescription !== null && inputEmbedDescription !== undefined ) { menuEmbed.setDescription(inputEmbedDescription); }
        else { delete menuEmbed.description; }

        if ( inputEmbedColour !== "" && inputEmbedColour !== " " && inputEmbedColour !== null && inputEmbedColour !== undefined )
        {
            // Validate
            if ( !UTILITY.hexColourRegex.test(inputEmbedColour) )
            {
                await modalInteraction.update({ components: originalModalMessageComponents });
                return await modalInteraction.followUp({ content: `That wasn't a valid Hex Colour Code! Please try again, using a valid Hex Colour Code (including the \`#\` (hash) at the start!)`, ephemeral: true });
            }
            else { menuEmbed.setColor(inputEmbedColour); }
        }
        else { delete menuEmbed.color; }

        // Update Stored Embed
        client.roleMenu.set(`editEmbed_${modalInteraction.guildId}`, menuEmbed);

        // Update Select menu since Embed has been edited
        originalModalMessageComponents.pop();
        originalModalMessageComponents.push(CONSTANTS.components.selects.ROLE_MENU_EDIT_SAVE);

        // UPDATE
        return await modalInteraction.update({ embeds: [menuEmbed], components: originalModalMessageComponents });
    }
};
