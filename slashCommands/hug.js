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
    name: 'hug',
    description: 'Give someone a comforting cuddle',

    // LIMITATIONS
    //     'twilightzebby' - Only TwilightZebby#1955 can use this command
    //     If commented out, everyone can use this command
    //limitation: 'twilightzebby',

    // Command's cooldown, in seconds
    cooldown: 5,

    /**
     * Command's functionality
     * 
     * @param {Discord.Guild|null} guild 
     * @param {*} data
     * @param {*} commandData
     * @param {Discord.GuildMember|null} member
     * @param {Discord.User|null} user
     */
    async execute(guild, data, commandData, member, user) {

      return await ActionModule.Respond("hug", guild, data, commandData, member, user);

      // END OF SLASH COMMAND
    }
};
