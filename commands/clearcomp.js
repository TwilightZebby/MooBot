const Discord = require('discord.js');
const { client } = require('../constants.js');


module.exports = {
    name: 'clearcomp',
    description: `Clears the components from a specific Message previously sent by this Bot`,
    
    // Cooldown is in seconds
    cooldown: 5,

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

        // Check message was sent by this Bot
        let targetMessage = await message.channel.messages.fetch(args[0])
        .catch(async (err) => {
            return await message.reply({ content: `Sorry, but I couldn't fetch any message with that ID.\n\nPlease try again, ensuring the message was sent in the same Channel you try to use this command in; and that the message hasn't been deleted.`, allowedMentions: { parse: [], repliedUser: false } });
        });

        if ( targetMessage.author.id !== client.user.id )
        {
            return await message.reply({ content: `Sorry, but that wasn't a message sent by me!\n(I can only edit out components from messages I have sent)`, allowedMentions: { parse: [], repliedUser: false } });
        }

        // Attempt to remove components
        await targetMessage.edit({ components: [] })
        .catch(async (err) => {
            return await message.reply({ content: `Whoops, something went wrong while trying to remove the components from that message!\n\n(Link: <${targetMessage.url}>)`, allowedMentions: { parse: [], repliedUser: false } });
        })
        .then(async () => {
            return await message.reply({ content: `Successfully edited out the components from my previous message!\n\n(Link: <${targetMessage.url}> )`, allowedMentions: { parse: [], repliedUser: false } });
        });

        return;

    }
}
