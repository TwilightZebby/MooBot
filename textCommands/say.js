// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const Utility = require('../modules/utilityModule.js');

module.exports = {
    // Command Name
    name: 'say',
    // Description of command
    description: `Make the Bot say something`,
    // Category of Command, used for Help Command
    category: 'developer',

    // Alias(es) of command, if any
    // Uncomment if there will be some
    //alias: [],

    // Command Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 5,

    // Is command intended for DM usage with the Bot only?
    // DO NOT HAVE THIS AND "guildOnly" UNCOMMENTED - ONLY ONE OR THE OTHER OR NEITHER
    //dmOnly: true,

    // Is command intended for Guild usage only?
    // DO NOT HAVE THIS AND "dmOnly" UNCOMMENTED - ONLY ONE OR THE OTHER OR NEITHER
    guildOnly: true,

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
        // TODO: Replace with a Slash Command version of this, once Discord releases App Permissions v2 and Input Modals

        let repeatedMessage = arguments.join(' ');

        // First, ensure no accidental [at]Everyone or [at]Here mentions, in case allowed_mentions field breaks
        if ( Utility.TestForEveryoneMention(repeatedMessage) )
        {
            repeatedMessage.replace(Utility.everyoneRegex, "everyone");
        }

        // Send message
        await message.channel.send({ content: repeatedMessage, allowedMentions: { parse: [] } }); // VERY IMPORTANT TO *NOT* ALLOW ANY MENTIONS

        // Check if Bot has MANAGE_MESSAGES Permission in that Channel
        if ( message.guild.me.permissionsIn(message.channel).has(Discord.Permissions.FLAGS.MANAGE_MESSAGES) )
        {
            // Delete trigger command, since we have Permissions to do so
            await message.delete();
        }

        return;
    }
};
