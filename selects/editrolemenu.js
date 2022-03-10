// Imports
const Discord = require('discord.js');
const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Select's Name, used as start of its Custom ID
    name: 'editrolemenu',
    // Select's description, purely for documentation
    description: `Handles Select for editing an existing Role Menu`,

    // Select's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 5,



    /**
     * Main function that runs this Select
     * 
     * @param {Discord.SelectMenuInteraction} selectInteraction Select Interaction
     */
    async execute(selectInteraction)
    {
        // Grab value
        let editOption = selectInteraction.values.shift();

        switch(editOption)
        {
            case "edit_embed":
                // Edit the Embed
                /** @type {Discord.MessageEmbed} */
                let previewEmbed = client.roleMenu.get("editEmbed");

                let embedModal = new Discord.Modal().setCustomId("editembeddata").setTitle("Edit Menu Embed").addComponents([
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("title").setLabel("Embed Title").setMaxLength(256).setStyle("SHORT").setRequired(true).setValue(!previewEmbed?.title ? "" : previewEmbed.title) ),
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("description").setLabel("Embed Description").setMaxLength(3000).setStyle("PARAGRAPH").setValue(!previewEmbed?.description ? "" : previewEmbed.description) ),
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("hexcolour").setLabel("Embed Colour (In Hex Format)").setMaxLength(7).setMinLength(7).setStyle("SHORT").setValue(!previewEmbed?.hexColor ? "" : previewEmbed.hexColor).setPlaceholder("Example: #5865F2") )
                ]);
                await selectInteraction.showModal(embedModal);
                break;

            case "add_role":
                // Add a new Role
                // Validate Menu doesn't already have the max of 10 Buttons
                /** @type {Array<Discord.MessageButton>} */
                let fetchedButtons = client.roleMenu.get("editButtons");
                if ( fetchedButtons?.length === 10 ) { return await selectInteraction.reply({ content: `Sorry, but you cannot add more than 10 (ten) Role Buttons to a single Menu!`, ephemeral: true }); }

                // Construct & Display Modal
                let newRoleModal = new Discord.Modal().setCustomId("editaddrole").setTitle("Add Assignable Role").addComponents([
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("roleid").setLabel("Role ID").setMaxLength(19).setMinLength(17).setStyle("SHORT").setRequired(true).setPlaceholder("Example: 5981450330692649077") ),
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("buttonlabel").setLabel("Role's Button Label (Required if no emoji)").setMaxLength(80).setStyle("SHORT") ),
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("buttonemoji").setLabel("Role's Button Emoji (Required if no label)").setStyle("SHORT").setPlaceholder("Example: <:grass_block:601353406577246208> or ✨") )
                ]);
                await selectInteraction.showModal(newRoleModal);
                break;

            case "remove_role":
                // Remove a Role from a Menu
                let removeRoleModal = new Discord.Modal().setCustomId("editremoverole").setTitle("Remove Assignable Role").addComponents([
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("roleid").setLabel("Role ID").setMaxLength(19).setMinLength(17).setStyle("SHORT").setRequired(true).setPlaceholder("Example: 5981450330692649077") )
                ]);
                await selectInteraction.showModal(removeRoleModal);
                break;

            case "save":
                // Save and update Menu
                await this.saveAndUpdate(selectInteraction);
                break;

            default:
                return await selectInteraction.reply({ content: CONSTANTS.errorMessages.GENERIC, ephemeral: true });
        }

        return;
    },







    /**
     * Saves and Updates the changes for an existing Menu
     * 
     * @param {Discord.SelectMenuInteraction} selectInteraction Select Interaction
     */
    async saveAndUpdate(selectInteraction)
    {
        // Defer, just in case
        await selectInteraction.deferUpdate();

        // Bring in JSON
        let RoleMenuJson = require('../hiddenJsonFiles/roleMenus.json');

        // Fetch all data
        /** @type {Discord.MessageEmbed} */
        let updatedEmbed = client.roleMenu.get("editEmbed");
        /** @type {Array<Discord.MessageButton} */
        let updatedButtons = client.roleMenu.get("editButtons");
        /** @type {Array<Object>} */
        let updatedRoles = client.roleMenu.get("editRoles");


        
        // Prepare Buttons
        /** @type {Array<Discord.MessageActionRow>} */
        let menuComponentsArray = [];
        let temp;
        for ( let i = 0; i <= updatedButtons.length - 1; i++ )
        {
            // Update Button's Custom ID from "roleedit_*" to "role_*"
            let tempRoleID = updatedButtons[i].customId.split("_").pop();

            if ( i === 0 )
            {
                // First button on first row
                temp = new Discord.MessageActionRow().addComponents(updatedButtons[i].setCustomId(`role_${tempRoleID}`).setDisabled(false));
                // Push early if only button
                if ( updatedButtons.length - 1 === i ) { menuComponentsArray.push(temp); }
            }
            else if ( i > 0 && i < 4 )
            {
                // First row, not the first button
                temp.addComponents(updatedButtons[i].setCustomId(`role_${tempRoleID}`).setDisabled(false));
                // Push early, if these are the only buttons
                if ( updatedButtons.length - 1 === i ) { menuComponentsArray.push(temp); }
            }
            else if ( i === 4 )
            {
                // Last button of the first row
                temp.addComponents(updatedButtons[i].setCustomId(`role_${tempRoleID}`).setDisabled(false));
                // Free up TEMP ready for second row
                menuComponentsArray.push(temp);
                temp = new Discord.MessageActionRow();
            }
            else if ( i > 4 && i < 9 )
            {
                // Second row, buttons 1 through 4
                temp.addComponents(updatedButtons[i].setCustomId(`role_${tempRoleID}`).setDisabled(false));
                // Push early, if these are the only buttons
                if ( updatedButtons.length - 1 === i ) { menuComponentsArray.push(temp); }
            }
            else if ( i === 9 )
            {
                // Second row, last button
                temp.addComponents(updatedButtons[i].setCustomId(`role_${tempRoleID}`).setDisabled(false));
                menuComponentsArray.push(temp);
            }
            else { break; }
        }


        // Fetch and updating existing Menu's Message
        /** @type {String} */
        let menuMessageId = client.roleMenu.get("menuMessageID");
        let menuJSON = RoleMenuJson[menuMessageId];

        let fetchedChannel = await selectInteraction.guild.channels.fetch(menuJSON.channelID);
        /** @type {Discord.Message} */
        let fetchedMessage = await fetchedChannel.messages.fetch(menuMessageId);
        await fetchedMessage.edit({ embeds: [updatedEmbed], components: menuComponentsArray, allowedMentions: { parse: [] } });


        // Update stored details in JSON
        menuJSON.roles = updatedRoles;
        menuJSON.embed = { title: updatedEmbed.title,
             description: updatedEmbed.description !== null && updatedEmbed.description !== undefined && updatedEmbed.description !== "" && updatedEmbed.description !== " " ? updatedEmbed.description : null,
             color: updatedEmbed.hexColor
        };
        RoleMenuJson[menuMessageId] = menuJSON;

        // Save JSON
        fs.writeFile('./hiddenJsonFiles/roleMenus.json', JSON.stringify(RoleMenuJson, null, 4), async (err) => {
            if ( err ) { return await selectInteraction.followUp({ content: `An error occurred while trying to save your new Role Menu...`, ephemeral: true }); }
        });

        // ACK to User
        await selectInteraction.editReply({ content: `✅ Successfully saved and updated your changes to the Role Menu!`, embeds: [], components: [] });

        // Wipe caches, ready for next time
        client.roleMenu.clear();
        return;
    }
};
