// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Button's Name, used as start of its Custom ID
    name: 'inforole',
    // Button's description, purely for documentation
    description: `Shows Role information for the specified Member as part of /info user Command`,

    // Button's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 60,



    /**
     * Main function that runs this Button
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction Button Interaction
     */
    async execute(buttonInteraction)
    {
        // Grab target member ID
        const targetMemberID = buttonInteraction.customId.slice(9);
        const targetMember = await buttonInteraction.guild.members.fetch(targetMemberID);
        const targetMemberRoles = targetMember.roles.cache.filter(role => role.id !== targetMember.guild.id); // Filter out @everyone
        
        // Role Strings
        let roleStrings = [];
        targetMemberRoles.forEach(role => roleStrings.push(`<@&${role.id}>`));

        // Assemble Role information
        const memberRoleEmbed = new Discord.MessageEmbed().setColor(targetMember.displayHexColor)
        .setAuthor({ name: `Role Information for ${targetMember.displayName}`, iconURL: targetMember.displayAvatarURL({ dynamic: true, format: 'png' }) })
        .setTitle(`${targetMemberRoles.size} Roles:`)
        .setDescription(roleStrings.join(', '));

        // Send
        return buttonInteraction.reply({ embeds: [memberRoleEmbed], ephemeral: true });
    }
};
