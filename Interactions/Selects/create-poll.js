const { StringSelectMenuInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const fs = require('fs');
const { DiscordClient, Collections } = require("../../constants.js");

const AddChoiceModal = new ModalBuilder().setCustomId(`create-poll-add-choice`).setTitle(`Add Choice`).addComponents([
    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId("label").setLabel("Answer Choice").setMaxLength(80).setStyle(TextInputStyle.Short).setRequired(true) ])
]);

module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "create-poll",

    // Select's Description
    Description: `Handles processing options for creation of Polls`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 3,



    /**
     * Executes the Select
     * @param {StringSelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        // Grab value
        const SelectedOption = selectInteraction.values.shift();

        switch (SelectedOption)
        {
            // Edit Embed
            case "configure-embed":
                let embedData = Collections.PollCreation.get(selectInteraction.guildId)?.embed;

                let embedModal = new ModalBuilder().setCustomId(`create-poll-embed`).setTitle(`Configure Poll Embed`).addComponents([
                    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`title`).setLabel("Poll Question").setMaxLength(256).setStyle(TextInputStyle.Short).setRequired(true).setValue(!embedData?.data.title ? "" : embedData.data.title) ]),
                    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`description`).setLabel("Poll Description").setMaxLength(2000).setStyle(TextInputStyle.Paragraph).setRequired(false).setValue(!embedData?.data.description ? "" : embedData.data.description) ]),
                    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`hex-colour`).setLabel("Embed Colour (In Hex Format)").setMaxLength(7).setPlaceholder("#ab44ff").setStyle(TextInputStyle.Short).setRequired(false).setValue(!embedData?.data.color ? "" : `${typeof embedData.data.color === 'number' ? `#${embedData.data.color.toString(16).padStart(6, '0')}` : embedData.data.color}`) ])
                ]);

                await selectInteraction.showModal(embedModal);
                break;


            // Add a new Choice
            case "add-choice":
                // Validate Poll doesn't have more than 5 Choices (limit will be increased at a later date)
                let fetchedChoices = Collections.PollCreation.get(selectInteraction.guildId).choices;
                if ( fetchedChoices.length === 5 )
                {
                    await selectInteraction.reply({ ephemeral: true, content: `Sorry, but you cannot add more than 5 (five) Choices to a single Poll at this time.` });
                    break;
                }

                // Ask for Choice Label & Emoji
                await selectInteraction.showModal(AddChoiceModal);
                break;

            
            // Remove a Choice
            case "remove-choice":
                await selectInteraction.deferUpdate(); // So original is editable later

                // Construct String Select to select which Choice to delete
                let cachedChoices = Collections.PollCreation.get(selectInteraction.guildId).choices;
                let removeChoiceSelect = new StringSelectMenuBuilder().setCustomId("create-poll-remove-choice").setMinValues(1).setMaxValues(1).setPlaceholder("Pick a Choice to remove");
                cachedChoices.forEach(choiceObj => {
                    removeChoiceSelect.addOptions(new StringSelectMenuOptionBuilder().setLabel(choiceObj.label).setValue(choiceObj.label.toLowerCase()));
                });

                // ACK to User
                await selectInteraction.followUp({ ephemeral: true, components: [new ActionRowBuilder().addComponents(removeChoiceSelect)], content: `Please use the Select Menu below to choose which Choice you would like to __remove__ from your Poll.` });

                // Temp-store interaction so we can return to it
                let pollDataRemoveChoice = Collections.PollCreation.get(selectInteraction.guildId);
                pollDataRemoveChoice.interaction = selectInteraction;
                Collections.PollCreation.set(selectInteraction.guildId, pollDataRemoveChoice);
                break;


            // Save & Display
            case "save":
                await saveAndDisplay(selectInteraction);
                break;


            // Cancel creation
            case "cancel":
                // Clear Timeout first, just in case
                let timeoutCache = Collections.PollCreation.get(selectInteraction.guildId).timeout;
                clearTimeout(timeoutCache);
                Collections.PollCreation.delete(selectInteraction.guildId);
                await selectInteraction.update({ embeds: [], components: [], content: `Creation of new Poll has been cancelled. You may now dismiss or delete this message.` });
                break;


            default:
                await selectInteraction.reply({ ephemeral: true, content: `Sorry, an error has occurred.` });
                break;
        }

        return;
    }
}



/**
 * Saves & Displays the new Poll for Members to vote in
 * @param {StringSelectMenuInteraction} selectInteraction 
 */
