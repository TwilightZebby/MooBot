const { StringSelectMenuInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "create-menu-add-button",

    // Select's Description
    Description: `Handles Role Select for adding a Role to a Menu during creation (Button Type)`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 8,



    /**
     * Executes the Select
     * @param {StringSelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        // Grab Role ID & Button Type
        const RoleID = selectInteraction.customId.split("_").pop();
        const ButtonType = selectInteraction.values.shift();

        // Modal for grabbing Button Label/Emoji
        const MenuButtonModal = new ModalBuilder().setCustomId(`create-menu-button-text_${RoleID}_${ButtonType}`).setTitle("Set Button Label/Emoji").addComponents([
            new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId("label").setLabel("Button Label (Required if no Emoji)").setMaxLength(80).setStyle(TextInputStyle.Short).setRequired(false) ]),
            new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId("emoji").setLabel("Button Emoji (Required if no Label)").setMaxLength(200).setPlaceholder("<:grass_block:601353406577246208> or ✨").setStyle(TextInputStyle.Short).setRequired(false) ]),
        ]);

        await selectInteraction.showModal(MenuButtonModal);
        return;
    }
}
