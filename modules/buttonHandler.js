// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');

module.exports = {
    /**
     * Main function for Button Handler
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction
     * 
     * @returns {Promise<*>}
     */
    async Main(buttonInteraction)
    {
        let buttonCustomID = buttonInteraction.customId.split("_").shift();
        const button = client.buttons.get(buttonCustomID);

        if ( !button )
        {
            // Couldn't find Button, this error shouldn't ever appear tho
            return await buttonInteraction.reply({ content: CONSTANTS.errorMessages.BUTTON_GENERIC_FAILED_RARE, ephemeral: true });
        }



        // Cooldowns
        if ( !client.buttonCooldowns.has(button.name) )
        {
            // No cooldown found, make it
            client.buttonCooldowns.set(button.name, new Discord.Collection());
        }



        const now = Date.now();
        const timestamps = client.buttonCooldowns.get(button.name);
        const cooldownAmount = ( button.cooldown || 3 ) * 1000;



        if ( timestamps.has(buttonInteraction.user.id) )
        {
            const expirationTime = timestamps.get(buttonInteraction.user.id) + cooldownAmount;

            if ( now < expirationTime )
            {
                let timeLeft = ( expirationTime - now ) / 1000;

                // Minutes
                if ( timeLeft >= 60 && timeLeft < 3600 )
                {
                    timeLeft /= 60;
                    let cooldownMessage = CONSTANTS.errorMessages.BUTTON_COOLDOWN.replace("{{buttonCooldown}}", `${timeLeft.toFixed(1)} more minutes`);
                    return await buttonInteraction.reply({ content: cooldownMessage, ephemeral: true });
                }
                // Hours
                else if ( timeLeft >= 3600 && timeLeft < 86400 )
                {
                    timeLeft /= 3600;
                    let cooldownMessage = CONSTANTS.errorMessages.BUTTON_COOLDOWN.replace("{{buttonCooldown}}", `${timeLeft.toFixed(1)} more hours`);
                    return await buttonInteraction.reply({ content: cooldownMessage, ephemeral: true });
                }
                // Days
                else if ( timeLeft >= 86400 && timeLeft < 2.628e+6 )
                {
                    timeLeft /= 86400;
                    let cooldownMessage = CONSTANTS.errorMessages.BUTTON_COOLDOWN.replace("{{buttonCooldown}}", `${timeLeft.toFixed(1)} more days`);
                    return await buttonInteraction.reply({ content: cooldownMessage, ephemeral: true });
                }
                // Months
                else if ( timeLeft >= 2.628e+6 )
                {
                    timeLeft /= 2.628e+6;
                    let cooldownMessage = CONSTANTS.errorMessages.BUTTON_COOLDOWN.replace("{{buttonCooldown}}", `${timeLeft.toFixed(1)} more months`);
                    return await buttonInteraction.reply({ content: cooldownMessage, ephemeral: true });
                }
                // Seconds
                else
                {
                    let cooldownMessage = CONSTANTS.errorMessages.BUTTON_COOLDOWN.replace("{{buttonCooldown}}", `${timeLeft.toFixed(1)} more seconds`);
                    return await buttonInteraction.reply({ content: cooldownMessage, ephemeral: true });
                }
            }
        }
        else
        {
            timestamps.set(buttonInteraction.user.id, now);
            setTimeout(() => timestamps.delete(buttonInteraction.user.id), cooldownAmount);
        }


        
        // Attempt to process the Button choice
        try
        {
            await button.execute(buttonInteraction);
        }
        catch (err)
        {
            console.error(err);

            // Just in case it was deferred
            if ( buttonInteraction.deferred )
            {
                await buttonInteraction.editReply({ content: CONSTANTS.errorMessages.BUTTON_GENERIC_FAILED });
            }
            else
            {
                await buttonInteraction.reply({ content: CONSTANTS.errorMessages.BUTTON_GENERIC_FAILED, ephemeral: true });
            }
        }

        return;
    }
}
