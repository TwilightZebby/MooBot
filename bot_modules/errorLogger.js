const { client } = require('../constants.js');
const Discord = require('discord.js');

module.exports = {
    name: "errorLogger",

    /**
     * Throw Error into Console AND Discord Error Logs Channel
     * 
     * @param {Error} error 
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async Log(error) {

        // Log to Console
        console.error(error);

        // Log to Channel
        let errorLogChannel = await client.guilds.fetch('681805468749922308');
        errorLogChannel = errorLogChannel.channels.resolve('720578054480724050');
        let messageArray = [
            `**Error**`,
            `\`\`\`${error}\`\`\``,
            `**Error Stack Trace**`,
            `\`\`\`${error.stack}\`\`\``
        ];

        return await errorLogChannel.send(messageArray.join(`\n`));

    },


    /**
     * Throws Error to Console AND Discord Channel, with a custom Message prefixing it
     * 
     * @param {Error} error 
     * @param {String} eMessage 
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async LogCustom(error, eMessage) {

        // Log to Console
        console.error(`${eMessage}\n`, error);

        // Log to Channel
        let errorLogChannel = await client.guilds.fetch('681805468749922308');
        errorLogChannel = errorLogChannel.channels.resolve('720578054480724050');
        let messageArray = [
            `**Error**`,
            `\`\`\`${error}\`\`\``,
            `**Error Stack Trace**`,
            `\`\`\`${error.stack}\`\`\``
        ];

        return await errorLogChannel.send(`${eMessage}\n${messageArray.join(`\n`)}`);

    },



    /**
     * For throwing a custom error WITHOUT an error object
     * 
     * @param {String} eMessage 
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async LogMessage(eMessage) {

        // Log to Console
        console.log(`${eMessage}`);

        // Log to Channel
        let errorLogChannel = await client.guilds.fetch('681805468749922308');
        errorLogChannel = errorLogChannel.channels.resolve('720578054480724050');

        return await errorLogChannel.send(`${eMessage}`);

    },



    /**
     * Send a custom Error message to the Discord User
     * 
     * @param {Discord.Channel} messageTarget Where to send the Message (NEEDS .send() FUNCTION)
     * @param {String} eMessageContent The Custom message itself
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async LogToUser(messageTarget, eMessageContent) {

        const embed = new Discord.MessageEmbed();
        embed.setColor('#9c0000')
        .setTitle(`⚠️ An error has occurred!`)
        .setDescription(`${eMessageContent}`);

        return await messageTarget.send(embed);

    }

};