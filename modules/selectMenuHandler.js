// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');

module.exports = {
    /**
     * Main function for Select Menu Handler
     * 
     * @param {Discord.SelectMenuInteraction} selectMenuInteraction
     * 
     * @returns {Promise<*>}
     */
    async Main(selectMenuInteraction)
    {
        let selectMenuCustomID = selectMenuInteraction.customId.split("_").shift();
        const selectMenu = client.selects.get(selectMenuCustomID);

        if ( !selectMenu )
        {
            // Couldn't find Select Menu, this error shouldn't ever appear tho
            return await selectMenuInteraction.reply({ content: CONSTANTS.errorMessages.SELECT_MENU_GENERIC_FAILED_RARE, ephemeral: true });
        }


        
        // Attempt to process the Select Menu choice
        try
        {
            await selectMenu.execute(selectMenuInteraction);
        }
        catch (err)
        {
            console.error(err);

            // Just in case it was deferred
            if ( selectMenuInteraction.deferred )
            {
                await selectMenuInteraction.editReply({ content: CONSTANTS.errorMessages.SELECT_MENU_GENERIC_FAILED });
            }
            else
            {
                await selectMenuInteraction.reply({ content: CONSTANTS.errorMessages.SELECT_MENU_GENERIC_FAILED, ephemeral: true });
            }
        }

        return;
    }
}
