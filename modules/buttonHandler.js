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
