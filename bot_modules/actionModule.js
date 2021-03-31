// LIBRARY IMPORTS
const Discord = require('discord.js');


// MODULE IMPORTS
const ErrorModule = require('../bot_modules/errorLogger.js');
const UtilityModule = require('../bot_modules/utilityModule.js');
const SlashCommands = require('../bot_modules/slashModule.js');


// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');



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
        const USERMESSAGES = require('../jsonFiles-AprilFools/userMessages.json');
        const ROLEMESSAGES = require('../jsonFiles-AprilFools/roleMessages.json');
        const EVERYONEMESSAGES = require('../jsonFiles-AprilFools/everyoneMessages.json');
        const SELFMESSAGES = require('../jsonFiles-AprilFools/selfMessages.json');

        const GIFLINKS = require('../jsonFiles-AprilFools/gifLinks.json');





        // Check for edge case of no given arguments
        if ( !commandData.options[0] || commandData.options[0].value === undefined || commandData.options[0].value === '' ) {
            return await SlashCommands.CallbackEphemeral(data, `Strange, I couldn't see any arguments there.... Please try again`);
        }





        // Split up the given arguments
        let personOption;
        let gifOption;

        for ( const option of commandData.options ) {
            if ( option.name === "person" ) {
                personOption = option.value;
            }
            else if ( option.name === "gif" ) {
                gifOption = option.value;
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





        // Check person argument to see what type of response we need
        let randomMessage = "";
        const authorRegEx = new RegExp(/{author}/g);
        const roleRegEx = new RegExp(/{role}/g);
        const receiverRegEx = new RegExp(/{receiver}/g);

        if ( roleTest ) {

            randomMessage = ROLEMESSAGES[`${commandName}`][Math.floor( ( Math.random() * ROLEMESSAGES[`${commandName}`].length ) + 0 )];
            randomMessage = randomMessage.replace(authorRegEx, `${member["nick"] !== null ? member["nick"] : member.user["username"]}`);
            randomMessage = randomMessage.replace(roleRegEx, `${personOption}`);

        }
        else if ( everyoneTest ) {

            randomMessage = EVERYONEMESSAGES[`${commandName}`][Math.floor( ( Math.random() * EVERYONEMESSAGES[`${commandName}`].length ) + 0 )];
            randomMessage = randomMessage.replace(authorRegEx, `${member["nick"] !== null ? member["nick"] : member.user["username"]}`);

        }
        else if ( await UtilityModule.TestForSelfMention(`${commandData.options[0].value}`, member) ) {

            randomMessage = SELFMESSAGES[`${commandName}`][Math.floor( ( Math.random() * SELFMESSAGES[`${commandName}`].length ) + 0 )];
            randomMessage = randomMessage.replace(authorRegEx, `${member["nick"] !== null ? member["nick"] : member.user["username"]}`);

        }
        else {

            randomMessage = USERMESSAGES[`${commandName}`][Math.floor( ( Math.random() * USERMESSAGES[`${commandName}`].length ) + 0 )];
            randomMessage = randomMessage.replace(authorRegEx, `${member["nick"] !== null ? member["nick"] : member.user["username"]}`);
            randomMessage = randomMessage.replace(receiverRegEx, `${personOption}`);

        }





        // Check arguments
        if ( !gifOption || gifOption === false ) {

            // No GIFs

            // Use Embed if Role Mention, just in case "allowed_mentions" flag breaks again on Discord's API
            if ( roleTest )
            {
                let fetchRole = await (await client.guilds.fetch(guildID)).roles.fetch((await UtilityModule.TestForRoleMention(personOption, true)));
                const embed = new Discord.MessageEmbed().setColor(`${fetchRole.hexColor}`).setDescription(randomMessage);

                await SlashCommands.Callback(data, ``, embed, { parse: [] });
                delete embed; // free up cache
            }
            else 
            {
                await SlashCommands.Callback(data, randomMessage, undefined, { parse: [] });
            }
            
            return;

        } else {




            // Embed because of GIF
            const embed = new Discord.MessageEmbed().setColor('RANDOM').setDescription(randomMessage)
            .setImage(GIFLINKS[`${commandName}`][Math.floor( ( Math.random() * GIFLINKS[`${commandName}`].length ) + 0 )]);

            await SlashCommands.Callback(data, ``, embed, { parse: [] });
            delete embed; // free up cache
            return;

        }

        // END OF MODULE
    }

};