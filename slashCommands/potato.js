// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

// The Button (but disabled!)
const messageActionRowDisabled = new Discord.MessageActionRow().addComponents(
    new Discord.MessageButton().setCustomId(`disabled_potato`).setLabel(`Potato Exploded!`).setStyle('DANGER').setEmoji('🥔').setDisabled(true)
);


module.exports = {
    // Slash Command's Name, MUST BE LOWERCASE AND NO SPACES
    name: 'potato',
    // Slash Command's description
    description: `Starts a Hot Potato game!`,
    // Category of Slash Command, used for Help (text) Command
    category: 'general',

    // Slash Command's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 120,


    /**
     * Returns data used for registering this Slash Command
     * 
     * @returns {Discord.ChatInputApplicationCommandData}
     */
    registerData()
    {
        const data = {};

        // Slash Command's Name, Description, and Application Command Type
        data.name = this.name;
        data.description = this.description;
        data.type = "CHAT_INPUT";
        
        return data;
    },




    /**
     * Main function that runs this Slash Command
     * 
     * @param {Discord.CommandInteraction} slashCommand Slash Command Interaction
     */
    async execute(slashCommand)
    {

        // Ensure not used in DMs
        if ( slashCommand.channel instanceof Discord.DMChannel )
        {
            return await slashCommand.reply({ content: CONSTANTS.errorMessages.SLASH_COMMAND_GUILDS_ONLY });
        }

        // Block usage in TiV
        if ( slashCommand.channel instanceof Discord.VoiceChannel )
        {
            return await slashCommand.reply({ content: CONSTANTS.errorMessages.SLASH_COMMAND_NO_TIV.replace("{{commandName}}", slashCommand.commandName), ephemeral: true });
        }



        // Ensure there isn't already an existing, on-going, Potato game in this channel
        let fetchedPotato = client.potato.get(slashCommand.channelId);
        if ( fetchedPotato )
        {
            return await slashCommand.reply({ content: `Sorry, you cannot start a new Hot Potato game when there is already one going in this Channel!`, ephemeral: true });
        }

        let channelMembers;
        let startingMember;

        // Determine which type of Text Channel this was used in
        if ( slashCommand.channel instanceof Discord.ThreadChannel )
        {
            // THREAD CHANNEL - thus go based off Thread Members
            channelMembers = slashCommand.channel.guildMembers.filter(member => !member.user.bot);
            startingMember = channelMembers.random();
        }
        else if ( slashCommand.channel instanceof Discord.TextChannel )
        {
            // GUILD TEXT CHANNEL - thus go based off most recent messages
            let recentMessages = await slashCommand.channel.messages.fetch({ limit: 25 });
            channelMembers = new Discord.Collection();

            // Filter out Bots and System Messages
            recentMessages = recentMessages.filter(message => !message.author.bot);
            recentMessages = recentMessages.filter(message => !message.system);

            // Error Checking for edge case
            if ( recentMessages.size < 1 )
            {
                return await slashCommand.reply({ content: `An error occurred while attempting to start a Hot Potato game.\nPlease try again, ensuring you aren't using this command in a channel flooded with Bot and/or System Messages.`, ephemeral: true });
            }


            // Add to collection and variable
            recentMessages.each(message => {
                // Ensure no duplicate Members
                if ( channelMembers.has(message.author.id) )
                {
                    // Continue
                }
                else
                {
                    channelMembers.set(message.author.id, message.author);
                }
            });

            startingMember = channelMembers.random();
        }
        else
        {
            // NEWS, DM, and VOICE Channels
            //    - VCs are only included as future-proofing against the upcoming Text in Voice update
            return await slashCommand.reply({ content: `Sorry, but this Slash Command can only be used within a standard Text Channel, or a Thread Channel.\nAnnouncement Channels, Direct Messages, and Voice Channels are not supported for this Command!`, ephemeral: true });
        }



        // Make Button for message
        let messageActionRow = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton().setCustomId(`potato_${startingMember instanceof Discord.GuildMember ? startingMember.user.id : startingMember.id}`)
            .setLabel(`Pass Potato!`)
            .setStyle('PRIMARY')
            .setEmoji('🥔')
        );


        // Construct temp object
        let potatoConstruct = {
            previousUserID: slashCommand.user.id,
            previousUserName: slashCommand.user.username,
            currentUserID: startingMember instanceof Discord.GuildMember ? startingMember.user.id : startingMember.id,
            currentUserName: startingMember instanceof Discord.GuildMember ? startingMember.user.username : startingMember.username,
            channelID: slashCommand.channelId
        };


        // Pick a random amount of time between 1 minute and 5 minutes (in milliseconds)
        let randomTime = Math.floor(( Math.random() * 300000 ) + 60000);


        // Send starting Message
        await slashCommand.reply({ content: `<@${slashCommand.user.id}> ( **${slashCommand.user.username}** ) has started a Hot Potato game and passed it to <@${startingMember instanceof Discord.GuildMember ? startingMember.user.id : startingMember.id}> ( **${startingMember instanceof Discord.GuildMember ? startingMember.user.username : startingMember.username}** )!\n\nPress the button attached to this message to pass the Hot Potato on before it explodes!`,
        components: [messageActionRow], allowedMentions: { parse: [], repliedUser: false } })
        .then(async (message) => {
            // Add to Collection
            client.potato.set(slashCommand.channelId, potatoConstruct);

            // End game after time chosen
            setTimeout(() => {
                // Refresh to ensure updated information
                let refreshedPotato = client.potato.get(slashCommand.channelId);

                // Update message to disable button
                slashCommand.editReply({ components: [messageActionRowDisabled], allowedMentions: { parse: [] } });

                // Send new follow-up message, in order to respect Edit Message Ratelimits and in case original message gets pushed up chat
                slashCommand.followUp({ content: `Times up!\nThe Hot Potato exploded, taking <@${refreshedPotato.currentUserID}> ( **${refreshedPotato.currentUserName}** ) with it!`, allowedMentions: { parse: [] } });

                // Delete object, ready for a new game
                client.potato.delete(slashCommand.channelId);
            }, randomTime);

            return;
        });

        delete randomTime;
        return;
    }
};
