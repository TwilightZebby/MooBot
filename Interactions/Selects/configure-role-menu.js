const { StringSelectMenuInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, RoleSelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const fs = require("fs");
const { Collections } = require("../../constants.js");

const AddRoleSelect = new ActionRowBuilder().addComponents([
    new RoleSelectMenuBuilder().setCustomId(`configure-menu-add-role`).setMinValues(1).setMaxValues(1).setPlaceholder("Search for a Role to add")
]);

const RemoveRoleSelect = new ActionRowBuilder().addComponents([
    new RoleSelectMenuBuilder().setCustomId(`configure-menu-remove-role`).setMinValues(1).setMaxValues(1).setPlaceholder("Search for a Role to remove")
]);

const SetTypeSelect = new ActionRowBuilder().addComponents([
    new StringSelectMenuBuilder().setCustomId(`configure-set-menu-type`).setMinValues(1).setMaxValues(1).setPlaceholder(`Select a Menu Type`).setOptions([
        new StringSelectMenuOptionBuilder().setValue(`TOGGLE`).setLabel(`Toggle`),
        new StringSelectMenuOptionBuilder().setValue(`SWAP`).setLabel(`Swappable`),
        new StringSelectMenuOptionBuilder().setValue(`SINGLE`).setLabel(`Single-use`)
    ])
]);

module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "configure-role-menu",

    // Select's Description
    Description: `Handles processing options for configuration of Role Menus`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 5,



    /**
     * Executes the Select
     * @param {StringSelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        // Grab value
        const SelectedOption = selectInteraction.values.shift();

        switch (SelectedOption)
        {
            // Set Menu Type
            case "set-type":
                await selectInteraction.deferUpdate();
                await selectInteraction.followUp({ ephemeral: true, components: [SetTypeSelect], content: `Please use the Select Menu below to pick which type of Role Menu you want.

• **TOGGLE** - Your standard Role Menu Type. Behaves like a classic Reaction Role Menu, but with Buttons instead.
• **SWAP** - Users can only have 1 Role per SWAP Menu. Attempting to select another Role on the same SWAP Menu would swap the two Roles instead. Useful for Colour Role Menus!
• **SINGLE-USE** - Users can only use a SINGLE-USE Menu once, and are unable to revoke the selected Role from themselves. Useful for Team Roles in Events.` });

                // Temp-store interaction so we can return to it
                let tempData = Collections.RoleMenuConfiguration.get(selectInteraction.guildId);
                tempData.interaction = selectInteraction;
                Collections.RoleMenuConfiguration.set(selectInteraction.guildId, tempData);
                break;


            // Edit Embed
            case "configure-embed":
                let embedData = Collections.RoleMenuConfiguration.get(selectInteraction.guildId)?.embed;

                let embedModal = new ModalBuilder().setCustomId(`configure-menu-embed`).setTitle(`Configure Menu Embed`).addComponents([
                    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`title`).setLabel("Embed Title").setMaxLength(256).setStyle(TextInputStyle.Short).setRequired(true).setValue(!embedData?.data.title ? "" : embedData.data.title) ]),
                    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`description`).setLabel("Embed Description").setMaxLength(2000).setStyle(TextInputStyle.Paragraph).setRequired(false).setValue(!embedData?.data.description ? "" : embedData.data.description) ]),
                    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`hex-colour`).setLabel("Embed Colour (In Hex Format)").setMaxLength(7).setPlaceholder("#ab44ff").setStyle(TextInputStyle.Short).setRequired(false).setValue(!embedData?.data.color ? "" : `${typeof embedData.data.color === 'number' ? `#${embedData.data.color.toString(16).padStart(6, '0')}` : embedData.data.color}`) ])
                ]);

                await selectInteraction.showModal(embedModal);
                break;


            // Add new Role to Menu
            case "add-role":
                // Validate Menu doesn't already have self-imposed max of 10 Buttons
                let fetchedButtons = Collections.RoleMenuConfiguration.get(selectInteraction.guildId).roles;
                if ( fetchedButtons?.length === 10 )
                {
                    await selectInteraction.reply({ ephemeral: true, content: `Sorry, but you cannot add more than 10 (ten) Role Buttons to a single Menu.` });
                    break;
                }

                // Ask for which Role to add
                await selectInteraction.deferUpdate(); // Just so the original is editable later
                await selectInteraction.followUp({ ephemeral: true, components: [AddRoleSelect], content: `Please use the Role Select Menu below to pick which Role from this Server you would like to add to your Role Menu.` });

                // Temp-store interaction so we can return to it
                let menuData = Collections.RoleMenuConfiguration.get(selectInteraction.guildId);
                menuData.interaction = selectInteraction;
                Collections.RoleMenuConfiguration.set(selectInteraction.guildId, menuData);
                break;


            // Remove Role from Menu
            case "remove-role":
                // ACK to User to choose which Role to remove from Menu
                await selectInteraction.deferUpdate(); // So original is editable later
                await selectInteraction.followUp({ ephemeral: true, components: [RemoveRoleSelect], content: `Please use the Role Select Menu below to pick which Role you want to *remove* from your Role Menu.` });

                // Temp-store interaction so we can return to it
                let menuDataRemove = Collections.RoleMenuConfiguration.get(selectInteraction.guildId);
                menuDataRemove.interaction = selectInteraction;
                Collections.RoleMenuConfiguration.set(selectInteraction.guildId, menuDataRemove);
                break;

            
            // Save & Display Menu
            case "save":
                await this.saveAndDisplay(selectInteraction);
                break;


            // Cancel configuration
            case "cancel":
                // Clear Timeout first, just in case
                let timeoutCache = Collections.RoleMenuConfiguration.get(selectInteraction.guildId).timeout;
                clearTimeout(timeoutCache);
                Collections.RoleMenuConfiguration.delete(selectInteraction.guildId);
                await selectInteraction.update({ embeds: [], components: [], content: `Configuration of Role Menu has been cancelled. You may now dismiss or delete this message.` });
                break;
                

            default:
                await selectInteraction.reply({ ephemeral: true, content: `An error occurred` });
                break;
        }

        return;
    },





    /**
     * Saves & Displays the new Menu for Members to use
     * @param {StringSelectMenuInteraction} selectInteraction 
     */
    async saveAndDisplay(selectInteraction)
    {
        // Defer
        await selectInteraction.deferUpdate();

        // Bring in JSON
        const RoleMenuJson = require("../../JsonFiles/Hidden/RoleMenus.json");

        // Fetch data
        const MenuDataCache = Collections.RoleMenuConfiguration.get(selectInteraction.guildId);
        const RoleDataCache = MenuDataCache.roles;
        const EmbedDataCache = MenuDataCache.embed.setFooter({ text: `Menu Type: ${MenuDataCache.type}` });
        const ButtonDataCache = MenuDataCache.buttons;
        const MenuType = MenuDataCache.type;

        // Construct Component Row(s)
        let temp;
        /** @type {Array<ActionRowBuilder>} */
        let buttonsArray = [];

        for ( let i = 0; i <= ButtonDataCache.length - 1; i++ )
        {
            // So that the Custom IDs of the Buttons can be updated from the "during creation" one to the "assign role" one
            let tempRoleID = ButtonDataCache[i].data.custom_id.split("_").pop();

            if ( i === 0 )
            {
                // First Button on first row
                temp = new ActionRowBuilder().addComponents(ButtonDataCache[i].setCustomId(`role_${tempRoleID}`));
                // push early if only Button
                if ( ButtonDataCache.length - 1 === i ) { buttonsArray.push(temp); }
            }
            else if ( i > 0 && i < 4 )
            {
                // First row, buttons two through four
                temp.addComponents(ButtonDataCache[i].setCustomId(`role_${tempRoleID}`));
                // push early if last Button
                if ( ButtonDataCache.length - 1 === i ) { buttonsArray.push(temp); }
            }
            else if ( i === 4 )
            {
                // First row, fifth button
                temp.addComponents(ButtonDataCache[i].setCustomId(`role_${tempRoleID}`));
                // Free up TEMP ready for second row
                buttonsArray.push(temp);
                temp = new ActionRowBuilder();
            }
            else if ( i > 4 && i < 9 )
            {
                // Second row, buttons one through four
                temp.addComponents(ButtonDataCache[i].setCustomId(`role_${tempRoleID}`));
                // push early if last Button
                if ( ButtonDataCache.length - 1 === i ) { buttonsArray.push(temp); }
            }
            else if ( i === 9 )
            {
                // Second row, fifth button
                temp.addComponents(ButtonDataCache[i].setCustomId(`role_${tempRoleID}`));
                buttonsArray.push(temp);
            }
            else { break; }
        }


        // Update Message with menu on
        await selectInteraction.channel.messages.fetch(MenuDataCache.originMessageId)
        .then(async fetchedMessage => {

            await fetchedMessage.edit({ embeds: [EmbedDataCache], components: buttonsArray, allowedMentions: { parse: [] } })
            .then(async sentMessage => {
                // Save to JSON
                RoleMenuJson[sentMessage.id] = {
                    MESSAGE_ID: sentMessage.id,
                    CHANNEL_ID: sentMessage.channel.id,
                    GUILD_ID: sentMessage.guild.id,
                    MENU_TYPE: MenuType,
                    ROLES: RoleDataCache,
                    EMBED: {
                        TITLE: EmbedDataCache.data.title,
                        DESCRIPTION: EmbedDataCache.data.description !== undefined ? EmbedDataCache.data.description : null,
                        COLOR: EmbedDataCache.data.color !== undefined ? EmbedDataCache.data.color : null
                    }
                };

                fs.writeFile('./JsonFiles/Hidden/RoleMenus.json', JSON.stringify(RoleMenuJson, null, 4), async (err) => {
                    if ( err )
                    { 
                        await selectInteraction.followUp({ content: `An error occurred while trying to save your updated Role Menu...`, ephemeral: true });
                        return;
                    }
                });


                // Clean up
                clearTimeout(MenuDataCache.timeout);
                Collections.RoleMenuConfiguration.delete(selectInteraction.guildId);
                await selectInteraction.deleteReply();
                return;
            })
            .catch(err => {
                //console.error(err);
                return;
            });

        });

        return;
    }
}
