// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');

module.exports = {
    /**
     * Main function for Modal Handler
     * 
     * @param {Discord.ModalSubmitInteraction} modalInteraction
     * 
     * @returns {Promise<*>}
     */
    async Main(modalInteraction)
    {
        let modalCustomID = modalInteraction.customId.split("_").shift();
        const modal = client.modals.get(modalCustomID);

        if ( !modal )
        {
            // Couldn't find Modal, this error shouldn't ever appear tho
            return await modalInteraction.reply({ content: CONSTANTS.errorMessages.GENERIC_RARE, ephemeral: true });
        }


        
        // Attempt to process the Modal Input
        try
        {
            await modal.execute(modalInteraction);
        }
        catch (err)
        {
            console.error(err);

            // Just in case it was deferred
            if ( modalInteraction.deferred )
            {
                await modalInteraction.editReply({ content: CONSTANTS.errorMessages.GENERIC_RARE });
            }
            else
            {
                await modalInteraction.reply({ content: CONSTANTS.errorMessages.GENERIC, ephemeral: true });
            }
        }

        return;
    }
}
