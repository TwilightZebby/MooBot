// Imports
const Discord = require('discord.js');
const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Select's Name, used as start of its Custom ID
    name: 'createrolemenu',
    // Select's description, purely for documentation
    description: `Handles presenting Modals for creating a Role Menu`,

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
        // Grab Value
        let createOption = selectInteraction.values.shift();
        
        switch(createOption)
        {
            case "configure_embed":
                // Edit the Embed
                /** @type {Discord.MessageEmbed} */
                let embedData = client.roleMenu.get("createEmbed");

                let embedModal = new Discord.Modal().setCustomId("createembeddata").setTitle("Configure Menu Embed").addComponents([
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("title").setLabel("Embed Title").setMaxLength(256).setStyle("SHORT").setRequired(true).setValue(!embedData?.title ? "" : embedData.title) ),
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("description").setLabel("Embed Description").setMaxLength(3000).setStyle("PARAGRAPH").setValue(!embedData?.description ? "" : embedData.description) ),
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("hexcolour").setLabel("Embed Colour (In Hex Format)").setMaxLength(7).setMinLength(7).setStyle("SHORT").setValue(!embedData?.hexColor ? "" : embedData.hexColor).setPlaceholder("Example: #5865F2") )
                ]);
                await selectInteraction.showModal(embedModal);
                break;

            case "add_role":
                // Add a new Role to the Menu
                // Validate Menu doesn't already have the max of 10 Buttons
                /** @type {Array<Discord.MessageButton>} */
                let fetchedButtons = client.roleMenu.get("createMenuButtons");
                if ( fetchedButtons?.length === 10 ) { return await selectInteraction.reply({ content: `Sorry, but you cannot add more than 10 (ten) Role Buttons to a single Menu!`, ephemeral: true }); }

                // Construct & Display Modal
                let newRoleModal = new Discord.Modal().setCustomId("createaddrole").setTitle("Add Assignable Role").addComponents([
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("roleid").setLabel("Role ID").setMaxLength(19).setMinLength(17).setStyle("SHORT").setRequired(true).setPlaceholder("Example: 5981450330692649077") ),
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("buttonlabel").setLabel("Role's Button Label (Required if no emoji)").setMaxLength(80).setStyle("SHORT") ),
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("buttonemoji").setLabel("Role's Button Emoji (Required if no label)").setStyle("SHORT").setPlaceholder("Example: <:grass_block:601353406577246208> or ✨") )
                ]);
                await selectInteraction.showModal(newRoleModal);
                break;

            case "remove_role":
                // Remove a Role from the menu
                let removeRoleModal = new Discord.Modal().setCustomId("createremoverole").setTitle("Remove Assignable Role").addComponents([
                    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId("roleid").setLabel("Role ID").setMaxLength(19).setMinLength(17).setStyle("SHORT").setRequired(true).setPlaceholder("Example: 5981450330692649077") )
                ]);
                await selectInteraction.showModal(removeRoleModal);
                break;

            case "save":
                // Save and Display new Menu
                await this.saveAndDisplay(selectInteraction);
                break;

            default:
                return await selectInteraction.reply({ content: CONSTANTS.errorMessages.GENERIC, ephemeral: true });
        }

        return;
    },








    /**
     * Saves and Displays the new Menu for Members to use
     * 
     * @param {Discord.SelectMenuInteraction} selectInteraction Select Interaction
     */
    async saveAndDisplay(selectInteraction)
    {
        // Defer, just in case
        await selectInteraction.deferUpdate();

        // Bring in JSON
        let RoleMenuJson = require('../hiddenJsonFiles/roleMenus.json');

        // Fetch all the data
        /** @type {Array<Discord.MessageButton>} */
        let newMenuButtons = client.roleMenu.get("createMenuButtons");
        /** @type {Discord.MessageEmbed} */
        let newMenuEmbed = client.roleMenu.get("createEmbed");
        /** @type {Array<Object>} */
        let newMenuRoleCache = client.roleMenu.get("createMenuRoleCache");

        // Prepare Buttons
        /** @type {Array<Discord.MessageActionRow>} */
        let menuComponentsArray = [];
        let temp;
        for ( let i = 0; i <= newMenuButtons.length - 1; i++ )
        {
            if ( i === 0 )
            {
                // First button on first row
                temp = new Discord.MessageActionRow().addComponents(newMenuButtons[i].setDisabled(false));
                // Push early if only button
                if ( newMenuButtons.length - 1 === i ) { menuComponentsArray.push(temp); }
            }
            else if ( i > 0 && i < 4 )
            {
                // First row, not the first button
                temp.addComponents(newMenuButtons[i].setDisabled(false));
                // Push early, if these are the only buttons
                if ( newMenuButtons.length - 1 === i ) { menuComponentsArray.push(temp); }
            }
            else if ( i === 4 )
            {
                // Last button of the first row
                temp.addComponents(newMenuButtons[i].setDisabled(false));
                // Free up TEMP ready for second row
                menuComponentsArray.push(temp);
                temp = new Discord.MessageActionRow();
            }
            else if ( i > 4 && i < 9 )
            {
                // Second row, buttons 1 through 4
                temp.addComponents(newMenuButtons[i].setDisabled(false));
                // Push early, if these are the only buttons
                if ( newMenuButtons.length - 1 === i ) { menuComponentsArray.push(temp); }
            }
            else if ( i === 9 )
            {
                // Second row, last button
                temp.addComponents(newMenuButtons[i].setDisabled(false));
                menuComponentsArray.push(temp);
            }
            else { break; }
        }

        // Send Message containing new Menu
        let newMenuMessage = await selectInteraction.channel.send({ embeds: [newMenuEmbed], components: menuComponentsArray, allowedMentions: { parse: [] } });

        // Store details in JSON, ready for future edits or removals
        RoleMenuJson[`${newMenuMessage.id}`] = {
            messageID: newMenuMessage.id,
            channelID: newMenuMessage.channel.id,
            guildID: newMenuMessage.guild.id,
            roles: newMenuRoleCache,
            embedData: { title: newMenuEmbed.title,
                description: newMenuEmbed.description !== null && newMenuEmbed.description !== undefined && newMenuEmbed.description !== "" && newMenuEmbed.description !== " " ? newMenuEmbed.description : null,
                color: newMenuEmbed.hexColor
            }
        };

        // Save back to JSON
        fs.writeFile('./hiddenJsonFiles/roleMenus.json', JSON.stringify(RoleMenuJson, null, 4), async (err) => {
            if ( err ) { return await selectInteraction.followUp({ content: `An error occurred while trying to save your new Role Menu...`, ephemeral: true }); }
        });

        // ACK to User
        await selectInteraction.editReply({ content: `✅ Successfully saved and displayed your new Role Menu!\nNow your Server Members can grant/revoke those Roles for themselves by simply pressing the respective button(s) :)`, embeds: [], components: [] });

        // Wipe Caches, ready for next Menu
        client.roleMenu.clear();
        return;
    }
};
