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
    name: 'register',
    description: 'Registers either all or a specific Slash Command',

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
        return await message.channel.send(`Sorry, but I couldn't see any arguments.\nCorrect Syntax: \`${PREFIX}register commandName|all global|guildID\``);
      }
      else if ( args.length < 2 ) {
        return await message.channel.send(`Sorry, but I couldn't see enough arguments.\nCorrect Syntax: \`${PREFIX}register commandName|all global|guildID\``);
      }
      else {

        // Split args
        const slashCommandName = args.shift().toLowerCase();
        const slashCommandScope = args.shift().toLowerCase();

        await SlashModule.RegisterCommands(slashCommandName, slashCommandScope);
        return await message.channel.send(`Successfully added ${slashCommandName === "all" ? "all my slash commands" : `the ${slashCommandName} slash command`} ${slashCommandScope === "global" ? "globally" : `to the Server with ID ${slashCommandScope}`}`);

      }

      // END OF COMMAND
    },
};
