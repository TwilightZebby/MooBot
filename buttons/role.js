// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Button's Name, used as start of its Custom ID
    name: 'role',
    // Button's description, purely for documentation
    description: `Grants/Revokes a Self-Assignable Role`,

    // Button's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 5,



    /**
     * Main function that runs this Button
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction Button Interaction
     */
    async execute(buttonInteraction)
    {
        // Fetch the Role in question
        let roleID = buttonInteraction.customId.split("_").pop();

        // Check if Member already has the Role, so we know if we need to grant or revoke it
        // Doing a forced refetch every time as to ensure updated Role Caches
        let guildMember = await buttonInteraction.guild.members.fetch({ user: buttonInteraction.user.id, force: true });

        if ( guildMember.roles.cache.has(roleID) )
        {
            // Member DOES has the Role already, thus revoke instead
            try
            {
                guildMember.roles.remove(roleID);
                return await buttonInteraction.reply({ content: `Successfully revoked the <@&${roleID}> Role from you.`, ephemeral: true });
            }
            catch (err)
            {
                return await buttonInteraction.reply({ content: `Sorry, something went wrong while trying to revoke the <@&${roleID}> Role from you.\nPlease try again in a few moments...`, ephemeral: true });
            }
        }
        else
        {
            // Member does NOT have the Role already, thus grant Role
            try
            {
                guildMember.roles.add(roleID);
                return await buttonInteraction.reply({ content: `Successfully granted you the <@&${roleID}> Role.`, ephemeral: true });
            }
            catch (err)
            {
                return await buttonInteraction.reply({ content: `Sorry, something went wrong while trying to grant you the <@&${roleID}> Role.\nPlease try again in a few moments...`, ephemeral: true });
            }
        }
    }
};
