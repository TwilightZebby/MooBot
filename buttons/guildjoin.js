// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Button's Name, used as start of its Custom ID
    name: 'guildjoin',
    // Button's description, purely for documentation
    description: `Used to approve or deny a Guild the Bot has joined`,

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
        // Grab stuff
        const splitCustomID = buttonInteraction.customId.split("_");
        const action = splitCustomID[1];
        const joinedGuildID = splitCustomID[2];

        switch (action)
        {
            case 'approve':
                const updatedActionRow = new Discord.MessageActionRow().addComponents(CONSTANTS.components.buttons.GUILD_APPROVED);
                return await buttonInteraction.update({ components: [updatedActionRow] });
            
            case 'reject':
            default:
                // Leave Guild
                const joinedGuild = await client.guilds.fetch(joinedGuildID);
                await joinedGuild.leave()
                .then(async (guild) => { 
                    const rejectedActionRow = new Discord.MessageActionRow().addComponents(CONSTANTS.components.buttons.GUILD_REJECTED);
                    return await buttonInteraction.update({ components: [rejectedActionRow] });
                })
                .catch(async (err) => {
                    console.error(err);
                    return await buttonInteraction.reply({ content: CONSTANTS.errorMessages.BUTTON_GENERIC_FAILED, ephemeral: true });
                });
        }
    }
};
