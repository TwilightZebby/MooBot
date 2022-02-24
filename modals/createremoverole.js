// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Modal's Name, used as start of its Custom ID
    name: 'createremoverole',
    // Modal's description, purely for documentation
    description: `Used to fetch the ID of the Role to be removed from the Menu`,



    /**
     * Main function that runs this modal
     * 
     * @param {Discord.ModalSubmitInteraction} modalInteraction Modal Interaction
     */
    async execute(modalInteraction)
    {
        let inputRoleID = modalInteraction.fields.getTextInputValue("roleid");

        // Validate Role does indeed exist on the Menu
        let roleCache = client.roleMenu.get("createMenuRoleCache");
        if ( !roleCache )
        {
            await modalInteraction.update({ components: [CONSTANTS.components.selects.ROLE_MENU_CREATE] });
            return await modalInteraction.followUp({ content: CONSTANTS.errorMessages.GENERIC, ephemeral: true });
        }

        let doesRoleExist = false;
        for (const roleCacheObject of roleCache)
        {
            if ( roleCacheObject.roleID === inputRoleID ) { doesRoleExist = true; break; }
        }

        if ( !doesRoleExist )
        {
            await modalInteraction.update({ components: [CONSTANTS.components.selects.ROLE_MENU_CREATE] });
            return await modalInteraction.followUp({ content: `That Role ID doesn't seem to match an existing Role on the Menu.\nPlease try again, ensuring the Role ID is for a Role already on this Menu`, ephemeral: true });
        }

        return await modalInteraction.followUp({ content: `Test go brrrrrr`, ephemeral: true });
    }
};
