// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

// Button to display publicly
const DISPLAY_PUBLIC_BUTTON = new Discord.MessageActionRow().addComponents( new Discord.MessageButton().setCustomId(`publictemp`).setLabel("Display Publicly").setStyle('PRIMARY') );

module.exports = {
    // Slash Command's Name, MUST BE LOWERCASE AND NO SPACES
    name: 'temperature',
    // Slash Command's description
    description: `Convert a given temperature between degrees C, F, and K`,
    // Category of Slash Command, used for Help (text) Command
    category: 'general',

    // Slash Command's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 10,


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
                type: "INTEGER",
                name: "value",
                description: "The temperature value you want to convert",
                required: true
            },
            {
                type: "STRING",
                name: "scale",
                description: "The temperature scale of the original value",
                required: true,
                choices: [
                    { name: "Celsius", value: "c" },
                    { name: "Fahernheit", value: "f" },
                    { name: "Kelvin", value: "k" }
                ]
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
        // Grab values
        let originalTempValue = slashCommand.options.getInteger("value", true);
        let originalTempScale = slashCommand.options.getString("scale", true);


        // Convert
        switch (originalTempScale)
        {
            case "c":
                // C to F/K
                let cToF = (originalTempValue * 9/5) + 32;
                let cToK = originalTempValue + 273.15;
                if ( cToK < 0 ) { return await slashCommand.reply({ content: `⚠ ${originalTempValue}C is a temperature that does not exist! (It's below Absolute Zero)`, ephemeral: true }); }
                await slashCommand.reply({ content: `${originalTempValue.toFixed(0)}C is about ${cToF.toFixed(0)}F or ${cToK.toFixed(0)}K`, ephemeral: true, components: [DISPLAY_PUBLIC_BUTTON] });
                break;

            case "f":
                // F to C/K
                let fToC = (originalTempValue - 32) * 5/9;
                let fToK = (originalTempValue - 32) * 5/9 + 273.15;
                if ( fToK < 0 ) { return await slashCommand.reply({ content: `⚠ ${originalTempValue}F is a temperature that does not exist! (It's below Absolute Zero)`, ephemeral: true }); }
                await slashCommand.reply({ content: `${originalTempValue.toFixed(0)}F is about ${fToC.toFixed(0)}C or ${fToK.toFixed(0)}K`, ephemeral: true, components: [DISPLAY_PUBLIC_BUTTON] });
                break;

            case "k":
                // K to C/F
                let kToC = originalTempValue - 273.15;
                let kToF = (originalTempValue - 273.15) * 9/5 + 32;
                if ( originalTempValue < 0 ) { return await slashCommand.reply({ content: `⚠ ${originalTempValue}K is a temperature that does not exist! (It's below Absolute Zero)`, ephemeral: true }); }
                await slashCommand.reply({ content: `${originalTempValue.toFixed(0)}K is about ${kToC.toFixed(0)}C or ${kToF.toFixed(0)}F`, ephemeral: true, components: [DISPLAY_PUBLIC_BUTTON] });
                break;

            default:
                await slashCommand.reply({ content: CONSTANTS.errorMessages.GENERIC, ephemeral: true });
        }

        return;
    }
};
