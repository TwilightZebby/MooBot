const { RoleSelectMenuInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Collections } = require("../../constants");

const NoRolesMenuSelect = new ActionRowBuilder().addComponents([
    new StringSelectMenuBuilder().setCustomId(`configure-role-menu`).setMinValues(1).setMaxValues(1).setPlaceholder("Please select an action").setOptions([
        new StringSelectMenuOptionBuilder().setLabel("Set Menu Type").setValue("set-type").setDescription("Change how the Menu will behave once saved").setEmoji(`🔧`),
        new StringSelectMenuOptionBuilder().setLabel("Configure Embed").setValue("configure-embed").setDescription("Set the Title, Description, and Colour of the Embed").setEmoji(`<:StatusRichPresence:842328614883295232>`),
        new StringSelectMenuOptionBuilder().setLabel("Add Role").setValue("add-role").setDescription("Add a Role to the Menu").setEmoji(`<:plusGrey:997752068439818280>`),
        new StringSelectMenuOptionBuilder().setLabel("Cancel Configuration").setValue("cancel").setDescription("Cancels configuration of this Role Menu").setEmoji(`❌`)
    ])
]);

const FullMenuSelect = new ActionRowBuilder().addComponents([
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
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "configure-menu-remove-role",

    // Select's Description
    Description: `Handles Role Select for removing a Role from a Menu during configuration (Role ID)`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 10,



    /**
     * Executes the Select
     * @param {RoleSelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        // Grab Role
        const InputRole = selectInteraction.roles.first();

        // Validate Role *IS* on this Menu
        const MenuDataCache = Collections.RoleMenuConfiguration.get(selectInteraction.guildId);
        const RoleDataCache = MenuDataCache.roles;
        const ButtonDataCache = MenuDataCache.buttons;
        let doesRoleExistOnMenu = false;

        for ( let i = 0; i <= RoleDataCache.length - 1; i++ )
        {
            if ( RoleDataCache[i].id === InputRole.id )
            {
                doesRoleExistOnMenu = true; // Mark existence
                RoleDataCache.splice(i, 1); // Removes from cache
                break;
            }
        }

        // Role doesn't exist on Menu, return with ACK message
        if ( !doesRoleExistOnMenu )
        {
            await selectInteraction.update({ content: `Please use the Role Select Menu below to pick which Role you want to *remove* from your Role Menu.

:warning: <@&${InputRole.id}> is __not__ on this Menu!` });
            return;
        }

        // Role DOES exist on Menu, now to remove the Button
        for ( let j = 0; j <= ButtonDataCache.length - 1; j++ )
        {
            if ( ButtonDataCache[j].data.custom_id === `configure-role-edit_${InputRole.id}` )
            {
                ButtonDataCache.splice(j, 1); // Remove from cache
                break;
            }
        }

        // Save back to Collection
        MenuDataCache.roles = RoleDataCache;
        MenuDataCache.buttons = ButtonDataCache;

        // Update Menu Message
        /** @type {Array<ActionRowBuilder>} */
        let updatedComponentsArray = [];
        let updatedMenuEmbed = MenuDataCache.embed.spliceFields(0, 3);
        let temp;
        let roleEmbedTextFieldOne = "";
        let roleEmbedTextFieldTwo = "";

        if ( ButtonDataCache.length >= 1 )
        {
            for ( let k = 0; k <= ButtonDataCache.length - 1; k++ )
            {
                if ( k === 0 )
                {
                    // First Button on first row
                    temp = new ActionRowBuilder().addComponents(ButtonDataCache[k]);
                    roleEmbedTextFieldOne += `• <@&${RoleDataCache[k].id}> - ${RoleDataCache[k].emoji != null ? RoleDataCache[k].emoji : ""} ${RoleDataCache[k].label != null ? RoleDataCache[k].label : ""}\n`;
                    // push early if only Button
                    if ( ButtonDataCache.length - 1 === k ) { updatedComponentsArray.push(temp); }
                }
                else if ( k > 0 && k < 4 )
                {
                    // First row, buttons two through four
                    temp.addComponents(ButtonDataCache[k]);
                    roleEmbedTextFieldOne += `• <@&${RoleDataCache[k].id}> - ${RoleDataCache[k].emoji != null ? RoleDataCache[k].emoji : ""} ${RoleDataCache[k].label != null ? RoleDataCache[k].label : ""}\n`;
                    // push early if last Button
                    if ( ButtonDataCache.length - 1 === k ) { updatedComponentsArray.push(temp); }
                }
                else if ( k === 4 )
                {
                    // First row, fifth button
                    temp.addComponents(ButtonDataCache[k]);
                    if ( roleEmbedTextFieldOne.length <= 1000 ) { roleEmbedTextFieldOne += `• <@&${RoleDataCache[k].id}> - ${RoleDataCache[k].emoji != null ? RoleDataCache[k].emoji : ""} ${RoleDataCache[k].label != null ? RoleDataCache[k].label : ""}\n`; }
                    else { roleEmbedTextFieldTwo += `• <@&${RoleDataCache[k].id}> - ${RoleDataCache[k].emoji != null ? RoleDataCache[k].emoji : ""} ${RoleDataCache[k].label != null ? RoleDataCache[k].label : ""}\n`; }
                    // Free up TEMP ready for second row
                    updatedComponentsArray.push(temp);
                    temp = new ActionRowBuilder();
                }
                else if ( k > 4 && k < 9 )
                {
                    // Second row, buttons one through four
                    temp.addComponents(ButtonDataCache[k]);
                    if ( roleEmbedTextFieldOne.length <= 1000 ) { roleEmbedTextFieldOne += `• <@&${RoleDataCache[k].id}> - ${RoleDataCache[k].emoji != null ? RoleDataCache[k].emoji : ""} ${RoleDataCache[k].label != null ? RoleDataCache[k].label : ""}\n`; }
                    else { roleEmbedTextFieldTwo += `• <@&${RoleDataCache[k].id}> - ${RoleDataCache[k].emoji != null ? RoleDataCache[k].emoji : ""} ${RoleDataCache[k].label != null ? RoleDataCache[k].label : ""}\n`; }
                    // push early if last Button
                    if ( ButtonDataCache.length - 1 === k ) { updatedComponentsArray.push(temp); }
                }
                else if ( k === 9 )
                {
                    // Second row, fifth button
                    temp.addComponents(ButtonDataCache[k]);
                    if ( roleEmbedTextFieldOne.length <= 1000 ) { roleEmbedTextFieldOne += `• <@&${RoleDataCache[k].id}> - ${RoleDataCache[k].emoji != null ? RoleDataCache[k].emoji : ""} ${RoleDataCache[k].label != null ? RoleDataCache[k].label : ""}\n`; }
                    else { roleEmbedTextFieldTwo += `• <@&${RoleDataCache[k].id}> - ${RoleDataCache[k].emoji != null ? RoleDataCache[k].emoji : ""} ${RoleDataCache[k].label != null ? RoleDataCache[k].label : ""}\n`; }
                    updatedComponentsArray.push(temp);
                }
                else { break; }
            }

            // Update Embed
            updatedMenuEmbed.addFields({ name: `\u200B`, value: roleEmbedTextFieldOne });
            if ( roleEmbedTextFieldTwo.length > 5 ) { updatedMenuEmbed.addFields({ name: `\u200B`, value: roleEmbedTextFieldTwo }); }

            // Use full Select Menu
            updatedComponentsArray.push(FullMenuSelect);
        }
        else
        {
            // No more buttons left, use smaller Select Menu
            updatedComponentsArray.push(NoRolesMenuSelect);
        }

        MenuDataCache.embed = updatedMenuEmbed;

        // Update Menu
        await MenuDataCache.interaction.editReply({ components: updatedComponentsArray, embeds: [updatedMenuEmbed] });
        await selectInteraction.deferUpdate();
        await selectInteraction.deleteReply();

        // Purge interaction from cache
        MenuDataCache.interaction = null;
        // Save to cache
        Collections.RoleMenuConfiguration.set(selectInteraction.guildId, MenuDataCache);

        return;
    }
}