async function saveAndDisplay(selectInteraction)
{
    await selectInteraction.deferUpdate();

    // Bring in JSON & fetch cached data
    const PollJson = require("../../JsonFiles/Hidden/ActivePolls.json");
    const PollCache = Collections.PollCreation.get(selectInteraction.guildId);
    const ButtonCache = PollCache.buttons;
    const ChoiceCache = PollCache.choices;
    const EmbedCache = PollCache.embed;

    // Change Buttons' Custom IDs and add to Component Row(s)
    // Also, construct Choices Object for Votes to be stored in the JSON
    let temp;
    /** @type {Array<ActionRowBuilder>} */
    let buttonsArray = [];
    let choiceVoteObject = {};

    for ( let i = 0; i <= ButtonCache.length - 1; i++ )
    {
        // Grab from old Custom ID
        let tempCustomID = ButtonCache[i].data.custom_id.split("_").pop();

        if ( i === 0 )
        {
            // First Button on first row
            temp = new ActionRowBuilder().addComponents(ButtonCache[i].setCustomId(`poll_${tempCustomID}`));
            choiceVoteObject[`${ChoiceCache[i].label.toLowerCase().replace(" ", "_")}`] = 0;

            // push early if only Button
            if ( ButtonCache.length - 1 === i ) { buttonsArray.push(temp); }
        }
        else
        {
            // First row, buttons two through four
            temp.addComponents(ButtonCache[i].setCustomId(`poll_${tempCustomID}`));
            choiceVoteObject[`${ChoiceCache[i].label.toLowerCase().replace(" ", "_")}`] = 0;

            // push early if last Button
            if ( ButtonCache.length - 1 === i ) { buttonsArray.push(temp); }
        }
    }


    // Send Poll
    await selectInteraction.channel.send({ embeds: [EmbedCache], components: buttonsArray, allowedMentions: { parse: [] } })
    .then(async sentMessage => {
        // Save to JSON
        PollJson[sentMessage.id] = {
            MESSAGE_ID: sentMessage.id,
            CHANNEL_ID: sentMessage.channel.id,
            GUILD_ID: sentMessage.guild.id,
            POLL_TYPE: "MANUAL",
            CHOICE_TYPE: "BUTTON",
            EMBED: {
                TITLE: EmbedCache.data.title,
                DESCRIPTION: EmbedCache.data.description !== undefined ? EmbedCache.data.description : null,
                COLOR: EmbedCache.data.color !== undefined ? EmbedCache.data.color : null
            },
            CHOICES: choiceVoteObject,
            MEMBERS_VOTED: []
        };

        fs.writeFile('./JsonFiles/Hidden/ActivePolls.json', JSON.stringify(PollJson, null, 4), async (err) => {
            if ( err )
            {
                await selectInteraction.followUp({ ephemeral: true, content: `An error occurred while trying to save your new Poll...` });
                return;
            }
        });


        // Clean Up
        clearTimeout(PollCache.timeout);
        Collections.PollCreation.delete(selectInteraction.guildId);
        
        // ACK with message to also state how to END Polls
        await selectInteraction.editReply({ components: [], embeds: [], content: `Your new Poll has been created!\nTo end your Poll, simply right-click/long-press on the Message containing the Poll, and use the "End Poll" Command under the "Apps" section.` });
        return;
    });

    return;
}
