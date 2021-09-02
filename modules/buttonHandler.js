const Discord = require('discord.js');
const { client } = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');

const ErrorModule = require('./errorLog.js');

module.exports = {
    /**
     * Main function for the Button Handler
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction
     * 
     * @returns {Promise<*>} 
     */
    async Main(buttonInteraction)
    {
        // Left blank for custom implentation depending on use-case,
        // since Buttons are far to customisable lol

        // Potato game
        if ( buttonInteraction.customId.includes("potato") )
        {
            return await this.HotPotato(buttonInteraction);
        }
        return;
    },





    /**
     * For Potato game
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction
     */
    async HotPotato(buttonInteraction)
    {
        // Hot Potato Game!
        let nextUserID = buttonInteraction.customId.slice(7);

        // First, make sure the User *is* the current one with the Potato
        if ( buttonInteraction.user.id !== nextUserID )
        {
            return await buttonInteraction.reply({ content: `You can't pass the Potato when you don't have it!`, ephemeral: true });
        }
        else
        {
            let potatoObject = client.hotPotato.get(buttonInteraction.channelId);

            // Double check a game is ongoing, just in case
            if ( !potatoObject )
            {
                return await buttonInteraction.reply({ content: `Sorry, the Potato has already exploded!`, ephemeral: true });
            }

            let channelMembers = buttonInteraction.channel.members.filter(member => !member.user.bot);
            let nextMember = channelMembers.random();

            potatoObject.previousUserID = potatoObject.currentUserID;
            potatoObject.previousUserName = potatoObject.currentUserName;
            potatoObject.currentUserID = nextMember.user.id;
            potatoObject.currentUserName = nextMember.displayName;

            client.hotPotato.set(buttonInteraction.channelId, potatoObject);

            let messageActionRow = new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton().setCustomId(`potato_${nextMember.user.id}`).setLabel(`Pass Potato!`).setStyle('PRIMARY').setEmoji('🥔')
            );

            return await buttonInteraction.update({ content: `<@${potatoObject.previousUserID}> ( **${potatoObject.previousUserName}** ) has passed the Potato to <@${nextMember.user.id}> ( **${nextMember.displayName}** )!\n\nPress the button below to pass the Potato before it explodes!`,
            components: [messageActionRow], allowedMentions: { parse: [] } });
        }
    }
}
