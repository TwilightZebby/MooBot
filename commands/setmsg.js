const Discord = require('discord.js');
const fs = require('fs');
const { client } = require('../constants.js');


module.exports = {
    name: 'setmsg',
    description: `Sets a custom built-in Action Message for a specific User`,
    
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
    minimumArgs: 3,
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

        // Fetch arguments
        let targetUserID = args.shift();
        let targetCommandName = args.shift();
        let customString = args.join(' ');
        let messagesContruct;

        if ( !AUTHORMESSAGES[`${targetUserID}`] )
        {
            // User doesn't have preset custom messages, thus use template
            messagesContruct = {
                userNote: `${targetUserID}`,
                headpat: "**{author}** gave **{receiver}** a headpat",
                hug: "**{author}** gave **{receiver}** a cuddle",
                bonk: "**{author}** bonked **{receiver}**",
                sleep: "**{author}** wants **{receiver}** to go to sleep!",
                boop: "**{author}** booped **{receiver}**",
                kiss: "**{author}** kissed **{receiver}**",
                slap: "**{author}** slapped **{receiver}**"
            }
        }
        else
        {
            // User does have preset custom messages already, so pull from them
            messagesContruct = AUTHORMESSAGES[`${targetUserID}`];
        }

        messagesContruct[`${targetCommandName}`] = customString;
        messagesContruct["userNote"] = targetUserID; // Temp put note as ID

        // Store to JSON
        AUTHORMESSAGES[`${targetUserID}`] = messagesContruct;

        fs.writeFile('./jsonFiles/authorSpecificMessages.json', JSON.stringify(AUTHORMESSAGES, null, 4), async (err) => {
            if (err)
            {
                return await message.reply({ content: `Sorry, but an error occurred while trying to save that custom message...`, allowedMentions: { parse: [], repliedUser: false } });
            }
        });

        return await message.reply({ content: `Successfully saved new custom message for User \<\@${targetUserID}\>`, allowedMentions: { parse: [], repliedUser: false } });

    }
}
