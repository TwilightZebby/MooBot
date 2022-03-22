// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Button's Name, used as start of its Custom ID
    name: 'publictemp',
    // Button's description, purely for documentation
    description: `Publicly displays a Temperature Conversion from the Slash Command`,

    // Button's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 20,



    /**
     * Main function that runs this Button
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction Button Interaction
     */
    async execute(buttonInteraction)
    {
        // Grab content
        let messageContent = buttonInteraction.message.content;

        // Remove Button
        await buttonInteraction.update({ components: [] });

        // Send content publicly
        return await buttonInteraction.followUp({ content: `${messageContent}\n\n*Conversion triggered by ${buttonInteraction.user.username}#${buttonInteraction.user.discriminator}, using \`/temperature\`*`, allowedMentions: { parse: [], repliedUser: false } });
    }
};
