// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

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

        // Set Embed data, if given
        if ( inputEmbedTitle !== "" && inputEmbedTitle !== " " && inputEmbedTitle !== null && inputEmbedTitle !== undefined ) { menuEmbed.setTitle(inputEmbedTitle) }
        else { delete menuEmbed.title; }

        if ( inputEmbedDescription !== "" && inputEmbedDescription !== " " && inputEmbedDescription !== null && inputEmbedDescription !== undefined ) { menuEmbed.setDescription(inputEmbedDescription) }
        else { delete menuEmbed.description; }

        if ( inputEmbedColour !== "" && inputEmbedColour !== " " && inputEmbedColour !== null && inputEmbedColour !== undefined ) { menuEmbed.setColor(inputEmbedColour) }
        else { delete menuEmbed.color; }

        let data = {
            "embeds": [menuEmbed]
        };

        // ACK
        let fetchedOriginal = client.roleMenu.get("originalResponse");
        client.api.webhooks(client.user.id)[fetchedOriginal.interactionToken].messages("@original").patch({data});
        return await modalInteraction.reply({ content: `Set the Embed Data for you! (See above)`, ephemeral: true });
    }
};
