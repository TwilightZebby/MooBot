const Discord = require("discord.js");



module.exports = {
    // Discord Client representing the Bot
    client: new Discord.Client({ intents: [ Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_INTEGRATIONS ], partials: [ 'MESSAGE' ] }),
    

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
        TEXT_COMMAND_NO_PERMISSION_GENERIC: `Sorry, but you do not have the permission to use that Command.`,
        TEXT_COMMAND_ARGUMENTS_REQUIRED: `Sorry, but this Command requires arguments to be included in its usage.\n`,
        TEXT_COMMAND_ARGUMENTS_MINIMUM: `Sorry, but this Command requires a **minimum** of {{minimumArguments}} arguments, while you only included {{givenArguments}} arguments.`,
        TEXT_COMMAND_ARGUMENTS_MAXIMUM: `Sorry, but this Command requires a **maximum** of {{maximumArguments}} arguments, while you only included {{givenArguments}} arguments`,
        TEXT_COMMAND_COOLDOWN: `Please wait {{commandCooldown}} before using the **{{commandName}}** Command again.`,
        TEXT_COMMAND_GENERIC_FAILED: `Sorry, but there was a problem trying to run the **{{commandName}}** Command. Please try again in a few moments.`,
        TEXT_COMMAND_GENERIC_FAILED_RARE: `Sorry, but there was a problem trying to run the **{{commandName}}** Command. Please try again in a few moments.\nIf you continue to see this error, please contact TwilightZebby#1955`,

        SLASH_COMMAND_GENERIC_FAILED: `Sorry, but there was a problem trying to run the **{{commandName}}** Slash Command.`,
        SLASH_COMMAND_GENERIC_FAILED_RARE: `Sorry, but there was a problem trying to run the **{{commandName}}** Slash Command.\nIf you continue to see this error, please contact TwilightZebby#1955`,
        SLASH_COMMAND_DMS_ONLY: `Sorry, but this Slash Command can only be used in DMs with me.`,
        SLASH_COMMAND_GUILDS_ONLY: `Sorry, but this Slash Command can only be used in Servers, not in DMs with me.`,
        SLASH_COMMAND_COOLDOWN: `Please wait {{commandCooldown}} before using the **{{commandName}}** Slash Command again.`,

        CONTEXT_COMMAND_GENERIC_FAILED: `Sorry, but there was a problem trying to run the **{{commandName}}** Context Command.`,
        CONTEXT_COMMAND_GENERIC_FAILED_RARE: `Sorry, but there was a problem trying to run the **{{commandName}}** Context Command.\nIf you continue to see this error, please contact TwilightZebby#1955`,
        CONTEXT_COMMAND_COOLDOWN: `Please wait {{commandCooldown}} before using the **{{commandName}}** Context Command again.`,

        SELECT_MENU_GENERIC_FAILED: `Sorry, but there was a problem trying to process that Select Menu choice.`,
        SELECT_MENU_GENERIC_FAILED_RARE: `Sorry, but there was a problem trying to process that Select Menu choice.\nIf you continue to see this error, please contact TwilightZebby#1955`,

        BUTTON_GENERIC_FAILED: `Sorry, but there was a problem trying to process that Button press.`,
        BUTTON_GENERIC_FAILED_RARE: `Sorry, but there was a problem trying to process that Button press.\nIf you continue to see this error, please contact TwilightZebby#1955`,
        BUTTON_COOLDOWN: `Please wait {{buttonCooldown}} before using that Button again.`
    },




    // COMPONENTS
    components: {
        selects: {
            /** Select Menu shown when wanting to create a new Role Menu
             * @type {Discord.MessageActionRow<Discord.MessageSelectMenu>}
             */
             ROLE_MENU_CREATE_NO_EMBED: new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu().setCustomId(`createrolemenu`).setMaxValues(1).setMinValues(1).setPlaceholder("Please select an action").setOptions([
                    { label: "Configure Embed", value: "configure_embed", description: "Set the Title, Description, and Colour of the Embed", emoji: "<:StatusRichPresence:842328614883295232>" },
                    { label: "Cancel Creation", value: "cancel", description: "Cancels creation of this Role Menu", emoji: "❌" }
                ])
            ),
            /** Select Menu shown when wanting to create a new Role Menu, after initial configuring of the Embed (needs at least the Title!)
             * @type {Discord.MessageActionRow<Discord.MessageSelectMenu>}
             */
             ROLE_MENU_CREATE_NO_ROLES: new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu().setCustomId(`createrolemenu`).setMaxValues(1).setMinValues(1).setPlaceholder("Please select an action").setOptions([
                    { label: "Configure Embed", value: "configure_embed", description: "Set the Title, Description, and Colour of the Embed", emoji: "<:StatusRichPresence:842328614883295232>" },
                    { label: "Add Role", value: "add_role", description: "Add a Role to the Menu", emoji: "<:plusGrey:941654979222077490>" },
                    { label: "Cancel Creation", value: "cancel", description: "Cancels creation of this Role Menu", emoji: "❌" }
                ])
            ),
            /** Select Menu shown when wanting to create a new Role Menu, for when there are added Role Buttons
             * @type {Discord.MessageActionRow<Discord.MessageSelectMenu>}
             */
            ROLE_MENU_CREATE: new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu().setCustomId(`createrolemenu`).setMaxValues(1).setMinValues(1).setPlaceholder("Please select an action").setOptions([
                    { label: "Configure Embed", value: "configure_embed", description: "Set the Title, Description, and Colour of the Embed", emoji: "<:StatusRichPresence:842328614883295232>" },
                    { label: "Add Role", value: "add_role", description: "Add a Role to the Menu", emoji: "<:plusGrey:941654979222077490>" },
                    { label: "Remove Role", value: "remove_role", description: "Remove a Role from the Menu", emoji: "<:IconDeleteTrashcan:750152850310561853>" },
                    { label: "Save and Display", value: "save", description: "Saves the new Menu, and displays it for Members to use", emoji: "<:IconActivity:815246970457161738>" },
                    { label: "Cancel Creation", value: "cancel", description: "Cancels creation of this Role Menu", emoji: "❌" }
                ])
            ),
            /** Select menu shown when wanting to edit an existing Role Menu
             * @type {Discord.MessageActionRow<Discord.MessageSelectMenu>}
             */
            ROLE_MENU_EDIT: new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu().setCustomId(`editrolemenu`).setMaxValues(1).setMinValues(1).setPlaceholder("Please select an action").setOptions([
                    { label: "Edit Embed", value: "edit_embed", description: "Change the Title, Description, and/or Colour of the Embed", emoji: "<:StatusRichPresence:842328614883295232>" },
                    { label: "Add Role", value: "add_role", description: "Add a new Role to the Menu", emoji: "<:plusGrey:941654979222077490>" },
                    { label: "Remove Role", value: "remove_role", description: "Remove a Role from the Menu", emoji: "<:IconDeleteTrashcan:750152850310561853>" },
                    { label: "Cancel Editing", value: "cancel", description: "Cancels editing of this Role Menu", emoji: "❌" }
                ])
            ),
            /** Select menu shown when wanting to edit an existing Role Menu, with Save option
             * @type {Discord.MessageActionRow<Discord.MessageSelectMenu>}
             */
             ROLE_MENU_EDIT_SAVE: new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu().setCustomId(`editrolemenu`).setMaxValues(1).setMinValues(1).setPlaceholder("Please select an action").setOptions([
                    { label: "Edit Embed", value: "edit_embed", description: "Change the Title, Description, and/or Colour of the Embed", emoji: "<:StatusRichPresence:842328614883295232>" },
                    { label: "Add Role", value: "add_role", description: "Add a new Role to the Menu", emoji: "<:plusGrey:941654979222077490>" },
                    { label: "Remove Role", value: "remove_role", description: "Remove a Role from the Menu", emoji: "<:IconDeleteTrashcan:750152850310561853>" },
                    { label: "Save and Update", value: "save", description: "Saves your changes to the Menu, and displays them", emoji: "<:IconActivity:815246970457161738>" },
                    { label: "Cancel Editing", value: "cancel", description: "Cancels editing of this Role Menu", emoji: "❌" }
                ])
            )
        },


        buttons: {
            /** Button shown for confirming a!shutdown
             * @type {Discord.MessageButton}
             */
            SHUTDOWN_CONFIRM: new Discord.MessageButton().setLabel(`Shutdown`).setStyle('DANGER'),
            /** Button shown for cancelling a!shutdown
             * @type {Discord.MessageButton}
             */
            SHUTDOWN_CANCEL: new Discord.MessageButton().setLabel(`Cancel`).setStyle('SUCCESS')
        }
    }
}
