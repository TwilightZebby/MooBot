const { Message } = require("discord.js");
const { DiscordClient, Collections } = require("../constants.js");

module.exports = {
    // Command's Name
    //     Use camelCase or full lowercase
    Name: "commandName",

    // Command's Description
    Description: `Description`,

    // Command's Category
    Category: "GENERAL",

    // Alias(es) of Command, if any
    Alias: [],

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 3,

    // Scope of Command's usage
    //     One of the following: DM, GUILD
    Scope: "GUILD",

    // Are arguments required?
    ArgumentsRequired: false,

    // Minimum amount of Arguments required
    //     REQUIRES "ArgumentsRequired" TO BE TRUE IF TO BE SET AS AN INTEGER
    MinimumArguments: null,

    // Maximum amount of Arguments allowed
    //     Does NOT require "ArgumentsRequired" to be true, but should be more than Minimum if set
    MaximumArguments: null,

    // Command Permission Level
    //     One of the following: DEVELOPER, SERVER_OWNER, ADMIN, MODERATOR, EVERYONE
    PermissionLevel: "EVERYONE",



    /**
     * Executes the Text Command
     * @param {Message} message Origin Message that triggered this Command
     * @param {?Array<String>} arguments Given arguments, can be empty!
     */
    async execute(message, arguments)
    {
        //.
    }
}
