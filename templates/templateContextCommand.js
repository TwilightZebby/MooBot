// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Context Command's Name, can be mixed case and allows for spaces
    // If the command name has a space, use an underscore (_) for the file name
    name: 'Command Name',
    // Context Command's description, used for Help (text) Command
    description: `Description`,
    // Category of Context Command, used for Help (text) Command
    category: 'general',

    // Context Command's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 3,


    /**
     * Returns data used for registering this Context Command
     * 
     * @returns {Discord.ApplicationCommandData}
     */
    registerData()
    {
        const data = {};

        // Slash Command's Name, Description, and Application Command Type
        data.name = this.name;
        data.description = ""; // Left blank otherwise Discord's API will reject
        data.type = ""; // either "USER" or "MESSAGE", must *not* be left blank
        
        return data;
    },




    /**
     * Main function that runs this Context Command
     * 
     * @param {Discord.ContextMenuInteraction} contextCommand Context Command Interaction
     */
    async execute(contextCommand)
    {

        // .

    }
};
