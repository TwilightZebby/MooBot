const Discord = require('discord.js');
const { client } = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');

const ErrorModule = require('./errorLog.js');
const PotatoModule = require('../slashCommands/potato.js');
const JailModule = require('../slashCommands/hornyjail.js');

module.exports = {
    /**
     * Main function for the Button Handler
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction
     * 
     * @returns {Promise<*>} 
     */
    async Main(buttonInteraction)
    {
        // Left blank for custom implentation depending on use-case,
        // since Buttons are far to customisable lol

        // Potato
        if ( buttonInteraction.customId.startsWith("potato") )
        {
            return await PotatoModule.HandleButton(buttonInteraction);
        }
        // Jail
        else if ( buttonInteraction.customId.startsWith("jail") )
        {
            return await JailModule.HandleVotingButtons(buttonInteraction);
        }
        return;
    }
}
