const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, OAuth2Scopes, PermissionFlagsBits } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "invitebot",

    // Command's Description
    Description: `Gives you this Bot's Invite Link!`,

    // Command's Category
    Category: "GENERAL",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 30,

    // Cooldowns for specific subcommands and/or subcommand-groups
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandCooldown: {
        "example": 3
    },

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "GUILD",

    // Scope of specific Subcommands Usage
    //     One of the following: DM, GUILD, ALL
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandScope: {
        "example": "GUILD"
    },



    /**
     * Returns data needed for registering Slash Command onto Discord's API
     * @returns {ChatInputApplicationCommandData}
     */
    registerData()
    {
        /** @type {ChatInputApplicationCommandData} */
        const Data = {};

        Data.name = this.Name;
        Data.description = this.Description;
        Data.type = ApplicationCommandType.ChatInput;
        Data.dmPermission = false;

        return Data;
    },



    /**
     * Executes the Slash Command
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async execute(slashCommand)
    {
        // Generate Invite Link
        const MooBotInvite = DiscordClient.generateInvite({
            scopes: [ OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands ],
            permissions: [ PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.SendMessagesInThreads, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.UseExternalEmojis ]
        });

        await slashCommand.reply({ ephemeral: true, content: `Here is the Invite Link to invite **${DiscordClient.user.username}** to your Server: <${MooBotInvite}>\n\nPlease remember that you need either "Manage Server" or "Admin" Permissions in, or be the Owner of, the Server you want to add **${DiscordClient.user.username}** to.\nAdditionally, **${DiscordClient.user.username}'s** Invite Link has the very basic Permissions it needs to function, but some of its features (like Role Menus) will require extra Permissions not included in the Invite Link.` });
        return;
    },



    /**
     * Handles given Autocomplete Interactions for any Options in this Slash CMD that uses it
     * @param {AutocompleteInteraction} autocompleteInteraction 
     */
    async autocomplete(autocompleteInteraction)
    {
        //.
    }
}
