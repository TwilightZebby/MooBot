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
     * @param {Discord.ModalMessageModalSubmitInteraction} modalInteraction Modal Interaction
     */
    async execute(modalInteraction)
    {
        // Grab inputs
        let inputRoleID = modalInteraction.fields.getTextInputValue("roleid");
        let inputButtonLabel = modalInteraction.fields.getTextInputValue("buttonlabel");
        let inputButtonEmoji = modalInteraction.fields.getTextInputValue("buttonemoji");

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
            await modalInteraction.update({ components: [CONSTANTS.components.selects.ROLE_MENU_CREATE] });
            return await modalInteraction.followUp({ content: `That Role ID didn't seem like it came from a Role in *this* Server. Please try again, using a Role ID for a Role in *this* Server.`, ephemeral: true });
        }

        // Emoji
        if ( !RegExp(/<a?:(?<name>[a-zA-Z0-9\_]+):(?<id>\d{15,21})>/g).test(inputButtonEmoji) && !emojiRegex.test(inputButtonEmoji) )
        {
            await modalInteraction.update({ components: [CONSTANTS.components.selects.ROLE_MENU_CREATE] });
            return await modalInteraction.followUp({ content: `That didn't seem like a Unicode Emoji, nor a custom Discord Emoji. Please try again, ensuring that, if using a custom Discord Emoji, you use the raw Custom Emoji format \`<:emojiName:emojiId>\` or \`<a:animatedEmojiName:animatedEmojiId>\``, ephemeral: true });
        }

        // Validate at least one of either label or emoji is given
        if ( (inputButtonLabel === "" && inputButtonLabel === " " && inputButtonLabel === null && inputButtonLabel === undefined) && (inputButtonEmoji === "" && inputButtonEmoji === " " && inputButtonEmoji === null && inputButtonEmoji === undefined) )
        {
            await modalInteraction.update({ components: [CONSTANTS.components.selects.ROLE_MENU_CREATE] });
            return await modalInteraction.followUp({ content: `Sorry, but I cannot create a Button for that Role without at least either the Label or Emoji being provided! Please try again, ensuring you include at least one of those fields (or both).`, ephemeral: true });
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
