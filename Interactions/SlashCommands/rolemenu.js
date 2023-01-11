const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, PermissionFlagsBits, ApplicationCommandOptionType, TextChannel, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Collections } = require("../../constants");

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

const EmptyMenuEmbed = new EmbedBuilder().setDescription(`*Role Menu is currently empty. Please use the Select Menu below to configure this Role Menu.*`);

const InitialSelectMenu = new ActionRowBuilder().addComponents([
    new StringSelectMenuBuilder().setCustomId(`create-role-menu`).setMinValues(1).setMaxValues(1).setPlaceholder("Please select an action").setOptions([
        new StringSelectMenuOptionBuilder().setLabel("Configure Embed").setValue("configure-embed").setDescription("Set the Title, Description, and Colour of the Embed").setEmoji(`<:StatusRichPresence:842328614883295232>`),
        new StringSelectMenuOptionBuilder().setLabel("Cancel Creation").setValue("cancel").setDescription("Cancels creation of this Role Menu").setEmoji(`❌`)
    ])
]);

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
                description: "Displays instructions on how to edit an existing Role Menu"
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

        // Ensure Bot has MANAGE_ROLES Permission
        if ( !slashCommand.appPermissions.has(PermissionFlagsBits.ManageRoles) )
        {
            await slashCommand.reply({ ephemeral: true, content: `⚠ I do not seem to have the \`MANAGE_ROLES\` Permission! Please ensure I have been granted it in order for my Self-Assignable Role Module to work.` });
            return;
        }

        // Grab Subcommand used
        const SubCommandName = slashCommand.options.getSubcommand();

        // Menu Creation
        if ( SubCommandName === "create" )
        {
            // Ensure SEND_MESSAGES Perm for Bot
            if ( !slashCommand.appPermissions.has(PermissionFlagsBits.SendMessages) )
            {
                await slashCommand.reply({ ephemeral: true, content: `Sorry, but I cannot create a Role Menu in this Channel without having the \`Send Messages\` Permission!` });
                return;
            }

            // ACK to User
            await slashCommand.reply({ ephemeral: true, components: [InitialSelectMenu], embeds: [EmptyMenuEmbed], 
                content: `__**Self-Assignable Role Menu Creation**__
Use the Select Menu to configure the Embed and Role Buttons. Press an existing Role Button to edit its label and/or emoji.
If including in Buttons, please make sure to have the relevant Emoji IDs ready (such as in a notepad program); as you won't be able to copy from a Discord Message while an Input Form is open.
Additionally, both Custom Discord Emojis, and standard Unicode Emojis, are supported.

An auto-updating preview of what your new Self-Assignable Role Menu will look like is shown below.`
            });

            // Create empty placeholder
            let newDataObject = {
                type: "TOGGLE",
                embed: new EmbedBuilder(),
                roles: [],
                buttons: [],
                interaction: null
            };

            Collections.RoleMenuCreation.set(slashCommand.guildId, newDataObject);
        }
        // Menu Configuring
        else if ( SubCommandName === "configure" )
        {
            //.
        }

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
