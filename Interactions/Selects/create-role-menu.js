const { StringSelectMenuInteraction, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");
const LocalizedStrings = require("../../JsonFiles/stringMessages.json");

module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "create-role-menu",

    // Select's Description
    Description: `Handles processing options for creation of Role Menus`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 5,



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
                let embedData = Collections.RoleMenuCreation.get(selectInteraction.guildId)?.embed;

                let embedModal = new ModalBuilder().setCustomId(`create-menu-embed`).setTitle(`Configure Menu Embed`).addComponents([
                    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`title`).setLabel("Embed Title").setMaxLength(256).setStyle(TextInputStyle.Short).setRequired(true).setValue(!embedData?.data.title ? "" : embedData.data.title) ]),
                    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`description`).setLabel("Embed Description").setMaxLength(2000).setStyle(TextInputStyle.Paragraph).setRequired(false).setValue(!embedData?.data.description ? "" : embedData.data.description) ]),
                    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`hex-colour`).setLabel("Embed Colour (In Hex Format)").setMinLength(7).setMaxLength(7).setStyle(TextInputStyle.Short).setRequired(false).setValue(!embedData?.data.color ? "" : `${typeof embedData.data.color === 'number' ? `#${embedData.data.color.toString(16).padStart(6, '0')}` : embedData.data.color}`) ])
                ]);

                await selectInteraction.showModal(embedModal);
                break;


            // Cancel creation
            case "cancel":
                Collections.RoleMenuCreation.delete(selectInteraction.guildId);
                await selectInteraction.update({ embeds: [], components: [], content: `Creation of new Role Menu has been cancelled. You may now dismiss or delete this message.` });
                break;

            default:
                await selectInteraction.reply({ ephemeral: true, content: `An error occurred` });
                break;
        }

        return;
    }
}
