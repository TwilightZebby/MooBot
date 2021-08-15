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
        const CUSTOMMESSAGES = require('../jsonFiles/customMessages.json');

        const GIFLINKS = require('../jsonFiles/gifLinks.json');


        // Check for edge case of no given arguments
        if ( !slashCommand.options.get("person") )
        {
            return await slashCommand.reply({ content: `Strange, I can't seem to see any arguments there... Please try again!`, ephemeral: true });
        }


        // Grab given arguments
        let personOption = slashCommand.options.get("person", true).value;

        let gifArgument = slashCommand.options.get("gif");
        let gifOption = gifArgument == null ? undefined : gifArgument.value;

        let reasonArgument = slashCommand.options.get("reason");
        let reasonOption = reasonArgument == null ? undefined : reasonArgument.value;


        // Check for sneaky role and [at]everyone pings, as well as channel mentions
        const roleTest = await UtilityModule.TestForRoleMention(`${personOption}`);
        const everyoneTest = await UtilityModule.TestForEveryoneMention(`${personOption}`);
        const channelTest = await UtilityModule.TestForChannelMention(`${personOption}`);


        // Channel Mentions are not supported, for clear and obvious reasons
        if ( channelTest )
        {
            return await slashCommand.reply({ content: `Sorry, but I cannot accept #channel mentions!`, ephemeral: true });
        }


        let displayMessage = "";

        // BUILT-IN MESSAGES, NOT CUSTOM
        if ( !reasonOption )
        {
            // Check person argument
            if ( roleTest )
            {
                displayMessage = ROLEMESSAGES[`${slashCommand.commandName}`];
                displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
                displayMessage = displayMessage.replace(roleRegEx, `${personOption}`);
            }
            else if ( everyoneTest )
            {
                displayMessage = EVERYONEMESSAGES[`${slashCommand.commandName}`];
                displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
            }
            else if ( await UtilityModule.TestForSelfMention(`${personOption}`, slashCommand.user) )
            {
                displayMessage = SELFMESSAGES[`${slashCommand.commandName}`];
                displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
            }
            else
            {
                personOption = await CheckForMention(personOption, slashCommand.guild); // For mobile users :)
                displayMessage = USERMESSAGES[`${slashCommand.commandName}`];
                displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
                displayMessage = displayMessage.replace(receiverRegEx, `${personOption}`);
            }
        }
        // CUSTOM MESSAGES
        else
        {
            displayMessage = CUSTOMMESSAGES[`${slashCommand.commandName}`];
            displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);

            // Add on custom message
            displayMessage += ` ${reasonOption}`;

            // Check for [at]Everyone/Here pings
            if ( everyoneTest )
            {
                displayMessage = displayMessage.replace(receiverRegEx, `everyone`);
            }
            else
            {
                personOption = await CheckForMention(personOption, slashCommand.guild); // For mobile users :)
                displayMessage = displayMessage.replace(receiverRegEx, `${personOption}`);
            }

            // Check for [at]Role pings
            if ( await UtilityModule.TestForRoleMention(reasonOption) )
            {
                return await slashCommand.reply({ content: `Sorry, but @role mentions aren't allowed in custom messages!`, ephemeral: true });
            }

            // Remove [at]Everyone/Here pings
            if ( await UtilityModule.TestForEveryoneMention(reasonOption) )
            {
                displayMessage = displayMessage.replace(everyoneMentionRegex, `everyone`);
            }
        }



        // Check for GIF argument
        if ( !gifOption || gifOption === false )
        {
            // Use an Embed for Role Mentions, just in case that "allowed_mentions" API flag breaks again
            if ( roleTest )
            {
                let fetchRole = await slashCommand.guild.roles.fetch((await UtilityModule.TestForRoleMention(personOption, true)));
                const embed = new Discord.MessageEmbed().setColor(`${fetchRole.hexColor}`).setDescription(displayMessage);

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
            // Use an embed due to GIF
            const embed = new Discord.MessageEmbed().setDescription(displayMessage)
            .setImage(GIFLINKS[`${slashCommand.commandName}`][Math.floor( ( Math.random() * GIFLINKS[`${slashCommand.commandName}`].length ) + 0 )]);


            // Role Colour
            if ( roleTest )
            {
                let fetchRole = await slashCommand.guild.roles.fetch(( await UtilityModule.TestForRoleMention(personOption, true) ));
                embed.setColor(`${fetchRole.hexColor}`);
            }
            // [at]Mentioned User
            else if ( await UtilityModule.TestForUserMention(personOption) )
            {
                let fetchMember = await slashCommand.guild.members.fetch(( await UtilityModule.TestForUserMention(personOption, true) ));
                embed.setColor(`${fetchMember.displayHexColor}`);
            }
            // plain-text and [at]Everyone/Here mentions
            else
            {
                embed.setColor('RANDOM');
            }

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
