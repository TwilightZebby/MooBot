const Discord = require('discord.js');
const { client } = require('../constants.js');
const ActionModule = require('../modules/actionModule.js');


module.exports = {
    name: 'headpat',
    description: `Comfort someone with a headpat`,
    
    // Cooldown is in seconds
    cooldown: 5,

    // Uncomment for making the command only usable in DMs with the Bot
    //    - DO NOT have both this AND "guildOnly" uncommented, only one or neither
    //dmOnly: true,

    // Uncomment for making the command only usable in Servers
    //   - DO NOT have both this AND "dmOnly" uncommented, only one or neither
    guildOnly: true,


    /**
     * Returns data to be used for registering the Slash Command
     * 
     * @returns {Discord.ApplicationCommandData} 
     */
    async registerData() {

        const data = {};
        data.name = this.name;
        data.description = this.description;
        data.type = "CHAT_INPUT"; // Slash Command
        data.options = [
            {
                type: "MENTIONABLE",
                name: "person",
                description: "The person you want to headpat",
                required: true
            },
            {
                type: "BOOLEAN",
                name: "gif",
                description: "True to display a GIF, otherwise leave blank or use False",
                required: false
            },
            {
                type: "STRING",
                name: "reason",
                description: "A custom message to add onto the end of the built-in messages",
                required: false
            }
        ];

        return data;

    },


    /**
     * Entry point that runs the slash command
     * 
     * @param {Discord.CommandInteraction} slashInteraction Slash Command Interaction
     */
    async execute(slashInteraction) {

        return await ActionModule.slashRespond(slashInteraction);

    }
}
