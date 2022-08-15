const { SelectMenuInteraction } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");
const LocalizedStrings = require("../../JsonFiles/stringMessages.json");

module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "select_custom_id",

    // Select's Description
    Description: `Description`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 3,



    /**
     * Executes the Select
     * @param {SelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        //.
    }
}
