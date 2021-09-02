const Discord = require('discord.js');
const { client } = require('../constants.js');


module.exports = {
    name: 'addgif',
    description: `Adds a linked GIF to one of the Action Slash Commands`,
    
    // Cooldown is in seconds
    cooldown: 10,

    // Limitation
    //    - "dev" for TwilightZebby only
    //    - "owner" for Server Owners and TwilightZebby
    //    - Comment out for everyone
    limitation: "dev",

    // Uncomment for making the command only usable in DMs with the Bot
    //    - DO NOT have both this AND "guildOnly" uncommented, only one or neither
    //dmOnly: true,

    // Uncomment for making the command only usable in Servers
    //   - DO NOT have both this AND "dmOnly" uncommented, only one or neither
    //guildOnly: true,

    // Required Arguments?
    //   - Does the command require arguments? (at least one) Comment out if works without arguments
    requiresArgs: true,
    
    // Argument Checks
    //   - Minimum required arguments, only use if "requiresArgs" is uncommented
    minimumArgs: 2,
    //   - Maximum required arguments, can be used regardless of if "requiresArgs" is commented out or not
    //maximumArgs: 5,


    /**
     * Entry point that runs the command
     * 
     * @param {Discord.Message} message Origin message that triggered this command
     * @param {Array<String>} args The given arguments of the command. Be sure to check for no arguments!
     */
    async execute(message, args) {

        let GIFLINKS = require('../jsonFiles/gifLinks.json');

        // Grab arguments
        let actionCommandName = args.shift().toLowerCase();
        let newGifURL = args.shift();

        // Check action command exists
        if ( !GIFLINKS[`${actionCommandName}`] )
        {
            return await message.reply({ content: `Whoops, but I don't have a **${actionCommandName}** Action Command!`, allowedMentions: { repliedUser: false, parse: [] } });
        }

        // Add GIF to store
        GIFLINKS[`${actionCommandName}`].push(newGifURL);

        // Save to JSON
        fs.writeFile('./jsonFiles/gifLinks.json', JSON.stringify(GIFLINKS, null, 4), async (err) => {
            if (err)
            {
                return await message.reply({ content: `Sorry, but an error occurred while trying to save that new GIF...`, allowedMentions: { parse: [], repliedUser: false } });
            }
        });

        return await message.reply({ content: `Successfully added the new GIF to the **${actionCommandName}** Action Command!`, allowedMentions: { parse: [], repliedUser: false } });

    }
}
