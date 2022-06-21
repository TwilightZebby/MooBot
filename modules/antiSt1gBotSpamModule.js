// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const { St1gBotUserID } = require('../config.js');


module.exports = {
    /**
     * Main function for the Module
     * 
     * @param {Discord.Message} message
     */
    async main(message)
    {
        // ****************************************
        // Not returning errors to the User here since
        // that would result in possible chat spam.
        // ****************************************
        
        // Error check for MANAGE_MESSAGES Permission
        if ( !message.channel.permissionsFor(message.guild.me).has(Discord.Permissions.FLAGS.MANAGE_MESSAGES) ) { return; }

        // If its the Birthday Role message, don't delete!
        if ( message.embeds )
        {
            if ( message.embeds[0].fields )
            {
                if ( message.embeds?.shift().fields?.shift().name.toLowerCase().includes("birthday") ) { return; }
            }
        }

        // Check to see if St1gBot is spamming
        let messageCollection = await message.channel.messages.fetch({ limit: 25 });
        // Filter out messages *not* sent by St1gBot
        messageCollection = messageCollection.filter(message => message.author.id === St1gBotUserID);
        
        // Check Collection size, if more than one, delete latest!
        if ( messageCollection.size > 1 )
        {
            try {
                await message.delete();
            } catch (err) {
                //console.error(err);
            }
        }
        
        return;
    }
}
