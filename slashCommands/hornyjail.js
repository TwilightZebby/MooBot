const Discord = require('discord.js');
const { client } = require('../constants.js');

// Disabled Buttons
const suspectPollRowsDisabled = [
    new Discord.MessageActionRow().addComponents([
        new Discord.MessageButton().setCustomId(`jailyesdisabled`).setLabel("Guilty").setStyle('DANGER').setDisabled(true),
        new Discord.MessageButton().setCustomId(`jailnodisabled`).setLabel("Innocent").setStyle('SUCCESS').setDisabled(true)
    ])
];


module.exports = {
    name: 'hornyjail',
    description: `Found a peep being naughty? Send them straight to Horny Jail!`,
    
    // Cooldown is in seconds
    cooldown: 60,

    // Uncomment for making the command only usable in DMs with the Bot
    //    - DO NOT have both this AND "guildOnly" uncommented, only one or neither
    //dmOnly: true,

    // Uncomment for making the command only usable in Servers
    //   - DO NOT have both this AND "dmOnly" uncommented, only one or neither
    guildOnly: true,

    // Slash Command Permission object
    /* slashPermissions: [
        {
            id: "136391162876395520",
            type: 2,
            permission: true
        },
        {
            id: "156482326887530498",
            type: 2,
            permission: true
        }
    ], */


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
        //data.defaultPermission = false;
        data.options = [
            {
                type: "USER",
                name: "suspect",
                description: "The naughty peep you want to send to jail",
                required: true
            }
        ];

        return data;

    },


    /**
     * Entry point that runs the slash command
     * 
     * @param {Discord.CommandInteraction} slashInteraction Slash Command Interaction
     */
    async execute(slashInteraction) {

        let suspectMember = slashInteraction.options.getMember("suspect", true);

        // Make sure suspect isn't already in Jail or has an active vote ongoing
        if ( client.jail.has(suspectMember.id) )
        {
            return await slashInteraction.reply({ content: `<@${suspectMember.id}> (**${suspectMember.displayName}**) is already in Horny Jail!`, ephemeral: true });
        }

        if ( client.suspect.has(suspectMember.id) )
        {
            return await slashInteraction.reply({ content: `<@${suspectMember.id}> (**${suspectMember.displayName}**) already has an ongoing trial against them!`, ephemeral: true });
        }

        // Prevent being used on Bots
        if ( suspectMember.user.bot )
        {
            return await slashInteraction.reply({ content: `Sorry, but you cannot accuse Bots of being horny!`, ephemeral: true });
        }

        // Make Buttons

        let suspectPollRows = [
            new Discord.MessageActionRow().addComponents([
                new Discord.MessageButton().setCustomId(`jail_yes_${suspectMember.id}`).setLabel("Guilty").setStyle('DANGER'),
                new Discord.MessageButton().setCustomId(`jail_no_${suspectMember.id}`).setLabel("Innocent").setStyle('SUCCESS')
            ])
        ];

        // Construct Embed
        let suspectEmbed = new Discord.MessageEmbed().setDescription(`<@${slashInteraction.user.id}> (**${slashInteraction.member.displayName}**) is accusing <@${suspectMember.id}> (**${suspectMember.displayName}**) of being horny and demands they go to Horny Jail!\n\nWhat will you, the Jury, deem?`)
        .addFields({
            name: `Innocent Votes`,
            value: `0`
        }, {
            name: `Guilty Votes`,
            value: `0`
        })
        .setColor('RANDOM');

        // Add to Collection
        let suspectConstruct = {
            suspectID: suspectMember.id,
            accuserID: slashInteraction.user.id,
            votesYes: [],
            votesNo: [],
            suspectPleads: null,
        };

        client.suspect.set(suspectMember.id, suspectConstruct);

        await slashInteraction.reply({ embeds: [suspectEmbed], components: suspectPollRows });


        // After 5 minutes, count votes
        setTimeout(async () => {
            let finalSuspect = client.suspect.get(suspectMember.id);

            // Error checking
            if ( !finalSuspect )
            {
                client.suspect.delete(suspectMember.id);
                let failEmbed = new Discord.MessageEmbed().setDescription(`Whoops, something went wrong while attempting to determine <@${suspectMember.id}>'s (**${suspectMember.displayName}**'s) guiltiness... Guess they are going free, *for now*`)
                .setColor('BLURPLE');
                await slashInteraction.editReply({ components: [suspectPollRowsDisabled] });
                return await slashInteraction.followUp({ embeds: [failEmbed] });
            }


            // Count votes
            if ( finalSuspect.votesYes === finalSuspect.votesNo )
            {
                // Jury is tied/undecided
                if ( finalSuspect.suspectPleads === "guilty" )
                {
                    // Suspect pleaded guilty - send to Horny Jail
                    // First, add to Collection
                    let jailConstruct = {
                        hornyID: suspectMember.id,
                        accuserID: slashInteraction.user.id
                    };
                    client.jail.set(suspectMember.id, jailConstruct);
                    client.suspect.delete(suspectMember.id);

                    // Message
                    let jailEmbed = new Discord.MessageEmbed().setDescription(`The Jury was undecided, however, since <@${suspectMember.id}>'s (**${suspectMember.displayName}**'s) pleeded guilty, they shall go to Horny Jail anyways!`)
                    .setColor('RED');

                    await slashInteraction.editReply({ components: [suspectPollRowsDisabled] });
                    await slashInteraction.followUp({ embeds: [jailEmbed] });

                    // Set 1 hour timer for Horny Jail
                    setTimeout(() => {
                        client.jail.delete(suspectMember.id);
                    }, 3.6e+6);
                }

                // Let suspect go free
                client.suspect.delete(suspectMember.id);
                let freeEmbed = new Discord.MessageEmbed().setDescription(`The Jury was undecided and couldn't agree on a verdict. Thus, <@${suspectMember.id}> (**${suspectMember.displayName}**) is allowed to go free *for the time being*`)
                .setColor('GREEN');

                await slashInteraction.editReply({ components: [suspectPollRowsDisabled] });
                return await slashInteraction.followUp({ embeds: [freeEmbed] });
            }
            else if ( finalSuspect.votesYes < finalSuspect.votesNo )
            {
                // More of the Jury voted Innocent over Guilty
                client.suspect.delete(suspectMember.id);
                let freeEmbed = new Discord.MessageEmbed().setDescription(`The Jury has decided their verdict. <@${suspectMember.id}> (**${suspectMember.displayName}**) was found innocent can is set free!`)
                .setColor('GREEN');

                await slashInteraction.editReply({ components: [suspectPollRowsDisabled] });
                return await slashInteraction.followUp({ embeds: [freeEmbed] });
            }
            else if ( finalSuspect.votesYes > finalSuspect.votesNo )
            {
                // More of the Jury voted Guilty over Innocent
                // Send to Horny Jail
                // First, add to Collection
                let jailConstruct = {
                    hornyID: suspectMember.id,
                    accuserID: slashInteraction.user.id
                };
                client.jail.set(suspectMember.id, jailConstruct);
                client.suspect.delete(suspectMember.id);

                // Message
                let jailEmbed = new Discord.MessageEmbed().setDescription(`The Jury has decided their verdict. <@${suspectMember.id}>'s (**${suspectMember.displayName}**'s) was found guilty and shall be sent to Horny Jail!`)
                .setColor('RED');

                await slashInteraction.editReply({ components: [suspectPollRowsDisabled] });
                await slashInteraction.followUp({ embeds: [jailEmbed] });

                // Set 1 hour timer for Horny Jail
                setTimeout(() => {
                    client.jail.delete(suspectMember.id);
                }, 3.6e+6);
            }
        }, 300000);

    },











    /**
     * Handles the Voting buttons
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction
     */
    async HandleVotingButtons(buttonInteraction)
    {
        // Grab Button's Custom ID & data we need
        let receivedCustomId = buttonInteraction.customId.slice(5);
        let receivedCustomData = receivedCustomId.split("_");
        let receivedVote = receivedCustomData.shift();
        let receivedSuspect = await buttonInteraction.guild.members.fetch(receivedCustomData.shift());

        // Grab from Collection
        let fetchedCollection = client.suspect.get(receivedSuspect.id);

        /* let suspectConstruct = {
            suspectID: suspectMember.id,
            accuserID: slashInteraction.user.id,
            votesYes: [],
            votesNo: [],
            suspectPleads: null,
        }; */


        // Initial check that they haven't already voted
        if ( fetchedCollection.votesNo.includes(buttonInteraction.user.id) || fetchedCollection.votesYes.includes(buttonInteraction.user.id) )
        {
            return await buttonInteraction.reply({ content: `You have already cast your vote!`, ephemeral: true });
        }


        // Suspect is voting for themselves, take vote as what they pleed
        if ( receivedSuspect.id === buttonInteraction.user.id )
        {
            if ( fetchedCollection.suspectPleads === null )
            {
                // Edit Collection
                let plead = receivedVote === "yes" ? "Guilty" : "Innocent";
                fetchedCollection.suspectPleads = plead;
                client.suspect.set(receivedSuspect.id, fetchedCollection);

                // Add to existing embed
                let messageEmbed = buttonInteraction.message.embeds.shift();
                messageEmbed.addFields({ name: `Suspect has pleaded`, value: `${plead}` });

                // Edit into message
                return await buttonInteraction.update({ embeds: [messageEmbed] });
            }
            else
            {
                // Suspect has already declared their plea!
                return await buttonInteraction.reply({ content: `Sorry, but you've already declared your plea!`, ephemeral: true });
            }

        }
        // Accuser is voting, deny vote
        else if ( fetchedCollection.accuserID === buttonInteraction.user.id )
        {
            return await buttonInteraction.reply({ content: `You can't place a vote when you're the Accuser!`, ephemeral: true });
        }
        // Vote Yes (Guilty)
        else if ( receivedVote === "yes" )
        {
            // Add to collection
            fetchedCollection.votesYes.push(buttonInteraction.user.id);
            client.suspect.set(receivedSuspect.id, fetchedCollection);

            // Update Embed
            let messageEmbed = buttonInteraction.message.embeds.shift();
            messageEmbed.fields[1].value = fetchedCollection.votesYes.size;

            // Update message
            return await buttonInteraction.update({ embeds: [messageEmbed] });
        }
        // Vote No (Innocent)
        else if ( receivedVote === "no" )
        {
            // Add to collection
            fetchedCollection.votesNo.push(buttonInteraction.user.id);
            client.suspect.set(receivedSuspect.id, fetchedCollection);

            // Update Embed
            let messageEmbed = buttonInteraction.message.embeds.shift();
            messageEmbed.fields[0].value = fetchedCollection.votesNo.size;

            // Update message
            return await buttonInteraction.update({ embeds: [messageEmbed] });
        }
    }
}
