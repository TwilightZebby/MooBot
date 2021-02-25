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
    }
};
