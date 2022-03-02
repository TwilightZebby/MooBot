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
            let commandResponse = await slashCommand.reply({ content: `__**Self-Assignable Role Menu Creation**__\nUse the Select Menu to configure the Embed and Role Buttons.\nPlease make sure to have the relevant Role IDs - and Emoji IDs if including in Buttons - ready (such as in a notepad program) as you won't be able to copy from a Discord message while an Input Form is open.\n\nAn auto-updating preview of what your new Self-Assignable Role Menu will look like is shown below.`,
                components: [CONSTANTS.components.selects.ROLE_MENU_CREATE_NO_EMBED], embeds: [createMenuEmbed], ephemeral: true });

            // Store
            client.roleMenu.set("originalResponse", { messageID: commandResponse.id, guildID: commandResponse.guildId, channelID: commandResponse.channelId, interactionToken: slashCommand.token });
        }
        // Menu Editing
        else if ( subCommandName === "configure" )
        {
            // .
        }

        // Send Menu and grab response
        //let commandResponse = await slashCommand.reply({ content: `__**Self-Assignable Role Management**__\n\nPlease use the below Select Menu to select what you want to do.`,
           // components: [CONSTANTS.components.selects.ROLE_MENU_INITIAL], ephemeral: true, fetchReply: true });

        // Store
        //client.roleMenu.set("originalResponse", { messageID: commandResponse.id, guildID: commandResponse.guildId, channelID: commandResponse.channelId, interactionToken: slashCommand.token });

        return;
    }
};
