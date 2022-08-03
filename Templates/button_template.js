const Discord = require("discord.js");
const { DiscordClient, Collections } = require("../constants.js");
const LocalizedErrors = require("../JsonFiles/errorMessages.json");
const LocalizedStrings = require("../JsonFiles/stringMessages.json");

module.exports = {
    // Button's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "button_custom_id",

    // Button's Description
    Description: `Description`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 3,



    /**
     * Executes the Button
     * @param {Discord.ButtonInteraction} buttonInteraction 
     */
    async execute(buttonInteraction)
    {
        //.
    }
}
