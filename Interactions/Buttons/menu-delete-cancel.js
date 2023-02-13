const { ButtonInteraction } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");

module.exports = {
    // Button's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "menu-delete-cancel",

    // Button's Description
    Description: `Cancels deletion of a Role Menu`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 10,



    /**
     * Executes the Button
     * @param {ButtonInteraction} buttonInteraction 
     */
    async execute(buttonInteraction)
    {
        // Just a simple ACK Message
        await buttonInteraction.update({ components: [], content: `Cancelled deletion of that Role Menu.\nFeel free to dismiss or delete this message.` });
        return;
    }
}
