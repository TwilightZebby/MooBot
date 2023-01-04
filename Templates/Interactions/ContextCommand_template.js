const { ApplicationCommandType, ApplicationCommandData, ContextMenuCommandInteraction } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");

module.exports = {
    // Command's Name
    //     Can use sentence casing and spaces
    Name: "Command Name",

    // Command's Description
    Description: `Description`,

    // Command's Category
    Category: "GENERAL",

    // Context Command Type
    //     One of either ApplicationCommandType.Message, ApplicationCommandType.User
    CommandType: ApplicationCommandType.Message,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 3,

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "GUILD",



    /**
     * Returns data needed for registering Context Command onto Discord's API
     * @returns {ApplicationCommandData}
     */
    registerData()
    {
        /** @type {ApplicationCommandData} */
        const Data = {};

        Data.name = this.Name;
        Data.description = "";
        Data.type = this.CommandType;

        return Data;
    },



    /**
     * Executes the Context Command
     * @param {ContextMenuCommandInteraction} contextCommand 
     */
    async execute(contextCommand)
    {
        //.
    }
}
