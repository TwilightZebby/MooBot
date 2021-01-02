// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require("discord.js");

// MODULE IMPORTS
//const ErrorModule = require('../bot_modules/errorLogger.js');
const SlashModule = require('../bot_modules/slashModule.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');



// THIS COMMAND
module.exports = {
    name: 'delete',
    description: 'Deletes either all or a specific Slash Command',

    // LIMITATIONS
    //     'twilightzebby' - Only TwilightZebby#1955 can use this command
    //     If commented out, everyone can use this command
    limitation: 'twilightzebby',

    // Command's cooldown, in seconds
    cooldown: 10,

    /**
     * Command's functionality
     * 
     * @param {Discord.Message} message 
     * @param {Array<String>} args
     */
    async execute(message, args) {

      if ( !args.length ) {
        await SlashModule.DeleteCommands(message.guild);
        return await message.react('👍');
      }
      else {
        await SlashModule.DeleteCommands(message.guild, args.shift().toLowerCase());
        return await message.react('👍');
      }

      // END OF COMMAND
    },
};
