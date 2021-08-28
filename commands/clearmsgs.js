const Discord = require('discord.js');
const fs = require('fs');
const { client } = require('../constants.js');


module.exports = {
    name: 'clearmsgs',
    description: `Clears all custom built-in Action Messages for a specific User`,
    
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
    guildOnly: true,

    // Required Arguments?
    //   - Does the command require arguments? (at least one) Comment out if works without arguments
    requiresArgs: true,
    
    // Argument Checks
    //   - Minimum required arguments, only use if "requiresArgs" is uncommented
    //minimumArgs: 2,
    //   - Maximum required arguments, can be used regardless of if "requiresArgs" is commented out or not
    //maximumArgs: 5,


    /**
     * Entry point that runs the command
     * 
     * @param {Discord.Message} message Origin message that triggered this command
     * @param {Array<String>} args The given arguments of the command. Be sure to check for no arguments!
     */
    async execute(message, args) {

        let AUTHORMESSAGES = require('../jsonFiles/authorSpecificMessages.json');

        // Fetch argument
        let targetUserID = args.shift();

        if ( !AUTHORMESSAGES[`${targetUserID}`] )
        {
            // User doesn't have preset custom messages, thus return
            return await message.reply({ content: `Sorry, but the User \<\@${targetUserID}\> doesn't have any stored custom messages, thus I cannot clear them.`, allowedMentions: { parse: [], repliedUser: false } });
        }
        else
        {
            // User does have preset custom messages already, so clear them
            delete AUTHORMESSAGES[`${targetUserID}`];

            // Write to JSON
            fs.writeFile('./jsonFiles/authorSpecificMessages.json', JSON.stringify(AUTHORMESSAGES, null, 4), async (err) => {
                if (err)
                {
                    return await message.reply({ content: `Sorry, but an error occurred while trying to clear stored custom messages for User \<\@${targetUserID}\>...`, allowedMentions: { parse: [], repliedUser: false } });
                }
            });

            return await message.reply({ content: `Successfully cleared all stored custom messages for User \<\@${targetUserID}\>`, allowedMentions: { parse: [], repliedUser: false } });
        }

    }
}
