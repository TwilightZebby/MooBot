// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const Utility = require('./utilityModule.js');

// REGEXS
const authorRegEx = new RegExp(/{author}/g);
const receiverRegEx = new RegExp(/{receiver}/g);


module.exports = {
    // Button's Name, used as start of its Custom ID
    name: 'areturn',
    // Button's description, purely for documentation
    description: `Returns an Action back at the original User`,

    // Button's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 10,



    /**
     * Main function that runs this Button
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction Button Interaction
     */
    async execute(buttonInteraction)
    {

        // Import JSON
        const USER_RETURN_MESSAGES = require('../jsonFiles/userReturnMessages.json');

        // Parse arguments out of Custom ID
        let buttonArguments = buttonInteraction.customId.split("_");
        const actionName = buttonArguments[1].toLowerCase();
        const originalUserID = buttonArguments[2];
        const originalTargetID = buttonArguments[3];

        // Ensure Button User ID matches Original Target
        if ( buttonInteraction.user.id !== originalTargetID )
        {
            return await buttonInteraction.reply({ content: `You cannot return an Action that wasn't aimed at you!`, ephemeral: true });
        }

        // Fetch Members
        const originalUser = await buttonInteraction.guild.members.fetch(originalUserID)
        .catch(async (err) => { return await buttonInteraction.reply({ content: CONSTANTS.errorMessages.BUTTON_GENERIC_FAILED, ephemeral: true }); });
        const originalTarget = await buttonInteraction.guild.members.fetch(originalTargetID)
        .catch(async (err) => { return await buttonInteraction.reply({ content: CONSTANTS.errorMessages.BUTTON_GENERIC_FAILED, ephemeral: true }); });

        // Construct Message
        let displayMessage = USER_RETURN_MESSAGES[`${actionName}`];
        displayMessage = displayMessage.replace(authorRegEx, `${originalTarget.displayName}`);
        displayMessage = displayMessage.replace(receiverRegEx, `${originalUser.displayName}`);

        // Remove Button from original Message
        await buttonInteraction.update({ components: [] });

        // Send Message
        return await buttonInteraction.followUp({ content: displayMessage, allowedMentions: { repliedUser: false, parse: [] } });
    }
};
