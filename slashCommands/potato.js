const Discord = require('discord.js');
const { client } = require('../constants.js');


module.exports = {
    name: 'potato',
    description: `Starts a Hot Potato game, where the last one with the Potato loses!`,
    
    // Cooldown is in seconds
    cooldown: 3,

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

        return data;

    },


    /**
     * Entry point that runs the slash command
     * 
     * @param {Discord.CommandInteraction} slashInteraction Slash Command Interaction
     */
    async execute(slashInteraction) {

        // If there is an existing Potato game on-going in this channel, don't start a new one!
        let fetchedPotato = client.hotPotato.get(slashInteraction.channelId);
        if ( fetchedPotato )
        {
            return await slashInteraction.reply({ content: `Whoops, you cannot start a new Hot Potato game in this channel as there is currently one still going!`, ephemeral: true });
        }

        // Pick a random starting User from the channel
        let channelMembers = slashInteraction.channel.members.filter(member => !member.user.bot);
        let startingMember = channelMembers.random();

        // Thy Button
        let messageActionRow = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton().setCustomId(`potato_${startingMember.user.id}`).setLabel(`Pass Potato!`).setStyle('PRIMARY').setEmoji('🥔')
        );

        // Construct Object
        let potatoConstruct = {
            previousUserID: slashInteraction.user.id,
            previousUserName: slashInteraction.member.displayName,
            currentUserID: startingMember.user.id,
            currentUserName: startingMember.displayName,
            channelID: slashInteraction.channelId,
            timeout: null
        };

        // Pick a random amount of time between 1 minute and 5 minutes (in milliseconds)
        let randomTime = Math.floor(( Math.random() * 300000 ) + 60000);

        await slashInteraction.reply({ content: `<@${slashInteraction.user.id}> ( **${slashInteraction.member.displayName}** ) has started a Hot Potato game and passed it to <@${startingMember.user.id}> ( **${startingMember.displayName}** )!\n\nPress the button attached to this message to pass the Hot Potato on before it explodes!`,
        components: [messageActionRow], allowedMentions: { parse: [], repliedUser: false } })
        .then(async (message) => {
            let potatoTimeout = setTimeout(() => {
                // refetch to make sure we have latest current user
                let refetchedPotato = client.hotPotato.get(slashInteraction.channelId);

                // Update message
                slashInteraction.editReply({ content: `Times up! The Hot Potato has exploded, taking <@${refetchedPotato.currentUserID}> ( **${refetchedPotato.currentUserName}** ) with it!`, components: [], allowedMentions: { parse: [] } });

                // Delete object, ready for new game
                client.hotPotato.delete(slashInteraction.channelId);
            }, randomTime);

            // Add to Collection
            potatoConstruct.timeout = potatoTimeout;
            client.hotPotato.set(slashInteraction.channelId, potatoConstruct);
            return;
        });

        delete randomTime;

        return;

    }
}
