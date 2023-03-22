const { ModalMessageModalSubmitInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const EmojiRegex = require("emoji-regex")();
const { Collections } = require("../../constants.js");

const DiscordEmojiRegex = new RegExp(/<a?:(?<name>[a-zA-Z0-9\_]+):(?<id>\d{15,21})>/);

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


const MaxChoicesMenuSelect = new ActionRowBuilder().addComponents([
    new StringSelectMenuBuilder().setCustomId(`create-poll`).setMinValues(1).setMaxValues(1).setPlaceholder("Please select an action").setOptions([
        //new StringSelectMenuOptionBuilder().setLabel("Set Poll Type").setValue("set-type").setDescription("Change how the Poll will behave once saved").setEmoji(`🔧`),
        new StringSelectMenuOptionBuilder().setLabel("Configure Embed").setValue("configure-embed").setDescription("Set the Question, Description, and Colour of the Poll").setEmoji(`<:StatusRichPresence:842328614883295232>`),
        new StringSelectMenuOptionBuilder().setLabel("Remove Choice").setValue("remove-choice").setDescription("Remove a Choice from the Poll").setEmoji(`<:IconDeleteTrashcan:750152850310561853>`),
        new StringSelectMenuOptionBuilder().setLabel("Save & Display").setValue("save").setDescription("Saves the new Poll, and displays it for Members to use").setEmoji(`<:IconActivity:815246970457161738>`),
        new StringSelectMenuOptionBuilder().setLabel("Cancel Creation").setValue("cancel").setDescription("Cancels creation of this Poll").setEmoji(`❌`)
    ])
]);

module.exports = {
    // Modal's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "create-poll-edit-choice",

    // Modal's Description
    Description: `Handles edits to existing Choices during Poll Creation`,



    /**
     * Executes the Modal
     * @param {ModalMessageModalSubmitInteraction} modalInteraction 
     */
    async execute(modalInteraction)
    {
        // Grab inputs
        const ChoiceCustomID = modalInteraction.customId.split("_").pop();
        const InputLabel = modalInteraction.fields.getTextInputValue("label");
        const InputEmoji = modalInteraction.fields.getTextInputValue("emoji");


        // Validate Emoji
        if ( InputEmoji == "" && InputEmoji == " " && InputEmoji == null && InputEmoji == undefined )
        {
            if ( !DiscordEmojiRegex.test(InputEmoji) && !EmojiRegex.test(InputEmoji) )
            {
                await modalInteraction.update({ content: `__**Poll Creation**__
Use the Select Menu to configure the Poll's Embed and Buttons. Press an existing Button to edit its label and/or emoji.
If including in Buttons, please make sure to have the relevant Emoji IDs ready (such as in a notepad program); as you won't be able to copy from a Discord Message while an Input Form is open.
Additionally, both Custom Discord Emojis, and standard Unicode Emojis, are supported.

An auto-updating preview of what your new Poll will look like is shown below.

⚠ **Sorry, but there was an error trying to validate your included Emoji. Please try again, ensuring you use either an [Unicode Emoji](<https://emojipedia.org>) or a raw Discord Custom Emoji string (example: \`<:grass_block:601353406577246208>\`)**` });
                return;
            }
        }

        
        // Update cache & buttons
        let pollCache = Collections.PollCreation.get(modalInteraction.guildId);
        let choiceCache = pollCache.choices;
        let buttonCache = pollCache.buttons;
        let embedCache = pollCache.embed;

        for ( let i = 0; i <= choiceCache.length - 1; i++ )
        {
            if ( choiceCache[i].label.toLowerCase().replace(" ", "-") === ChoiceCustomID )
            {
                // Update Label
                choiceCache[i].label = InputLabel;
                buttonCache[i].setLabel(InputLabel);
                buttonCache[i].setCustomId(`new-choice-edit_${InputLabel.toLowerCase().replace(" ", "-")}`);

                // Update Emoji
                if ( InputEmoji != null && InputEmoji != "" )
                {
                    choiceCache[i].emoji = InputEmoji;
                    buttonCache[i].setEmoji(InputEmoji);
                }
                else
                {
                    choiceCache[i].emoji = null;
                    buttonCache[i].setEmoji({});
                }

                break;
            }
        }


        // Save back to cache
        pollCache.buttons = buttonCache;
        pollCache.choices = choiceCache;


        // Re-Construct Embed, and add Component Arrays
        let pollEmbed = embedCache.spliceFields(0, 3);
        /** @type {Array<ActionRowBuilder>} */
        let updatedButtonsArray = [];
        let temp;
        let choicesTextFieldOne = "";

        for ( let i = 0; i <= buttonCache.length - 1; i++ )
        {
            // First button
            if ( i === 0 )
            {
                temp = new ActionRowBuilder().addComponents(buttonCache[i]);
                choicesTextFieldOne += `${choiceCache[i].emoji != null ? choiceCache[i].emoji : `•`} ${choiceCache[i].label}\n`
                //Push early if last Button
                if ( buttonCache.length - 1 === i ) { updatedButtonsArray.push(temp); }
            }
            // Buttons 2 - 5
            else
            {
                temp.addComponents(buttonCache[i]);
                choicesTextFieldOne += `${choiceCache[i].emoji != null ? choiceCache[i].emoji : `•`} ${choiceCache[i].label}\n`
                //Push early if last Button
                if ( buttonCache.length - 1 === i ) { updatedButtonsArray.push(temp); }
            }
        }


        // Add Select Menu, depending on number of choices
        if ( choiceCache.length >= 5 ) { updatedButtonsArray.push(MaxChoicesMenuSelect); }
        else { updatedButtonsArray.push(MenuSelect); }

        // Add to Embed
        embedCache.addFields({ name: `Poll Choices:`, value: choicesTextFieldOne }, { name: `\u200B`, value: `*Results will be shown once Poll ends*` });
        pollCache.embed = embedCache;


        // Update Menu
        await modalInteraction.update({ components: updatedButtonsArray, embeds: [embedCache], content: `__**Poll Creation**__
Use the Select Menu to configure the Poll's Embed and Buttons. Press an existing Button to edit its label and/or emoji.
If including in Buttons, please make sure to have the relevant Emoji IDs ready (such as in a notepad program); as you won't be able to copy from a Discord Message while an Input Form is open.
Additionally, both Custom Discord Emojis, and standard Unicode Emojis, are supported.

An auto-updating preview of what your new Poll will look like is shown below.` });

        // Save to cache
        Collections.PollCreation.set(modalInteraction.guildId, pollCache);
        return;
    }
}
