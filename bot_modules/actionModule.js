// LIBRARY IMPORTS
const Discord = require('discord.js');


// MODULE IMPORTS
const ErrorModule = require('../bot_modules/errorLogger.js');
const UtilityModule = require('../bot_modules/utilityModule.js');
const SlashCommands = require('../bot_modules/slashModule.js');


// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');


// REGEXS
const authorRegEx = new RegExp(/{author}/g);
const everyoneMentionRegex = new RegExp(/@(everyone|here)/g);
const roleRegEx = new RegExp(/{role}/g);
const receiverRegEx = new RegExp(/{receiver}/g);



// THIS MODULE
module.exports = {
    /**
     * Return response depanding on the Slash Command used
     * 
     * @param {String} commandName Name of Slash Command
     * @param {String} guildID 
     * @param {*} data
     * @param {*} commandData
     * @param {*} member 
     * 
     * @returns {Promise<*>} 
     */
    async Respond(commandName, guildID, data, commandData, member) {

        // JSON IMPORTS
        const USERMESSAGES = require('../jsonFiles/userMessages.json');
        const ROLEMESSAGES = require('../jsonFiles/roleMessages.json');
        const EVERYONEMESSAGES = require('../jsonFiles/everyoneMessages.json');
        const SELFMESSAGES = require('../jsonFiles/selfMessages.json');
        const CUSTOMMESSAGES = require('../jsonFiles/customMessages.json');

        const GIFLINKS = require('../jsonFiles/gifLinks.json');





        // Check for edge case of no given arguments
        if ( !commandData.options[0] || commandData.options[0].value === undefined || commandData.options[0].value === '' ) {
            return await SlashCommands.CallbackEphemeral(data, `Strange, I couldn't see any arguments there.... Please try again`);
        }





        // Split up the given arguments
        let personOption;
        let gifOption;
        let reasonOption;

        for ( const option of commandData.options ) {
            if ( option.name === "person" ) {
                personOption = option.value;
            }
            else if ( option.name === "gif" ) {
                gifOption = option.value;
            }
            else if ( option.name === "reason" ) {
                reasonOption = option.value;
            }
        }
        



        // Check for sneaky role pings and @everyone pings
        const roleTest = await UtilityModule.TestForRoleMention(`${personOption}`);
        const everyoneTest = await UtilityModule.TestForEveryoneMention(`${personOption}`);
        const channelTest = await UtilityModule.TestForChannelMention(`${personOption}`);



        // Channel Mentions
        if ( channelTest ) {
            return await SlashCommands.CallbackEphemeral(data, `Sorry ${member.user["username"]} - but I can't accept #channel mentions!`);
        }



        let displayMessage = "";

        // IF USING BUILT-IN MESSAGES RATHER THAN CUSTOM
        if ( !reasonOption )
        {
            // Check person argument to see what type of response we need
            if ( roleTest ) {

                displayMessage = ROLEMESSAGES[`${commandName}`][Math.floor( ( Math.random() * ROLEMESSAGES[`${commandName}`].length ) + 0 )];
                displayMessage = displayMessage.replace(authorRegEx, `${member["nick"] !== null ? member["nick"] : member.user["username"]}`);
                displayMessage = displayMessage.replace(roleRegEx, `${personOption}`);

            }
            else if ( everyoneTest ) {

                displayMessage = EVERYONEMESSAGES[`${commandName}`][Math.floor( ( Math.random() * EVERYONEMESSAGES[`${commandName}`].length ) + 0 )];
                displayMessage = displayMessage.replace(authorRegEx, `${member["nick"] !== null ? member["nick"] : member.user["username"]}`);

            }
            else if ( await UtilityModule.TestForSelfMention(`${commandData.options[0].value}`, member) ) {

                displayMessage = SELFMESSAGES[`${commandName}`][Math.floor( ( Math.random() * SELFMESSAGES[`${commandName}`].length ) + 0 )];
                displayMessage = displayMessage.replace(authorRegEx, `${member["nick"] !== null ? member["nick"] : member.user["username"]}`);

            }
            else {

                displayMessage = USERMESSAGES[`${commandName}`][Math.floor( ( Math.random() * USERMESSAGES[`${commandName}`].length ) + 0 )];
                displayMessage = displayMessage.replace(authorRegEx, `${member["nick"] !== null ? member["nick"] : member.user["username"]}`);
                displayMessage = displayMessage.replace(receiverRegEx, `${personOption}`);

            }
        }
        else
        {
            // CUSTOM MESSAGE
            displayMessage = CUSTOMMESSAGES[`${commandName}`];
            displayMessage = displayMessage.replace(authorRegEx, `${member["nick"] !== null ? member["nick"] : member.user["username"]}`);

            // Add on custom message
            displayMessage += ` ${reasonOption}`;

            // Check for @everyone/@here pings
            if ( everyoneTest )
            {
                displayMessage = displayMessage.replace(receiverRegEx, `everyone`);
            }
            else
            {
                displayMessage = displayMessage.replace(receiverRegEx, `${personOption}`);
            }

            // Check for @role pings
            if ( await UtilityModule.TestForRoleMention(reasonOption) )
            {
                return await SlashCommands.CallbackEphemeral(data, `Sorry, but currently @role mentions aren't allowed in custom reasons/messages.`);
            }

            // Remove @everyone and @here mentions from custom reasons
            if ( await UtilityModule.TestForEveryoneMention(reasonOption) )
            {
                displayMessage = displayMessage.replace(everyoneMentionRegex, `everyone`);
            }
        }
        





        // Check arguments
        if ( !gifOption || gifOption === false ) {

            // No GIFs

            // Use Embed if Role Mention, just in case "allowed_mentions" flag breaks again on Discord's API
            if ( roleTest )
            {
                let fetchRole = await (await client.guilds.fetch(guildID)).roles.fetch((await UtilityModule.TestForRoleMention(personOption, true)));
                const embed = new Discord.MessageEmbed().setColor(`${fetchRole.hexColor}`).setDescription(displayMessage);

                await SlashCommands.Callback(data, ``, embed, { parse: [] });
                delete embed; // free up cache
            }
            else 
            {
                await SlashCommands.Callback(data, displayMessage, undefined, { parse: [] });
            }
            
            return;

        } else {




            // Embed because of GIF
            const embed = new Discord.MessageEmbed().setDescription(displayMessage)
            .setImage(GIFLINKS[`${commandName}`][Math.floor( ( Math.random() * GIFLINKS[`${commandName}`].length ) + 0 )]);


            // Role Colour
            if ( roleTest )
            {
                let fetchRole = await (await client.guilds.fetch(guildID)).roles.fetch((await UtilityModule.TestForRoleMention(personOption, true)));
                embed.setColor(`${fetchRole.hexColor}`);
            }
            // @mentioned User
            else if ( await UtilityModule.TestForUserMention(personOption) )
            {
                let fetchMember = await (await client.guilds.fetch(guildID)).members.fetch((await UtilityModule.TestForUserMention(personOption, true)));
                embed.setColor(`${fetchMember.displayHexColor}`);
            }
            // plain-text and @everyone mentions
            else
            {
                embed.setColor('RANDOM');
            }

            await SlashCommands.Callback(data, ``, embed, { parse: [] });
            delete embed; // free up cache
            return;

        }

        // END OF MODULE
    }

};