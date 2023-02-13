const { ApplicationCommandType, ApplicationCommandData, ContextMenuCommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, DMChannel, PartialGroupDMChannel } = require("discord.js");

module.exports = {
    // Command's Name
    //     Can use sentence casing and spaces
    Name: "Delete Role Menu",

    // Command's Description
    Description: `Deletes an existing Role Menu`,

    // Command's Category
    Category: "MANAGEMENT",

    // Context Command Type
    //     One of either ApplicationCommandType.Message, ApplicationCommandType.User
    CommandType: ApplicationCommandType.Message,

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
        Data.defaultMemberPermissions = PermissionFlagsBits.ManageRoles;

        return Data;
    },



    /**
     * Executes the Context Command
     * @param {ContextMenuCommandInteraction} contextCommand 
     */
    async execute(contextCommand)
    {
        // Just in case
        if ( contextCommand.channel instanceof DMChannel || contextCommand.channel instanceof PartialGroupDMChannel )
        {
            await contextCommand.reply({ ephemeral: true, content: `Sorry, but this Context Command can__not__ be used within DMs or Group DMs.` });
            return;
        }

        // Check Message *is* a Role Menu with this Bot
        const RoleMenuJson = require('../../JsonFiles/Hidden/RoleMenus.json');
        const SourceMessage = contextCommand.options.getMessage('message', true);
        if ( !RoleMenuJson[SourceMessage.id] )
        {
            await contextCommand.reply({ ephemeral: true, content: `That Message doesn't contain any of my Role Menus!` });
            return;
        }


        // Construct Confirmation Buttons
        const ConfirmationButtonRow = new ActionRowBuilder().addComponents([
            new ButtonBuilder().setCustomId(`menu-delete-confirm_${SourceMessage.id}`).setLabel(`Delete`).setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId(`menu-delete-cancel`).setLabel(`Cancel`).setStyle(ButtonStyle.Secondary)
        ]);

        await contextCommand.reply({ ephemeral: true, components: [ConfirmationButtonRow], content: `Are you sure you want to delete this Role Menu?` });
        return;
    }
}
