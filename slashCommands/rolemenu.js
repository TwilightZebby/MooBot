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
        /* data.options = [
            {
                type: "SUB_COMMAND",
                name: "create",
                description: "Create a new Self-Assignable Role Menu"
            },
            {
                type: "SUB_COMMAND",
                name: "edit",
                description: "Add, edit, or remove Roles from an existing Menu",
                options: [
                    {
                        type: "STRING",
                        name: "messageid",
                        description: "The ID of the Message in this Channel containing a Role Menu",
                        required: true
                    }
                ]
            }
        ]; */
        
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

        // Create starting menu
        let initialMenuPageComponents = new Discord.MessageActionRow().addComponents(
            new Discord.MessageSelectMenu().setCustomId(`rolemenu`).setMaxValues(1).setMinValues(1).setOptions([
                { label: "Create Menu", value: "create_menu", description: "Creates a new Menu for Users to toggle Roles from", emoji: "<:ChannelCategory:816771723264393236>" },
                { label: "Add Role", value: "add_role", description: "Add a Role to an existing Menu", emoji: "<:plusGrey:941654979222077490>" },
                { label: "Edit Role", value: "edit_role", description: "Edit an existing Button for a Role", emoji: "<:IconSettings:778931333459738626>" },
                { label: "Remove Role", value: "remove_role", description: "Remove a Role from an existing Menu", emoji: "<:binGrey:941654671716655154>" }
            ]).setPlaceholder("Please select an action")
        );

        // Send Menu and grab response
        let commandResponse = await slashCommand.reply({ content: `__**Self-Assignable Role Management**__\n\nPlease use the below Select Menu to select what you want to do.`,
            components: [initialMenuPageComponents], ephemeral: true, fetchReply: true });

        // Store
        client.roleMenu.set("originalResponse", { messageID: commandResponse.id, guildID: commandResponse.guildId, channelID: commandResponse.channelId, interactionToken: slashCommand.token });

        return;
    }
};
