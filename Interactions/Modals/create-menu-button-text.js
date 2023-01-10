const { ModalMessageModalSubmitInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const EmojiRegex = require("emoji-regex")();
const { DiscordClient, Collections } = require("../../constants.js");

const DiscordEmojiRegex = new RegExp(/<a?:(?<name>[a-zA-Z0-9\_]+):(?<id>\d{15,21})>/);

const MenuSelect = new ActionRowBuilder().addComponents([
    new StringSelectMenuBuilder().setCustomId(`create-role-menu`).setMinValues(1).setMaxValues(1).setPlaceholder("Please select an action").setOptions([
        new StringSelectMenuOptionBuilder().setLabel("Configure Embed").setValue("configure-embed").setDescription("Set the Title, Description, and Colour of the Embed").setEmoji(`<:StatusRichPresence:842328614883295232>`),
        new StringSelectMenuOptionBuilder().setLabel("Add Role").setValue("add-role").setDescription("Add a Role to the Menu").setEmoji(`<:plusGrey:997752068439818280>`),
        new StringSelectMenuOptionBuilder().setLabel("Remove Role").setValue("remove-role").setDescription("Remove a Role from the Menu").setEmoji(`<:IconDeleteTrashcan:750152850310561853>`),
        new StringSelectMenuOptionBuilder().setLabel("Save & Display").setValue("save").setDescription("Saves the new Menu, and displays it for Members to use").setEmoji(`<:IconActivity:815246970457161738>`),
        new StringSelectMenuOptionBuilder().setLabel("Cancel Creation").setValue("cancel").setDescription("Cancels creation of this Role Menu").setEmoji(`❌`)
    ])
]);

module.exports = {
    // Modal's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "create-menu-button-text",

    // Modal's Description
    Description: `Processes addition of a new Button during creation of Role Menus`,



    /**
     * Executes the Modal
     * @param {ModalMessageModalSubmitInteraction} modalInteraction 
     */
    async execute(modalInteraction)
    {
        // Grab inputs
        const SplitCustomID = modalInteraction.customId.split("_");
        const ButtonType = SplitCustomID.pop();
        const RoleID = SplitCustomID.pop();
        const InputLabel = modalInteraction.fields.getTextInputValue("label");
        const InputEmoji = modalInteraction.fields.getTextInputValue("emoji");

        // Validate *an* input was included
        if ( (InputLabel == "" && InputLabel == " " && InputLabel == null && InputLabel == undefined) && (InputEmoji == "" && InputEmoji == " " && InputEmoji == null && InputEmoji == undefined) )
        {
            await modalInteraction.update({ content: `**Selected Role: <@&${InputRole.id}>**
Next, please use the Select Menu below to pick which [type of Button](https://i.imgur.com/NDgzcYa.png) you want to use for this Role.

⚠ Sorry, but you cannot leave both the Label and the Emoji fields blank. Please try again (after re-selecting the Button Type), making sure to fill in at least one of the fields needed for Buttons.` });
            return;
        }

        // Validate Emoji
        if ( InputEmoji == "" && InputEmoji == " " && InputEmoji == null && InputEmoji == undefined )
        {
            if ( !DiscordEmojiRegex.test(InputEmoji) && !EmojiRegex.test(InputEmoji) )
            {
                await modalInteraction.update({ content: `**Selected Role: <@&${InputRole.id}>**
Next, please use the Select Menu below to pick which [type of Button](https://i.imgur.com/NDgzcYa.png) you want to use for this Role.

⚠ Sorry, but there was an error trying to validate your included Emoji. Please try again (after re-selecting the Button Type), ensuring you use either an [Unicode Emoji](<https://emojipedia.org>) or a raw Discord Custom Emoji string (example: \`<:grass_block:601353406577246208>\`)` });
                return;
            }
        }


        // Update Cache & create new Button
        let menuData = Collections.RoleMenuCreation.get(modalInteraction.guildId);
        let roleCache = menuData.roles;
        if ( !roleCache ) { roleCache = []; }
        let newRoleData = { id: RoleID, emoji: null, label: null };

        let newRoleButton = new ButtonBuilder().setCustomId(`new-role-edit_${RoleID}`)
        .setStyle(ButtonType === 'blurple' ? ButtonStyle.Primary : ButtonType === 'green' ? ButtonStyle.Success : ButtonType === 'grey' ? ButtonStyle.Secondary : ButtonStyle.Danger);

        if ( InputLabel != "" && InputLabel != " " && InputLabel != null && InputLabel != undefined )
        {
            newRoleData.label = InputLabel;
            newRoleButton.setLabel(InputLabel);
        }

        if ( InputEmoji != "" && InputEmoji != " " && InputEmoji != null && InputEmoji != undefined )
        {
            newRoleData.emoji = InputEmoji;
            newRoleButton.setEmoji(InputEmoji);
        }

        // Fetch existing Buttons, if any
        let buttonCache = menuData.buttons;
        if ( !buttonCache || buttonCache.length < 1 ) { buttonCache = [newRoleButton]; }
        else { buttonCache.push(newRoleButton); }

        // Save Buttons & Roles
        menuData.buttons = buttonCache;
        roleCache.push(newRoleData);
        menuData.roles = roleCache;


        // Construct Arrays for Buttons to go into the Menu, and add to Embed
        let menuEmbed = menuData.embed.spliceFields(0, 3);
        /** @type {Array<ActionRowBuilder>} */
        let updatedButtonsArray = [];
        let temp;
        let roleEmbedTextFieldOne = "";
        let roleEmbedTextFieldTwo = "";

        for ( let i = 0; i <= buttonCache.length - 1; i++ )
        {
            if ( i === 0 )
            {
                // First Button on first row
                temp = new ActionRowBuilder().addComponents(buttonCache[i]);
                roleEmbedTextFieldOne += `• <@&${roleCache[i].id}> - ${roleCache[i].emoji != null ? roleCache[i].emoji : ""} ${roleCache[i].label != null ? roleCache[i].label : ""}\n`;
                // push early if only Button
                if ( buttonCache.length - 1 === i ) { updatedButtonsArray.push(temp); }
            }
            else if ( i > 0 && i < 4 )
            {
                // First row, buttons two through four
                temp.addComponents(buttonCache[i]);
                roleEmbedTextFieldOne += `• <@&${roleCache[i].id}> - ${roleCache[i].emoji != null ? roleCache[i].emoji : ""} ${roleCache[i].label != null ? roleCache[i].label : ""}\n`;
                // push early if last Button
                if ( buttonCache.length - 1 === i ) { updatedButtonsArray.push(temp); }
            }
            else if ( i === 4 )
            {
                // First row, fifth button
                temp.addComponents(buttonCache[i]);
                if ( roleEmbedTextFieldOne.length <= 1000 ) { roleEmbedTextFieldOne += `• <@&${roleCache[i].id}> - ${roleCache[i].emoji != null ? roleCache[i].emoji : ""} ${roleCache[i].label != null ? roleCache[i].label : ""}\n`; }
                else { roleEmbedTextFieldTwo += `• <@&${roleCache[i].id}> - ${roleCache[i].emoji != null ? roleCache[i].emoji : ""} ${roleCache[i].label != null ? roleCache[i].label : ""}\n`; }
                // Free up TEMP ready for second row
                updatedButtonsArray.push(temp);
                temp = new ActionRowBuilder();
            }
            else if ( i > 4 && i < 9 )
            {
                // Second row, buttons one through four
                temp.addComponents(buttonCache[i]);
                if ( roleEmbedTextFieldOne.length <= 1000 ) { roleEmbedTextFieldOne += `• <@&${roleCache[i].id}> - ${roleCache[i].emoji != null ? roleCache[i].emoji : ""} ${roleCache[i].label != null ? roleCache[i].label : ""}\n`; }
                else { roleEmbedTextFieldTwo += `• <@&${roleCache[i].id}> - ${roleCache[i].emoji != null ? roleCache[i].emoji : ""} ${roleCache[i].label != null ? roleCache[i].label : ""}\n`; }
                // push early if last Button
                if ( buttonCache.length - 1 === i ) { updatedButtonsArray.push(temp); }
            }
            else if ( i === 9 )
            {
                // Second row, fifth button
                temp.addComponents(buttonCache[i]);
                if ( roleEmbedTextFieldOne.length <= 1000 ) { roleEmbedTextFieldOne += `• <@&${roleCache[i].id}> - ${roleCache[i].emoji != null ? roleCache[i].emoji : ""} ${roleCache[i].label != null ? roleCache[i].label : ""}\n`; }
                else { roleEmbedTextFieldTwo += `• <@&${roleCache[i].id}> - ${roleCache[i].emoji != null ? roleCache[i].emoji : ""} ${roleCache[i].label != null ? roleCache[i].label : ""}\n`; }
                updatedButtonsArray.push(temp);
            }
            else { break; }
        }

        // Add Select Menu
        updatedButtonsArray.push(MenuSelect);

        // Add to Embed
        menuEmbed.addFields({ name: `\u200B`, value: roleEmbedTextFieldOne });
        if ( roleEmbedTextFieldTwo.length > 5 ) { menuEmbed.addFields({ name: `\u200B`, value: roleEmbedTextFieldTwo }); }
        menuData.embed = menuEmbed;

        // Update Menu
        await menuData.interaction.editReply({ components: updatedButtonsArray, embeds: [menuEmbed] });
        await modalInteraction.deferUpdate();
        await modalInteraction.deleteReply();

        // Purge interaction from cache
        menuData.interaction = null;
        // Save to cache
        Collections.RoleMenuCreation.set(modalInteraction.guildId, menuData);

        return;
    }
}
