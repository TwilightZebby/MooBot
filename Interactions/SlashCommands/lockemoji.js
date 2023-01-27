const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "lockemoji",

    // Command's Description
    Description: `Upload a Custom Emoji to this Server, that can be locked behind a Role`,

    // Command's Category
    Category: "MANAGEMENT",

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
        Data.defaultMemberPermissions = PermissionFlagsBits.ManageRoles;
        Data.dmPermission = false;
        Data.options = [
            {
                type: ApplicationCommandOptionType.Attachment,
                name: "emoji",
                description: "PNG or GIF of your Custom Emoji",
                required: true
            },
            {
                type: ApplicationCommandOptionType.Role,
                name: "role",
                description: "Role to lock your Custom Emoji behind",
                required: true
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
        // Ensure Bot has MANAGE_EMOJI Permission
        if ( !slashCommand.appPermissions.has(PermissionFlagsBits.ManageEmojisAndStickers) )
        {
            await slashCommand.reply({ ephemeral: true, content: `Sorry, but I cannot upload a Custom Emoji to this Server without having the **Manage Emojis and Stickers** Permission.\nPlease try again, once I have been granted that Permission!` });
            return;
        }

        // Grab Inputs
        const InputAttachment = slashCommand.options.getAttachment("emoji", true);
        const InputRole = slashCommand.options.getRole("role", true);

        // Ensure Attachment is PNG or GIF
        if ( InputAttachment.contentType !== "image/png" && InputAttachment.contentType !== "image/gif" )
        {
            await slashCommand.reply({ ephemeral: true, content: `Sorry, but that Emoji File wasn't a **PNG** or **GIF** file type.\nPlease try again, ensuring you use either a \`.png\` or \`.gif\` file for your Custom Emoji.` });
            return;
        }

        // Ensure Attachment is small enough to be uploaded as a Discord Custom Emoji
        if ( InputAttachment.size >= 256000 )
        {
            await slashCommand.reply({ ephemeral: true, content: `Sorry, but that Emoji File is too large to be uploaded as a Custom Emoji.\nDiscord requires Custom Emojis to be smaller than 256kb in file size. Please try again once you have a smaller file size for your Custom Emoji.` });
            return;
        }

        // Ensure no outages
        if ( !slashCommand.guild.available )
        {
            await slashCommand.reply({ ephemeral: true, content: `Sorry, but this Command is unusable while there's a Discord Outage affecting your Server. You can check [Discord's Outage Page](https://discordstatus.com) for extra details.` });
            return;
        }

        // Defer, just in case
        await slashCommand.deferReply({ ephemeral: true });

        // Upload to Server        
        await slashCommand.guild.emojis.create({ attachment: InputAttachment.url, name: "UnnamedEmoji", roles: [InputRole.id], reason: `Role-locked Custom Emoji uploaded by ${slashCommand.user.tag}` })
        .then(async newEmoji => {
            slashCommand.editReply({ content: `Successfully uploaded your new Role-locked Custom Emoji to this Server. You can rename and/or delete your Emoji, much like others, in Server Settings > Emojis, providing you have the __Manage Emojis and Stickers__ Permission.` });
            return;
        })
        .catch(async err => {
            //console.error(err);
            await slashCommand.editReply({ content: `Sorry, but there was an error trying to upload your Custom Emoji to this Server.
Preview of the raw error:
\`\`\`
${err}
\`\`\`` 
            });
            return;
        });

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
