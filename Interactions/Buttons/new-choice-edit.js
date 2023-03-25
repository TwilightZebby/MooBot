const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { Collections } = require("../../constants.js");

module.exports = {
    // Button's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "new-choice-edit",

    // Button's Description
    Description: `Handles editing Choices during Poll creation`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 3,



    /**
     * Executes the Button
     * @param {ButtonInteraction} buttonInteraction 
     */
    async execute(buttonInteraction)
    {
        // Grab Choice and cache
        const ChoiceCustomID = buttonInteraction.customId.split("_").pop();
        const ChoiceCache = Collections.PollCreation.get(buttonInteraction.guildId).choices;
        let currentLabel = null;
        let currentEmoji = null;

        // Grab current Choice data
        for ( let i = 0; i <= ChoiceCache.length - 1; i++ )
        {
            if ( ChoiceCache[i].label.toLowerCase().replace(" ", "-") === ChoiceCustomID )
            {
                currentLabel = ChoiceCache[i].label;
                currentEmoji = ChoiceCache[i].emoji;
                break;
            }
        }


        // Construct Modal
        const EditChoiceModal = new ModalBuilder().setCustomId(`create-poll-edit-choice_${ChoiceCustomID}`).setTitle("Edit Choice").addComponents([
            new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId("label").setLabel("Answer Choice").setMaxLength(80).setStyle(TextInputStyle.Short).setRequired(true).setValue(currentLabel != null ? currentLabel : "") ]),
            new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId("emoji").setLabel("Button Emoji").setMaxLength(200).setPlaceholder("<:grass_block:601353406577246208> or ✨").setStyle(TextInputStyle.Short).setRequired(false).setValue(currentEmoji != null ? currentEmoji : "") ])
        ]);

        // ACK
        await buttonInteraction.showModal(EditChoiceModal);
        return;
    }
}
