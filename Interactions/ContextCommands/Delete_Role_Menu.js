const { ApplicationCommandType, ApplicationCommandData, ContextMenuCommandInteraction, PermissionFlagsBits } = require("discord.js");
const fs = require('fs');

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

        await contextCommand.deferReply({ ephemeral: true });

        // Check Message *is* a Role Menu with this Bot
        const RoleMenuJson = require('../../JsonFiles/Hidden/RoleMenus.json');
        const SourceMessage = contextCommand.options.getMessage('message', true);
        if ( !RoleMenuJson[SourceMessage.id] )
        {
            await contextCommand.editReply({ content: `That Message doesn't contain any of my Role Menus!` });
            return;
        }

        // Attempt deletion
        await SourceMessage.delete()
        .then(async deletedMessage => {
            delete RoleMenuJson[SourceMessage.id];
            fs.writeFile('./JsonFiles/Hidden/RoleMenus.json', JSON.stringify(RoleMenuJson, null, 4), async err => {
                if ( err )
                {
                    //console.error(err);
                }
            });

            await contextCommand.editReply({ content: `Successfully deleted that Role Menu!` });
        })
        .catch(async err => {
            //console.error(err);
            await contextCommand.editReply({ content: `Sorry, but there was an error trying to delete that Role Menu.` });
        });

        return;
    }
}
