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
     * @param {Discord.Guild|null} guild
     * @param {*} data
     * @param {*} commandData
     * @param {Discord.GuildMember|null} member
     * @param {Discord.User|null} user
     * 
     * @returns {Promise<*>} 
     */
    async Respond(commandName, guild, data, commandData, member, user) {

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
            return await SlashCommands.CallbackEphemeral(data, 3, `Sorry ${member !== null ? member.displayName : user.username} - but I can't accept #channel mentions!`);
        }

        

        // Prevent Role and Everyone mention usage in DMs
        if ( ( roleTest || everyoneTest ) && guild === null ) {
            return await SlashCommands.CallbackEphemeral(data, 3, `Sorry ${member !== null ? member.displayName : user.username} - I can't accept @role and @everyone mentions in DMs!`);
        }





        // Check first argument to see what type of response we need
        let randomMessage = "";
        const authorRegEx = new RegExp(/{author}/g);
        const roleRegEx = new RegExp(/{role}/g);
        const receiverRegEx = new RegExp(/{receiver}/g);

        if ( roleTest ) {

            randomMessage = ROLEMESSAGES[`${commandName}`][Math.floor( ( Math.random() * ROLEMESSAGES[`${commandName}`].length ) + 0 )];
            randomMessage = randomMessage.replace(authorRegEx, `${member !== null ? member.displayName : user.username}`);
            randomMessage = randomMessage.replace(roleRegEx, `${personOption}`);

        }
        else if ( everyoneTest ) {

            randomMessage = EVERYONEMESSAGES[`${commandName}`][Math.floor( ( Math.random() * EVERYONEMESSAGES[`${commandName}`].length ) + 0 )];
            randomMessage = randomMessage.replace(authorRegEx, `${member !== null ? member.displayName : user.username}`);

        }
        else if ( await UtilityModule.TestForSelfMention(`${commandData.options[0].value}`, member) ) {

            randomMessage = SELFMESSAGES[`${commandName}`][Math.floor( ( Math.random() * SELFMESSAGES[`${commandName}`].length ) + 0 )];
            randomMessage = randomMessage.replace(authorRegEx, `${member !== null ? member.displayName : user.username}`);

        }
        else {

            randomMessage = USERMESSAGES[`${commandName}`][Math.floor( ( Math.random() * USERMESSAGES[`${commandName}`].length ) + 0 )];
            randomMessage = randomMessage.replace(authorRegEx, `${member !== null ? member.displayName : user.username}`);
            randomMessage = randomMessage.replace(receiverRegEx, `${personOption}`);

        }





        // Check arguments
        if ( !gifOption || gifOption === false ) {

            // No GIFs
            //randomMessage += ` ${MESSAGEEMOJIS[`${commandName}`]}`;

            return await SlashCommands.Callback(data, 3, randomMessage, undefined, { parse: ['users'] });

        } else {




            // Embed because of GIF
            const embed = new Discord.MessageEmbed().setColor('RANDOM').setDescription(randomMessage)
            .setImage(GIFLINKS[`${commandName}`][Math.floor( ( Math.random() * GIFLINKS[`${commandName}`].length ) + 0 )]);

            await SlashCommands.Callback(data, 3, ``, embed, { parse: ['users'] });
            delete embed; // free up cache
            return;

        }

        // END OF MODULE
    }

};