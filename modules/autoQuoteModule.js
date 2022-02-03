// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');
const UTILITY = require('../modules/utilityModule.js');


module.exports = {
    /**
     * Main function for the Auto Quote Module
     * 
     * @param {Discord.Message} message
     */
    async main(message)
    {
        // ****************************************
        // Not returning errors to the User here since
        // that would result in possible chat spam.
        // ****************************************
        

        // Split up message for ease
        let splitMessage = message.content.split("/");

        // If message link is surrounded by < > then don't auto-quote
        if ( splitMessage[0].startsWith("<") && splitMessage[6].endsWith(">") ) { return; }

        // Grab Message, Channel, and Guild IDs for ease
        const linkMessageID = splitMessage[6];
        const linkChannelID = splitMessage[5];
        const linkGuildID = splitMessage[4];

        // Ensure it wasn't a link to a DM message
        if ( linkGuildID === "@me" ) { return; }

        // Ensure Linked Message is from a Server the Bot is in
        let sourceGuild = await client.guilds.fetch(linkGuildID).catch((err) => { return; });

        // NodeJS stop being stupid please
        if ( sourceGuild instanceof Discord.Guild )
        {
            // Ensure Bot has access to source Channel
            let sourceChannel = await sourceGuild.channels.fetch(linkChannelID).catch((err) => { return; });

            // NodeJS stop being stupid please (part 2)
            if ( (sourceChannel instanceof Discord.TextChannel) || (sourceChannel instanceof Discord.NewsChannel) )
            {
                // Attempt to fetch source Message
                let sourceMessage = await sourceChannel.messages.fetch(linkMessageID).catch((err) => { return; });

                // NodeJS stop being stupid please (the finale)
                if ( sourceMessage instanceof Discord.Message )
                {
                    // Ensure no System Messages, nor messages from Bots
                    if ( sourceMessage.system || sourceMessage.author.bot ) { return; }

                    // Assemble Embed for quoting
                    let quoteEmbed = new Discord.MessageEmbed().setAuthor({ name: `${!sourceMessage.member?.displayName ? sourceMessage.author.username : sourceMessage.member.displayName} (${sourceMessage.author.username}#${sourceMessage.author.discriminator})`, iconURL: !sourceMessage.member ? sourceMessage.author.displayAvatarURL({ dynamic: true, format: 'png' }) : sourceMessage.member.displayAvatarURL({ dynamic: true, format: 'png' }) })
                    .setColor(!sourceMessage.member?.displayHexColor ? 'RANDOM' : sourceMessage.member.displayHexColor)
                    .setDescription(!sourceMessage.content ? ' ' : sourceMessage.content)
                    .setFooter({ text: `Quoted by ${message.author.username}#${message.author.discriminator}` })
                    .setTimestamp(sourceMessage.createdTimestamp);

                    if ( sourceMessage.attachments.size >= 1 )
                    {
                        // If spoilered, don't embed
                        if ( sourceMessage.attachments.first().spoiler )
                        {
                            quoteEmbed.addFields({ name: "\u200B", value: "*This message contains spoiler-marked image(s)*" });
                        }
                        // Check if first Attachment is an Image or GIF that can be embedded and displayed
                        else if ( ["image/png", "image/jpeg", "image/webp", "image/gif"].includes(sourceMessage.attachments.first().contentType) )
                        {
                            quoteEmbed.setImage(sourceMessage.attachments.first().url);
                        }
                    }

                    // Add Jump Link
                    quoteEmbed.addFields({ name: `Jump to Message`, value: `[Click to jump](${sourceMessage.url})` });
                
                    // Send message
                    return await message.reply({ embeds: [quoteEmbed], allowedMentions: { parse: [], repliedUser: false } });
                }
            }
        }

        return;
    }
}
