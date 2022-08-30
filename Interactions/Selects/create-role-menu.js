const { SelectMenuInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");
const LocalizedStrings = require("../../JsonFiles/stringMessages.json");

module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "create-role-menu",

    // Select's Description
    Description: `Handles Select Menu for setting up Role Menus during creation process`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 5,



    /**
     * Executes the Select
     * @param {SelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        // Grab value
        const SelectValue = selectInteraction.values.shift();

        switch(SelectValue)
        {
            // EDIT EMBED DETAILS
            case "configure-embed":
                const EmbedData = Collections.RoleMenuCreation.get(`${selectInteraction.guildId}`).embed;

                const EmbedModal = new ModalBuilder().setCustomId("rolemenu-create-embed").setTitle("Configure Menu Embed").addComponents([
                    new ActionRowBuilder().addComponents([new TextInputBuilder().setCustomId("title").setLabel("Title").setMaxLength(256).setStyle(TextInputStyle.Short).setRequired(true).setValue(!EmbedData.data?.title ? "" : EmbedData.data.title)]),
                    new ActionRowBuilder().addComponents([new TextInputBuilder().setCustomId("description").setLabel("Description").setMaxLength(2000).setStyle(TextInputStyle.Paragraph).setRequired(false).setValue(!EmbedData.data?.description ? "" : EmbedData.data.description)]),
                    new ActionRowBuilder().addComponents([new TextInputBuilder().setCustomId("hexcolor").setLabel("Colour (in hex format)").setMaxLength(7).setMinLength(7).setStyle(TextInputStyle.Short).setRequired(false).setValue(!EmbedData.data?.color ? "" : EmbedData.data.color)])
                ]);

                return await selectInteraction.showModal(EmbedModal);

            
            // CANCEL MENU CREATION
            case "cancel":
                Collections.RoleMenuCreation.delete(`${selectInteraction.guildId}`);
                return await selectInteraction.update({ components: [], embeds: [], content: `Successfully cancelled creation of this Menu.` });
        }
    }
}
