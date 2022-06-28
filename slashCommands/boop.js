// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const Action = require('../modules/actionModule.js');

module.exports = {
    // Slash Command's Name, MUST BE LOWERCASE AND NO SPACES
    name: 'boop',
    // Slash Command's description
    description: `Boop someone!`,
    // Category of Slash Command, used for Help (text) Command
    category: 'action',

    // Slash Command's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 5,


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
                type: "MENTIONABLE",
                name: "person",
                description: "The person you want to boop",
                required: true
            },
            {
                type: "BOOLEAN",
                name: "gif",
                description: "True to display a GIF, otherwise leave blank or use False",
                required: false
            },
            {
                type: "BOOLEAN",
                name: "button",
                description: "Set if the \"Return Action\" Button should be displayed (Default: true)",
                required: false
            },
            {
                type: "STRING",
                name: "reason",
                description: "A custom message to add onto the end of the built-in messages",
                required: false
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
        // Ensure no DM usage
        if ( slashCommand.channel instanceof Discord.DMChannel )
        {
            return await slashCommand.reply({ content: CONSTANTS.errorMessages.SLASH_COMMAND_GUILDS_ONLY, ephemeral: true });
        }
        else
        {
            return await Action.slashRespond(slashCommand);
        }
    }
};
