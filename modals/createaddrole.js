// Imports
const Discord = require('discord.js');
const emojiRegex = require('emoji-regex')();
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

        // Valdate
        // Role ID
        if ( !RegExp(/[0-9]{17,19}/g).test(inputRoleID) )
        {
            return await modalInteraction.reply({ content: `That didn't seem like a valid Role ID... Please try again, using a valid Role ID *from this Server* is used.`, ephemeral: true });
        }

        // Role ID is of a Role from this Guild
        let fetchedRole = modalInteraction.guild.roles.fetch(inputRoleID)
        .catch(err => { fetchedRole = null; });
        if ( !fetchedRole )
        {
            return await modalInteraction.reply({ content: `That Role ID didn't seem like it came from a Role in *this* Server. Please try again, using a Role ID for a Role in *this* Server.`, ephemeral: true });
        }

        // Emoji
        if ( !RegExp(/<a?:(?<name>[a-zA-Z0-9\_]+):(?<id>\d{15,21})>/g).test(inputButtonEmoji) && !emojiRegex.test(inputButtonEmoji) )
        {
            return await modalInteraction.reply({ content: `That didn't seem like a Unicode Emoji, nor a custom Discord Emoji. Please try again, ensuring that, if using a custom Discord Emoji, you use the raw Custom Emoji format \`<:emojiName:emojiId>\` or \`<a:animatedEmojiName:animatedEmojiId>\``, ephemeral: true });
        }

        // Validate at least one of either label or emoji is given
        if ( (inputButtonLabel === "" && inputButtonLabel === " " && inputButtonLabel === null && inputButtonLabel === undefined) && (inputButtonEmoji === "" && inputButtonEmoji === " " && inputButtonEmoji === null && inputButtonEmoji === undefined) )
        {
            return await modalInteraction.reply({ content: `Sorry, but I cannot create a Button for that Role without at least either the Label or Emoji being provided! Please try again, ensuring you ` })
        }

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
