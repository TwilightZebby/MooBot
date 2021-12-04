// LIBRARY IMPORTS
const Discord = require('discord.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');

// CONSTANTS
const RESPONSES = {
    deadChat: `Saying the Chat or Server is dead doesn't help anything.\n https://nodeadchat.glitch.me/`
}

const DEAD_CHAT_STRINGS = [
    "chat ded", "chat dead", "chat is dead", "rip chat", "chat is ded", "dead chat", "ded chat",
    "server ded", "server dead", "server is dead", "rip server", "server is ded", "dead server", "ded server",
    "server kind is dead", "server is kinda dead", "server kinda is dead", "chat is so dead",
    "channel ded", "channel dead", "channel is dead", "rip channel", "channel is ded", "dead channel", "ded channel"
];

// THIS MODULE
module.exports = {
    /**
     * Checks for if someone points out dead chat, and removes message if so
     * 
     * @param {Discord.Message} message 
     */
    async NoDeadChat(message) {
        let wasChatDeadSaid = false;

        for (let i = 0; i < DEAD_CHAT_STRINGS.length; i++)
        {
            if ( message.content.includes(DEAD_CHAT_STRINGS[i]) )
            {
                wasChatDeadSaid = true;
            }

            if (wasChatDeadSaid) { break; }
            else { continue; }
        }

        if (wasChatDeadSaid)
        {
            await message.reply({ content: RESPONSES.deadChat, allowedMentions: { repliedUser: true } })
            .then(async () => {
                try {
                    await message.delete();
                } catch (err) {
                    console.error(err);
                }
            });
            return;
        }

        return;
    }
}
