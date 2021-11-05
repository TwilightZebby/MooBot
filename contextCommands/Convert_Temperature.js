const Discord = require('discord.js');
const { client } = require('../constants.js');

const tempRegex = new RegExp(/(?<amount>-?\d+(?:\.\d*)?)[^\S\n]*(?<degrees>°|deg(?:rees?)?|in)?[^\S\n]*(?<unit>c(?:(?=el[cs]ius\b|entigrades?\b|\b))|f(?:(?=ahrenheit\b|\b))|k(?:(?=elvins?\b|\b)))/gi);
const celsiusRegex = new RegExp(/(?<amount>-?\d+(?:\.\d*)?)[^\S\n]*(?<degrees>°|deg(?:rees?)?|in)?[^\S\n]*(?<unit>c(?:(?=el[cs]ius\b|entigrades?\b|\b)))/gi);
const fahernheitRegex = new RegExp(/(?<amount>-?\d+(?:\.\d*)?)[^\S\n]*(?<degrees>°|deg(?:rees?)?|in)?[^\S\n]*(?<unit>f(?:(?=ahrenheit\b|\b)))/gi);
const kelvinRegex = new RegExp(/(?<amount>-?\d+(?:\.\d*)?)[^\S\n]*(?<degrees>°|deg(?:rees?)?|in)?[^\S\n]*(?<unit>k(?:(?=elvins?\b|\b)))/gi);


module.exports = {
    name: 'Convert_Temperature',
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
        data.name = this.name.split('_').join(' ');
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

        let contextMessage = contextInteraction.options.getMessage('message');

        // No Bot Messages!
        if ( contextMessage.author.bot )
        {
            return await contextInteraction.reply({ content: `Sorry, but that was a Bot's Message, I don't check those!`, ephemeral: true });
        }

        // No System Messages!
        if ( contextMessage.system )
        {
            return; // Because we cannot reply based off a System Message
        }

        // Ensure message actually has content to prevent being broken
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
            // Convert temp
            let convertedTemp = this.convert(tempSearch.shift());
            await contextInteraction.reply({ content: `[Jump to Source Message](<${contextMessage.url}>)\nHere is your converted temperatures!\n\n• ${convertedTemp}` });
            delete convertedTemp;
            delete tempSearch;
            return;
        }
        // 10 or less results
        else if ( tempSearch.length > 1 && tempSearch.length <= 10 )
        {
            // Defer just in case
            await contextInteraction.deferReply();

            // Loop through, converting all the temperatures
            let convertedTemps = [];

            tempSearch.forEach((item) => {
                let tempConversion = this.convert(item);

                // To catch WHATEVER THE FUCK IS CAUSING THIS BECAUSE FUCK IF I KNOW
                while ( !tempConversion || tempConversion === undefined || tempConversion === null )
                {
                    tempConversion = this.convert(item);
                }

                convertedTemps.push(`• ${tempConversion}`);
            });

            await contextInteraction.editReply({ content: `[Jump to Source Message](<${contextMessage.url}>)\nHere is your converted temperatures!\n\n${convertedTemps.join(`\n`)}` });
            delete convertedTemps;
            delete tempSearch;
            return;
        }
        // More than 10 results, reject to not cause spam
        else
        {
            return await contextInteraction.reply({ content: `Sorry, but there are too many temperatures mentioned in that message! (I have a limit of 10 I can handle!)`, ephemeral: true });
        }

    },














    /**
     * Returns the temperature converted. Example: Passing C would return it both in F and K
     * 
     * @param {String} originalTemp
     * 
     * @returns {String} converted temp
     */
    convert(originalTemp)
    {
        // Figure out original temp system
        let originalSystem = "";

        if ( celsiusRegex.test(originalTemp) ) { originalSystem = "c" }
        else if ( fahernheitRegex.test(originalTemp) ) { originalSystem = "f" }
        else if ( kelvinRegex.test(originalTemp) ) { originalSystem = "k" }

        // Grab the numerical value of the temp
        let originalValue = originalTemp.match(new RegExp(/[0-9.\-]/gi));
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
}