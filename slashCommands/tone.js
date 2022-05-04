// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const ToneJson = require('../jsonFiles/toneIndicators.json');

module.exports = {
    // Slash Command's Name, MUST BE LOWERCASE AND NO SPACES
    name: 'tone',
    // Slash Command's description
    description: `Shows what each tone indicator means (eg: /j, /s, /lh, etc.)`,
    // Category of Slash Command, used for Help (text) Command
    category: 'general',

    // Slash Command's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 60,


    /**
     * Returns data used for registering this Slash Command
     * 
     * @returns {Discord.ChatInputApplicationCommandData}
     */
    registerData()
    {
        const data = {};

        // Slash Command's Name, Description, and Application Command Type
        data.name = this.name;
        data.description = this.description;
        data.type = "CHAT_INPUT";
        data.options = [
            {
                type: "STRING",
                name: "indicator",
                description: "The tone indicator to see information about",
                autocomplete: true,
                required: true
            }
        ];
        
        return data;
    },




    /**
     * Main function that runs this Slash Command
     * 
     * @param {Discord.CommandInteraction} slashCommand Slash Command Interaction
     */
    async execute(slashCommand)
    {
        return await slashCommand.reply({ content: ToneJson["tones"][`${slashCommand.options.getString("indicator", true)}`], ephemeral: true });
    },







    /**
     * Handles the autocomplete argument(s) of this Slash Command
     * 
     * @param {Discord.AutocompleteInteraction} autocompleteInteraction 
     */
    async autocomplete(autocompleteInteraction)
    {
        /** @type {String} */
        const focusedValue = autocompleteInteraction.options.getFocused();
        let filteredResults;

        if ( !focusedValue || focusedValue == "" || focusedValue == " " )
        {
            filteredResults = ToneJson["autocompleteArray"];
        }
        else
        {
            filteredResults = ToneJson["autocompleteArray"].filter(tone => tone.toLowerCase().startsWith(focusedValue.toLowerCase()) || tone.toLowerCase().includes(focusedValue.toLowerCase()));
        }

        // Keep within 25 choice limit
        if ( filteredResults.length > 25 ) { filteredResults.slice(0, 24); }

        return await autocompleteInteraction.respond(filteredResults.map(tone => ({ name: tone, value: tone.split(' ').shift() })));
    }
};
