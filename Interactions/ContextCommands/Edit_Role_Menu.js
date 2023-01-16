const { ApplicationCommandType, ApplicationCommandData, ContextMenuCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { Collections } = require("../../constants.js");

const CHANNEL_TYPE_TO_STRING = {
    0: "a Text",
    1: "a DM",
    2: "a Voice",
    3: "a Group DM",
    4: "a Category",
    5: "an Announcement",
    10: "an Announcement Thread",
    11: "a Public Thread",
    12: "a Private Thread",
    13: "a Stage",
    14: "a Directory",
    15: "a Forum"
};

module.exports = {
    // Command's Name
    //     Can use sentence casing and spaces
    Name: "Edit Role Menu",

    // Command's Description
    Description: `Edit an existing Role Menu`,

    // Command's Category
    Category: "MANAGEMENT",

    // Context Command Type
    //     One of either ApplicationCommandType.Message, ApplicationCommandType.User
    CommandType: ApplicationCommandType.Message,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 30,

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
        Data.defaultMemberPermissions = PermissionFlagsBits.ManageRoles;

        return Data;
    },



    /**
     * Executes the Context Command
     * @param {ContextMenuCommandInteraction} contextCommand 
     */
    async execute(contextCommand)
    {
        // Check Message *is* a Role Menu with this Bot
        const RoleMenuJson = require('../../JsonFiles/Hidden/RoleMenus.json');
        const SourceMessage = contextCommand.options.getMessage('message', true);
        if ( !RoleMenuJson[SourceMessage.id] )
        {
            await contextCommand.reply({ ephemeral: true, content: `That Message doesn't contain any of my Role Menus!` });
            return;
        }

        // Ensure Bot has MANAGE_ROLES Permission
        if ( !contextCommand.appPermissions.has(PermissionFlagsBits.ManageRoles) )
        {
            await contextCommand.reply({ ephemeral: true, context: `⚠ I do not seem to have the \`MANAGE_ROLES\` Permission! Please ensure I have been granted it in order for my Self-Assignable Role Module to work.` });
            return;
        }

        // Ensure Bot has READ_MESSAGE_HISTORY Permission to be able to edit the existing Role Menu
        if ( !contextCommand.appPermissions.has(PermissionFlagsBits.ReadMessageHistory) )
        {
            await contextCommand.reply({ ephemeral: true, content: `Sorry, but I cannot edit an existing Role menu in this Channel without having the \`Read Message History\` Permission!` });
            return;
        }




        // Setup for Menu Configuration
        const MenuData = RoleMenuJson[SourceMessage.id];
        let newDataObject = {
            type: MenuData["MENU_TYPE"],
            embed: new EmbedBuilder().setTitle(MenuData["EMBED"]["TITLE"]),
            roles: MenuData["ROLES"],
            buttons: [],
            interaction: null
        };
    }
}
