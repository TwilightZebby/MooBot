const { ApplicationCommandType, ApplicationCommandData, ContextMenuCommandInteraction } = require("discord.js");
const { DiscordClient } = require("../../constants.js");
const ActionStrings = require('../../JsonFiles/actionMessages.json');

// REGEXS
const AuthorRegEx = new RegExp(/{AUTHOR}/g);
const ReceiverRegEx = new RegExp(/{RECEIVER}/g);


module.exports = {
    // Command's Name
    //     Can use sentence casing and spaces
    Name: "Headpat User",

    // Command's Description
    Description: `Gives the User a headpat`,

    // Command's Category
    Category: "ACTION",

    // Context Command Type
    //     One of either ApplicationCommandType.Message, ApplicationCommandType.User
    CommandType: ApplicationCommandType.User,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 10,

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
        Data.dmPermission = false;

        return Data;
    },



    /**
     * Executes the Context Command
     * @param {ContextMenuCommandInteraction} contextCommand 
     */
    async execute(contextCommand)
    {
        // Grab Data
        const PersonOption = contextCommand.options.getMember("user");
        let displayMessage = "";

        // Assemble message
        // @user (self)
        if ( PersonOption.id === contextCommand.user.id )
        {
            displayMessage = ActionStrings['SELF_USER'][`headpat`];
            displayMessage = displayMessage.replace(AuthorRegEx, `${contextCommand.member.displayName}`);
        }
        // @user (this bot)
        else if ( PersonOption.id === DiscordClient.user.id )
        {
            displayMessage = ActionStrings['MOOBOT'][`headpat`];
            displayMessage = displayMessage.replace(AuthorRegEx, `${contextCommand.member.displayName}`).replace(ReceiverRegEx, `${PersonOption.displayName}`);
        }
        // @user (literally any bot that isn't this one)
        else if ( PersonOption.user.bot )
        {
            displayMessage = ActionStrings['OTHER_BOT'][`headpat`];
            displayMessage = displayMessage.replace(AuthorRegEx, `${contextCommand.member.displayName}`).replace(ReceiverRegEx, `${PersonOption.displayName}`);
        }
        // @user (literally any other User that doesn't meet the above)
        else
        {
            displayButton = true;
            displayMessage = ActionStrings['OTHER_USER'][`headpat`];
            displayMessage = displayMessage.replace(AuthorRegEx, `${contextCommand.member.displayName}`).replace(ReceiverRegEx, `${PersonOption.displayName}`);
        }


        // Send Message
        await contextCommand.reply({ allowedMentions: { parse: [] }, content: displayMessage });
        return;
    }
}
