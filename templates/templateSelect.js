// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Select's Name, used as start of its Custom ID
    name: 'select_name',
    // Select's description, purely for documentation
    description: `Description`,

    // Select's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 3,



    /**
     * Main function that runs this Select
     * 
     * @param {Discord.SelectMenuInteraction} selectInteraction Select Interaction
     */
    async execute(selectInteraction)
    {

        // .

    }
};
