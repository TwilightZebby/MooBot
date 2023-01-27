const { StringSelectMenuInteraction, RoleSelectMenuInteraction, ChannelSelectMenuInteraction, UserSelectMenuInteraction, MentionableSelectMenuInteraction } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");

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
     * @param {StringSelectMenuInteraction|RoleSelectMenuInteraction|ChannelSelectMenuInteraction|UserSelectMenuInteraction|MentionableSelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        //.
    }
}
