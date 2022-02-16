// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Modal's Name, used as start of its Custom ID
    name: 'createaddrole',
    // Modal's description, purely for documentation
    description: `Handles input for adding Roles during Menu Creation`,



    /**
     * Main function that runs this modal
     * 
     * @param {Discord.ModalSubmitInteraction} modalInteraction Modal Interaction
     */
    async execute(modalInteraction)
    {
        // Grab inputs
        let inputRoleID = modalInteraction.getTextInputValue("roleid");
        let inputButtonLabel = modalInteraction.getTextInputValue("buttonlabel");
        let inputButtonEmoji = modalInteraction.getTextInputValue("buttonemoji");

        return await modalInteraction.reply({ content: `Role ID: "${inputRoleID}", Button Label: "${inputButtonLabel}", Button Emoji: "${inputButtonEmoji}"`, ephemeral: true });

        /* let data = {
            "type": 7,
            "data": {
                "embeds": [menuEmbed]
            }
        }; */

        // ACK
        //return client.api.interactions(`${modalInteraction.id}`)[`${modalInteraction.token}`].callback.post({data});
    }
};
