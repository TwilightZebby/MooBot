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

        // Just for them errors
        let originalModalMessageComponents = modalInteraction.message.components;

        // Valdate
        // Role ID
        if ( !RegExp(/[0-9]{17,19}/g).test(inputRoleID) )
        {
            await modalInteraction.update({ components: originalModalMessageComponents });
            return await modalInteraction.followUp({ content: `That didn't seem like a valid Role ID... Please try again, using a valid Role ID *from this Server* is used.`, ephemeral: true });
        }

        // Role ID is of a Role from this Guild
        let fetchedRole = modalInteraction.guild.roles.fetch(inputRoleID)
        .catch(err => { fetchedRole = null; });
        if ( !fetchedRole )
        {
            await modalInteraction.update({ components: originalModalMessageComponents });
            return await modalInteraction.followUp({ content: `That Role ID didn't seem like it came from a Role in *this* Server. Please try again, using a Role ID for a Role in *this* Server.`, ephemeral: true });
        }

        // Ensure given Role is LOWER than the Bot's own highest role
        let botMember = modalInteraction.guild.me;
        let roleCompare = modalInteraction.guild.roles.comparePositions(inputRoleID, botMember.roles.highest.id);
        if ( roleCompare >= 0 )
        {
            await modalInteraction.update({ components: originalModalMessageComponents });
            return await modalInteraction.followUp({ content: `That Role ID is for a Role higher than this Bot's highest Role! As such, I won't be able to grant or revoke it for other Members.`, ephemeral: true });
        }

        // Validate at least one of either label or emoji is given
        if ( (inputButtonLabel === "" && inputButtonLabel === " " && inputButtonLabel === null && inputButtonLabel === undefined) && (inputButtonEmoji === "" && inputButtonEmoji === " " && inputButtonEmoji === null && inputButtonEmoji === undefined) )
        {
            await modalInteraction.update({ components: originalModalMessageComponents });
            return await modalInteraction.followUp({ content: `Sorry, but I cannot create a Button for that Role without at least either the Label or Emoji being provided! Please try again, ensuring you include at least one of those fields (or both).`, ephemeral: true });
        }

        // Validate Emoji, if included
        if ( inputButtonEmoji !== "" && inputButtonEmoji !== " " && inputButtonEmoji !== null && inputButtonEmoji !== undefined )
        {
            if ( !RegExp(/<a?:(?<name>[a-zA-Z0-9\_]+):(?<id>\d{15,21})>/g).test(inputButtonEmoji) && !emojiRegex.test(inputButtonEmoji) )
            {
                await modalInteraction.update({ components: originalModalMessageComponents });
                return await modalInteraction.followUp({ content: `That didn't seem like a Unicode Emoji, nor a custom Discord Emoji. Please try again, ensuring that, if using a custom Discord Emoji, you use the raw Custom Emoji format \`<:emojiName:emojiId>\` or \`<a:animatedEmojiName:animatedEmojiId>\``, ephemeral: true });
            }
        }

        // Construct Button, and cache object
        /** @type {Array<Object>} */
        let updatedRoleCache = client.roleMenu.get("createMenuRoleCache");
        if ( !updatedRoleCache ) { updatedRoleCache = []; }
        let newRoleCacheObject = { roleID: inputRoleID, label: null, emoji: null };
        let newRoleButton = new Discord.MessageButton().setStyle('PRIMARY').setCustomId(`role_${inputRoleID}`);
        
        if ( inputButtonLabel !== "" && inputButtonLabel !== " " && inputButtonLabel !== null && inputButtonLabel !== undefined )
        {
            newRoleButton.setLabel(inputButtonLabel);
            newRoleCacheObject.label = inputButtonLabel;
        }
        
        if ( inputButtonEmoji !== "" && inputButtonEmoji !== " " && inputButtonEmoji !== null && inputButtonEmoji !== undefined )
        {
            newRoleButton.setEmoji(inputButtonEmoji);
            newRoleCacheObject.emoji = inputButtonEmoji;
        }

        updatedRoleCache.push(newRoleCacheObject);
        client.roleMenu.set("createMenuRoleCache", updatedRoleCache);

        // Fetch existing Buttons, if any
        /** @type {Array<Discord.MessageButton>} */
        let createMenuButtons = client.roleMenu.get("createMenuButtons");
        if ( !createMenuButtons || createMenuButtons?.length < 1 )
        {
            // No existing buttons made yet
            createMenuButtons = [newRoleButton];
        }
        else
        {
            // There are existing buttons already!
            createMenuButtons.push(newRoleButton);
        }

        // Save Buttons to Cache
        client.roleMenu.set("createMenuButtons", createMenuButtons);

        // Construct Arrays for Buttons to go onto the Menu
        /** @type {Array<Discord.MessageActionRow>} */
        let updatedComponentsArray = [];
        let temp;
        for ( let i = 0; i <= createMenuButtons.length - 1; i++ )
        {
            if ( i === 0 )
            {
                // First button on first row
                temp = new Discord.MessageActionRow().addComponents(createMenuButtons[i].setDisabled(true));
                // Push early if only button
                if ( createMenuButtons.length - 1 === i ) { updatedComponentsArray.push(temp); }
            }
            else if ( i > 0 && i < 4 )
            {
                // First row, not the first button
                temp.addComponents(createMenuButtons[i].setDisabled(true));
                // Push early, if these are the only buttons
                if ( createMenuButtons.length - 1 === i ) { updatedComponentsArray.push(temp); }
            }
            else if ( i === 4 )
            {
                // Last button of the first row
                temp.addComponents(createMenuButtons[i].setDisabled(true));
                // Free up TEMP ready for second row
                updatedComponentsArray.push(temp);
                temp = new Discord.MessageActionRow();
            }
            else if ( i > 4 && i < 9 )
            {
                // Second row, buttons 1 through 4
                temp.addComponents(createMenuButtons[i].setDisabled(true));
                // Push early, if these are the only buttons
                if ( createMenuButtons.length - 1 === i ) { updatedComponentsArray.push(temp); }
            }
            else if ( i === 9 )
            {
                // Second row, last button
                temp.addComponents(createMenuButtons[i].setDisabled(true));
                updatedComponentsArray.push(temp);
            }
            else { break; }
        }

        // Now add Select Menu
        updatedComponentsArray.push(CONSTANTS.components.selects.ROLE_MENU_CREATE);


        // Add Role(s) to Embed
        /** @type {Discord.MessageEmbed} */
        let menuEmbed = client.roleMenu.get("createEmbed");
        if ( !menuEmbed ) { menuEmbed = new Discord.MessageEmbed(); }

        let roleEmbedTextFieldOne = "";
        let roleEmbedTextFieldTwo = "";
        for ( let i = 0; i <= updatedRoleCache.length - 1; i++ )
        {
            if ( roleEmbedTextFieldOne.length >= 950 )
            {
                // Switch to Field Two
                roleEmbedTextFieldTwo += `• <@&${updatedRoleCache[i].roleID}> - ${updatedRoleCache[i].label !== null ? updatedRoleCache[i].label : ""}\n`;
            }
            else
            {
                // Stay on Field One
                roleEmbedTextFieldOne += `• <@&${updatedRoleCache[i].roleID}> - ${updatedRoleCache[i].label !== null ? updatedRoleCache[i].label : ""}\n`;
            }
        }

        menuEmbed.spliceFields(0, 25); // Reset, just in case
        menuEmbed.addFields({ name: `\u200B`, value: roleEmbedTextFieldOne });
        if ( roleEmbedTextFieldTwo !== "" && roleEmbedTextFieldTwo !== " " )
        {
            menuEmbed.addFields({ name: `\u200B`, value: roleEmbedTextFieldTwo });
        }

        return await modalInteraction.update({ components: updatedComponentsArray, embeds: [menuEmbed] });
    }
};
