const { ApplicationCommandType, ApplicationCommandData, ContextMenuCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    // Command's Name
    //     Can use sentence casing and spaces
    Name: "End Poll",

    // Command's Description
    Description: `Use to end an active Poll`,

    // Command's Category
    Category: "MANAGEMENT",

    // Context Command Type
    //     One of either ApplicationCommandType.Message, ApplicationCommandType.User
    CommandType: ApplicationCommandType.Message,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 30,

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "GUILD",



    /**
     * Returns data needed for registering Context Command onto Discord's API
     * @returns {ApplicationCommandData}
     */
    registerData()
    {
        /** @type {ApplicationCommandData} */
        const Data = {};

        Data.name = this.Name;
        Data.description = "";
        Data.type = this.CommandType;
        Data.dmPermission = false;
        Data.defaultMemberPermissions = PermissionFlagsBits.ManageChannels;

        return Data;
    },



    /**
     * Executes the Context Command
     * @param {ContextMenuCommandInteraction} contextCommand 
     */
    async execute(contextCommand)
    {
        // Fetch Message and JSON
        const SourceMessage = contextCommand.options.getMessage("message", true);
        let pollJson = require("../../JsonFiles/Hidden/ActivePolls.json");

        // Validate Message does contain a Poll made with this Bot
        if ( !pollJson[SourceMessage.id] )
        {
            await contextCommand.reply({ ephemeral: true, content: `Sorry, but this Command can only be used on Messages containing active Polls!` });
            return;
        }


        // Grab current votes, total votes, and what the choices were
        const OriginalChoices = SourceMessage.embeds[0].fields.shift().value.split(`• `);
        const FinalChoiceVotes = pollJson[SourceMessage.id]["CHOICES"];
        /** @type {Number} */
        const TotalVotes = pollJson[SourceMessage.id]["MEMBERS_VOTED"].length;

        
        // Calculate & map votes & percentages to their Choices
        let mappedResults = [];
        OriginalChoices.forEach(ChoiceString => {
            if ( ChoiceString != "" && ChoiceString != " " )
            {
                ChoiceString = ChoiceString.trim();
                let temp = "";
                let choiceValue = ChoiceString.toLowerCase().replace(" ", "-");
                
                // Choice Name (For UX)
                temp += `• **${ChoiceString}** `;
                // Number of Votes for Choice
                temp += `- ${FinalChoiceVotes[choiceValue]} Vote${FinalChoiceVotes[choiceValue] === 1 ? "" : "s"} `;
                // Percentage of Total Votes
                temp += `(~${((FinalChoiceVotes[choiceValue] / TotalVotes) * 100).toFixed(1)}%)`

                mappedResults.push(temp);
            }
        });


        // Edit into Embed
        let updateEmbed = EmbedBuilder.from(SourceMessage.embeds[0]);
        updateEmbed = updateEmbed.spliceFields(0, 3);
        updateEmbed.addFields({ name: `Poll Choices:`, value: mappedResults.join(`\n`) });
        updateEmbed.setFooter({ text: `Final Total Votes: ${TotalVotes}` });

        // Update Message
        await SourceMessage.edit({ components: [], embeds: [updateEmbed] })
        .then(async updatedMessage => {
            // Purge from JSON
            delete pollJson[SourceMessage.id];
            fs.writeFile('./JsonFiles/Hidden/ActivePolls.json', JSON.stringify(pollJson, null, 4), async (err) => {
                if ( err )
                {
                    await contextCommand.reply({ ephemeral: true, content: `An error occurred while trying to end your Poll...` });
                    return;
                }
            });

            await contextCommand.reply({ ephemeral: true, content: `Successfully ended your Poll.\nNew votes cannot be submitted for this Poll any more.` });
            return;
        });

        return;
    }
}
