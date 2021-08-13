const Discord = require('discord.js');
const { client } = require('../constants.js');


module.exports = {
    name: 'commandName',
    description: `A Description of the command`,
    
    // Cooldown is in seconds
    cooldown: 3,

    /**
     * Returns data to be used for registering the Context Command
     * 
     * @returns {Discord.ApplicationCommandData} 
     */
    async registerData() {

        const data = {};
        data.name = this.name;
        data.description = "";
        data.type = ""; // Either "USER" or "MESSAGE"

        return data;

    },


    /**
     * Entry point that runs the context command
     * 
     * @param {Discord.ContextMenuInteraction} contextInteraction Context Command Interaction
     */
    async execute(contextInteraction) {

        //.

    }
}
