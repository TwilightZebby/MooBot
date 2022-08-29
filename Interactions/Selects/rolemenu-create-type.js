const { SelectMenuInteraction, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");
const LocalizedStrings = require("../../JsonFiles/stringMessages.json");


/** Default blank Embed */
const DefaultEmbed = new EmbedBuilder().setDescription("*Role menu is currently empty.*");

/** Select Menu for start of Menu Creation */
const RoleMenuCreateNoEmbed = new ActionRowBuilder().addComponents([
    new SelectMenuBuilder().setCustomId(`create-role-menu`).setMaxValues(1).setMinValues(1).setPlaceholder("Please select an action").setOptions([
        new SelectMenuOptionBuilder().setValue("configure-embed").setEmoji("<:StatusRichPresence:842328614883295232>").setLabel("Configure Embed").setDescription("Set the Title, Description, and/or Colour of the Embed"),
        new SelectMenuOptionBuilder().setValue("cancel").setEmoji("❌").setLabel("Cancel Creation").setDescription("Cancels the creation of this Role Menu")
    ])
]);

module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "rolemenu-create-type",

    // Select's Description
    Description: `Starts the correct Role Menu Creation process, depending on selected Menu Type`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 30,



    /**
     * Executes the Select
     * @param {SelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        // Grab Type selected
        const MenuTypeValue = selectInteraction.values.shift();
        
        // Create entry in Collection for this Guild
        Collections.RoleMenuCreation.set(`${selectInteraction.guildId}`, { type: MenuTypeValue });

        // Allow User to begin creating their Role Menu
        return await selectInteraction.update({ components: [RoleMenuCreateNoEmbed], embeds: [DefaultEmbed], content: `__**Self-Assignable Role Menu Creation**__ - Menu Creation
Please use the Select Menu below the Preview to configure the Embed and Role Buttons for your Menu.
*Since this uses Modals, please ensure you have the relevant Role IDs and Emoji IDs (if including in Buttons) to hand, such as in a notepad program - since you won't be able to click into a Discord Channel while the Modal is open.*

An automatically updating preview of your Menu is shown below:` });
    }
}
