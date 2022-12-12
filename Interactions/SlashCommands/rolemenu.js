const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, PermissionFlagsBits, ApplicationCommandOptionType, TextChannel } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");
const LocalizedStrings = require("../../JsonFiles/stringMessages.json");

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
    //     Use full lowercase
    Name: "rolemenu",

    // Command's Description
    Description: `Use to create or configure Self-Assignable Role Menus`,

    // Command's Category
    Category: "GENERAL",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 30,

    // Cooldowns for specific subcommands and/or subcommand-groups
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandCooldown: {
        "create": 30,
        "configure": 15
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
                description: "Manage the Embed, Roles, and Buttons on an existing Role Menu",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "menu-id",
                        description: "The ID of an existing Menu",
                        max_length: 22,
                        min_length: 16,
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
        // Prevent usage in non-Text Channels
        if ( !(slashCommand.channel instanceof TextChannel) )
        {
            await slashCommand.reply({ ephemeral: true, content: `Sorry, but this Command can only be used inside of Text Channels. (You used it in ${CHANNEL_TYPE_TO_STRING[slashCommand.channel.type]} Channel)` });
            return;
        }

        await slashCommand.reply({ ephemeral: true, content: `Test` });
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
