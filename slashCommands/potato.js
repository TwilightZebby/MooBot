const Discord = require('discord.js');
const { client } = require('../constants.js');


module.exports = {
    name: 'potato',
    description: `Starts a Hot Potato game!`,
    
    // Cooldown is in seconds
    cooldown: 60,

    // Uncomment for making the command only usable in DMs with the Bot
    //    - DO NOT have both this AND "guildOnly" uncommented, only one or neither
    //dmOnly: true,

    // Uncomment for making the command only usable in Servers
    //   - DO NOT have both this AND "dmOnly" uncommented, only one or neither
    guildOnly: true,


    /**
     * Returns data to be used for registering the Slash Command
     * 
     * @returns {Discord.ApplicationCommandData} 
     */
    async registerData() {

        const data = {};
        data.name = this.name;
        data.description = this.description;
        data.type = "CHAT_INPUT"; // Slash Command
        data.defaultPermission = false;

        return data;

    },


    /**
     * Entry point that runs the slash command
     * 
     * @param {Discord.CommandInteraction} slashInteraction Slash Command Interaction
     */
    async execute(slashInteraction) {

        // If there is an existing Potato game on-going in this channel, don't start a new one!
        let fetchedPotato = client.potato.get(slashInteraction.channelId);
        if ( fetchedPotato )
        {
            return await slashInteraction.reply({ content: `Whoops, you cannot start a new Hot Potato game in this channel as there is currently one still going!`, ephemeral: true });
        }

        let channelMembers;
        let startingMember;


        // Determine what type of text based channel this was used in
        if ( slashInteraction.channel instanceof Discord.ThreadChannel )
        {
            // THREAD CHANNEL
            //     Go based off Thread's Members
            channelMembers = slashInteraction.channel.guildMembers.filter(member => !member.user.bot);
            startingMember = channelMembers.random();
        }
        else if ( slashInteraction.channel instanceof Discord.TextChannel )
        {
            // (regular) TEXT CHANNEL
            //     Go based off recent messages as I cannot be bothered to try and make an auto-cleaning member cache :S
            let recentMessages = await slashInteraction.channel.messages.fetch({ limit: 25 });
            channelMembers = new Discord.Collection();

            // Remove Bot users & system messages
            recentMessages = recentMessages.filter(message => !message.author.bot);
            recentMessages = recentMessages.filter(message => !message.system);

            // Error checking
            if ( recentMessages.size < 1 )
            {
                return await slashInteraction.reply({ content: `Whoops! An error occured while attempting to start the Hot Potato game!`, ephemeral: true });
            }

            // Do the thing
            recentMessages.each(message => {

                // Make sure there isn't duplicate Members
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
            // NEWS AND DM CHANNELS
            return await slashInteraction.reply({ content: `Sorry, but this Slash Command can only be used within Text or Thread Channels, not in Announcement Channels nor DMs!`, ephemeral: true });
        }




        // Thy Button
        let messageActionRow = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton().setCustomId(`potato_${startingMember instanceof Discord.GuildMember ? startingMember.user.id : startingMember.id}`).setLabel(`Pass Potato!`).setStyle('PRIMARY').setEmoji('🥔')
        );

        // Construct Object
        let potatoConstruct = {
            previousUserID: slashInteraction.user.id,
            previousUserName: slashInteraction.user.username,
            currentUserID: startingMember instanceof Discord.GuildMember ? startingMember.user.id : startingMember.id,
            currentUserName: startingMember instanceof Discord.GuildMember ? startingMember.user.username : startingMember.username,
            channelID: slashInteraction.channelId
        };

        // Pick a random amount of time between 1 minute and 5 minutes (in milliseconds)
        let randomTime = Math.floor(( Math.random() * 300000 ) + 60000);




        await slashInteraction.reply({ content: `<@${slashInteraction.user.id}> ( **${slashInteraction.user.username}** ) has started a Hot Potato game and passed it to <@${startingMember instanceof Discord.GuildMember ? startingMember.user.id : startingMember.id}> ( **${startingMember instanceof Discord.GuildMember ? startingMember.user.username : startingMember.username}** )!\n\nPress the button attached to this message to pass the Hot Potato on before it explodes!`,
        components: [messageActionRow], allowedMentions: { parse: [], repliedUser: false } })
        .then(async (message) => {

            // Add to Collection
            client.potato.set(slashInteraction.channelId, potatoConstruct);

            setTimeout(() => {
                // refetch to make sure we have latest current user
                let refetchedPotato = client.potato.get(slashInteraction.channelId);

                // Update message
                slashInteraction.editReply({ content: `Times up! The Hot Potato has exploded, taking <@${refetchedPotato.currentUserID}> ( **${refetchedPotato.currentUserName}** ) with it!`, components: [], allowedMentions: { parse: [] } });

                // Delete object, ready for new game
                client.potato.delete(slashInteraction.channelId);
            }, randomTime);

            return;
        });

        delete randomTime;

        return;

    },














    /**
     * For handling of the button :P
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction
     */
    async HandleButton(buttonInteraction)
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
            let potatoObject = client.potato.get(buttonInteraction.channelId);
 
            // Double check a game is ongoing, just in case
            if ( !potatoObject )
            {
                return await buttonInteraction.reply({ content: `Sorry, the Potato has already exploded!`, ephemeral: true });
            }



            let channelMembers;
            let nextMember;


            // Determine what type of text based channel this was used in
            if ( buttonInteraction.channel instanceof Discord.ThreadChannel )
            {
                // THREAD CHANNEL
                //     Go based off Thread's Members
                channelMembers = buttonInteraction.channel.guildMembers.filter(member => !member.user.bot);
                nextMember = channelMembers.random();
            }
            else if ( buttonInteraction.channel instanceof Discord.TextChannel )
            {
                // (regular) TEXT CHANNEL
                //     Go based off recent messages as I cannot be bothered to try and make an auto-cleaning member cache :S
                let recentMessages = await buttonInteraction.channel.messages.fetch({ limit: 25 });
                channelMembers = new Discord.Collection();

                // Remove Bot users & system messages
                recentMessages = recentMessages.filter(message => !message.author.bot);
                recentMessages = recentMessages.filter(message => !message.system);

                // Do the thing
                recentMessages.each(message => {

                    // Make sure there isn't duplicate Members
                    if ( channelMembers.has(message.author.id) )
                    {
                        // Continue
                    }
                    else
                    {
                        channelMembers.set(message.author.id, message.author);
                    }
                });

                // Error checking
                if ( channelMembers.size < 1 )
                {
                    return await buttonInteraction.reply({ content: `Whoops! An error occured while attempting to pass the Hot Potato!`, ephemeral: true });
                }
            
                nextMember = channelMembers.random();
            }
            else
            {
                // NEWS AND DM CHANNELS
                return await buttonInteraction.reply({ content: `I don't understand how you managed to get this button in an Announcement Channel or DM, but you shouldn't have!`, ephemeral: true });
            }



 
            potatoObject.previousUserID = potatoObject.currentUserID;
            potatoObject.previousUserName = potatoObject.currentUserName;
            potatoObject.currentUserID = nextMember instanceof Discord.GuildMember ? nextMember.user.id : nextMember.id;
            potatoObject.currentUserName = nextMember instanceof Discord.GuildMember ? nextMember.user.username : nextMember.username;
 
            client.potato.set(buttonInteraction.channelId, potatoObject);
 
            let messageActionRow = new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton().setCustomId(`potato_${nextMember instanceof Discord.GuildMember ? nextMember.user.id : nextMember.id}`).setLabel(`Pass Potato!`).setStyle('PRIMARY').setEmoji('🥔')
            );
 
            return await buttonInteraction.update({ content: `<@${potatoObject.previousUserID}> ( **${potatoObject.previousUserName}** ) has passed the Potato to <@${nextMember instanceof Discord.GuildMember ? nextMember.user.id : nextMember.id}> ( **${nextMember instanceof Discord.GuildMember ? nextMember.user.username : nextMember.username}** )!\n\nPress the button below to pass the Potato before it explodes!`,
            components: [messageActionRow], allowedMentions: { parse: [] } });
        }
    }
}
