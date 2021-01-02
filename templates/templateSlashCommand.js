// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require("discord.js");

// MODULE IMPORTS
//const ErrorModule = require('../bot_modules/errorLogger.js');
const SlashCommands = require('../bot_modules/slashModule.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');



// THIS COMMAND
module.exports = {
    name: '',
    description: '',

    // LIMITATIONS
    //     'twilightzebby' - Only TwilightZebby#1955 can use this command
    //     If commented out, everyone can use this command
    //limitation: 'twilightzebby',

    // Command's cooldown, in seconds
    cooldown: 3,

    /**
     * Command's functionality
     * 
     * @param {Discord.Guild} guild 
     * @param {*} data
     * @param {*} commandData
     * @param {Discord.GuildMember} member
     */
    async execute(guild, data, commandData, member) {

      //.

      // END OF SLASH COMMAND
    }
};
