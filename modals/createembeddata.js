// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const UTILITY = require('../modules/utilityModule.js');

module.exports = {
    // Modal's Name, used as start of its Custom ID
    name: 'createembeddata',
    // Modal's description, purely for documentation
    description: `Handles input for Role Menu Embed Data`,



    /**
     * Main function that runs this modal
     * 
     * @param {Discord.ModalSubmitInteraction} modalInteraction Modal Interaction
     */
    async execute(modalInteraction)
    {
        // Grab inputs
        let inputEmbedTitle = modalInteraction.getTextInputValue("title");
        let inputEmbedDescription = modalInteraction.getTextInputValue("description");
        let inputEmbedColour = modalInteraction.getTextInputValue("hexcolour");

        /** @type {Discord.MessageEmbed} */
        let menuEmbed = client.roleMenu.get("createEmbed");

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
                let data = {
                    "type": 7,
                    "data": { "components": [CONSTANTS.components.selects.ROLE_MENU_CREATE] }
                };

                client.api.interactions(`${modalInteraction.id}`)[`${modalInteraction.token}`].callback.post({data});
                return await modalInteraction.followUp({ content: `That wasn't a valid Hex Colour Code! Please try again, using a valid Hex Colour Code (including the \`#\` (hash) at the start!)`, ephemeral: true });
            }
            else { menuEmbed.setColor(inputEmbedColour); }
        }
        else { delete menuEmbed.color; }

        // Update Stored Embed
        client.roleMenu.set("createEmbed", menuEmbed);

        let data = {
            "type": 7,
            "data": { "embeds": [menuEmbed] }
        };

        // ACK
        return client.api.interactions(`${modalInteraction.id}`)[`${modalInteraction.token}`].callback.post({data});
    }
};
