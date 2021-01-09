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
     * @param {String} commandName
     * @param {Discord.Guild} guild
     * @param {*} data
     * @param {*} commandData
     * @param {Discord.GuildMember} member
     * 
     * @returns {Promise<*>} 
     */
    async Respond(commandName, guild, data, commandData, member) {

        // JSON IMPORTS
        const USERMESSAGES = require('../jsonFiles/userMessages.json');
        const ROLEMESSAGES = require('../jsonFiles/roleMessages.json');
        const EVERYONEMESSAGES = require('../jsonFiles/everyoneMessages.json');
        const SELFMESSAGES = require('../jsonFiles/selfMessages.json');

        const GIFLINKS = require('../jsonFiles/gifLinks.json');
        //const MESSAGEEMOJIS = require('../jsonFiles/emojis.json');





        // Check for edge case of no given arguments
        if ( !commandData.options[0] || commandData.options[0].value === undefined || commandData.options[0].value === '' ) {
            return await SlashCommands.CallbackEphemeral(data, 3, `Strange, I couldn't see any arguments there.... Please try again`);
        }



        // Check for sneaky role pings and @everyone pings
        const roleTest = await UtilityModule.TestForRoleMention(`${commandData.options[0].value}`);
        const everyoneTest = await UtilityModule.TestForEveryoneMention(`${commandData.options[0].value}`);
        const channelTest = await UtilityModule.TestForChannelMention(`${commandData.options[0].value}`);



        // Channel Mentions
        if ( channelTest ) {
            return await SlashCommands.CallbackEphemeral(data, 3, `Sorry ${member.displayName} - but I can't accept #channel mentions!`);
        }





        // Check first argument to see what type of response we need
        let randomMessage = "";
        const authorRegEx = new RegExp(/{author}/g);
        const roleRegEx = new RegExp(/{role}/g);
        const receiverRegEx = new RegExp(/{receiver}/g);

        if ( roleTest ) {

            randomMessage = ROLEMESSAGES[`${commandName}`][Math.floor( ( Math.random() * ROLEMESSAGES[`${commandName}`].length ) + 0 )];
            randomMessage = randomMessage.replace(authorRegEx, `${member.displayName}`);
            randomMessage = randomMessage.replace(roleRegEx, `${commandData.options[0].value}`);

        }
        else if ( everyoneTest ) {

            randomMessage = EVERYONEMESSAGES[`${commandName}`][Math.floor( ( Math.random() * EVERYONEMESSAGES[`${commandName}`].length ) + 0 )];
            randomMessage = randomMessage.replace(authorRegEx, `${member.displayName}`);

        }
        else if ( await UtilityModule.TestForSelfMention(`${commandData.options[0].value}`, member) ) {

            randomMessage = SELFMESSAGES[`${commandName}`][Math.floor( ( Math.random() * SELFMESSAGES[`${commandName}`].length ) + 0 )];
            randomMessage = randomMessage.replace(authorRegEx, `${member.displayName}`);

        }
        else {

            randomMessage = USERMESSAGES[`${commandName}`][Math.floor( ( Math.random() * USERMESSAGES[`${commandName}`].length ) + 0 )];
            randomMessage = randomMessage.replace(authorRegEx, `${member.displayName}`);
            randomMessage = randomMessage.replace(receiverRegEx, `${commandData.options[0].value}`);

        }





        // Check arguments
        if ( !commandData.options[1] || commandData.options[1].value === false ) {

            // No GIFs
            //randomMessage += ` ${MESSAGEEMOJIS[`${commandName}`]}`;

            return await SlashCommands.Callback(data, 3, randomMessage, undefined, { parse: ['users'] });

        } else {




            // Embed because of GIF
            const embed = new Discord.MessageEmbed().setDescription(randomMessage)
            .setImage(GIFLINKS[`${commandName}`][Math.floor( ( Math.random() * GIFLINKS[`${commandName}`].length ) + 0 )]);

            await SlashCommands.Callback(data, 3, ``, embed, { parse: ['users'] });
            delete embed; // free up cache
            return;

        }

        // END OF MODULE
    }

};