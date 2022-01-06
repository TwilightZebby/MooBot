// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Button's Name, used as start of its Custom ID
    name: 'button_name',
    // Button's description, purely for documentation
    description: `Description`,

    // Button's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 3,



    /**
     * Main function that runs this Button
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction Button Interaction
     */
    async execute(buttonInteraction)
    {

        // .

    }
};
