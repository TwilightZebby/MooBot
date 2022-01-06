// Imports
const Discord = require('discord.js');
const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Command Name
    name: 'addgif',
    // Description of command
    description: `Adds the linked GIF to one of the Action Slash Commands`,
    // Category of Command, used for Help Command
    category: 'management',

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
    requiresArguments: true,

    // What is the minimum required arguments?
    // THIS REQUIRES "requiresArguments" TO BE UNCOMMENTED
    minimumArguments: 2,

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

        let GIF_LINKS = require('../jsonFiles/gifLinks.json');
        
        // Grab Arguments
        let actionCommandName = arguments.shift().toLowerCase();
        let newGifUrl = arguments.shift();

        // Check command exists
        if ( !GIF_LINKS[`${actionCommandName}`] )
        {
            return await message.reply({ content: `Error: **${actionCommandName}** isn't a valid Action Slash Command I have!`, allowedMentions: { parse: [], repliedUser: false } });
        }

        // Add GIF Link to JSON
        GIF_LINKS[`${actionCommandName}`].push(newGifUrl);

        // Save to JSON
        fs.writeFile('./jsonFiles/gifLinks.json', JSON.stringify(GIF_LINKS, null, 4), async (err) => {
            if ( err ) { return await message.reply({ content: CONSTANTS.errorMessages.GENERIC, allowedMentions: { parse: [], repliedUser: false } }); }
        })

        return await message.reply({ content: `Successfully added the linked GIF to the **${actionCommandName}** Action Slash Command.`, allowedMentions: { parse: [], repliedUser: false } });
    }
};
