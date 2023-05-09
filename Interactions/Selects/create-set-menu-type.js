const { StringSelectMenuInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");

const EmbedSelectMenu = new ActionRowBuilder().addComponents([
    new StringSelectMenuBuilder().setCustomId(`create-role-menu`).setMinValues(1).setMaxValues(1).setPlaceholder("Please select an action").setOptions([
        new StringSelectMenuOptionBuilder().setLabel("Set Menu Type").setValue("set-type").setDescription("Change how the Menu will behave once saved").setEmoji(`🔧`),
        new StringSelectMenuOptionBuilder().setLabel("Configure Embed").setValue("configure-embed").setDescription("Set the Title, Description, and Colour of the Embed").setEmoji(`<:StatusRichPresence:842328614883295232>`),
        new StringSelectMenuOptionBuilder().setLabel("Cancel Creation").setValue("cancel").setDescription("Cancels creation of this Role Menu").setEmoji(`❌`)
    ])
]);

module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "create-set-menu-type",

    // Select's Description
    Description: `Sets the Type of Role Menu during Menu Creation`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 3,



    /**
     * Executes the Select
     * @param {StringSelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        // Grab stuff
        const MenuDataCache = Collections.RoleMenuCreation.get(selectInteraction.guildId);
        const EmbedCache = MenuDataCache.embed;
        const SelectedTypeChoice = selectInteraction.values.shift();
        let originalComponents = MenuDataCache.interaction.message.components;

        // Set the Type
        EmbedCache.setFooter({ text: `Menu Type: ${SelectedTypeChoice}` });
        MenuDataCache.type = SelectedTypeChoice;
        MenuDataCache.embed = EmbedCache;

        // If this was the first time setting the Menu Type, update Select to allow editing of Embed
        if ( originalComponents[originalComponents.length - 1].components[originalComponents[originalComponents.length - 1].components.length - 1].options.length === 2 )
        {
            await MenuDataCache.interaction.editReply({ embeds: [EmbedCache], components: [EmbedSelectMenu] });
        }
        else
        {
            await MenuDataCache.interaction.editReply({ embeds: [EmbedCache] });
        }
        
        // Clean up        
        await selectInteraction.deferUpdate();
        await selectInteraction.deleteReply();

        // Clear Interaction from Cache, then save Type to it
        MenuDataCache.interaction = null;
        Collections.RoleMenuCreation.set(selectInteraction.guildId, MenuDataCache);

        return;
    }
}
