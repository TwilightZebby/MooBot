const Discord = require('discord.js');
const { client } = require('../constants.js');


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
                return await slashInteraction.editReply({ embeds: [failEmbed], components: [] });
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

                    await slashInteraction.editReply({ embeds: [jailEmbed], components: [] });

                    // Set 1 hour timer for Horny Jail
                    setTimeout(() => {
                        client.jail.delete(suspectMember.id);
                    }, 3.6e+6);
                }

                // Let suspect go free
                client.suspect.delete(suspectMember.id);
                let freeEmbed = new Discord.MessageEmbed().setDescription(`The Jury was undecided and couldn't agree on a verdict. Thus, <@${suspectMember.id}> (**${suspectMember.displayName}**) is allowed to go free *for the time being*`)
                .setColor('GREEN');

                return await slashInteraction.editReply({ embeds: [freeEmbed], components: [] });
            }
            else if ( finalSuspect.votesYes < finalSuspect.votesNo )
            {
                // More of the Jury voted Innocent over Guilty
                client.suspect.delete(suspectMember.id);
                let freeEmbed = new Discord.MessageEmbed().setDescription(`The Jury has decided their verdict. <@${suspectMember.id}> (**${suspectMember.displayName}**) was found innocent can is set free!`)
                .setColor('GREEN');

                return await slashInteraction.editReply({ embeds: [freeEmbed], components: [] });
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

                await slashInteraction.editReply({ embeds: [jailEmbed], components: [] });

                // Set 1 hour timer for Horny Jail
                setTimeout(() => {
                    client.jail.delete(suspectMember.id);
                }, 3.6e+6);
            }
        }, 300000);

    }
}
