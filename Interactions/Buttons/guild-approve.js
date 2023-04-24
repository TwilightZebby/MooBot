const { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    // Button's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "guild-approve",

    // Button's Description
    Description: `Approves a Guild for using this Bot`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 10,



    /**
     * Executes the Button
     * @param {ButtonInteraction} buttonInteraction 
     */
    async execute(buttonInteraction)
    {
        // Ensure only Zebby can use
        if ( buttonInteraction.user.id !== "156482326887530498" )
        {
            await buttonInteraction.reply({ ephemeral: true, content: `Sorry, only my Developer can use this Button!` });
            return;
        }

        // For now, simply update the Log Message
        const ApprovedActionRow = new ActionRowBuilder().addComponents([
            new ButtonBuilder().setCustomId(`disabled`).setDisabled(true).setEmoji('✅').setLabel(`Approved`).setStyle(ButtonStyle.Success)
        ]);

        await buttonInteraction.update({ components: [ApprovedActionRow] });
        return;
    }
}
