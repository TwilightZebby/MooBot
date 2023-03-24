const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    // Button's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "poll",

    // Button's Description
    Description: `Handles vote submissions on Polls`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 20,



    /**
     * Executes the Button
     * @param {ButtonInteraction} buttonInteraction 
     */
    async execute(buttonInteraction)
    {
        // Fetch data needed
        const MemberVoting = buttonInteraction.member;
        const ChoiceVoted = buttonInteraction.customId.split("_").pop();
        let pollJson = require("../../JsonFiles/Hidden/ActivePolls.json");

        // Check if Member has already voted on this poll
        if ( pollJson[buttonInteraction.message.id]["MEMBERS_VOTED"].includes(MemberVoting.id) )
        {
            await buttonInteraction.reply({ ephemeral: true, content: `You have already voted on this Poll!\nIt is not possible to vote multiple times or to change your vote on Polls made with this Bot.` });
            return;
        }


        // Add Vote
        pollJson[buttonInteraction.message.id]["CHOICES"][ChoiceVoted] += 1;
        pollJson[buttonInteraction.message.id]["MEMBERS_VOTED"].push(MemberVoting.id);
        
        // Save to JSON
        fs.writeFile('./JsonFiles/Hidden/ActivePolls.json', JSON.stringify(pollJson, null, 4), async (err) => {
            if ( err )
            {
                await buttonInteraction.reply({ ephemeral: true, content: `Sorry, an error has occurred while trying to process your Poll Vote...` });
                return;
            }
        });


        // Edit total votes into Embed
        const UpdatePollEmbed = EmbedBuilder.from(buttonInteraction.message.embeds.pop());
        UpdatePollEmbed.setFooter({ text: `Current Total Votes: ${pollJson[buttonInteraction.message.id]["MEMBERS_VOTED"].length}` });
        
        await buttonInteraction.update({ embeds: [UpdatePollEmbed] }).then(async updatedMessage => {
            // ACK to Member that their vote has been submitted
            await buttonInteraction.followUp({ ephemeral: true, content: `✅ Successfully voted for **${ChoiceVoted.replace("-", " ")}**` });
            return;
        });

        return;
    }
}
