const { ApplicationCommandType, ApplicationCommandData, ContextMenuCommandInteraction, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Collections } = require("../../constants.js");

const MenuSelect = new ActionRowBuilder().addComponents([
    new StringSelectMenuBuilder().setCustomId(`configure-role-menu`).setMinValues(1).setMaxValues(1).setPlaceholder("Please select an action").setOptions([
        new StringSelectMenuOptionBuilder().setLabel("Set Menu Type").setValue("set-type").setDescription("Change how the Menu will behave once saved").setEmoji(`🔧`),
        new StringSelectMenuOptionBuilder().setLabel("Configure Embed").setValue("configure-embed").setDescription("Set the Title, Description, and Colour of the Embed").setEmoji(`<:StatusRichPresence:842328614883295232>`),
        new StringSelectMenuOptionBuilder().setLabel("Add Role").setValue("add-role").setDescription("Add a Role to the Menu").setEmoji(`<:plusGrey:997752068439818280>`),
        new StringSelectMenuOptionBuilder().setLabel("Remove Role").setValue("remove-role").setDescription("Remove a Role from the Menu").setEmoji(`<:IconDeleteTrashcan:750152850310561853>`),
        new StringSelectMenuOptionBuilder().setLabel("Save & Update").setValue("save").setDescription("Saves the Menu, and updates it for Members to use").setEmoji(`<:IconActivity:815246970457161738>`),
        new StringSelectMenuOptionBuilder().setLabel("Cancel Configuration").setValue("cancel").setDescription("Cancels configuration of this Role Menu").setEmoji(`❌`)
    ])
]);

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

        // Ensure Bot has MANAGE_ROLES Permission
        if ( !contextCommand.appPermissions.has(PermissionFlagsBits.ManageRoles) )
        {
            await contextCommand.editReply({ context: `⚠ I do not seem to have the \`MANAGE_ROLES\` Permission! Please ensure I have been granted it in order for my Self-Assignable Role Module to work.` });
            return;
        }

        // Ensure Bot has READ_MESSAGE_HISTORY Permission to be able to edit the existing Role Menu
        if ( !contextCommand.appPermissions.has(PermissionFlagsBits.ReadMessageHistory) )
        {
            await contextCommand.editReply({ content: `Sorry, but I cannot edit an existing Role menu in this Channel without having the \`Read Message History\` Permission!` });
            return;
        }

        // Ensure there isn't already an active Role Menu Configuration happening in that Guild
        if ( Collections.RoleMenuConfiguration.has(contextCommand.guildId) )
        {
            await contextCommand.editReply({ content: `Sorry, but there seems to already be an active Role Menu Configuration happening on this Server right now; either by yourself or someone else.\nPlease either wait for the User to finish configuring their Role Menu, or for the inactive Configuration timer to expire (which is about one hour from initial use of Command).` });
            return;
        }




        // Setup for Menu Configuration
        const MenuData = RoleMenuJson[SourceMessage.id];
        const ConfigEmbed = new EmbedBuilder().setTitle(MenuData["EMBED"]["TITLE"]);

        // Embed
        if ( MenuData["EMBED"]["DESCRIPTION"] !== null ) { ConfigEmbed.setDescription(MenuData["EMBED"]["DESCRIPTION"]); }
        if ( MenuData["EMBED"]["COLOR"] !== null ) { ConfigEmbed.setColor(MenuData["EMBED"]["COLOR"]); }

        
        // Roles & Buttons
        /** @type {Array<{id: String, style: String, emoji: ?String, label: ?String}>} */
        const RoleCache = MenuData["ROLES"];
        /** @type {Array<ButtonBuilder>} */
        let buttonCache = [];
        /** @type {Array<ActionRowBuilder>} */
        let componentsArray = [];
        let temp;
        let roleEmbedTextFieldOne = "";
        let roleEmbedTextFieldTwo = "";
        let iCounter = 0;

        // Construct the Buttons && add to Embed
        RoleCache.forEach(role => {
            // Button stuff first
            let tempButtonStyle = role.style;
            let newButton = new ButtonBuilder().setCustomId(`configure-role-edit_${role.id}`)
            .setStyle(tempButtonStyle === 'blurple' ? ButtonStyle.Primary : tempButtonStyle === 'green' ? ButtonStyle.Success : tempButtonStyle === 'grey' ? ButtonStyle.Secondary : ButtonStyle.Danger);

            if ( role.label != null ) { newButton.setLabel(role.label); }
            if ( role.emoji != null ) { newButton.setEmoji(role.emoji); }

            buttonCache.push(newButton);

            
            // Components Array second
            if ( iCounter === 0 )
            {
                // Create first row
                temp = new ActionRowBuilder().addComponents(newButton);
                if ( RoleCache.length - 1 === iCounter ) { componentsArray.push(temp); }
            }
            else if ( iCounter > 0 && iCounter < 5 )
            {
                // First row still has space
                temp.addComponents(newButton);
                if ( RoleCache.length - 1 === iCounter ) { componentsArray.push(temp); }
            }
            else if ( iCounter === 5 )
            {
                // Move to second row
                componentsArray.push(temp);
                temp = new ActionRowBuilder().addComponents(newButton);
                if ( RoleCache.length - 1 === iCounter ) { componentsArray.push(temp); }
            }
            else if ( iCounter > 5 )
            {
                // Second row has space
                temp.addComponents(newButton);
                if ( RoleCache.length - 1 === iCounter ) { componentsArray.push(temp); }
            }


            // Embed Strings third
            if ( roleEmbedTextFieldOne.length <= 1000 ) { roleEmbedTextFieldOne += `• <@&${role.id}> - ${role.emoji != null ? role.emoji : ""} ${role.label != null ? role.label : ""}\n`; }
            else { roleEmbedTextFieldTwo += `• <@&${role.id}> - ${role.emoji != null ? role.emoji : ""} ${role.label != null ? role.label : ""}\n`; }

            iCounter++;
        });


        // Add Select Menu
        componentsArray.push(MenuSelect);

        // Add strings to Embed
        ConfigEmbed.addFields({ name: `\u200B`, value: roleEmbedTextFieldOne });
        if ( roleEmbedTextFieldTwo.length > 5 ) { ConfigEmbed.addFields({ name: `\u200B`, value: roleEmbedTextFieldTwo }); }

        // Auto-expire cache after one hour
        let timeoutExpiry = setTimeout(() => { Collections.RoleMenuConfiguration.delete(contextCommand.guildId); }, 3.6e+6);

        // Save to cache
        let newDataObject = {
            type: MenuData["MENU_TYPE"],
            originMessageId: SourceMessage.id,
            embed: ConfigEmbed,
            roles: RoleCache,
            buttons: buttonCache,
            interaction: null,
            timeout: timeoutExpiry
        };
        Collections.RoleMenuConfiguration.set(contextCommand.guildId, newDataObject);

        // Ack to User to begin Configuration Process
        await contextCommand.editReply({ components: componentsArray, embeds: [ConfigEmbed],
            content: `__**Self-Assignable Role Menu Configuration**__
Use the Select Menu to configure the Embed and Role Buttons. Press an existing Role Button to edit its label and/or emoji.
If including in Buttons, please make sure to have the relevant Emoji IDs ready (such as in a notepad program); as you won't be able to copy from a Discord Message while an Input Form is open.
Additionally, both Custom Discord Emojis, and standard Unicode Emojis, are supported.

An auto-updating preview of what your new Self-Assignable Role Menu will look like is shown below.`
        });

        return;
    }
}
