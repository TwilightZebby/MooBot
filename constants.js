/********************
 * Discord.js related
 ********************/

const Discord = require("discord.js"); //Bringing in Discord.js
exports.client = new Discord.Client(
    {
        ws: {
            intents: 7935
        }
    }
);
