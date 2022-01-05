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
        

        // Grab Guild, Channel, and Message ID from Link
        let splitMessage = message.content.split("/");
        const linkMessageID = splitMessage[splitMessage.length - 1];
        const linkChannelID = splitMessage[splitMessage.length - 2];
        const linkGuildID = splitMessage[splitMessage.length - 3];

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
                    .addFields({ name: `Jump to Message`, value: `[Click to jump](${sourceMessage.url})` })
                    .setFooter({ text: `Quoted by ${message.author.username}#${message.author.discriminator}` })
                    .setTimestamp(sourceMessage.createdTimestamp);

                    if ( sourceMessage.attachments.size >= 1 )
                    {
                        quoteEmbed.setImage(sourceMessage.attachments.first().url);
                    }
                
                    // Send message
                    return await message.reply({ embeds: [quoteEmbed], allowedMentions: { parse: [], repliedUser: false } });
                }
            }
        }

        return;
    }
}
