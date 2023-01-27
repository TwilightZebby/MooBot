const { Message, PermissionFlagsBits, ThreadAutoArchiveDuration } = require("discord.js");
const { DiscordClient } = require("../constants");

module.exports = {
    /**
     * Auto-create Threads, based off the questions posted in chat by the Truth or Dare Bot
     * @param {Message} message 
     */
    async Main(message)
    {
        // Error Check for CREATE_PUBLIC_THREADS Permission
        if ( !message.channel.permissionsFor(DiscordClient.user.id).has(PermissionFlagsBits.CreatePublicThreads) ) { return; }

        // To only make Threads off actual Questions from the ToD Bot
        if ( !message.embeds[0].footer.text.includes("Type:") ) { return; }

        // Grab Title of ToD's Embed for use in Thread name
        let ToDEmbedTitle = message.embeds.shift().title;
        if ( ToDEmbedTitle.length > 100 ) { ToDEmbedTitle = `${ToDEmbedTitle.slice(0, 95)}...`; }

        // Create the Thread!
        await message.startThread({
            name: ToDEmbedTitle, autoArchiveDuration: ThreadAutoArchiveDuration.OneHour, reason: `Auto Thread Creation for ToD Bot`
        })
        .catch(err => {
            //console.error(err);
        });

        return;
    }
}
