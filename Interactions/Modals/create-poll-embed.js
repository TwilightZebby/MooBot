const { ModalMessageModalSubmitInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Collections } = require("../../constants.js");

const HexColourRegex = new RegExp(/#[0-9a-fA-F]{6}/);

const MenuSelectNoChoices = new ActionRowBuilder().addComponents([
    new StringSelectMenuBuilder().setCustomId(`create-poll`).setMinValues(1).setMaxValues(1).setPlaceholder("Please select an action").setOptions([
        //new StringSelectMenuOptionBuilder().setLabel("Set Poll Type").setValue("set-type").setDescription("Change how the Poll will behave once saved").setEmoji(`🔧`),
        new StringSelectMenuOptionBuilder().setLabel("Configure Embed").setValue("configure-embed").setDescription("Set the Question, Description, and Colour of the Poll").setEmoji(`<:StatusRichPresence:842328614883295232>`),
        new StringSelectMenuOptionBuilder().setLabel("Add Choice").setValue("add-choice").setDescription("Add a Choice to the Poll").setEmoji(`<:plusGrey:997752068439818280>`),
        new StringSelectMenuOptionBuilder().setLabel("Cancel Creation").setValue("cancel").setDescription("Cancels creation of this Poll").setEmoji(`❌`)
    ])
]);

module.exports = {
    // Modal's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "create-poll-embed",

    // Modal's Description
    Description: `Handles input for Poll Embed data during creation`,



    /**
     * Executes the Modal
     * @param {ModalMessageModalSubmitInteraction} modalInteraction 
     */
    async execute(modalInteraction)
    {
        // Grab Inputs
        const InputTitle = modalInteraction.fields.getTextInputValue("title");
        const InputDescription = modalInteraction.fields.getTextInputValue("description");
        const InputColour = modalInteraction.fields.getTextInputValue("hex-colour");

        let originalComponents = modalInteraction.message.components;

        let menuEmbed = Collections.PollCreation.get(modalInteraction.guildId)?.embed;
        if ( !menuEmbed ) { menuEmbed = new EmbedBuilder(); }

        // Set data, if given, and also do validation checks if need be
        if ( InputTitle != "" && InputTitle != " " && InputTitle != null && InputTitle != undefined ) { menuEmbed.setTitle(InputTitle); }
        else { menuEmbed.setTitle(null); }

        if ( InputDescription != "" && InputDescription != " " && InputDescription != null && InputDescription != undefined ) { menuEmbed.setDescription(InputDescription); }
        else { menuEmbed.setDescription(null); }

        if ( InputColour != "" && InputColour != " " && InputColour != null && InputColour != undefined )
        {
            // Validate
            if ( !HexColourRegex.test(InputColour) )
            {
                await modalInteraction.update({ components: originalComponents });
                await modalInteraction.followUp({ ephemeral: true, content: `That wasn't a valid Hex Colour Code! Please try again, using a valid Hex Colour Code (including the \`#\` (hash) at the start).` });
                return;
            }
            else { menuEmbed.setColor(InputColour); }
        }
        else { menuEmbed.setColor(null); }

        // Update stored Embed
        let fetchedData = Collections.PollCreation.get(modalInteraction.guildId);
        fetchedData.embed = menuEmbed;
        Collections.PollCreation.set(modalInteraction.guildId, fetchedData);

        // Update Component to "no choices" one, if it was the first Embed edit
        if ( originalComponents[originalComponents.length - 1].components[originalComponents[originalComponents.length - 1].components.length - 1].options.length === 2 )
        {
            await modalInteraction.update({ embeds: [menuEmbed], components: [MenuSelectNoChoices] });
            return;
        }
        else
        {
            await modalInteraction.update({ embeds: [menuEmbed] });
            return;
        }
    }
}
