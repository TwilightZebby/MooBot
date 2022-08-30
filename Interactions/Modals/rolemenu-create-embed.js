const { ModalMessageModalSubmitInteraction, ActionRowBuilder, EmbedBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");
const LocalizedStrings = require("../../JsonFiles/stringMessages.json");

const HexColorRegex = new RegExp(/#[0-9a-fA-F]{6}/);

const RoleMenuCreateNoRoles = new ActionRowBuilder().addComponents([
    new SelectMenuBuilder().setCustomId(`create-role-menu`).setMaxValues(1).setMinValues(1).setPlaceholder("Please select an action").setOptions([
        new SelectMenuOptionBuilder().setValue("configure-embed").setEmoji("<:StatusRichPresence:842328614883295232>").setLabel("Configure Embed").setDescription("Set the Title, Description, and/or Colour of the Embed"),
        new SelectMenuOptionBuilder().setValue("add-role").setEmoji("<:plusGrey:997752068439818280>").setLabel("Add Role").setDescription("Add a Role to the Menu"),
        new SelectMenuOptionBuilder().setValue("cancel").setEmoji("❌").setLabel("Cancel Creation").setDescription("Cancels the creation of this Role Menu")
    ])
]);

module.exports = {
    // Modal's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "rolemenu-create-embed",

    // Modal's Description
    Description: `Handles input for Role Menu Embeds during creation process`,



    /**
     * Executes the Modal
     * @param {ModalMessageModalSubmitInteraction} modalInteraction 
     */
    async execute(modalInteraction)
    {
        // Grab inputted values
        const InputTitle = modalInteraction.fields.getTextInputValue("title");
        const InputDescription = modalInteraction.fields.getTextInputValue("description");
        const InputColor = modalInteraction.fields.getTextInputValue("hexcolor");

        // Grabbing the original message components, just so we can force an update
        //    when there's an update, triggering Discord to force the Select back into a
        //    state of "nothing is selected"
        const OriginalComponents = modalInteraction.message.components;

        // Fetch Embed Data, if any
        const CachedData = Collections.RoleMenuCreation.get(`${modalInteraction.guildId}`);
        const CachedEmbedData = CachedData.embed;

        // Set from Inputs, if given
        if ( InputTitle != "" && InputTitle != " " && InputTitle !== null && InputTitle !== undefined ) { CachedEmbedData.setTitle(InputTitle); }
        else { delete CachedEmbedData.data.title; }

        if ( InputDescription != "" && InputDescription != " " && InputDescription !== null && InputDescription !== undefined ) { CachedEmbedData.setDescription(InputDescription); }
        else { delete CachedEmbedData.data.description; }

        if ( InputColor != "" && InputColor != " " && InputColor !== null && InputColor !== undefined )
        {
            // Validate
            if ( !HexColorRegex.test(InputColor) )
            {
                await modalInteraction.update({ components: OriginalComponents });
                return await modalInteraction.followUp({ ephemeral: true, content: `That wasn't a valid Hex Colour Code! Please try again, using a valid Hex Colour Code (including the \`#\` (hash) at the start!)` });
            }
            else { CachedEmbedData.setColor(InputColor); }
        }
        else { delete CachedEmbedData.data.color; }


        // Update stored Embed Data Cache
        CachedData.embed = CachedEmbedData;
        Collections.RoleMenuCreation.set(`${modalInteraction.guildId}`, CachedData);

        // Update component to "Add roles" one, if it was first Embed Configuration
        if ( OriginalComponents[OriginalComponents.length - 1].components[OriginalComponents[OriginalComponents.length - 1].components.length - 1].options.length === 2 )
        {
            return await modalInteraction.update({ embeds: [CachedEmbedData], components: [RoleMenuCreateNoRoles] });
        }
        else
        {
            return await modalInteraction.update({ embeds: [CachedEmbedData] });
        }
    }
}
