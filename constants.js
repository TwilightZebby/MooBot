const Discord = require("discord.js");



module.exports = {
    // Discord Client representing the Bot
    client: new Discord.Client({ intents: [ Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_INTEGRATIONS ] }),
    

    // STRINGS
    errorMessages: {
        GENERIC: `Whoops! Something went wrong! Feel free to try again in a few moments.`,
        GENERIC_RARE: `Whoops, something went wrong! Feel free to try again in a few moments - if you keep seeing this error then please contact TwilightZebby#1955 (the developer of this Bot).`,

        TEXT_COMMAND_DMS_ONLY: `Sorry, but that Command can only be used in DMs with me.`,
        TEXT_COMMAND_GUILDS_ONLY: `Sorry, but that Command can only be used in Servers, not in DMs with me.`,
        TEXT_COMMAND_NO_PERMISSION_DEVELOPER: `Sorry, but that Command can only be used by my developer!`,
        TEXT_COMMAND_NO_PERMISSION_OWNER: `Sorry, but that Command can only be used by the Owner of this Server!`,
        TEXT_COMMAND_NO_PERMISSION_ADMIN: `Sorry, but that Command can only be used by the Owner of this Server, and those with the \`ADMINISTRATOR\` Permission.`,
        TEXT_COMMAND_NO_PERMISSION_MODERATOR: `Sorry, but that Command can only be used by this Server's Moderators, those with the \`ADMINISTRATOR\` Permission, and this Server's Owner.`,
        TEXT_COMMAND_ARGUMENTS_REQUIRED: `Sorry, but this Command requires arguments to be included in its usage.\n`,
        TEXT_COMMAND_ARGUMENTS_MINIMUM: `Sorry, but this Command requires a **minimum** of {{minimumArguments}} arguments, while you only included {{givenArguments}} arguments.`,
        TEXT_COMMAND_ARGUMENTS_MAXIMUM: `Sorry, but this Command requires a **maximum** of {{maximumArguments}} arguments, while you only included {{givenArguments}} arguments`,
        TEXT_COMMAND_COOLDOWN: `Please wait {{commandCooldown}} before using the {{commandName}} Command again.`,
        TEXT_COMMAND_GENERIC_FAILED: `Sorry, but there was a problem trying to run the {{commandName}} Command. Please try again in a few moments.`,
        TEXT_COMMAND_GENERIC_FAILED_RARE: `Sorry, but there was a problem trying to run the {{commandName}} Command. Please try again in a few moments.\nIf you continue to see this error, please contact TwilightZebby#1955`,

        SLASH_COMMAND_GENERIC_FAILED: `Sorry, but there was a problem trying to run the {{commandName}} Slash Command.`,
        SLASH_COMMAND_GENERIC_FAILED_RARE: `Sorry, but there was a problem trying to run the {{commandName}} Slash Command.\nIf you continue to see this error, please contact TwilightZebby#1955`,
        SLASH_COMMAND_DMS_ONLY: `Sorry, but this Slash Command can only be used in DMs with me.`,
        SLASH_COMMAND_GUILDS_ONLY: `Sorry, but this Slash Command can only be used in Servers, not in DMs with me.`,
        SLASH_COMMAND_COOLDOWN: `Please wait {{commandCooldown}} before using the {{commandName}} Slash Command again.`,

        CONTEXT_COMMAND_GENERIC_FAILED: `Sorry, but there was a problem trying to run the {{commandName}} Context Command.`,
        CONTEXT_COMMAND_GENERIC_FAILED_RARE: `Sorry, but there was a problem trying to run the {{commandName}} Context Command.\nIf you continue to see this error, please contact TwilightZebby#1955`,
        CONTEXT_COMMAND_COOLDOWN: `Please wait {{commandCooldown}} before using the {{commandName}} Context Command again.`,

        SELECT_MENU_GENERIC_FAILED: `Sorry, but there was a problem trying to process that Select Menu choice.`,
        SELECT_MENU_GENERIC_FAILED_RARE: `Sorry, but there was a problem trying to process that Select Menu choice.\nIf you continue to see this error, please contact TwilightZebby#1955`,

        BUTTON_GENERIC_FAILED: `Sorry, but there was a problem trying to process that Button press.`,
        BUTTON_GENERIC_FAILED_RARE: `Sorry, but there was a problem trying to process that Button press.\nIf you continue to see this error, please contact TwilightZebby#1955`
    },




    // COMPONENTS
    components: {
        selects: {
            /** Initial Select Menu that is shown upon triggering /rolemenu
             * @type {Discord.MessageActionRow<Discord.MessageSelectMenu>}
             */
            ROLE_MENU_INITIAL: new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu().setCustomId(`rolemenu`).setMaxValues(1).setMinValues(1).setOptions([
                    { label: "Create Menu", value: "create_menu", description: "Creates a new Menu for Users to toggle Roles from", emoji: "<:ChannelCategory:816771723264393236>" },
                    { label: "Add Role", value: "add_role", description: "Add a Role to an existing Menu", emoji: "<:plusGrey:941654979222077490>" },
                    { label: "Edit Role", value: "edit_role", description: "Edit an existing Button for a Role", emoji: "<:IconSettings:778931333459738626>" },
                    { label: "Remove Role", value: "remove_role", description: "Remove a Role from an existing Menu", emoji: "<:binGrey:941654671716655154>" }
                ]).setPlaceholder("Please select an action")
            ),
            /** Select Menu shown when wanting to create a new Role Menu
             * @type {Discord.MessageActionRow<Discord.MessageSelectMenu>}
             */
             ROLE_MENU_CREATE_NO_ROLES: new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu().setCustomId(`createrolemenu`).setMaxValues(1).setMinValues(1).setPlaceholder("Please select an action").setOptions([
                    { label: "Configure Embed", value: "configure_embed", description: "Set the Title, Description, and Colour of the Embed", emoji: "<:StatusRichPresence:842328614883295232>" },
                    { label: "Add Role", value: "add_role", description: "Add a Role to the Menu", emoji: "<:plusGrey:941654979222077490>" }
                ])
            ),
            /** Select Menu shown when wanting to create a new Role Menu, for when there are added Role Buttons
             * @type {Discord.MessageActionRow<Discord.MessageSelectMenu>}
             */
            ROLE_MENU_CREATE: new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu().setCustomId(`createrolemenu`).setMaxValues(1).setMinValues(1).setPlaceholder("Please select an action").setOptions([
                    { label: "Configure Embed", value: "configure_embed", description: "Set the Title, Description, and Colour of the Embed", emoji: "<:StatusRichPresence:842328614883295232>" },
                    { label: "Add Role", value: "add_role", description: "Add a Role to the Menu", emoji: "<:plusGrey:941654979222077490>" },
                    { label: "Edit Role", value: "edit_role", description: "Edit a Role on the Menu", emoji: "<:IconSettings:778931333459738626>" }
                    { label: "Remove Role", value: "remove_role", description: "Remove a Role from the Menu", emoji: "<:binGrey:941654671716655154>" },
                    { label: "Save and Display", value: "save", description: "Saves the new Menu, and displays it for members to use", emoji: "<:IconActivity:815246970457161738>" }
                ])
            )
        }
    }
}
