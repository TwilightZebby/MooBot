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
    name: 'headpat',
    description: 'Comfort someone with a headpat',

    // LIMITATIONS
    //     'twilightzebby' - Only TwilightZebby#1955 can use this command
    //     If commented out, everyone can use this command
    //limitation: 'twilightzebby',

    // Command's cooldown, in seconds
    cooldown: 10,

    /**
     * Command's functionality
     * 
     * @param {Discord.Guild} guild 
     * @param {*} data
     * @param {*} commandData
     * @param {Discord.GuildMember} member
     */
    async execute(guild, data, commandData, member) {

      // Check for sneaky role pings and @everyone pings
      const roleRegex = new RegExp(/<@&(\d{17,19})>/g);
      const everyoneRegex = new RegExp(/@(everyone|here)/g);
      const channelRegex = new RegExp(/<#(\d{17,19})>/g);

      if ( roleRegex.test(commandData.options[0].value) ) {
        return await SlashCommands.CallbackEphemeral(data, 3, `Sorry ${member.displayName} - I don't accept Role Pings!`);
      }
      
      if ( everyoneRegex.test(commandData.options[0].value) ) {
        return await SlashCommands.CallbackEphemeral(data, 3, `Sorry ${member.displayName} - You can't ping [at]Everyone that easily!`);
      }

      if ( channelRegex.test(commandData.options[0].value) ) {
        return await SlashCommands.CallbackEphemeral(data, 3, `Sorry ${member.displayName} - I don't accept Channel Mentions!`);
      }


      // Send Message
      return await SlashCommands.Callback(data, 3, `**${commandData.options[0].value}** received a headpat from **${member.displayName}** \<a:headpatUwU:794877772349964298\>`);

      // END OF SLASH COMMAND
    }
};
