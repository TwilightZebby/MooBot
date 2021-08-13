const Discord = require('discord.js');
const { client } = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');

const ErrorModule = require('./errorLog.js');

module.exports = {
    /**
     * Main function for the Slash Command Handler
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
            // Couldn't find file for Slash Command's behavour
            return await slashInteraction.reply({ content: `Sorry, but something went wrong while trying to execute this Slash Command.`, ephemeral: true });
        }




        // DM Test
        if ( slashCommand.dmOnly && !(slashInteraction.channel instanceof Discord.DMChannel) )
        {
            return await slashInteraction.reply({ content: `Sorry, but this Slash Command can only be used in DMs with the Bot.`, ephemeral: true });
        }


        // Guild Test
        if ( slashCommand.guildOnly && (slashInteraction.channel instanceof Discord.DMChannel) )
        {
            return await slashInteraction.reply({ content: `Sorry, but this Slash Command can only be used in Servers.`, ephemeral: true });
        }







        // Cooldowns
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
                    return await slashInteraction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more minutes before using this Slash Command again.`, ephemeral: true });
                }
                // Hours
                else if ( timeLeft >= 3600 && timeLeft < 86400 )
                {
                    timeLeft /= 3600;
                    return await slashInteraction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more hours before using this Slash Command again.`, ephemeral: true });
                }
                // Days
                else if ( timeLeft >= 86400 && timeLeft < 2.628e+6 )
                {
                    timeLeft /= 86400;
                    return await slashInteraction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more days before using this Slash Command again.`, ephemeral: true });
                }
                // Months
                else if ( timeLeft >= 2.628e+6 )
                {
                    timeLeft /= 2.628e+6;
                    return await slashInteraction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more months before using this Slash Command again.`, ephemeral: true });
                }
                // Seconds
                else
                {
                    return await slashInteraction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more seconds before using this Slash Command again.`, ephemeral: true });
                }
            }
        }
        else
        {
            timestamps.set(slashInteraction.user.id, now);
            setTimeout(() => timestamps.delete(slashInteraction.user.id), cooldownAmount);
        }






        // Attempt to run slash command
        try
        {
            await slashCommand.execute(slashInteraction);
        }
        catch (err)
        {
            await ErrorModule.LogCustom(err, `Execute Slash Command Failed: `);
            
            // Just in case
            if ( slashInteraction.deferred )
            {
                await slashInteraction.editReply({ content: `Sorry, but something went wrong while trying to run that Slash Command.`, ephemeral: true });
            }
            else
            {
                await slashInteraction.reply({ content: `Sorry, but something went wrong while trying to run that Slash Command.`, ephemeral: true });
            }
        }

        return;
    }
}
