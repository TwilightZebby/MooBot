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
        let dmOption;

        for ( const option of commandData.options ) {
            if ( option.name === "person" ) {
                personOption = option.value;
            }
            else if ( option.name === "gif" ) {
                gifOption = option.value;
            }
            else if ( option.name === "dm" ) {
                dmOption = option.value;
            }
        }




        // FOR DM OPTION
        if ( dmOption === true ) {
            return await this.RespondDM(commandName, guild, data, commandData, member, user);
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
            const embed = new Discord.MessageEmbed().setDescription(randomMessage)
            .setImage(GIFLINKS[`${commandName}`][Math.floor( ( Math.random() * GIFLINKS[`${commandName}`].length ) + 0 )]);

            await SlashCommands.Callback(data, 3, ``, embed, { parse: ['users'] });
            delete embed; // free up cache
            return;

        }

        // END OF MODULE
    },

























    /**
     * DM version of responding to an Action Slash Command
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
    async RespondDM(commandName, guild, data, commandData, member, user) {


        await SlashCommands.Callback(data, 2); // ACK so I can use FollowUps due to latency with DMs


        // JSON IMPORTS
        const DMMESSAGES = require('../jsonFiles/dmMessages.json');

        const GIFLINKS = require('../jsonFiles/gifLinks.json');
        //const MESSAGEEMOJIS = require('../jsonFiles/emojis.json');







        // Split up the given arguments
        let personOption;
        let gifOption;
        let dmOption;

        for ( const option of commandData.options ) {
            if ( option.name === "person" ) {
                personOption = option.value;
            }
            else if ( option.name === "gif" ) {
                gifOption = option.value;
            }
            else if ( option.name === "dm" ) {
                dmOption = option.value;
            }
        }



        // Check for sneaky role pings and @everyone pings
        const roleTest = await UtilityModule.TestForRoleMention(`${personOption}`);
        const everyoneTest = await UtilityModule.TestForEveryoneMention(`${personOption}`);
        const channelTest = await UtilityModule.TestForChannelMention(`${personOption}`);



        // Channel Mentions
        if ( channelTest ) {
            return await SlashCommands.CallbackEphemeralFollowUp(data, `Sorry ${member !== null ? member.displayName : user.username} - but I can't accept #channel mentions for DM usage!`);
        }

        

        // Prevent Role and Everyone mention usage in DMs
        if ( roleTest || everyoneTest ) {
            return await SlashCommands.CallbackEphemeralFollowUp(data, `Sorry ${member !== null ? member.displayName : user.username} - I can't accept @role and @everyone mentions for the DM option!`);
        }




        // Check for self-mentions - why have them for a DM?
        if ( await UtilityModule.TestForSelfMention(`${personOption}`, member) ) {
            return await SlashCommands.CallbackEphemeralFollowUp(data, `Sorry ${member !== null ? member.displayName : user.username} - You can't ping yourself when using the DM option!`);
        }



        // Final Check, ensure its an actual User Ping
        //    Yes, I know I could have done this instead of the above 3, but eh I like multiple error messages :P
        if ( (await UtilityModule.TestForUserMention(personOption)) === false ) {
            return await SlashCommands.CallbackEphemeralFollowUp(data, `Sorry, but I can only accept actual @user mentions when the DM option is enabled!`);
        }





        // Check first argument to see what type of response we need
        let randomMessage = "";
        const authorRegEx = new RegExp(/{author}/g);
        const receiverRegEx = new RegExp(/{receiver}/g);

        randomMessage = DMMESSAGES[`${commandName}`][Math.floor( ( Math.random() * DMMESSAGES[`${commandName}`].length ) + 0 )];
        randomMessage = randomMessage.replace(authorRegEx, `${member !== null ? member.displayName : user.username}`);
        randomMessage = randomMessage.replace(receiverRegEx, `${personOption}`);





        let receiverUserString = await UtilityModule.TestForUserMention(personOption, true);
        let receiverUser = await client.users.fetch(`${receiverUserString}`);





        // Check arguments
        if ( !gifOption || gifOption === false ) {

            // No GIFs
            //randomMessage += ` ${MESSAGEEMOJIS[`${commandName}`]}`;

            let receiverDMs = await receiverUser.createDM();
            let sentDM = await receiverDMs.send(`${randomMessage}\n(Triggered within St1g Gaming, Dr1fterX's Discord Server)`, { allowedMentions: { parse: ['users'] } });

            if ( sentDM ) { await SlashCommands.CallbackEphemeralFollowUp(data, `Successfully sent your **${commandName}** to ${receiverUser.username}#${receiverUser.discriminator}`); }
            else { await SlashCommands.CallbackEphemeralFollowUp(data, `Sorry, but something went wrong while sending your **${commandName}** to ${receiverUser.username}#${receiverUser.discriminator}...\n(They may have their DMs turned off?)`); }

            await receiverUser.deleteDM();
            return;

        } else {




            // Embed because of GIF
            const embed = new Discord.MessageEmbed().setDescription(`${randomMessage}\n(Triggered within St1g Gaming, Dr1fterX's Discord Server)`)
            .setImage(GIFLINKS[`${commandName}`][Math.floor( ( Math.random() * GIFLINKS[`${commandName}`].length ) + 0 )]);


            let receiverDMs = await receiverUser.createDM();
            let sentDM = await receiverDMs.send(embed, { allowedMentions: { parse: ['users'] } });

            if ( sentDM ) { await SlashCommands.CallbackEphemeralFollowUp(data, `Successfully sent your **${commandName}** to ${receiverUser.username}#${receiverUser.discriminator}`); }
            else { await SlashCommands.CallbackEphemeralFollowUp(data, `Sorry, but something went wrong while sending your **${commandName}** to ${receiverUser.username}#${receiverUser.discriminator}...\n(They may have their DMs turned off?)`); }

            await receiverUser.deleteDM();

            delete embed; // free up cache
            return;

        }

        // END OF MODULE
    }

};