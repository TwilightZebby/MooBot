const { RoleSelectMenuInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Collections } = require("../../constants");

module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "configure-menu-add-role",

    // Select's Description
    Description: `Handles Role Select for adding a Role to a Menu during configuration (Role ID)`,

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

        // Validate Role hasn't already been added to this menu
        const RoleDataCache = Collections.RoleMenuConfiguration.get(selectInteraction.guildId).roles;
        let isRoleAdded = RoleDataCache.find(roleObj => roleObj.id === InputRole.id);
        if ( isRoleAdded != undefined )
        {
            await selectInteraction.update({ content: `Please use the Role Select Menu below to pick which Role from this Server you would like to add to your Role Menu.

⚠ <@&${InputRole.id}> has already been added to this Role Menu!` });
            return;
        }

        // Validate Role is LOWER than Bot's own highest Role
        let botMember = selectInteraction.guild.members.me;
        let roleCompare = selectInteraction.guild.roles.comparePositions(InputRole.id, botMember.roles.highest.id);
        if ( roleCompare >= 0 )
        {
            await selectInteraction.update({ content: `Please use the Role Select Menu below to pick which Role from this Server you would like to add to your Role Menu.

⚠ <@&${InputRole.id}> is higher than this Bot's own highest Role (<@&${botMember.roles.highest.id}>) - as such, this Bot won't be able to grant/revoke it for other Members.` });
            return;
        }

        // Select for setting the *type* of Button for the Menu
        const ButtonTypeSelect = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder().setCustomId(`configure-menu-add-button_${InputRole.id}`).setMinValues(1).setMaxValues(1).setPlaceholder("Select a Button type").setOptions([
                new StringSelectMenuOptionBuilder().setLabel("Blurple").setValue("blurple"),
                new StringSelectMenuOptionBuilder().setLabel("Green").setValue("green"),
                new StringSelectMenuOptionBuilder().setLabel("Grey").setValue("grey"),
                new StringSelectMenuOptionBuilder().setLabel("Red").setValue("red")
            ])
        ]);

        // Update Message for next step - selecting Button Type to use
        await selectInteraction.update({ components: [ButtonTypeSelect], content: `**Selected Role: <@&${InputRole.id}>**\nNext, please use the Select Menu below to pick which [type of Button](https://i.imgur.com/NDgzcYa.png) you want to use for this Role.` });
        return;
    }
}
