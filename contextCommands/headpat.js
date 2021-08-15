const Discord = require('discord.js');
const { client } = require('../constants.js');
const ActionModule = require('../modules/actionModule.js');


module.exports = {
    name: 'headpat',
    description: `Comfort someone with a headpat`,
    
    // Cooldown is in seconds
    cooldown: 5,

    /**
     * Returns data to be used for registering the Context Command
     * 
     * @returns {Discord.ApplicationCommandData} 
     */
    async registerData() {

        const data = {};
        data.name = this.name;
        data.description = "";
        data.type = "USER"; // Either "USER" or "MESSAGE"

        return data;

    },


    /**
     * Entry point that runs the context command
     * 
     * @param {Discord.ContextMenuInteraction} contextInteraction Context Command Interaction
     */
    async execute(contextInteraction) {

        return await ActionModule.contextRespond(contextInteraction);

    }
}
