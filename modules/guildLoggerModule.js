// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const { ErrorLogGuildID, GuildLogChannelID } = require('../config.js');


module.exports = {
    /**
     * Logs whenever the Bot joins a Guild
     * 
     * @param {Discord.Guild} guild
     */
    async onJoin(guild)
    {
        // Basic info
        const guildOwner = await guild.fetchOwner();

        // Construct Embed
        const guildJoinedEmbed = new Discord.MessageEmbed().setColor('GREEN')
        .setTitle(`Joined ${guild.name}`)
        .setThumbnail(guild.iconURL({ format: 'png', dynamic: true }))
        .setDescription(`**Guild Owner:** ${guildOwner.user.username}\n**Guild Owner ID:** ${guild.ownerId}\n**Guild Member Count:** ${guild.memberCount}`);

        // Configure Buttons
        const actionRow = new Discord.MessageActionRow().addComponents(
            CONSTANTS.components.buttons.APPROVE_GUILD_JOIN.setCustomId(`guildjoin_approve_${guild.id}`),
            CONSTANTS.components.buttons.REJECT_GUILD_JOIN.setCustomId(`guildjoin_reject_${guild.id}`)
        );

        // Send into Logging Channel
        const logGuild = await client.guilds.fetch(ErrorLogGuildID);
        /** @type {Discord.TextChannel} */
        const logChannel = await logGuild.channels.fetch(GuildLogChannelID);
        return await logChannel.send({ embeds: [guildJoinedEmbed], components: [actionRow] });
    }
}
