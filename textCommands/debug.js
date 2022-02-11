// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Command Name
    name: 'debug',
    // Description of command
    description: `Used to toggle Debug Mode for the Bot`,
    // Category of Command, used for Help Command
    category: 'development',

    // Alias(es) of command, if any
    // Uncomment if there will be some
    //alias: [],

    // Command Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 10,

    // Is command intended for DM usage with the Bot only?
    // DO NOT HAVE THIS AND "guildOnly" UNCOMMENTED - ONLY ONE OR THE OTHER OR NEITHER
    //dmOnly: true,

    // Is command intended for Guild usage only?
    // DO NOT HAVE THIS AND "dmOnly" UNCOMMENTED - ONLY ONE OR THE OTHER OR NEITHER
    //guildOnly: true,

    // Is at least one argument required?
    //requiresArguments: true,

    // What is the minimum required arguments?
    // THIS REQUIRES "requiresArguments" TO BE UNCOMMENTED
    //minimumArguments: 2,

    // What is the maximum required arguments?
    // Is usable/settable no matter if "requiresArguments" is un/commented
    //maximumArguments: 5,

    // Command Limitation - limits who can use this Command
    //    - "developer" for TwilightZebby only
    //    - "owner" for Guild Owners & TwilightZebby
    //    - "admin" for those with the ADMIN Guild Permission, Guild Owners, & TwilightZebby
    //    - "moderator" for those with Moderator-level Guild Permissions, Admins, Guild Owners, & TwilightZebby
    //    - "everyone" (or commented out) for everyone to use this command
    limitation: "developer",



    /**
     * Main function that runs the command
     * 
     * @param {Discord.Message} message Origin Message that triggered this command
     * @param {Array<String>} arguments The given arguments of the command. Can be empty if no arguments were passed!
     */
    async execute(message, arguments)
    {
        // No argument = respond with current state of Debug Mode
        if ( !arguments || !arguments.length || arguments.length < 1 )
        {
            return await message.reply({ content: `Debug Mode is currently set to ${client.debugMode}.`, allowedMentions: { parse: [], repliedUser: false } });
        }
        else
        {
            // Check Argument
            if ( !["true", "false"].includes(arguments[0].toLowerCase()) )
            {
                return await message.reply({ content: `Sorry, but I only accept either "true" or "false" as the inputs for that command!`, allowedMentions: { parse: [], repliedUser: false } });
            }
        
            const debugArgument = arguments.shift().toLowerCase();
        
            // Toggle the debug mod
            switch(debugArgument)
            {
                case "true":
                    client.debugMode = true;
            
                case "false":
                default:
                    client.debugMode = false;
            }
        
            // ACK to user
            return await message.reply({ content: `Successfully toggled my Debug Mode to ${debugArgument}.`, allowedMentions: { parse: [], repliedUser: false } });
        }   
    }
};
