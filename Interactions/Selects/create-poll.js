const { StringSelectMenuInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");

const AddChoiceModal = new ModalBuilder().setCustomId(`create-poll-add-choice`).setTitle(`Add Choice`).addComponents([
    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId("label").setLabel("Answer Choice").setMaxLength(80).setStyle(TextInputStyle.Short).setRequired(true) ]),
    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId("emoji").setLabel("Button Emoji").setMaxLength(200).setPlaceholder("<:grass_block:601353406577246208> or ✨").setStyle(TextInputStyle.Short).setRequired(false) ]),
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
