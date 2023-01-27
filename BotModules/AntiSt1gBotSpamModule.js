const { Message, PermissionFlagsBits } = require("discord.js");
const { DiscordClient } = require("../constants.js");
const { St1gBotUserID, St1gCheckerBotUserID } = require("../config.js");

module.exports = {
    /**
     * If St1gBots is/are spamming, purge their spam
     * @param {Message} message 
     */
    async Main(message)
    {
        // ****************************************
        // Not returning errors to the User here since
        // that would result in possible chat spam.
        // ****************************************

        // Exempt when grace is active
        if ( DiscordClient.st1gBotGrace === true ) { return; }

        // Error Check for MANAGE_MESSAGES Permission
        if ( !message.channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.ManageMessages) ) { return; }

        // Don't delete Birthday Messages!
        if ( message.embeds )
        {
            if ( message.embeds[0]?.fields )
            {
                if ( message.embeds[0]?.fields?.name )
                {
                    if ( message.embeds?.shift().fields?.shift().name.toLowerCase().includes("birthday") ) { return; }
                }
            }
        }

        // Check for St1gBot Spam
        let messageCollection = await message.channel.messages.fetch({ limit: 25 });
        // Filter out messages *not* sent by either of the St1gBots
        let st1gBotCollection = messageCollection.filter(message => message.author.id === St1gBotUserID);
        let st1gCheckerBotCollection = messageCollection.filter(message => message.author.id === St1gCheckerBotUserID);

        // If more than one, delete latest!
        if ( st1gBotCollection.size > 1 )
        {
            try { await message.delete(); }
            catch (err) {
                //console.error(err);
            }
        }

        if ( st1gCheckerBotCollection.size > 1 )
        {
            try { await message.delete(); }
            catch (err) {
                //console.error(err);
            }
        }

        return;
    }
}
