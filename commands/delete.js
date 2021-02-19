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
        return await message.channel.send(`Sorry, but I couldn't see any arguments.\nCorrect Syntax: \`${PREFIX}delete commandName global|guildID\``);
      }
      else if ( args.length < 2 ) {
        return await message.channel.send(`Sorry, but I couldn't see enough arguments.\nCorrect Syntax: \`${PREFIX}delete commandName global|guildID\``);
      }
      else {

        // Split args
        const slashCommandName = args.shift().toLowerCase();
        const slashCommandScope = args.shift().toLowerCase();

        if ( !SlashModule.validCommands.includes(slashCommandName) ) {
          return await message.channel.send(`Sorry ${message.member.displayName} - that isn't a valid Slash Command I have`);
        }

        await SlashModule.DeleteCommands(slashCommandName, slashCommandScope);
        return await message.channel.send(`Successfully removed the ${slashCommandName} slash command ${slashCommandScope === "global" ? "globally" : `from the Server with ID ${slashCommandScope}`}`);

      }

      // END OF COMMAND
    },
};
