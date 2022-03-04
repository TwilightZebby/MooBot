// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Slash Command's Name, MUST BE LOWERCASE AND NO SPACES
    name: 'rolemenu',
    // Slash Command's description
    description: `Used to create or manage Self-Assignable Role Menus`,
    // Category of Slash Command, used for Help (text) Command
    category: 'general',

    // Slash Command's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 10,


    /**
     * Returns data used for registering this Slash Command
     * 
     * @returns {Discord.ChatInputApplicationCommandData}
     */
    registerData()
    {
        const data = {};

        // Slash Command's Name, Description, and Application Command Type
        data.name = this.name;
        data.description = this.description;
        data.type = "CHAT_INPUT";
        data.options = [
            {
                type: "SUB_COMMAND",
                name: "create",
                description: "Create a new Self-Assignable Role Menu"
            },
            {
                type: "SUB_COMMAND",
                name: "configure",
                description: "Manage the Roles, Buttons, and Embeds on an existing Menu",
                options: [
                    {
                        type: "STRING",
                        name: "message",
                        description: "The ID of the Message containing an existing Menu",
                        required: true
                    }
                ]
            }
        ];
        
        return data;
    },




    /**
     * Main function that runs this Slash Command
     * 
     * @param {Discord.CommandInteraction} slashCommand Slash Command Interaction
     */
    async execute(slashCommand)
    {
        // Check User has MANAGE_ROLES Permission
        if ( !slashCommand.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_ROLES, true) )
        {
            return await slashCommand.reply({ content: `⚠ You cannot use this Slash Command, as you do *not* have the \`MANAGE_ROLES\` Permission.`, ephemeral: true });
        }

        // Check the BOT has MANAGE_ROLES Permission
        if ( !slashCommand.guild.me.permissions.has(Discord.Permissions.FLAGS.MANAGE_ROLES, true) )
        {
            return await slashCommand.reply({ content: `⚠ I do not seem to have the \`MANAGE_ROLES\` Permission! Please ensure I have been granted it in order for my Self-Assignable Role Module to work.`, ephemeral: true });
        }


        let subCommandName = slashCommand.options.getSubcommand();

        // Menu Creation
        if ( subCommandName === "create" )
        {
            // Construct stuff
            let createMenuEmbed = new Discord.MessageEmbed().setDescription("*Role Menu is currently empty. Please use the Select Menu below to configure this Role Menu*");
                
            // ACK to User
            let commandResponse = await slashCommand.reply({ content: `__**Self-Assignable Role Menu Creation**__\nUse the Select Menu to configure the Embed and Role Buttons.\nPlease make sure to have the relevant Role IDs - and Emoji IDs if including in Buttons - ready (such as in a notepad program) as you won't be able to copy from a Discord message while an Input Form is open.\nAdditionally, both Custom Discord Emojis, and standard Unicode Emojis, are supported.\n\nAn auto-updating preview of what your new Self-Assignable Role Menu will look like is shown below.`,
                components: [CONSTANTS.components.selects.ROLE_MENU_CREATE_NO_EMBED], embeds: [createMenuEmbed], ephemeral: true, fetchReply: true });

            // Store
            client.roleMenu.set("originalResponse", { messageID: commandResponse.id, guildID: commandResponse.guildId, channelID: commandResponse.channelId, interactionToken: slashCommand.token });
        }
        // Menu Editing
        else if ( subCommandName === "configure" )
        {
            // Check that message *does* have a Menu
            let roleMenuJson = require('../hiddenJsonFiles/roleMenus.json');
            let messageID = slashCommand.options.getString("message", true);
            if ( !roleMenuJson[messageID] )
            {
                return await slashCommand.reply({ content: `That Message ID isn't for a Message containing one of my Role Menus!`, ephemeral: true });
            }
            else
            {
                return await this.configure(slashCommand, messageID);
            }
        }

        return;
    },








    /**
     * Starts the Configuration Process for editing a Role Menu
     * @param {Discord.CommandInteraction} slashCommand 
     * @param {String} messageId ID of the Message containing the Menu
     */
    async configure(slashCommand, messageId)
    {
        // Just so we can grab the Channel and Guild IDs for the Message Link
        let roleMenuJSON = require('../hiddenJsonFiles/roleMenus.json');
        let thisMenu = roleMenuJSON[messageId];

        // Construct Embed for auto-updating preview
        let previewEmbed = new Discord.MessageEmbed().setTitle(thisMenu.embed.title);
        if ( thisMenu.embed.description !== null ) { previewEmbed.setDescription(thisMenu.embed.description); }
        if ( thisMenu.embed.color !== null ) { previewEmbed.setColor(thisMenu.embed.color); }


        // Construct Buttons for auto-updating preview
        /** @type {Array<Discord.MessageButton>} */
        let previewButtons = [];
        for (let i = 0; i <= thisMenu.roles.length - 1; i++)
        {
            let tempButton = new Discord.MessageButton().setStyle('PRIMARY').setCustomId(`roleedit_${thisMenu.roles[i].roleID}`);
            if ( thisMenu.roles[i].label !== null ) { tempButton.setLabel(thisMenu.roles[i].label); }
            if ( thisMenu.roles[i].emoji !== null ) { tempButton.setEmoji(thisMenu.roles[i].emoji); }
            previewButtons.push(tempButton);
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
        let originalEditMenuResponse = await slashCommand.reply({ content: `__**Self-Assignable Role Menu Management**__\nPlease use the Select Menu to select what you want to change of the Role Menu ([Jump Link to current Menu](<https://discord.com/channels/${thisMenu.guildID}/${thisMenu.channelID}/${messageId}>)).\nTo edit a Button, simply press/tap it.\n\nAn auto-updating preview of your Menu is shown below:`,
            components: previewComponentArray, embeds: [previewEmbed], ephemeral: true, fetchReply: true });
        
        // Save to Collection
        client.roleMenu.set("originalEditResponse", { messageID: originalEditMenuResponse.id, guildID: originalEditMenuResponse.guildId, channelID: originalEditMenuResponse.channelId, interactionToken: slashCommand.token });

        return;
    }
};
