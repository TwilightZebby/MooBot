const Discord = require('discord.js');
const { client } = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');

const ErrorModule = require('./errorLog.js');

module.exports = {
    /**
     * Main function for the Select Menu Handler
     * 
     * @param {Discord.SelectMenuInteraction} selectMenuInteraction
     * 
     * @returns {Promise<*>} 
     */
    async Main(selectMenuInteraction)
    {
        // Left blank for custom implentation depending on use-case,
        // since Select Menus are far to customisable lol
        return;
    }
}
