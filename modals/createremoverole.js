// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Modal's Name, used as start of its Custom ID
    name: 'createremoverole',
    // Modal's description, purely for documentation
    description: `Used to fetch the ID of the Role to be removed from the Menu`,



    /**
     * Main function that runs this modal
     * 
     * @param {Discord.ModalSubmitInteraction} modalInteraction Modal Interaction
     */
    async execute(modalInteraction)
    {
        let inputRoleID = modalInteraction.fields.getTextInputValue("roleid");

        // Just for them errors
        let originalModalMessageComponents = modalInteraction.message.components;

        // Validate Role does indeed exist on the Menu
        /** @type {Array<Object>} */
        let roleCache = client.roleMenu.get("createMenuRoleCache");
        if ( !roleCache )
        {
            await modalInteraction.update({ components: originalModalMessageComponents });
            return await modalInteraction.followUp({ content: CONSTANTS.errorMessages.GENERIC, ephemeral: true });
        }

        let doesRoleExist = false;
        for ( let i = 0; i <= roleCache.length - 1; i++ )
        {
            if ( roleCache[i].roleID === inputRoleID )
            {
                doesRoleExist = true; // Mark existence
                roleCache.splice(i, 1); // Removes from cache
                break;
            }
        }

        if ( !doesRoleExist )
        {
            await modalInteraction.update({ components: originalModalMessageComponents });
            return await modalInteraction.followUp({ content: `That Role ID doesn't seem to match an existing Role on the Menu.\nPlease try again, ensuring the Role ID is for a Role already on this Menu`, ephemeral: true });
        }

        // Remove from Button cache as well
        /** @type {Array<Discord.MessageButton>} */
        let buttonCache = client.roleMenu.get("createMenuButtons");

        for ( let j = 0; j <= buttonCache.length - 1; j++ )
        {
            if ( buttonCache[j].customId === `role_${inputRoleID}` )
            {
                buttonCache.splice(j, 1); // Remove from cache
                break;
            }
        }

        // Save back to Collections
        client.roleMenu.set("createMenuRoleCache", roleCache);
        client.roleMenu.set("createMenuButtons", buttonCache);

        /** @type {Array<Discord.MessageActionRow>} */
        let updatedComponentsArray = [];

        if ( buttonCache.length >= 1 )
        {
            // Update Buttons on message
            let temp;
            for ( let i = 0; i <= buttonCache.length - 1; i++ )
            {
                if ( i === 0 )
                {
                    // First button on first row
                    temp = new Discord.MessageActionRow().addComponents(buttonCache[i].setDisabled(true));
                    // Push early if only button
                    if ( buttonCache.length - 1 === i ) { updatedComponentsArray.push(temp); }
                }
                else if ( i > 0 && i < 4 )
                {
                    // First row, not the first button
                    temp.addComponents(buttonCache[i].setDisabled(true));
                    // Push early, if these are the only buttons
                    if ( buttonCache.length - 1 === i ) { updatedComponentsArray.push(temp); }
                }
                else if ( i === 4 )
                {
                    // Last button of the first row
                    temp.addComponents(buttonCache[i].setDisabled(true));
                    // Free up TEMP ready for second row
                    updatedComponentsArray.push(temp);
                    temp = new Discord.MessageActionRow();
                }
                else if ( i > 4 && i < 9 )
                {
                    // Second row, buttons 1 through 4
                    temp.addComponents(buttonCache[i].setDisabled(true));
                    // Push early, if these are the only buttons
                    if ( buttonCache.length - 1 === i ) { updatedComponentsArray.push(temp); }
                }
                else if ( i === 9 )
                {
                    // Second row, last button
                    temp.addComponents(buttonCache[i].setDisabled(true));
                    updatedComponentsArray.push(temp);
                }
                else { break; }
            }

            // There's still at least one Button left, thus use fuller Select menu
            updatedComponentsArray.push(CONSTANTS.components.selects.ROLE_MENU_CREATE);
        }
        else
        {
            // There are no more buttons left, use minised Select Menu instead
            updatedComponentsArray.push(CONSTANTS.components.selects.ROLE_MENU_CREATE_NO_ROLES);
        }

        // Now to update the Embed
        /** @type {Discord.MessageEmbed} */
        let cachedEmbed = client.roleMenu.get("createEmbed");
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
