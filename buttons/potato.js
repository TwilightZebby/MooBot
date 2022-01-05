// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Button's Name, used as start of its Custom ID
    name: 'potato',
    // Button's description, purely for documentation
    description: `Handles passing the Potato during a Hot Potato Game`,

    // Button's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 3,



    /**
     * Main function that runs this Button
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction Button Interaction
     */
    async execute(buttonInteraction)
    {
        let nextUserID = buttonInteraction.customId.slice(7);

        // Ensure User that pressed Button is the one with the Potato
        if ( buttonInteraction.user.id !== nextUserID )
        {
            return await buttonInteraction.reply({ content: `You can't pass the Potato when you don't have it!`, ephemeral: true });
        }
        else
        {
            let potatoObject = client.potato.get(buttonInteraction.channelId);

            // Ensure game is still ongoing
            if ( !potatoObject )
            {
                return await buttonInteraction.reply({ content: `The Potato has already exploded!`, ephemeral: true });
            }


            let channelMembers;
            let nextMember;


            // Determine what kind of Text-based Channel this was used in
            if ( buttonInteraction.channel instanceof Discord.ThreadChannel )
            {
                // THREAD CHANNEL - go based off Thread's Members
                channelMembers = buttonInteraction.channel.guildMembers.filter(member => !member.user.bot); // Filter out Bots
                nextMember = channelMembers.random();
            }
            else if ( buttonInteraction.channel instanceof Discord.TextChannel )
            {
                // GUILD TEXT CHANNEL - go based off recent messages
                let recentMessages = await buttonInteraction.channel.messages.fetch({ limit: 25 });
                channelMembers = new Discord.Collection();

                // Filter out Bot Users and System Messages
                recentMessages = recentMessages.filter(message => !message.author.bot);
                recentMessages = recentMessages.filter(message => !message.system);

                // Error checking for edge case
                if ( recentMessages.size < 1 )
                {
                    return await buttonInteraction.reply({ content: `An error occurred while trying to pass the Hot Potato.\nPlease try again, ensuring this wasn't used in a channel with a flood of Bot or System Messages.`, ephemeral: true });
                }


                // Add to Collection and variable
                recentMessages.each(message => {
                    // Ensure no duplicates
                    if ( channelMembers.has(message.author.id) )
                    {
                        // Continue
                    }
                    else
                    {
                        channelMembers.set(message.author.id, message.author);
                    }
                });

                nextMember = channelMembers.random();
            }
            else
            {
                // NEWS, DM, and VOICE Channels
                //    - VCs are only included as future-proofing against the upcoming Text in Voice update
                return await buttonInteraction.reply({ content: CONSTANTS.errorMessages.BUTTON_GENERIC_FAILED_RARE, ephemeral: true });
            }


            // Update Object
            potatoObject.previousUserID = potatoObject.currentUserID;
            potatoObject.previousUserName = potatoObject.currentUserName;
            potatoObject.currentUserID = nextMember instanceof Discord.GuildMember ? nextMember.user.id : nextMember.id;
            potatoObject.currentUserName = nextMember instanceof Discord.GuildMember ? nextMember.user.username : nextMember.username;

            client.potato.set(buttonInteraction.channelId, potatoObject);

            // Construct updated Button
            let messageActionRow = new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton().setCustomId(`potato_${nextMember instanceof Discord.GuildMember ? nextMember.user.id : nextMember.id}`)
                .setLabel(`Pass Potato!`)
                .setStyle('PRIMARY')
                .setEmoji('🥔')
            );

            // Update Message
            return await buttonInteraction.update({ content: `<@${potatoObject.previousUserID}> ( **${potatoObject.previousUserName}** ) has passed the Potato to <@${nextMember instanceof Discord.GuildMember ? nextMember.user.id : nextMember.id}> ( **${nextMember instanceof Discord.GuildMember ? nextMember.user.username : nextMember.username}** )!\n\nPress the button below to pass the Potato before it explodes!`,
            components: [messageActionRow], allowedMentions: { parse: [] } });
        }
    }
};
