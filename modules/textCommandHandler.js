// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');
const TextCommandAllowLists = require('../hiddenJsonFiles/commandAllowList.json');

module.exports = {
    /**
     * Main function for Text-based Command Handler
     * 
     * @param {Discord.Message} message Source Message that triggered this
     * 
     * @returns {Promise<Boolean|*>} False if not a command
     */
    async Main(message)
    {
        // CHECK FOR PREFIX (including @mention of the Bot itself)
        const escapePrefix = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapePrefix(PREFIX)})\\s*`);

        if ( !prefixRegex.test(message.content) )
        {
            // No prefix found, not a command attempt
            return false;
        }
        else
        {
            // Slice off Prefix and assemble command
            const [, matchedPrefix] = message.content.match(prefixRegex);
            const arguments = message.content.slice(matchedPrefix.length).trim().split(/ +/);
            const commandName = arguments.shift().toLowerCase();
            const command = client.textCommands.get(commandName);

            if ( !command )
            {
                // No command found
                return;
            }


            // Test for DM usage
            if ( command.dmOnly && !(message.channel instanceof Discord.DMChannel) ) 
            {
                return await message.reply({ content: CONSTANTS.errorMessages.TEXT_COMMAND_DMS_ONLY, allowedMentions: { parse: [], repliedUser: false } });
            }


            // Test for Guild usage
            if ( command.guildOnly && (message.channel instanceof Discord.DMChannel) )
            {
                return await message.channel.send({ content: CONSTANTS.errorMessages.TEXT_COMMAND_GUILDS_ONLY, allowedMentions: { parse: [], repliedUser: false } });
            }


            // Command Limitations
            // If missing from command, default to "everyone can use this"
            if ( command.limitation )
            {
                switch ( command.limitation )
                {
                    case "developer":
                        // Only TwilightZebby, the Bot's Developer, can use
                        if ( message.author.id !== TwilightZebbyID )
                        {
                            return await message.reply({ content: CONSTANTS.errorMessages.TEXT_COMMAND_NO_PERMISSION_DEVELOPER, allowedMentions: { parse: [], repliedUser: false } });
                        }
                        break;

                    case "owner":
                        // Server Owners and TwilightZebby can use
                        if ( message.author.id !== TwilightZebbyID && message.author.id !== message.guild.ownerId )
                        {
                            return await message.reply({ content: CONSTANTS.errorMessages.TEXT_COMMAND_NO_PERMISSION_OWNER, allowedMentions: { parse: [], repliedUser: false } });
                        }
                        break;

                    case "admin":
                        // Server Owners, those with Admin Permission, and TwilightZebby can use
                        if ( message.author.id !== TwilightZebbyID && message.author.id !== message.guild.ownerId && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR) )
                        {
                            return await message.reply({ content: CONSTANTS.errorMessages.TEXT_COMMAND_NO_PERMISSION_ADMIN, allowedMentions: { parse: [], repliedUser: false } });
                        }
                        break;

                    case "moderator":
                        // Those with Moderator-level permissions, Admin Permission, Server Owners, and TwilightZebby can use
                        if ( message.author.id !== TwilightZebbyID && message.author.id !== message.guild.ownerId && !message.member.permissions.has("ADMINISTRATOR") && !message.member.permissions.has("BAN_MEMBERS") && !message.member.permissions.has("KICK_MEMBERS") && !message.member.permissions.has("MANAGE_CHANNELS") && !message.member.permissions.has("MANAGE_GUILD") && !message.member.permissions.has("MANAGE_MESSAGES") && !message.member.permissions.has("MANAGE_ROLES") && !message.member.permissions.has("MANAGE_THREADS") && !message.member.permissions.has("MODERATE_MEMBERS") )
                        {
                            return await message.reply({ content: CONSTANTS.errorMessages.TEXT_COMMAND_NO_PERMISSION_MODERATOR, allowedMentions: { parse: [], repliedUser: false } });
                        }
                        break;

                    case "private":
                        // Check per-Command per-User Allow List to see if User has been granted permission to use this Command
                        if ( !TextCommandAllowLists[`${commandName}`]?.includes(message.author.id) )
                        {
                            return await message.reply({ content: CONSTANTS.errorMessages.TEXT_COMMAND_NO_PERMISSION_GENERIC, allowedMentions: { parse: [], repliedUser: false } });
                        }
                        break;

                    case "everyone":
                    default:
                        break;
                }
            }



            // Argument checks
            // Check for required arguments
            if ( command.requiresArguments && ( !arguments.length || arguments.length === 0 ) )
            {
                return await message.reply({ content: CONSTANTS.errorMessages.TEXT_COMMAND_ARGUMENTS_REQUIRED, allowedMentions: { parse: [], repliedUser: false } });
            }

            // Check for minimum amount of required arguments
            if ( command.requiresArguments && arguments.length >= 1 )
            {
                if ( arguments.length < command.minimumArguments )
                {
                    let errorMsg = CONSTANTS.errorMessages.TEXT_COMMAND_ARGUMENTS_MINIMUM.replace("{{minimumArguments}}", command.minimumArguments).replace("{{givenArguments}}", arguments.length);
                    return await message.reply({ content: errorMsg, allowedMentions: { parse: [], repliedUser: false } });
                }
            }

            // Check for maximum allowed arguments
            if ( arguments.length > command.maximumArguments )
            {
                let errorMsg = CONSTANTS.errorMessages.TEXT_COMMAND_ARGUMENTS_MAXIMUM.replace("{{maximumArguments}}", command.maximumArguments).replace("{{givenArguments}}", arguments.length);
                return await message.reply({ content: errorMsg, allowedMentions: { parse: [], repliedUser: false } });
            }




            // Command Cooldown
            if ( !client.cooldowns.has(command.name) )
            {
                // No current cooldown found, make a new one
                client.cooldowns.set(command.name, new Discord.Collection());
            }

            

            const now = Date.now();
            const timestamps = client.cooldowns.get(command.name);
            const cooldownAmount = ( command.cooldown || 3 ) * 1000;



            if ( timestamps.has(message.author.id) )
            {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                if ( now < expirationTime )
                {
                    let timeLeft = ( expirationTime - now ) / 1000;

                    // Minutes
                    if ( timeLeft >= 60 && timeLeft < 3600 )
                    {
                        timeLeft /= 60;
                        let cooldownMessage = CONSTANTS.errorMessages.TEXT_COMMAND_COOLDOWN.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)} more minutes`).replace("{{commandName}}", `**${command.name}**`);
                        return await message.reply({ content: cooldownMessage, allowedMentions: { parse: [], repliedUser: false } });
                    }
                    // Hours
                    else if ( timeLeft >= 3600 )
                    {
                        timeLeft /= 3600;
                        let cooldownMessage = CONSTANTS.errorMessages.TEXT_COMMAND_COOLDOWN.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)} more hours`).replace("{{commandName}}", `**${command.name}**`);
                        return await message.reply({ content: cooldownMessage, allowedMentions: { parse: [], repliedUser: false } });
                    }
                    // Days
                    else if ( timeLeft >= 86400 && timeLeft < 2.628e+6 )
                    {
                        timeLeft /= 86400;
                        let cooldownMessage = CONSTANTS.errorMessages.TEXT_COMMAND_COOLDOWN.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)} more days`).replace("{{commandName}}", `**${command.name}**`);
                        return await message.reply({ content: cooldownMessage, allowedMentions: { parse: [], repliedUser: false } });
                    }
                    // Months
                    else if ( timeLeft >= 2.628e+6 )
                    {
                        timeLeft /= 2.628e+6;
                        let cooldownMessage = CONSTANTS.errorMessages.TEXT_COMMAND_COOLDOWN.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)} more months`).replace("{{commandName}}", `**${command.name}**`);
                        return await message.reply({ content: cooldownMessage, allowedMentions: { parse: [], repliedUser: false } });
                    }
                    // Seconds
                    else
                    {
                        let cooldownMessage = CONSTANTS.errorMessages.TEXT_COMMAND_COOLDOWN.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)} more seconds`).replace("{{commandName}}", `**${command.name}**`);
                        return await message.reply({ content: cooldownMessage, allowedMentions: { parse: [], repliedUser: false } });
                    }
                }
            }
            else
            {
                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            }




            // Attempt to run command
            try
            {
                await command.execute(message, arguments);
            }
            catch (err)
            {
                console.error(err);
                await message.reply({ content: CONSTANTS.errorMessages.TEXT_COMMAND_GENERIC_FAILED.replace("{{commandName}}", `**${command.name}**`), allowedMentions: { parse: [], repliedUser: false } });
            }

            return;
        }
    }
};
