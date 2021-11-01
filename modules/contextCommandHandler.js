const Discord = require('discord.js');
const { client } = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');

const ErrorModule = require('./errorLog.js');

module.exports = {
    /**
     * Main function for the Context Command Handler
     * 
     * @param {Discord.ContextMenuInteraction} contextInteraction
     * 
     * @returns {Promise<*>} 
     */
    async Main(contextInteraction)
    {
        // To catch for Context CMDs that have spaces in their UI name
        if ( contextInteraction.commandName.includes(" ") )
        {
            contextInteraction.commandName = contextInteraction.commandName.split(" ").join("_");
        }

        // Find Command
        const contextCommand = client.contextCommands.get(contextInteraction.commandName);

        if ( !contextCommand )
        {
            // Couldn't find file for Context Command's behaviour
            return await contextInteraction.reply({ content: `Sorry, but something went wrong while trying to execute this Context Command.`, ephemeral: true });
        }


        // Cooldowns
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
                    return await contextInteraction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more minutes before using this Context Command again.`, ephemeral: true });
                }
                // Hours
                else if ( timeLeft >= 3600 && timeLeft < 86400 )
                {
                    timeLeft /= 3600;
                    return await contextInteraction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more hours before using this Context Command again.`, ephemeral: true });
                }
                // Days
                else if ( timeLeft >= 86400 && timeLeft < 2.628e+6 )
                {
                    timeLeft /= 86400;
                    return await contextInteraction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more days before using this Context Command again.`, ephemeral: true });
                }
                // Months
                else if ( timeLeft >= 2.628e+6 )
                {
                    timeLeft /= 2.628e+6;
                    return await contextInteraction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more months before using this Context Command again.`, ephemeral: true });
                }
                // Seconds
                else
                {
                    return await contextInteraction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more seconds before using this Context Command again.`, ephemeral: true });
                }
            }
        }
        else
        {
            timestamps.set(contextInteraction.user.id, now);
            setTimeout(() => timestamps.delete(contextInteraction.user.id), cooldownAmount);
        }






        // Attempt to run context command
        try
        {
            await contextCommand.execute(contextInteraction);
        }
        catch (err)
        {
            await ErrorModule.LogCustom(err, `Execute Context Command Failed: `);
            
            // Just in case
            if ( contextInteraction.deferred )
            {
                await contextInteraction.editReply({ content: `Sorry, but something went wrong while trying to run that Context Command.`, ephemeral: true });
            }
            else
            {
                await contextInteraction.reply({ content: `Sorry, but something went wrong while trying to run that Context Command.`, ephemeral: true });
            }
        }

        return;
    }
}
