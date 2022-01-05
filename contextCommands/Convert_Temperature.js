// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

// REGEXS
const temperatureRegex = new RegExp(/(?<amount>-?\d+(?:\.\d*)?)[^\S\n]*(?<degrees>°|deg(?:rees?)?|in)?[^\S\n]*(?<unit>c(?:(?=el[cs]ius\b|entigrades?\b|\b))|f(?:(?=ahrenheit\b|\b))|k(?:(?=elvins?\b|\b)))/gi);
const celsiusRegex = new RegExp(/(?<amount>-?\d+(?:\.\d*)?)[^\S\n]*(?<degrees>°|deg(?:rees?)?|in)?[^\S\n]*(?<unit>c(?:(?=el[cs]ius\b|entigrades?\b|\b)))/gi);
const fahernheitRegex = new RegExp(/(?<amount>-?\d+(?:\.\d*)?)[^\S\n]*(?<degrees>°|deg(?:rees?)?|in)?[^\S\n]*(?<unit>f(?:(?=ahrenheit\b|\b)))/gi);
const kelvinRegex = new RegExp(/(?<amount>-?\d+(?:\.\d*)?)[^\S\n]*(?<degrees>°|deg(?:rees?)?|in)?[^\S\n]*(?<unit>k(?:(?=elvins?\b|\b)))/gi);

module.exports = {
    // Context Command's Name, can be mixed case and allows for spaces
    // If the command name has a space, use an underscore (_) for the file name
    name: 'Convert Temperature',
    // Context Command's description, used for Help (text) Command
    description: `Convert temperatures from Messages`,
    // Category of Context Command, used for Help (text) Command
    category: 'general',

    // Context Command's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 30,


    /**
     * Returns data used for registering this Context Command
     * 
     * @returns {Discord.ApplicationCommandData}
     */
    registerData()
    {
        const data = {};

        // Slash Command's Name, Description, and Application Command Type
        data.name = this.name;
        data.description = ""; // Left blank otherwise Discord's API will reject
        data.type = "MESSAGE"; // either "USER" or "MESSAGE", must *not* be left blank
        
        return data;
    },




    /**
     * Main function that runs this Context Command
     * 
     * @param {Discord.ContextMenuInteraction} contextCommand Context Command Interaction
     */
    async execute(contextCommand)
    {

        //  Grab the message
        let sourceMessage = contextCommand.options.getMessage('message');

        // Check is not Bot or System Message
        if ( sourceMessage.author.bot || sourceMessage.system )
        {
            return await contextCommand.reply({ content: `Sorry, but this Context Command cannot be used on a System or Bot Message.`, ephemeral: true });
        }

        // Check for message content
        if ( !sourceMessage.content || sourceMessage.content === '' )
        {
            return await contextCommand.reply({ content: `Sorry, but that Message doesn't have any content! (Attachments aren't supported by this Context Command)`, ephemeral: true });
        }


        // Check for Temperature(s) in the Message
        let temperatureSearch = sourceMessage.content.match(temperatureRegex);

        if ( !temperatureSearch || temperatureSearch === null )
        {
            return await contextCommand.reply({ content: `Sorry, but I couldn't find any temperatures to convert in that Message.`, ephemeral: true });
        }
        // Only one, single, result
        else if ( temperatureSearch.length === 1 )
        {
            // Convert the Temperature
            let convertedTemperature = this.convert(temperatureSearch.shift());
            await contextCommand.reply({ content: `[Jump to source Message](<${sourceMessage.url}>)\nHere is your converted temperature:\n\n• ${convertedTemperature}` });
            delete convertedTemperature, temperatureSearch;
            return;
        }
        // 10 or less results
        else if ( temperatureSearch.length > 1 && temperatureSearch.length <= 10 )
        {
            // Defer, just in case
            await contextCommand.deferReply();

            // Loop through results, converting each one
            let convertedTemperatures = [];

            temperatureSearch.forEach((item) => {
                let temperatureConversion = this.convert(item);

                // To catch strange error because I have no clue what is causing it
                while ( !temperatureConversion || temperatureConversion === undefined || temperatureConversion === null )
                {
                    temperatureConversion = this.convert(item);
                }

                convertedTemperatures.push(`• ${temperatureConversion}`);
            });


            // Send message
            await contextCommand.editReply({ content: `[Jump to source Message](<${sourceMessage.url}>)\nHere is your converted temperatures:\n\n${convertedTemperatures.join(`\n`)}` });
            delete convertedTemperatures, temperatureSearch;
            return;
        }
        // More than 10 results, reject to not cause spam
        else
        {
            return await contextCommand.reply({ content: `Sorry, but there are too many temperatures found in that Message!\n(I have a maximum limit of 10 temperatures I can convert from a single message)`, ephemeral: true });
        }
    },














    /**
     * Returns the temperature converted. Example: Passing C would return it both in F and K
     * 
     * @param {String} originalTemperature
     * 
     * @returns {String} converted temperature
     */
    convert(originalTemperature)
    {
        // Figure out original temperature system
        let originalSystem = "";

        if ( celsiusRegex.test(originalTemperature) ) { originalSystem = "c" }
        else if ( fahernheitRegex.test(originalTemperature) ) { originalSystem = "f" }
        else if ( kelvinRegex.test(originalTemperature) ) { originalSystem = "k" }

        // Grab the numerical value of the temperature
        let originalValue = originalTemperature.match(new RegExp(/[0-9.\-]/gi));
        originalValue = originalValue.join('');
        originalValue = parseFloat(originalValue);

        // Now CONVERT!
        if ( originalSystem === "c" )
        {
            // C to F and K
            let convertedF = ( originalValue * 9/5 ) + 32;
            let convertedK = originalValue + 273.15;

            return `${originalValue.toFixed(1)}C is ${convertedF.toFixed(1)}F or ${convertedK.toFixed(1)}K`;
        }
        else if ( originalSystem === "f" )
        {
            // F to C and K
            let convertedC = ( originalValue - 32 ) * 5/9;
            let convertedK = ( originalValue - 32 ) * 5/9 + 273.15;

            return `${originalValue.toFixed(1)}F is ${convertedC.toFixed(1)}C or ${convertedK.toFixed(1)}K`;
        }
        else if ( originalSystem === "k" )
        {
            // K to F and C (yes, doing F and C instead of C and F for a specific reason hehe)
            let convertedF = ( originalValue - 273.15 ) * 9/5 + 32;
            let convertedC = originalValue - 273.15;

            return `${originalValue.toFixed(1)}K is ${convertedF.toFixed(1)}F or ${convertedC.toFixed(1)}C`;
        }
    }
};
