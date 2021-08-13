const { client } = require('../constants.js');
const { ErrorLogChannelID, ErrorLogGuildID } = require('../config.js');
const Discord = require('discord.js');



/**
 * Fetches the Channel in Discord for logging errors
 * 
 * @param {String} guildID 
 * @param {String} channelID 
 * 
 * @returns {Promise<Discord.TextChannel>} Text Channel
 */
async function fetchErrorLogChannel(guildID, channelID)
{
    // Fetch Guild
    let guild = await client.guilds.fetch({ guild: guildID }).catch(console.error);
    let channel = await guild.channels.fetch(channelID).catch(console.error);

    return channel;
}




module.exports = {
    /**
     * Throws Error into console and Discord
     * 
     * @param {Error} error
     */
    async Log(error)
    {
        // Log to console
        console.error(error);

        // Log to Discord
        let messageArray = [
            `**Error**`,
            `\`\`\`${error}\`\`\``,
            `**Error Stack Trace**`,
            `\`\`\`${error.stack}\`\`\``
        ];

        let errorChannel = await fetchErrorLogChannel(ErrorLogGuildID, ErrorLogChannelID);
        await errorChannel.send({ content: messageArray.join(`\n`) });
        return;
    },






    /**
     * Throws Error into console and Discord, with a custom message attached
     * 
     * @param {Error} error
     * @param {String} eMessage
     */
     async LogCustom(error, eMessage)
     {
         // Log to console
         console.error(`${eMessage}\n`, error);
 
         // Log to Discord
         let messageArray = [
             `**Error**`,
             `\`\`\`${error}\`\`\``,
             `**Error Stack Trace**`,
             `\`\`\`${error.stack}\`\`\``
         ];
 
         let errorChannel = await fetchErrorLogChannel(ErrorLogGuildID, ErrorLogChannelID);
         await errorChannel.send({ content: `${eMessage}\n${messageArray.join(`\n`)}` });
         return;
     },






     /**
     * For logging a custom error, without an actual error object
     * 
     * @param {String} eMessage
     */
    async LogMessage(eMessage)
    {
        // Log to console
        console.log(eMessage);

        // Log to Discord
        let errorChannel = await fetchErrorLogChannel(ErrorLogGuildID, ErrorLogChannelID);
        await errorChannel.send({ content: eMessage });
        return;
    },






    /**
     * Send a custom error message to the User via the current channel
     * 
     * @param {Discord.TextChannel|Discord.NewsChannel|Discord.ThreadChannel} textBasedChannel
     * @param {String} eMessage
     */
     async LogToUserChannel(textBasedChannel, eMessage)
     {
        let embed = new Discord.MessageEmbed().setColor('#8c0000')
        .setTitle(`⚠ An error has occurred!`)
        .setDescription(eMessage);

        await textBasedChannel.send({ embeds: [embed] });
        return;
     },






     /**
     * Send a custom error message to the User via their DMs, or to the current Channel if DMs are disabled
     * 
     * @param {Discord.User} user
     * @param {Discord.TextChannel|Discord.NewsChannel|Discord.ThreadChannel} textBasedChannel
     * @param {String} eMessage
     */
      async LogToUserDM(user, textBasedChannel, eMessage)
      { 
        let embed = new Discord.MessageEmbed().setColor('#8c0000')
        .setTitle(`⚠ An error has occurred!`)
        .setDescription(eMessage);


        let userDMs = await user.createDM();
        await userDMs.send({ content: eMessage }).catch(async err => {
            // DM can't be sent for whatever reason (ie: they disabled them)
            await textBasedChannel.send({ embeds: [embed] });
        });
        return;
      }
}
