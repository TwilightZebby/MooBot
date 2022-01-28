// Imports
const Discord = require('discord.js');
const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Button's Name, used as start of its Custom ID
    name: 'feb29',
    // Button's description, purely for documentation
    description: `Handles when a /birthday set comes in with Feb 29th set as the Birthday`,

    // Button's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 300,



    /**
     * Main function that runs this Button
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction Button Interaction
     */
    async execute(buttonInteraction)
    {

        // Bring in birthday Store
        let birthdayJSON = require('../hiddenJsonFiles/birthdayDates.json');

        // Edge case of button not actually being pressed by target
        const originalUserID = buttonInteraction.customId.slice(6);
        if ( originalUserID !== buttonInteraction.user.id )
        {
            return;
        }

        // Set the Birthday!
        birthdayJSON[originalUserID] = {
            userID: originalUserID,
            month: 1,
            date: 29
        };

        // Write to JSON
        fs.writeFile('./hiddenJsonFile/birthdatDates.json', JSON.stringify(birthdayJSON, null, 4), async (err) => {
            if (err)
            {
                await buttonInteraction.reply({ content: CONSTANTS.errorMessages.BUTTON_GENERIC_FAILED, ephemeral: true });
                return await console.error(err);
            }
        });

        // ACK to User
        return await buttonInteraction.update({ content: `✅ Successfully set your Birthday as February 29th!`, components: [] });

    }
};
