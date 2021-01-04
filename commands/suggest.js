// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require("discord.js");

// MODULE IMPORTS
const ErrorModule = require('../bot_modules/errorLogger.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');



// THIS COMMAND
module.exports = {
    name: 'suggest',
    description: 'Suggest a GIF or Message to be added to the Bot',

    // LIMITATIONS
    //     'twilightzebby' - Only TwilightZebby#1955 can use this command
    //     If commented out, everyone can use this command
    //limitation: 'twilightzebby',

    // Command's cooldown, in seconds
    cooldown: 10,

    /**
     * Command's functionality
     * 
     * @param {Discord.Message} message 
     * @param {Array<String>} args
     */
    async execute(message, args) {

      // Make sure User has actually suggested something
      if ( !args || !args.length ) {
        return await message.channel.send(`${message.member.displayName} - You didn't pass a suggestion! Please try again, including either a message or a GIF to be added to the Bot.`);
      }



      // Fetch stuff needed
      const ZebbysPrivateGuild = await client.guilds.fetch('720258928470130760');
      const SuggestionChannel = ZebbysPrivateGuild.channels.resolve('795717706652844063');
      const suggestionString = args.join(' ');



      // Send suggestion to Zebby
      let tempMessage = await SuggestionChannel.send(`**New suggestion by ${message.author.username}#${message.author.discriminator}**\n\`\`\`${suggestionString}\`\`\``)
      .catch(async (err) => {
        await ErrorModule.LogCustom(err, `(**suggest.js** - POST suggestion to Suggestion Channel)`);
        await ErrorModule.LogToUser(message.channel, `There was an error sending your Suggestion to TwilightZebby... :/`);
      });


      if ( !tempMessage ) { return; } // To prevent the success message from appearing
      else {
        // User response
        return await message.channel.send(`${message.member.displayName} - Successfully sent your suggestion to TwilightZebby!`);
      }

      // END OF COMMAND
    },
};
