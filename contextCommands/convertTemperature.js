const Discord = require('discord.js');
const { client } = require('../constants.js');

const tempRegex = new RegExp(/(?<amount>-?\d+(?:\.\d*)?)[^\S\n]*(?<degrees>°|deg(?:rees?)?|in)?[^\S\n]*(?<unit>c(?:(?=el[cs]ius\b|entigrades?\b|\b))|f(?:(?=ahrenheit\b|\b))|k(?:(?=elvins?\b|\b)))/gi);


module.exports = {
    name: 'convertTemperature',
    description: `Convert temperatures from Messages`,
    
    // Cooldown is in seconds
    cooldown: 30,

    /**
     * Returns data to be used for registering the Context Command
     * 
     * @returns {Discord.ApplicationCommandData} 
     */
    async registerData() {

        const data = {};
        data.name = this.name;
        data.description = "";
        data.type = "MESSAGE"; // Either "USER" or "MESSAGE"

        return data;

    },


    /**
     * Entry point that runs the context command
     * 
     * @param {Discord.ContextMenuInteraction} contextInteraction Context Command Interaction
     */
    async execute(contextInteraction) {

        // First, ensure message actually has content to prevent being broken by BOT EMBEDS
        let contextMessage = contextInteraction.options.getMessage('message');
        if ( !contextMessage.content || contextMessage.content === '' )
        {
            return await contextInteraction.reply({ content: `Sorry, but that message doesn't have any content for me to check!`, ephemeral: true });
        }

        // Check MSG content actually has temps in it for us to convert
        let tempSearch = contextMessage.content.match(tempRegex);
        if ( !tempSearch || tempSearch === null )
        {
            return await contextInteraction.reply({ content: `Sorry, but I couldn't see any temperatures mentioned in that message.`, ephemeral: true });
        }
        // Only one result
        else if ( tempSearch.length === 1 )
        {
            //.
        }
        // 10 or less results
        else if ( tempSearch.length > 1 && tempSearch.length <= 10 )
        {
            //.
        }
        // More than 10 results, reject to not cause spam
        else
        {
            return await contextInteraction.reply({ content: `Sorry, but there are too many temperatures mentioned in that message! (I have a limit of 10 I can handle!)`, ephemeral: true });
        }

    }
}
