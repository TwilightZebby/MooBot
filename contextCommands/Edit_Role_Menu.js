// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Context Command's Name, can be mixed case and allows for spaces
    // If the command name has a space, use an underscore (_) for the file name
    name: 'Edit Role Menu',
    // Context Command's description, used for Help (text) Command
    description: `Context Command version of /rolemenu configure`,
    // Category of Context Command, used for Help (text) Command
    category: 'management',

    // Context Command's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 10,


    /**
     * Returns data used for registering this Context Command
     * 
     * @returns {Discord.ApplicationCommandData}
     */
    registerData()
    {
        const data = {};

        // Slash Command's Name, Description, and Application Command Type
        data.name = this.name;
        data.description = ""; // Left blank otherwise Discord's API will reject
        data.type = "MESSAGE"; // either "USER" or "MESSAGE", must *not* be left blank
        
        return data;
    },




    /**
     * Main function that runs this Context Command
     * 
     * @param {Discord.ContextMenuInteraction} contextCommand Context Command Interaction
     */
    async execute(contextCommand)
    {
        // Prevent usage in TiV and Announcement Channels
        if ( contextCommand.channel instanceof Discord.VoiceChannel )
        {
            return await contextCommand.reply({ content: CONSTANTS.errorMessages.SLASH_COMMAND_NO_TIV.replace("{{commandName}}", contextCommand.commandName), ephemeral: true });
        }

        if ( contextCommand.channel instanceof Discord.NewsChannel )
        {
            return await contextCommand.reply({ content: `Sorry, but this Context Command cannot be used in Announcement Channels.`, ephemeral: true });
        }

        // Check User has MANAGE_ROLES Permission
        if ( !contextCommand.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_ROLES, true) )
        {
            return await contextCommand.reply({ content: `⚠ You cannot use this Context Command, as you do *not* have the \`MANAGE_ROLES\` Permission.`, ephemeral: true });
        }

        // Check the BOT has MANAGE_ROLES Permission
        if ( !contextCommand.guild.me.permissions.has(Discord.Permissions.FLAGS.MANAGE_ROLES, true) )
        {
            return await contextCommand.reply({ content: `⚠ I do not seem to have the \`MANAGE_ROLES\` Permission! Please ensure I have been granted it in order for my Self-Assignable Role Module to work.`, ephemeral: true });
        }


        // Check Bot has `READ_MESSAGE_HISTORY` Permission in current Channel
        if ( !contextCommand.channel.permissionsFor(contextCommand.guild.me).has(Discord.Permissions.FLAGS.READ_MESSAGE_HISTORY) )
        {
            return await contextCommand.reply({ content: `Sorry, but I cannot edit an existing Role Menu in this Channel without having the \`Read Message History\` Permission!`, ephemeral: true });
        }

        // Check that message *does* have a Menu
        let roleMenuJson = require('../hiddenJsonFiles/roleMenus.json');
        //  Grab the message
        let sourceMessage = contextCommand.options.getMessage('message');
        if ( !roleMenuJson[sourceMessage.id] )
        {
            return await contextCommand.reply({ content: `That Message doesn't contain one of my Role Menus!`, ephemeral: true });
        }
        else
        {
            return await this.configure(contextCommand, sourceMessage.id);
        }
    },








    /**
     * Starts the Configuration Process for editing a Role Menu
     * @param {Discord.ContextMenuInteraction} contextCommand 
     * @param {String} messageId ID of the Message containing the Menu
     */
    async configure(contextCommand, messageId)
    {
        // Just so we can grab the Channel and Guild IDs for the Message Link
        let roleMenuJSON = require('../hiddenJsonFiles/roleMenus.json');
        let thisMenu = roleMenuJSON[messageId];

        // Construct Embed for auto-updating preview
        let previewEmbed = new Discord.MessageEmbed().setTitle(thisMenu.embed.title);
        if ( thisMenu.embed.description !== null ) { previewEmbed.setDescription(thisMenu.embed.description); }
        if ( thisMenu.embed.color !== null ) { previewEmbed.setColor(thisMenu.embed.color); }


        // Construct Buttons for auto-updating preview
        // Also, add the Roles to the Embed
        /** @type {Array<Discord.MessageButton>} */
        let previewButtons = [];
        let roleEmbedTextFieldOne = "";
        let roleEmbedTextFieldTwo = "";
        for (let i = 0; i <= thisMenu.roles.length - 1; i++)
        {
            // Construct Button
            let tempButton = new Discord.MessageButton().setStyle('PRIMARY').setCustomId(`roleedit_${thisMenu.roles[i].roleID}`);
            if ( thisMenu.roles[i].label !== null ) { tempButton.setLabel(thisMenu.roles[i].label); }
            if ( thisMenu.roles[i].emoji !== null ) { tempButton.setEmoji(thisMenu.roles[i].emoji); }
            previewButtons.push(tempButton);

            // Add to Embed
            if ( roleEmbedTextFieldOne.length >= 950 )
            {
                // Switch to Field Two
                roleEmbedTextFieldTwo += `• <@&${thisMenu.roles[i].roleID}> - ${thisMenu.roles[i].emoji !== null ? thisMenu.roles[i].emoji : ""} ${thisMenu.roles[i].label !== null ? thisMenu.roles[i].label : ""}\n`;
            }
            else
            {
                // Stay on Field One
                roleEmbedTextFieldOne += `• <@&${thisMenu.roles[i].roleID}> - ${thisMenu.roles[i].emoji !== null ? thisMenu.roles[i].emoji : ""} ${thisMenu.roles[i].label !== null ? thisMenu.roles[i].label : ""}\n`;
            }
        }

        // Display on Embed
        previewEmbed.addFields({ name: `\u200B`, value: roleEmbedTextFieldOne });
        if ( roleEmbedTextFieldTwo !== "" && roleEmbedTextFieldTwo !== " " )
        {
            previewEmbed.addFields({ name: `\u200B`, value: roleEmbedTextFieldTwo });
        }


        // Prepare for display
        /** @type {Array<Discord.MessageActionRow>} */
        let previewComponentArray = [];
        let temp;
        for ( let i = 0; i <= previewButtons.length - 1; i++ )
        {
            if ( i === 0 )
            {
                // First button on first row
                temp = new Discord.MessageActionRow().addComponents(previewButtons[i].setDisabled(false));
                // Push early if only button
                if ( previewButtons.length - 1 === i ) { previewComponentArray.push(temp); }
            }
            else if ( i > 0 && i < 4 )
            {
                // First row, not the first button
                temp.addComponents(previewButtons[i].setDisabled(false));
                // Push early, if these are the only buttons
                if ( previewButtons.length - 1 === i ) { previewComponentArray.push(temp); }
            }
            else if ( i === 4 )
            {
                // Last button of the first row
                temp.addComponents(previewButtons[i].setDisabled(false));
                // Free up TEMP ready for second row
                previewComponentArray.push(temp);
                temp = new Discord.MessageActionRow();
            }
            else if ( i > 4 && i < 9 )
            {
                // Second row, buttons 1 through 4
                temp.addComponents(previewButtons[i].setDisabled(false));
                // Push early, if these are the only buttons
                if ( previewButtons.length - 1 === i ) { previewComponentArray.push(temp); }
            }
            else if ( i === 9 )
            {
                // Second row, last button
                temp.addComponents(previewButtons[i].setDisabled(false));
                previewComponentArray.push(temp);
            }
            else { break; }
        }

        // Add Select Menu
        previewComponentArray.push(CONSTANTS.components.selects.ROLE_MENU_EDIT);


        // Send initial message
        let originalEditMenuResponse = await contextCommand.reply({ content: `__**Self-Assignable Role Menu Management**__\n([Jump Link to current Menu](<https://discord.com/channels/${thisMenu.guildID}/${thisMenu.channelID}/${messageId}>))\nIf you want to edit a Role Button, simply press/tab on it; otherwise, for editing the Embed or adding/removing Roles, use the Select Menu.\n\nAn auto-updating preview of your Menu is shown below:`,
            components: previewComponentArray, embeds: [previewEmbed], ephemeral: true, fetchReply: true });
        
        // Save to Collection
        client.roleMenu.set(`originalEditResponse_${originalEditMenuResponse.guildId}`, { messageID: originalEditMenuResponse.id, guildID: originalEditMenuResponse.guildId, channelID: originalEditMenuResponse.channelId, interactionToken: contextCommand.token });
        client.roleMenu.set(`editEmbed_${originalEditMenuResponse.guildId}`, previewEmbed);
        client.roleMenu.set(`editButtons_${originalEditMenuResponse.guildId}`, previewButtons);
        client.roleMenu.set(`editRoles_${originalEditMenuResponse.guildId}`, thisMenu.roles);
        client.roleMenu.set(`menuMessageID_${originalEditMenuResponse.guildId}`, messageId);

        return;
    }
};
