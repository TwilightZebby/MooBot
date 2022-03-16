// Imports
const Discord = require('discord.js');
const emojiRegex = require('emoji-regex')();
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Modal's Name, used as start of its Custom ID
    name: 'editrolebutton',
    // Modal's description, purely for documentation
    description: `Handles edits to existing Role Buttons`,



    /**
     * Main function that runs this modal
     * 
     * @param {Discord.ModalMessageModalSubmitInteraction} modalInteraction Modal Interaction
     */
    async execute(modalInteraction)
    {
        // Grab inputs
        let roleID = modalInteraction.customId.split("_").pop();
        let inputButtonLabel = modalInteraction.fields.getTextInputValue("buttonlabel");
        let inputButtonEmoji = modalInteraction.fields.getTextInputValue("buttonemoji");

        // Just for errors
        let originalModalMessageComponents = modalInteraction.message.components;

        // Validate that at least one of either Label or Emoji still exist
        if ( (inputButtonLabel === "" && inputButtonLabel === " " && inputButtonLabel === null && inputButtonLabel === undefined) && (inputButtonEmoji === "" && inputButtonEmoji === " " && inputButtonEmoji === null && inputButtonEmoji === undefined) )
        {
            await modalInteraction.update({ components: originalModalMessageComponents });
            return await modalInteraction.followUp({ content: `Sorry, but I cannot edit the Button for that Role without at least one of either the Label or Emoji being provided! Please try again, ensuring you include at least one of those fields (or both).`, ephemeral: true });
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

        // Update caches
        let roleCache = client.roleMenu.get("editRoles");
        /** @type {Array<Discord.MessageButton>} */
        let buttonCache = client.roleMenu.get("editButtons");

        // ROLE CACHE
        for ( let i = 0; i <= roleCache.length - 1; i++ )
        {
            if ( roleCache[i].roleID === roleID )
            {
                if ( inputButtonLabel !== "" && inputButtonLabel !== " " && inputButtonLabel !== null && inputButtonLabel !== undefined )
                {
                    roleCache[i].label = inputButtonLabel;
                }
                else
                {
                    roleCache[i].label = null;
                }

                if ( inputButtonEmoji !== "" && inputButtonEmoji !== " " && inputButtonEmoji !== null && inputButtonEmoji !== undefined )
                {
                    roleCache[i].emoji = inputButtonEmoji;
                }
                else
                {
                    roleCache[i].emoji = null;
                }

                break;
            }
        }

        // BUTTON CACHE
        for ( let i = 0; i <= buttonCache.length - 1; i++ )
        {
            if ( buttonCache[i].customId === `roleedit_${roleID}` )
            {
                if ( inputButtonLabel !== "" && inputButtonLabel !== " " && inputButtonLabel !== null && inputButtonLabel !== undefined )
                {
                    buttonCache[i].setLabel(inputButtonLabel);
                }
                else
                {
                    buttonCache[i].setLabel("");
                }

                if ( inputButtonEmoji !== "" && inputButtonEmoji !== " " && inputButtonEmoji !== null && inputButtonEmoji !== undefined )
                {
                    buttonCache[i].setEmoji(inputButtonEmoji);
                }
                else
                {
                    buttonCache[i].setEmoji("");
                }

                break;
            }
        }


        // Save back to caches
        client.roleMenu.set("editRoles", roleCache);
        client.roleMenu.set("editButtons", buttonCache);

        
        // Reconstruct Component Rows
        /** @type {Array<Discord.MessageActionRow>} */
        let updatedComponentsArray = [];
        // Update Buttons on message
        let temp;
        for ( let i = 0; i <= buttonCache.length - 1; i++ )
        {
            if ( i === 0 )
            {
                // First button on first row
                temp = new Discord.MessageActionRow().addComponents(buttonCache[i]);
                // Push early if only button
                if ( buttonCache.length - 1 === i ) { updatedComponentsArray.push(temp); }
            }
            else if ( i > 0 && i < 4 )
            {
                // First row, not the first button
                temp.addComponents(buttonCache[i]);
                // Push early, if these are the only buttons
                if ( buttonCache.length - 1 === i ) { updatedComponentsArray.push(temp); }
            }
            else if ( i === 4 )
            {
                // Last button of the first row
                temp.addComponents(buttonCache[i]);
                // Free up TEMP ready for second row
                updatedComponentsArray.push(temp);
                temp = new Discord.MessageActionRow();
            }
            else if ( i > 4 && i < 9 )
            {
                // Second row, buttons 1 through 4
                temp.addComponents(buttonCache[i]);
                // Push early, if these are the only buttons
                if ( buttonCache.length - 1 === i ) { updatedComponentsArray.push(temp); }
            }
            else if ( i === 9 )
            {
                // Second row, last button
                temp.addComponents(buttonCache[i]);
                updatedComponentsArray.push(temp);
            }
            else { break; }
        }

        // Insert Select Menu
        updatedComponentsArray.push(CONSTANTS.components.selects.ROLE_MENU_EDIT_SAVE);

        // Now to update the Embed
        /** @type {Discord.MessageEmbed} */
        let cachedEmbed = client.roleMenu.get("editEmbed");
        cachedEmbed.spliceFields(0, 25); // Reset, just in case

        if ( buttonCache.length >= 1 )
        {
            // There are still Roles on the Menu, so all we need to do is clear out the removed one
            let roleEmbedTextFieldOne = "";
            let roleEmbedTextFieldTwo = "";
            for ( let i = 0; i <= roleCache.length - 1; i++ )
            {
                if ( roleEmbedTextFieldOne.length >= 950 )
                {
                    // Switch to Field Two
                    roleEmbedTextFieldTwo += `• <@&${roleCache[i].roleID}> - ${roleCache[i].emoji !== null ? roleCache[i].emoji : ""} ${roleCache[i].label !== null ? roleCache[i].label : ""}\n`;
                }
                else
                {
                    // Stay on Field One
                    roleEmbedTextFieldOne += `• <@&${roleCache[i].roleID}> - ${roleCache[i].emoji !== null ? roleCache[i].emoji : ""} ${roleCache[i].label !== null ? roleCache[i].label : ""}\n`;
                }
            }

            cachedEmbed.addFields({ name: `\u200B`, value: roleEmbedTextFieldOne });
            if ( roleEmbedTextFieldTwo !== "" && roleEmbedTextFieldTwo !== " " )
            {
                cachedEmbed.addFields({ name: `\u200B`, value: roleEmbedTextFieldTwo });
            }
        }

        // Update to Message
        return await modalInteraction.update({ embeds: [cachedEmbed], components: updatedComponentsArray });
    }
};
