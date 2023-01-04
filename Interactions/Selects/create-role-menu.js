const { StringSelectMenuInteraction, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, RoleSelectMenuBuilder } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");

const RoleSelect = new ActionRowBuilder().addComponents([
    new RoleSelectMenuBuilder().setCustomId(`create-menu-add-role`).setMinValues(1).setMaxValues(1).setPlaceholder("Search for a Role")
]);

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


            // Add new Role to Menu
            case "add-role":
                // Validate Menu doesn't already have self-imposed max of 10 Buttons
                let fetchedButtons = Collections.RoleMenuCreation.get(selectInteraction.guildId).roles;
                if ( fetchedButtons?.length === 10 )
                {
                    await selectInteraction.reply({ ephemeral: true, content: `Sorry, but you cannot add more than 10 (ten) Role Buttons to a single Menu.` });
                    break;
                }

                // Ask for which Role to add
                await selectInteraction.deferUpdate(); // Just so the original is editable later
                await selectInteraction.followUp({ ephemeral: true, components: [RoleSelect], content: `Please use the Role Select Menu below to pick which Role from this Server you would like to add to your new Role Menu.` });

                // Temp-store interaction so we can return to it
                let menuData = Collections.RoleMenuCreation.get(selectInteraction.guildId);
                menuData.interaction = selectInteraction;
                Collections.RoleMenuCreation.set(selectInteraction.guildId, menuData);
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
