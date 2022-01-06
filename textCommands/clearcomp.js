// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Command Name
    name: 'clearcomp',
    // Description of command
    description: `Removes components (Buttons/Selects) from a specific Message sent by this Bot`,
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
    requiresArguments: true,

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

        // Ensure message ID was of a message sent by this Bot
        let targetMessage = await message.channel.messages.fetch(arguments.shift())
        .catch(async (err) => { return await message.reply({ content: `I could not find any Message in this Channel with that Message ID.\nPlease try again, ensuring the Message ID if of a Message sent in the same Channel as this command, and that the Message hasn't been deleted.`, allowedMentions: { parse: [], repliedUser: false } }); });

        // Ensure Message was sent by the Bot
        if ( targetMessage.author.id !== client.user.id )
        {
            return await message.reply({ content: `That Message wasn't sent by me!\nI can only remove components from Messages sent by me.`, allowedMentions: { parse: [], repliedUser: false } });
        }

        // Attempt component removal
        await targetMessage.edit({ components: [] })
        .then(async () => { return await message.reply({ content: `Successfully removed the components from my message\n(Message Link: <${targetMessage.url}> )`, allowedMentions: { parse: [], repliedUser: false } }); })
        .catch(async (err) => { return await message.reply({ content: CONSTANTS.errorMessages.GENERIC, allowedMentions: { parse: [], repliedUser: false } }); });

        return;
    }
};
