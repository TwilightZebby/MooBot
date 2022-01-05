// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');

module.exports = {
    /**
     * Main function for Slash Command Handler
     * 
     * @param {Discord.CommandInteraction} slashInteraction
     * 
     * @returns {Promise<*>}
     */
    async Main(slashInteraction)
    {
        const slashCommand = client.slashCommands.get(slashInteraction.commandName);

        if ( !slashCommand )
        {
            // Couldn't find Slash Command, this error shouldn't ever appear tho
            return await slashInteraction.reply({ content: CONSTANTS.errorMessages.SLASH_COMMAND_GENERIC_FAILED_RARE.replace("{{commandName}}", slashInteraction.commandName), ephemeral: true });
        }


        // Test for DM usage
        if ( slashCommand.dmOnly && !(slashInteraction.channel instanceof Discord.DMChannel) )
        {
            return await slashInteraction.reply({ content: CONSTANTS.errorMessages.SLASH_COMMAND_DMS_ONLY, ephemeral: true });
        }


        // Test for Guild usage
        if ( slashInteraction.guildOnly && (slashInteraction.channel instanceof Discord.DMChannel) )
        {
            return await slashInteraction.reply({ content: CONSTANTS.errorMessages.SLASH_COMMAND_GUILDS_ONLY, ephemeral: true });
        }



        // Command Cooldowns
        if ( !client.slashCooldowns.has(slashCommand.name) )
        {
            // No cooldown found, make it
            client.slashCooldowns.set(slashCommand.name, new Discord.Collection());
        }



        const now = Date.now();
        const timestamps = client.slashCooldowns.get(slashCommand.name);
        const cooldownAmount = ( slashCommand.cooldown || 3 ) * 1000;



        if ( timestamps.has(slashInteraction.user.id) )
        {
            const expirationTime = timestamps.get(slashInteraction.user.id) + cooldownAmount;

            if ( now < expirationTime )
            {
                let timeLeft = ( expirationTime - now ) / 1000;

                // Minutes
                if ( timeLeft >= 60 && timeLeft < 3600 )
                {
                    timeLeft /= 60;
                    let cooldownMessage = CONSTANTS.errorMessages.SLASH_COMMAND_COOLDOWN.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)} more minutes`).replace("{{commandName}}", `**${slashInteraction.commandName}**`);
                    return await slashInteraction.reply({ content: cooldownMessage, ephemeral: true });
                }
                // Hours
                else if ( timeLeft >= 3600 && timeLeft < 86400 )
                {
                    timeLeft /= 3600;
                    let cooldownMessage = CONSTANTS.errorMessages.SLASH_COMMAND_COOLDOWN.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)} more hours`).replace("{{commandName}}", `**${slashInteraction.commandName}**`);
                    return await slashInteraction.reply({ content: cooldownMessage, ephemeral: true });
                }
                // Days
                else if ( timeLeft >= 86400 && timeLeft < 2.628e+6 )
                {
                    timeLeft /= 86400;
                    let cooldownMessage = CONSTANTS.errorMessages.SLASH_COMMAND_COOLDOWN.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)} more days`).replace("{{commandName}}", `**${slashInteraction.commandName}**`);
                    return await slashInteraction.reply({ content: cooldownMessage, ephemeral: true });
                }
                // Months
                else if ( timeLeft >= 2.628e+6 )
                {
                    timeLeft /= 2.628e+6;
                    let cooldownMessage = CONSTANTS.errorMessages.SLASH_COMMAND_COOLDOWN.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)} more months`).replace("{{commandName}}", `**${slashInteraction.commandName}**`);
                    return await slashInteraction.reply({ content: cooldownMessage, ephemeral: true });
                }
                // Seconds
                else
                {
                    let cooldownMessage = CONSTANTS.errorMessages.SLASH_COMMAND_COOLDOWN.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)} more seconds`).replace("{{commandName}}", `**${slashInteraction.commandName}**`);
                    return await slashInteraction.reply({ content: cooldownMessage, ephemeral: true });
                }
            }
        }
        else
        {
            timestamps.set(slashInteraction.user.id, now);
            setTimeout(() => timestamps.delete(slashInteraction.user.id), cooldownAmount);
        }



        // Attempt to run the Slash Command
        try
        {
            await slashCommand.execute(slashInteraction);
        }
        catch (err)
        {
            console.error(err);

            // Just in case it was deferred
            if ( slashInteraction.deferred )
            {
                await slashInteraction.editReply({ content: CONSTANTS.errorMessages.SLASH_COMMAND_GENERIC_FAILED.replace("{{commandName}}", slashInteraction.commandName) });
            }
            else
            {
                await slashInteraction.reply({ content: CONSTANTS.errorMessages.SLASH_COMMAND_GENERIC_FAILED.replace("{{commandName}}", slashInteraction.commandName), ephemeral: true });
            }
        }

        return;
    }
}
