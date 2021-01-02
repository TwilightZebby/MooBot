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
    name: 'ping',
    description: 'See if the Bot is online and responsive',

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

      return await SlashCommands.Callback(data, 4, `${member.displayName}, your ping is ${member.client.ws.ping.toFixed(2)}ms`);

      //END OF SLASH COMMAND
    }
};
