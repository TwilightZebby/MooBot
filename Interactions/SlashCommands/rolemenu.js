const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, PermissionFlagsBits, ApplicationCommandOptionType, ChannelType,  SelectMenuBuilder, SelectMenuOptionBuilder, ActionRowBuilder } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");
const LocalizedStrings = require("../../JsonFiles/stringMessages.json");


/** Select for choosing Role Menu Type to create */
const RoleMenuTypeSelect = new ActionRowBuilder().addComponents([
    new SelectMenuBuilder().setCustomId(`rolemenu-create-type`).setMaxValues(1).setMinValues(1).setPlaceholder("Choose Role Menu Type").setOptions([
        new SelectMenuOptionBuilder().setValue("classic").setLabel("Classic").setDescription("Users can select multiple Roles from this Menu."),
        new SelectMenuOptionBuilder().setValue("swappable").setLabel("Single Role (Swappable)").setDescription("Users can only select 1 Role at a time from this Menu."),
        new SelectMenuOptionBuilder().setValue("one_time_use").setLabel("One Time Use").setDescription("Users can only use this Menu once, and only to select 1 Role.")
    ])
]);

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "rolemenu",

    // Command's Description
    Description: `Used to create or manage Self-Assignable Role Menus`,

    // Command's Category
    Category: "GENERAL",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 10,

    // Cooldowns for specific subcommands and/or subcommand-groups
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandCooldown: {
        "create": 10,
        "configure": 10
    },

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "GUILD",

    // Scope of specific Subcommands Usage
    //     One of the following: DM, GUILD, ALL
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandScope: {
        "create": "GUILD",
        "configure": "GUILD"
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
        Data.defaultMemberPermissions = PermissionFlagsBits.ManageRoles;
        Data.options = [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "create",
                description: "Create a new Self-Assignable Role Menu"
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "configure",
                description: "Manage the Roles, Buttons, and Embed on an existing Role Menu",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "id",
                        description: "The Menu/Message ID of the existing Role Menu",
                        max_length: 21,
                        required: true
                    }
                ]
            }
        ];

        return Data;
    },



    /**
     * Executes the Slash Command
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async execute(slashCommand)
    {
        // Prevent usage in unsupported Channel Types
        if ( slashCommand.channel.type === ChannelType.GuildVoice ) { return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale].SLASH_COMMAND_NO_TIV }); }
        if ( slashCommand.channel.type === ChannelType.GuildNews ) { return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale].SLASH_COMMAND_NO_ANNOUNCEMENT }); }
        if ( (slashCommand.channel.type === ChannelType.GuildNewsThread) || (slashCommand.channel.type === ChannelType.GuildPrivateThread) || (slashCommand.channel.type === ChannelType.GuildPublicThread) ) { return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale].SLASH_COMMAND_NO_THREAD }); }

        // Check for MANAGE_ROLES Permission
        //if ( !slashCommand.memberPermissions.has(PermissionFlagsBits.ManageRoles, true) ) { return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale].ROLEMENU_COMMAND_USER_NO_MANAGE_ROLES_PERMISSION }); }
        if ( !slashCommand.appPermissions.has(PermissionFlagsBits.ManageRoles, true) ) { return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale].ROLEMENU_COMMAND_BOT_NO_MANAGE_ROLES_PERMISSION }); }

        // Grab Subcommand used and do stuff based on that
        const SubcommandName = slashCommand.options.getSubcommand(true);

        // Menu Creation
        if ( SubcommandName === "create" )
        {
            // Check for SEND_MESSAGES and VIEW_CHANNEL Permissions
            if ( !slashCommand.appPermissions.has(PermissionFlagsBits.ViewChannel, true) ) { return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale].ROLEMENU_COMMAND_BOT_NO_VIEW_CHANNEL_PERMISSION }); }
            if ( !slashCommand.appPermissions.has(PermissionFlagsBits.SendMessages, true) ) { return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale].ROLEMENU_COMMAND_BOT_NO_SEND_MESSAGES_PERMISSION }); }

            // Send Role Menu Type selection
            return await slashCommand.reply({ ephemeral: true, components: [RoleMenuTypeSelect], content: `__**Self-Assignable Role Menu Creation**__ - Menu Type Selection
Please use the Select Menu below to choose which type of Role Menu you would like to create.` });
        }
        // Menu Configuration/Editing
        else if ( SubcommandName === "configure" )
        {
            //.
        }
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
