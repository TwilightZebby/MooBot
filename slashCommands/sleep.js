// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require("discord.js");

// MODULE IMPORTS
const ActionModule = require('../bot_modules/actionModule.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');



// THIS COMMAND
module.exports = {
    name: 'sleep',
    description: 'Tell someone to sleep!',

    // LIMITATIONS
    //     'twilightzebby' - Only TwilightZebby#1955 can use this command
    //     If commented out, everyone can use this command
    //limitation: 'twilightzebby',

    // If the Slash Command can only be used in Guilds
    //     Comment out if this Slash Command can also be used in DMs
    guildOnly: true,

    // Command's cooldown, in seconds
    cooldown: 5,

    /**
     * Command's functionality
     * 
     * @param {String|null} guildID Null if used in DMs
     * @param {*} data
     * @param {*} commandData
     * @param {*|null} member Null if used in DMs
     * @param {*|null} user Null if used in Guilds
     */
    async execute(guildID, data, commandData, member, user) {

      return await ActionModule.Respond("sleep", guildID, data, commandData, member);

      // END OF SLASH COMMAND
    },









    /**
     * Registers the sleep Slash Command
     * 
     * @param {Boolean} isGlobal True if Global, False if Guild
     * @param {String} [guildID] Provide Guild ID if Guild Command, otherwise ignore
     */
    async register(isGlobal, guildID) {

      // Data
      const data = {};
      data.name = "sleep";
      data.description = "Tell someone to go sleep!";
      data.options = new Array();

      const option = {};
      option.name = "person";
      option.description = "Either a name or an @mention";
      option.type = 3; // String
      option.required = true;

      data.options.push(option);


      const secondOption = {};
      secondOption.name = "GIF";
      secondOption.description = "True to use a GIF, otherwise leave blank";
      secondOption.type = 5; // Boolean
      secondOption.required = false;

      data.options.push(secondOption);

      

      if ( isGlobal ) {
          client.api.applications(client.user.id).commands().post({data});
      }
      else {
          client.api.applications(client.user.id).guilds(guildID).commands().post({data});
      }

      return;

    }
};
