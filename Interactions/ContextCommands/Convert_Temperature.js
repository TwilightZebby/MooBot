const { ApplicationCommandType, ApplicationCommandData, ContextMenuCommandInteraction } = require("discord.js");

// REGEXS
const TemperatureRegex = new RegExp(/(?<amount>-?\d+(?:\.\d*)?)[^\S\n]*(?<degrees>°|deg(?:rees?)?|in)?[^\S\n]*(?<unit>c(?:(?=el[cs]ius\b|entigrades?\b|\b))|f(?:(?=ahrenheit\b|\b))|k(?:(?=elvins?\b|\b)))/gi);
const CelsiusRegex = new RegExp(/(?<amount>-?\d+(?:\.\d*)?)[^\S\n]*(?<degrees>°|deg(?:rees?)?|in)?[^\S\n]*(?<unit>c(?:(?=el[cs]ius\b|entigrades?\b|\b)))/gi);
const FahernheitRegex = new RegExp(/(?<amount>-?\d+(?:\.\d*)?)[^\S\n]*(?<degrees>°|deg(?:rees?)?|in)?[^\S\n]*(?<unit>f(?:(?=ahrenheit\b|\b)))/gi);
const KelvinRegex = new RegExp(/(?<amount>-?\d+(?:\.\d*)?)[^\S\n]*(?<degrees>°|deg(?:rees?)?|in)?[^\S\n]*(?<unit>k(?:(?=elvins?\b|\b)))/gi);


/**
 * Converts given temperature
 * @param {String} originalTemperature 
 * @param {String} locale Locale from Context Command
 * @returns {String}
 */
function convertTemperature(originalTemperature, locale)
{
    // Grab original scale
    let originalScale = "";
    if ( CelsiusRegex.test(originalTemperature) ) { originalScale = "c"; }
    else if ( FahernheitRegex.test(originalTemperature) ) { originalScale = "f"; }
    else if ( KelvinRegex.test(originalTemperature) ) { originalScale = "k"; }
    // Grab original numerical value of Temperature
    let originalValue = originalTemperature.match(new RegExp(/[0-9.\-]/gi));
    originalValue = originalValue.join('');
    originalValue = parseInt(originalValue);


    // CONVERT! :D
    if ( originalScale === "c" )
    {
        const CToF = ( originalValue * 9/5 ) + 32;
        const CToK = originalValue + 273.15;
        // Check for invalid Temperature
        if ( CToK < 0 ) { return `:warning: ${originalValue}C is a temperature that cannot exist! (It is below Absolute Zero!)`; }
        // Return converted temperatures
        return `${originalValue}C is about ${CToF}F or ${CToK}K`;
    }
    else if ( originalScale === "f" )
    {
        const FToC = ( originalValue - 32 ) * 5/9;
        const FToK = ( originalValue - 32 ) * 5/9 + 273.15;
        // Check for invalid Temperature
        if ( FToK < 0 ) { return `:warning: ${originalValue}F is a temperature that cannot exist! (It is below Absolute Zero!)`; }
        // Return converted temperatures
        return `${originalValue}F is about ${FToC}C or ${FToK}K`;
    }
    else if ( originalScale === "k" )
    {
        const KToC = originalValue - 273.15;
        const KToF = ( originalValue - 273.15 ) * 9/5 + 32;
        // Check for invalid Temperature
        if ( originalValue < 0 ) { return `:warning: ${originalValue}K is a temperature that cannot exist! (It is below Absolute Zero!)`; }
        // Return converted temperatures
        return `${originalValue}K is about ${KToC}C or ${KToF}F`;
    }
}


module.exports = {
    // Command's Name
    //     Can use sentence casing and spaces
    Name: "Convert Temperature",

    // Command's Description
    Description: `Convert Temperatures detected within sent Messages`,

    // Command's Category
    Category: "GENERAL",

    // Context Command Type
    //     One of either ApplicationCommandType.Message, ApplicationCommandType.User
    CommandType: ApplicationCommandType.Message,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 30,

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "ALL",



    /**
     * Returns data needed for registering Context Command onto Discord's API
     * @returns {ApplicationCommandData}
     */
    registerData()
    {
        /** @type {ApplicationCommandData} */
        const Data = {};

        Data.name = this.Name;
        Data.description = "";
        Data.type = this.CommandType;

        return Data;
    },



    /**
     * Executes the Context Command
     * @param {ContextMenuCommandInteraction} contextCommand 
     */
    async execute(contextCommand)
    {
        // Grab Source Message
        const SourceMessage = contextCommand.options.getMessage('message');

        // Error checks
        if ( SourceMessage.author.bot || SourceMessage.system || SourceMessage.author.system ) { return await contextCommand.reply({ ephemeral: true, content: "Sorry, but this Context Command cannot be used on a System or Bot Message." }); }
        if ( !SourceMessage.content || SourceMessage.content == '' ) { return await contextCommand.reply({ ephemeral: true, content: "Sorry, but that Message doesn't have any content! (Attachments aren't checked by this Context Command)" }); }


        // Check there are actually temperatures in the Message
        const MatchedTemperatures = SourceMessage.content.match(TemperatureRegex);

        // No Temperatures found
        if ( !MatchedTemperatures || MatchedTemperatures == null ) { console.log("004"); return await contextCommand.reply({ ephemeral: true, content: "Sorry, but I couldn't find any temperatures to convert from that Message." }); }
        // More than 10 results
        else if ( MatchedTemperatures.length > 10 ) { console.log("005"); return await contextCommand.reply({ ephemeral: true, content: "Sorry, but there are too many temperatures found in that Message!\n(I have a maximum limit of 10 temperatures per Message that I can convert)" }); }
        // One single result
        else if ( MatchedTemperatures.length === 1 )
        {
            const ConvertedResult = convertTemperature(MatchedTemperatures.shift(), contextCommand.locale);
            return await contextCommand.reply({ ephemeral: true, content: `[Jump to source Message](<${SourceMessage.url}>)\nHere is your converted temperature:\n\n• ${ConvertedResult}` });
        }
        // Between 2 and 10 results (inclusive)
        else
        {
            // Defer, just in case
            await contextCommand.deferReply({ ephemeral: true });

            // Loop through results, converting each one
            let convertedResults = [];
            MatchedTemperatures.forEach(item => {
                let tempResult = convertTemperature(item, contextCommand.locale);
                // Yes, I still have no idea what causes this error, so I'm keeping this from the v5 versions!
                while ( !tempResult || tempResult == undefined || tempResult == null ) { tempResult = convertTemperature(item, contextCommand.locale); }
                convertedResults.push(`• ${tempResult}`);
            });

            // Send Results
            return await contextCommand.editReply({ content: `[Jump to source Message](<${SourceMessage.url}>)\nHere is your converted temperature:\n\n${convertedResults.join(`\n`)}` });
        }
    }
}
