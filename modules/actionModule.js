// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');
const Utility = require('./utilityModule.js');

// REGEXS
const authorRegEx = new RegExp(/{author}/g);
const roleRegEx = new RegExp(/{role}/g);
const receiverRegEx = new RegExp(/{receiver}/g);


module.exports = {
    /**
     * Main Handler for Action Slash Commands
     * 
     * @param {Discord.CommandInteraction} slashCommand
     */
    async slashRespond(slashCommand)
    {
        // IMPORT JSONS
        const USER_MESSAGES = require('../jsonFiles/userMessages.json');
        const ROLE_MESSAGES = require('../jsonFiles/roleMessages.json');
        const EVERYONE_MESSAGES = require('../jsonFiles/everyoneMessages.json');
        const SELF_MESSAGES = require('../jsonFiles/selfMessages.json');
        const BOT_MESSAGES = require('../jsonFiles/botMessages.json');
        const TWILIGHT_BOT_MESSAGES = require('../jsonFiles/twilightBotMessages.json');
        const CUSTOM_MESSAGES = require('../jsonFiles/customMessages.json');

        const GIF_LINKS = require('../jsonFiles/gifLinks.json');


        // Grab given arguments
        let personArgument = slashCommand.options.getMentionable("person", true);
        let gifArgument = slashCommand.options.get("gif");
        let gifOption = gifArgument == null ? undefined : gifArgument.value;
        let reasonArgument = slashCommand.options.get("reason");
        let reasonOption = reasonArgument == null ? undefined : reasonArgument.value;

        // Create Button for returning the action
        let actionReturnActionRow = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton().setStyle('PRIMARY').setCustomId(`areturn_${slashCommand.commandName}_${slashCommand.user.id}_${personArgument.id}`).setLabel(`Return ${slashCommand.commandName}`)
        );
        let displayButton = false; // For knowing if the Button should be included or not, since it only wants to appear when Target is a User, not a Role


        let displayMessage = "";

        // No custom message given
        if ( !reasonOption )
        {
            // Check person argument so we know what type of mention was given ([at]user, [at]role, or [at]everyone/here)
            if ( (personArgument instanceof Discord.Role) && (personArgument.id === personArgument.guild.id) )
            {
                // EVERYONE & HERE MENTIONS
                displayMessage = EVERYONE_MESSAGES[`${slashCommand.commandName}`];
                displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
            }
            else if ( (personArgument instanceof Discord.Role) && (personArgument.id !== personArgument.guild.id) )
            {
                // ROLES THERE ARE NOT EVERYONE AND HERE MENTIONS
                displayMessage = ROLE_MESSAGES[`${slashCommand.commandName}`];
                displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
                displayMessage = displayMessage.replace(roleRegEx, `<@&${personArgument.id}>`);
            }
            else if ( (personArgument instanceof Discord.GuildMember) && (personArgument.user.id === slashCommand.user.id) )
            {
                // USER MENTION - used on self
                displayMessage = SELF_MESSAGES[`${slashCommand.commandName}`];
                displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
            }
            else if ( (personArgument instanceof Discord.GuildMember) && (personArgument.user.id === client.user.id) )
            {
                // USER MENTION - used on the Bot itself
                displayMessage = TWILIGHT_BOT_MESSAGES[`${slashCommand.commandName}`];
                displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
                displayMessage = displayMessage.replace(receiverRegEx, `${personArgument.user.username}`);
            }
            else if ( (personArgument instanceof Discord.GuildMember) && personArgument.user.bot )
            {
                // USER MENTION - used on a bot user
                displayMessage = BOT_MESSAGES[`${slashCommand.commandName}`];
                displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
                displayMessage = displayMessage.replace(receiverRegEx, `${personArgument.user.username}`);
            }
            else
            {
                // USER MENTION - used on someone else
                displayButton = true;
                displayMessage = USER_MESSAGES[`${slashCommand.commandName}`];
                displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
                displayMessage = displayMessage.replace(receiverRegEx, `${personArgument.displayName}`);
            }
        }
        // Custom message given
        else
        {
            displayMessage = CUSTOM_MESSAGES[`${slashCommand.commandName}`];
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
                displayMessage = SELF_MESSAGES[`${slashCommand.commandName}`];
                displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
                displayMessage += ` ${reasonOption}`;
            }

            if ( (personArgument instanceof Discord.GuildMember) && (personArgument.user.id !== slashCommand.user.id) )
            {
                // USER MENTION - used on literally anyone else
                displayButton = true;
                displayMessage = displayMessage.replace(receiverRegEx, `${personArgument.displayName}`);
            }


            // Check reason argument for sneaky mentions
            if ( Utility.TestForEveryoneMention(reasonOption) )
            {
                displayMessage = displayMessage.replace(Utility.everyoneRegex, `everyone`);
            }

            if ( Utility.TestForRoleMention(reasonOption) )
            {
                return await slashCommand.reply({ content: `Sorry, but @role mentions aren't allowed in custom reasons/messages!`, ephemeral: true });
            }
        }



        // Check GIF argument
        if ( !gifOption || gifOption === false )
        {
            // No GIF, use Embed if Role Mention was included
            if ( personArgument instanceof Discord.Role )
            {
                const embed = new Discord.MessageEmbed().setColor(personArgument.hexColor)
                .setDescription(displayMessage);
                await slashCommand.reply({ embeds: [embed], allowedMentions: { parse: [] } });
                delete embed;
            }
            else
            {
                if ( displayButton )
                {
                    // Send Message
                    let sentActionMessage = await slashCommand.reply({ content: displayMessage, components: [actionReturnActionRow], allowedMentions: { parse: [] }, fetchReply: true });
                    
                    // Auto remove Button after 5 minutes, just to keep chats clean :)
                    setTimeout(async () => {
                        return await sentActionMessage.edit({ components: [] });
                    }, 60000);
                }
                else { await slashCommand.reply({ content: displayMessage, allowedMentions: { parse: [] } }); }
            }

            return;
        }
        else
        {
            // GIF was requested
            const embed = new Discord.MessageEmbed().setDescription(displayMessage)
            .setImage(GIF_LINKS[`${slashCommand.commandName}`][Math.floor(( Math.random() * GIF_LINKS[`${slashCommand.commandName}`].length ) + 0)])
            .setColor(personArgument instanceof Discord.Role ? personArgument.hexColor : personArgument instanceof Discord.GuildMember ? personArgument.displayHexColor : 'RANDOM');

            await slashCommand.reply({ embeds: [embed], allowedMentions: { parse: [] } });
            delete embed;
            return;
        }
    }
}
