// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Command Name
    name: 'deadchat',
    // Description of command
    description: `Used for responding to unhelpful "dead chat/server/channel" messages :c`,
    // Category of Command, used for Help Command
    category: 'general',

    // Alias(es) of command, if any
    // Uncomment if there will be some
    //alias: [],

    // Command Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 60,

    // Is command intended for DM usage with the Bot only?
    // DO NOT HAVE THIS AND "guildOnly" UNCOMMENTED - ONLY ONE OR THE OTHER OR NEITHER
    //dmOnly: true,

    // Is command intended for Guild usage only?
    // DO NOT HAVE THIS AND "dmOnly" UNCOMMENTED - ONLY ONE OR THE OTHER OR NEITHER
    guildOnly: true,

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
    //    - "private" for those TwilightZebby explicitly grants permission to use on a per-User allowlist basis. This is non-linear as the above permissions do NOT override this
    //    - "everyone" (or commented out) for everyone to use this command
    limitation: "moderator",



    /**
     * Main function that runs the command
     * 
     * @param {Discord.Message} message Origin Message that triggered this command
     * @param {Array<String>} arguments The given arguments of the command. Can be empty if no arguments were passed!
     */
    async execute(message, arguments)
    {
        if ( (message.channel instanceof Discord.TextChannel) || (message.channel instanceof Discord.ThreadChannel) || (message.channel instanceof Discord.VoiceChannel) )
        {
            // Send response, dependant on `EMBED_LINKS` Permission
            const botUserPermissions = message.channel.permissionsFor(client.user.id, true);
            if ( botUserPermissions.has(Discord.Permissions.FLAGS.EMBED_LINKS, true) )
            {
                return await message.reply({ content: `https://i.imgur.com/GPsMbsm.png`, allowedMentions: { parse: [], repliedUser: false } });
            }
            else
            {
                return await message.reply({ content: `Always pointing out that a chat, channel, or server is "dead" or "inactive" doesn't get you a reward or anything. In fact, it doesn't help the server in any way.\nSo instead of saying how inactive a chat is, try to get things moving again!\n\nAnything is better than complaining about it.`, allowedMentions: { parse: [], repliedUser: false } });
            }
        }
        else
        {
            return await message.reply({ content: `Sorry, that command will only work in Text Channels, Thread Channels, and Voice Text Chats.`, allowedMentions: { parse: [], repliedUser: false } });
        }
    }
};
