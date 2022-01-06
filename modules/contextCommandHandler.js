// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');

module.exports = {
    /**
     * Main function for Context Command Handler
     * 
     * @param {Discord.ContextMenuInteraction} contextInteraction
     * 
     * @returns {Promise<*>}
     */
    async Main(contextInteraction)
    {
        // Catch for spaces in Context Command Names
        if ( contextInteraction.commandName.includes(" ") )
        {
            contextInteraction.commandName = contextInteraction.commandName.split(" ").join("_");
        }

        // Find context command
        const contextCommand = client.contextCommands.get(contextInteraction.commandName);

        if ( !contextCommand )
        {
            // Couldn't find Context Command, this error shouldn't ever appear tho
            return await contextInteraction.reply({ content: CONSTANTS.errorMessages.CONTEXT_COMMAND_GENERIC_FAILED_RARE.replace("{{commandName}}", `**${contextInteraction.commandName}**`), ephemeral: true });
        }




        // Command Cooldowns
        if ( !client.contextCooldowns.has(contextCommand.name) )
        {
            // No cooldown found, make it
            client.contextCooldowns.set(contextCommand.name, new Discord.Collection());
        }



        const now = Date.now();
        const timestamps = client.contextCooldowns.get(contextCommand.name);
        const cooldownAmount = ( contextCommand.cooldown || 3 ) * 1000;



        if ( timestamps.has(contextInteraction.user.id) )
        {
            const expirationTime = timestamps.get(contextInteraction.user.id) + cooldownAmount;

            if ( now < expirationTime )
            {
                let timeLeft = ( expirationTime - now ) / 1000;

                // Minutes
                if ( timeLeft >= 60 && timeLeft < 3600 )
                {
                    timeLeft /= 60;
                    let cooldownMessage = CONSTANTS.errorMessages.CONTEXT_COMMAND_COOLDOWN.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)} more minutes`).replace("{{commandName}}", `**${contextInteraction.commandName}**`);
                    return await contextInteraction.reply({ content: cooldownMessage, ephemeral: true });
                }
                // Hours
                else if ( timeLeft >= 3600 && timeLeft < 86400 )
                {
                    timeLeft /= 3600;
                    let cooldownMessage = CONSTANTS.errorMessages.CONTEXT_COMMAND_COOLDOWN.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)} more hours`).replace("{{commandName}}", `**${contextInteraction.commandName}**`);
                    return await contextInteraction.reply({ content: cooldownMessage, ephemeral: true });
                }
                // Days
                else if ( timeLeft >= 86400 && timeLeft < 2.628e+6 )
                {
                    timeLeft /= 86400;
                    let cooldownMessage = CONSTANTS.errorMessages.CONTEXT_COMMAND_COOLDOWN.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)} more days`).replace("{{commandName}}", `**${contextInteraction.commandName}**`);
                    return await contextInteraction.reply({ content: cooldownMessage, ephemeral: true });
                }
                // Months
                else if ( timeLeft >= 2.628e+6 )
                {
                    timeLeft /= 2.628e+6;
                    let cooldownMessage = CONSTANTS.errorMessages.CONTEXT_COMMAND_COOLDOWN.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)} more months`).replace("{{commandName}}", `**${contextInteraction.commandName}**`);
                    return await contextInteraction.reply({ content: cooldownMessage, ephemeral: true });
                }
                // Seconds
                else
                {
                    let cooldownMessage = CONSTANTS.errorMessages.CONTEXT_COMMAND_COOLDOWN.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)} more seconds`).replace("{{commandName}}", `**${contextInteraction.commandName}**`);
                    return await contextInteraction.reply({ content: cooldownMessage, ephemeral: true });
                }
            }
        }
        else
        {
            timestamps.set(contextInteraction.user.id, now);
            setTimeout(() => timestamps.delete(contextInteraction.user.id), cooldownAmount);
        }



        // Attempt to run the Context Command
        try
        {
            await contextCommand.execute(contextInteraction);
        }
        catch (err)
        {
            console.error(err);

            // Just in case it was deferred
            if ( contextInteraction.deferred )
            {
                await contextInteraction.editReply({ content: CONSTANTS.errorMessages.CONTEXT_COMMAND_GENERIC_FAILED.replace("{{commandName}}", `**${contextInteraction.commandName}**`) });
            }
            else
            {
                await contextInteraction.reply({ content: CONSTANTS.errorMessages.CONTEXT_COMMAND_GENERIC_FAILED.replace("{{commandName}}", `**${contextInteraction.commandName}**`), ephemeral: true });
            }
        }

        return;
    }
}
