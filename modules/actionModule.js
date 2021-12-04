// LIBRARY IMPORTS
const Discord = require('discord.js');

// MODULE IMPORTS
const ErrorModule = require('./errorLog.js');
const UtilityModule = require('./utilityModule.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');

// REGEXS
const authorRegEx = new RegExp(/{author}/g);
const everyoneMentionRegex = new RegExp(/@(everyone|here)/g);
const roleRegEx = new RegExp(/{role}/g);
const receiverRegEx = new RegExp(/{receiver}/g);


/**
 * Check to see if we need to use Member's Display Name, to be kind to Mobile Users haha
 * 
 * @param {String} userArgument
 * @param {Discord.Guild} guildOBJ
 * 
 * @returns {Promise<String>}
 */
async function CheckForMention(userArgument, guildOBJ)
{
    if ( await UtilityModule.TestForUserMention(userArgument) )
    {
        let mentionMember = await guildOBJ.members.fetch(await UtilityModule.TestForUserMention(userArgument, true));
        return mentionMember.displayName;
    }
    else
    {
        return userArgument;
    }
}



// THIS MODULE
module.exports = {
    /**
     * Main handler for Action Slash Commands
     * 
     * @param {Discord.CommandInteraction} slashCommand
     */
    async slashRespond(slashCommand)
    {
        // JSON IMPORTS
        const USERMESSAGES = require('../jsonFiles/userMessages.json');
        const ROLEMESSAGES = require('../jsonFiles/roleMessages.json');
        const EVERYONEMESSAGES = require('../jsonFiles/everyoneMessages.json');
        const SELFMESSAGES = require('../jsonFiles/selfMessages.json');
        const BOTMESSAGES = require('../jsonFiles/botMessages.json');
        const AUTHORMESSAGES = require('../jsonFiles/authorSpecificMessages.json');
        const ACTIONBOTMESSAGES = require('../jsonFiles/actionsBotMessages.json');
        const CUSTOMMESSAGES = require('../jsonFiles/customMessages.json');

        const GIFLINKS = require('../jsonFiles/gifLinks.json');


        // Grab given arguments
        let personArgument = slashCommand.options.getMentionable("person", true);
        let gifArgument = slashCommand.options.get("gif");
        let gifOption = gifArgument == null ? undefined : gifArgument.value;
        let reasonArgument = slashCommand.options.get("reason");
        let reasonOption = reasonArgument == null ? undefined : reasonArgument.value;


        let displayMessage = "";

        // No custom message given
        if ( !reasonOption )
        {
            // Check person argument so we know what type of mention was given ([at]user, [at]role, or [at]everyone/here)
            if ( (personArgument instanceof Discord.Role) && (personArgument.id === personArgument.guild.id) )
            {
                // EVERYONE & HERE MENTIONS
                displayMessage = EVERYONEMESSAGES[`${slashCommand.commandName}`];
                displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
            }
            else if ( (personArgument instanceof Discord.Role) && (personArgument.id !== personArgument.guild.id) )
            {
                // ROLES THERE ARE NOT EVERYONE AND HERE MENTIONS
                displayMessage = ROLEMESSAGES[`${slashCommand.commandName}`];
                displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
                displayMessage = displayMessage.replace(roleRegEx, `<@&${personArgument.id}>`);
            }
            else if ( (personArgument instanceof Discord.GuildMember) && (personArgument.user.id === slashCommand.user.id) )
            {
                // USER MENTION - used on self
                displayMessage = SELFMESSAGES[`${slashCommand.commandName}`];
                displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
            }
            else if ( (personArgument instanceof Discord.GuildMember) && (personArgument.user.id === client.user.id) )
            {
                // USER MENTION - used on the Actions Bot itself
                displayMessage = ACTIONBOTMESSAGES[`${slashCommand.commandName}`];
                displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
                displayMessage = displayMessage.replace(receiverRegEx, `${personArgument.user.username}`);
            }
            else if ( (personArgument instanceof Discord.GuildMember) && personArgument.user.bot )
            {
                // USER MENTION - used on a bot user
                displayMessage = BOTMESSAGES[`${slashCommand.commandName}`];
                displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
                displayMessage = displayMessage.replace(receiverRegEx, `${personArgument.user.username}`);
            }
            else
            {
                // USER MENTION - used *by* a specific User who has a custom set of stored messages
                if ( AUTHORMESSAGES[`${slashCommand.user.id}`] )
                {
                    displayMessage = AUTHORMESSAGES[`${slashCommand.user.id}`][`${slashCommand.commandName}`];
                }
                // USER MENTION - used on someone else
                else
                {
                    if ( USERMESSAGES[`${slashCommand.commandName}`] instanceof Array )
                    {
                        // RANDOMISE TIME!
                        // Just for seasonal messages hehe
                        displayMessage = USERMESSAGES[`${slashCommand.commandName}`][Math.floor((Math.random() * USERMESSAGES[`${slashCommand.commandName}`].length) + 0)];
                    }
                    else
                    {
                        // No multiple messages, just a single one so no randomiser
                        displayMessage = USERMESSAGES[`${slashCommand.commandName}`];
                    }
                }
                displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
                displayMessage = displayMessage.replace(receiverRegEx, `${personArgument.displayName}`);
            }
        }
        // Custom message given
        else
        {
            displayMessage = CUSTOMMESSAGES[`${slashCommand.commandName}`];
            displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
            displayMessage += ` ${reasonOption}`;


            // Check for mentions
            if ( (personArgument instanceof Discord.Role) && (personArgument.id === personArgument.guild.id) )
            {
                // EVERYONE & HERE MENTIONS
                displayMessage = displayMessage.replace(receiverRegEx, `everyone`);
            }
            
            if ( (personArgument instanceof Discord.Role) && (personArgument.id !== personArgument.guild.id) )
            {
                // ROLES THERE ARE NOT EVERYONE AND HERE MENTIONS
                displayMessage = displayMessage.replace(receiverRegEx, `<@&${personArgument.id}>`);
            }
            
            if ( (personArgument instanceof Discord.GuildMember) && (personArgument.user.id === slashCommand.user.id) )
            {
                // USER MENTION - used on self
                displayMessage = SELFMESSAGES[`${slashCommand.commandName}`];
                displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
                displayMessage += ` ${reasonOption}`;
            }

            if ( (personArgument instanceof Discord.GuildMember) && (personArgument.user.id !== slashCommand.user.id) )
            {
                // USER MENTION - used on literally anyone else
                displayMessage = displayMessage.replace(receiverRegEx, `${personArgument.displayName}`);
            }


            // Check reason argument for sneaky mentions
            if ( await UtilityModule.TestForEveryoneMention(reasonOption) )
            {
                displayMessage = displayMessage.replace(everyoneMentionRegex, `everyone`);
            }

            if ( await UtilityModule.TestForRoleMention(reasonOption) )
            {
                return await slashCommand.reply({ content: `Sorry, but @role mentions aren't allowed in custom reasons/messages!`, ephemeral: true });
            }
        }



        // Check GIF argument
        if ( !gifOption || gifOption === false )
        {
            // No GIF, but use an embed if role mention was included
            if ( personArgument instanceof Discord.Role )
            {
                const embed = new Discord.MessageEmbed().setColor(personArgument.hexColor).setDescription(displayMessage);
                await slashCommand.reply({ embeds: [embed], allowedMentions: { parse: [] } });
                delete embed;
            }
            else
            {
                await slashCommand.reply({ content: displayMessage, allowedMentions: { parse: [] } });
            }

            return;
        }
        else
        {
            // Yes GIF option
            const embed = new Discord.MessageEmbed().setDescription(displayMessage)
            .setImage(GIFLINKS[`${slashCommand.commandName}`][Math.floor( ( Math.random() * GIFLINKS[`${slashCommand.commandName}`].length ) + 0 )])
            .setColor(personArgument instanceof Discord.Role ? personArgument.hexColor : personArgument instanceof Discord.GuildMember ? personArgument.displayHexColor : 'RANDOM');

            await slashCommand.reply({ embeds: [embed], allowedMentions: { parse: [] } });
            delete embed;
            return;
        }
    },










    /**
     * Main handler for Action Context Commands
     * 
     * @param {Discord.ContextMenuInteraction} contextCommand
     */
    async contextRespond(contextCommand)
    {
        // JSON IMPORTS
        const USERMESSAGES = require('../jsonFiles/userMessages.json');
        const SELFMESSAGES = require('../jsonFiles/selfMessages.json');
        const BOTMESSAGES = require('../jsonFiles/botMessages.json');

        const GIFLINKS = require('../jsonFiles/gifLinks.json');

        let contextTarget = contextCommand.options.resolved.members.first();


        let displayMessage = "";

        // DISPLAY MESSAGE
        // If used on self
        if ( contextTarget.user.id === contextCommand.user.id )
        {
            displayMessage = SELFMESSAGES[`${contextCommand.commandName}`];
            displayMessage = displayMessage.replace(authorRegEx, `${contextCommand.member.displayName}`);
        }
        // Used on a Bot User
        else if ( contextTarget.user.bot )
        {
            displayMessage = BOTMESSAGES[`${contextCommand.commandName}`];
            displayMessage = displayMessage.replace(authorRegEx, `${contextCommand.member.displayName}`);
            displayMessage = displayMessage.replace(receiverRegEx, `${contextTarget.displayName}`);
        }
        // Used on another member
        else
        {
            displayMessage = USERMESSAGES[`${contextCommand.commandName}`];
            displayMessage = displayMessage.replace(authorRegEx, `${contextCommand.member.displayName}`);
            displayMessage = displayMessage.replace(receiverRegEx, `${contextTarget.displayName}`);
        }



        return await contextCommand.reply({ content: displayMessage, allowedMentions: { parse: [] } });
    }
}
