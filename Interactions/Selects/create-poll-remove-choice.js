const { StringSelectMenuInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Collections } = require("../../constants.js");

const MenuSelect = new ActionRowBuilder().addComponents([
    new StringSelectMenuBuilder().setCustomId(`create-poll`).setMinValues(1).setMaxValues(1).setPlaceholder("Please select an action").setOptions([
        //new StringSelectMenuOptionBuilder().setLabel("Set Poll Type").setValue("set-type").setDescription("Change how the Poll will behave once saved").setEmoji(`🔧`),
        new StringSelectMenuOptionBuilder().setLabel("Configure Embed").setValue("configure-embed").setDescription("Set the Question, Description, and Colour of the Poll").setEmoji(`<:StatusRichPresence:842328614883295232>`),
        new StringSelectMenuOptionBuilder().setLabel("Add Choice").setValue("add-choice").setDescription("Add a Choice to the Poll").setEmoji(`<:plusGrey:997752068439818280>`),
        new StringSelectMenuOptionBuilder().setLabel("Remove Choice").setValue("remove-choice").setDescription("Remove a Choice from the Poll").setEmoji(`<:IconDeleteTrashcan:750152850310561853>`),
        new StringSelectMenuOptionBuilder().setLabel("Save & Display").setValue("save").setDescription("Saves the new Poll, and displays it for Members to use").setEmoji(`<:IconActivity:815246970457161738>`),
        new StringSelectMenuOptionBuilder().setLabel("Cancel Creation").setValue("cancel").setDescription("Cancels creation of this Poll").setEmoji(`❌`)
    ])
]);

const NoChoicesMenuSelect = new ActionRowBuilder().addComponents([
    new StringSelectMenuBuilder().setCustomId(`create-poll`).setMinValues(1).setMaxValues(1).setPlaceholder("Please select an action").setOptions([
        //new StringSelectMenuOptionBuilder().setLabel("Set Poll Type").setValue("set-type").setDescription("Change how the Poll will behave once saved").setEmoji(`🔧`),
        new StringSelectMenuOptionBuilder().setLabel("Configure Embed").setValue("configure-embed").setDescription("Set the Question, Description, and Colour of the Poll").setEmoji(`<:StatusRichPresence:842328614883295232>`),
        new StringSelectMenuOptionBuilder().setLabel("Add Choice").setValue("add-choice").setDescription("Add a Choice to the Poll").setEmoji(`<:plusGrey:997752068439818280>`),
        new StringSelectMenuOptionBuilder().setLabel("Cancel Creation").setValue("cancel").setDescription("Cancels creation of this Poll").setEmoji(`❌`)
    ])
]);


module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "create-poll-remove-choice",

    // Select's Description
    Description: `Handles removing the specified Choice from a Poll in construction`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 3,



    /**
     * Executes the Select
     * @param {StringSelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        await selectInteraction.deferUpdate();


        // Grab Choice and cached data
        const InputChoice = selectInteraction.values.shift();
        let cachedPollData = Collections.PollCreation.get(selectInteraction.guildId);
        let cachedChoices = cachedPollData.choices;
        let cachedButtons = cachedPollData.buttons;
        let cachedEmbed = cachedPollData.embed;

        // Remove Choice
        for ( let i = 0; i <= cachedChoices.length - 1; i++ )
        {
            if ( cachedChoices[i].label.toLowerCase() === InputChoice )
            {
                cachedButtons.splice(i, 1);
                cachedChoices.splice(i, 1);
                break;
            }
        }


        // Update Embed
        cachedEmbed = cachedEmbed.spliceFields(0, 3);
        /** @type {Array<ActionRowBuilder>} */
        let updatedButtonsArray = [];
        let temp;
        let choicesTextFieldOne = "";

        for ( let i = 0; i <= cachedButtons.length - 1; i++ )
        {
            // First button
            if ( i === 0 )
            {
                temp = new ActionRowBuilder().addComponents(cachedButtons[i]);
                choicesTextFieldOne += `${cachedChoices[i].emoji != null ? cachedChoices[i].emoji : `•`} ${cachedChoices[i].label}\n`
                //Push early if last Button
                if ( cachedButtons.length - 1 === i ) { updatedButtonsArray.push(temp); }
            }
            // Buttons 2 - 5
            else
            {
                temp.addComponents(cachedButtons[i]);
                choicesTextFieldOne += `${cachedChoices[i].emoji != null ? cachedChoices[i].emoji : `•`} ${cachedChoices[i].label}\n`
                //Push early if last Button
                if ( cachedButtons.length - 1 === i ) { updatedButtonsArray.push(temp); }
            }
        }

        cachedEmbed.addFields({ name: `Poll Choices:`, value: choicesTextFieldOne }, { name: `\u200B`, value: `*Results will be shown once Poll ends*` });

        // Add Select Menu, depending on number of choices left
        if ( cachedChoices.length < 1 ) { updatedButtonsArray.push(NoChoicesMenuSelect); }
        else { updatedButtonsArray.push(MenuSelect); }

        // Add back to cache
        cachedPollData.buttons = cachedButtons;
        cachedPollData.choices = cachedChoices;
        cachedPollData.embed = cachedEmbed;

        
        // ACK to User
        await cachedPollData.interaction.editReply({ components: updatedButtonsArray, embeds: [cachedEmbed] });
        await selectInteraction.deleteReply();

        // Purge cached Interaction
        cachedPollData.interaction = null;
        Collections.PollCreation.set(selectInteraction.guildId, cachedPollData);

        return;
    }
}
