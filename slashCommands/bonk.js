// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require("discord.js");

// MODULE IMPORTS
//const ErrorModule = require('../bot_modules/errorLogger.js');
const UtilityModule = require('../bot_modules/utilityModule.js');
const SlashCommands = require('../bot_modules/slashModule.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');


// JSON IMPORTS
const ACTIONMESSAGES = require('../jsonFiles/actionMessages.json');



// THIS COMMAND
module.exports = {
    name: 'bonk',
    description: 'BONK THOSE NAUGHTY PEEPS',

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

      // Check for edge case of no given arguments
      if ( !commandData.options[0] ) {
        return await SlashCommands.CallbackEphemeral(data, 3, `Strange, I couldn't see any arguments there.... Please try again`);
      }



      // Check for sneaky role pings and @everyone pings
      const roleTest = await UtilityModule.TestForRoleMention(`${commandData.options[0].value}`);
      const everyoneTest = await UtilityModule.TestForEveryoneMention(`${commandData.options[0].value}`);
      const channelTest = await UtilityModule.TestForChannelMention(`${commandData.options[0].value}`);



      // Channel Mentions
      if ( channelTest ) {
        return await SlashCommands.CallbackEphemeral(data, 3, `Sorry ${member.displayName} - but I can't accept #channel mentions!`);
      }



      // Check arguments
      if ( !commandData.options[1] || commandData.options[1].value === false ) {

        // No GIFs
        let randomMessage = ACTIONMESSAGES["bonk"][Math.floor( ( Math.random() * ACTIONMESSAGES["bonk"].length ) + 0 )];
        randomMessage = randomMessage.replace(`{author}`, `${member.displayName}`);

        let receiver;

        // Everyone Test
        if ( everyoneTest ) {
          receiver = `everyone`;
        }
        else if ( roleTest ) {
          receiver = `everyone with the ${commandData.options[0].value} Role`;
        }
        else {
          receiver = `${commandData.options[0].value}`;
        }


        randomMessage = randomMessage.replace(`{receiver}`, `${receiver}`);
        return await SlashCommands.Callback(data, 3, randomMessage, undefined, { parse: ['users'] });

      }



      // END OF SLASH COMMAND
    }
};
