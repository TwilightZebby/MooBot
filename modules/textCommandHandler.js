const Discord = require('discord.js');
const { client } = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');

const ErrorModule = require('./errorLog.js');

module.exports = {
    /**
     * Main function for the Text-based Command Handler
     * 
     * @param {Discord.Message} message
     * 
     * @returns {Promise<Boolean|*>} False if not a command
     */
    async Main(message)
    {
        // Prefix check
        const escapePrefix = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapePrefix(PREFIX)})\\s*`);

        if ( !prefixRegex.test(message.content) )
        {
            // No prefix found, so ignore
            return false;
        }
        else
        {
            // Slice off Prefix and assemble command
            const [, matchedPrefix] = message.content.match(prefixRegex);
            const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command = client.commands.get(commandName);


            if ( !command )
            {
                // No command found, return
                return;
            }







            // DM Test
            if ( command.dmOnly && !(message.channel instanceof Discord.DMChannel) )
            {
                return await message.channel.send({ content: `**${message.author.username}** sorry, but this command can only be used in DMs with this Bot.` });
            }




            // Guild Test
            if ( command.guildOnly && (message.channel instanceof Discord.DMChannel) )
            {
                return await message.channel.send({ content: `**${message.author.username}** sorry, but this command can only be used within Servers, not in DMs.` });
            }




            // Command Limitations
            if ( command.limitation )
            {
                switch ( command.limitation )
                {
                    case "dev":
                        // Only TwilightZebby, the Bot's developer, can use
                        if ( message.author.id !== TwilightZebbyID )
                        {
                            return await message.channel.send({ content: `**${message.author.username}** sorry, but this command can only be used by **TwilightZebby#1955**` });
                        }
                        break;



                    case "owner":
                        // Only TwilightZebby, and Server Owners, can use
                        if ( message.author.id !== TwilightZebbyID && message.author.id !== message.guild.ownerId )
                        {
                            return await message.channel.send({ content: `**${message.author.username}** sorry, but this command can only be used by Server Owners.` });
                        }
                        break;



                    default:
                        break;
                }
            }




            // Argument checks
            if ( command.requiresArgs && ( !args.length || args.length === 0 ) )
            {
                return await message.channel.send({ content: `**${message.author.username}** sorry, this command requires arguments to be passed to it, and I am unable to detect any in your command usage.` });
            }

            if ( command.requiresArgs && args.length >= 1 )
            {
                // Check for minimum args
                if ( args.length < command.minimumArgs )
                {
                    return await message.channel.send({ content: `**${message.author.username}** sorry, but this command requires a **minimum** of **${command.minimumArgs}** arguments, while you only gave ${args.length} arguments.` });
                }
            }

            // Check for maximum args
            if ( args.length > command.maximumArgs )
            {
                return await message.channel.send({ content: `**${message.author.username}** sorry, but this command has a **maximum** limit of **${command.maximumArgs}** arguments, while you gave ${args.length} arguments.` });
            }




            // Command Cooldowns
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
                        return await message.channel.send({ content: `**${message.author.username}** please wait ${timeLeft.toFixed(1)} more minutes before using the \`${command.name}\` command again.` });
                    }
                    // Hours
                    else if ( timeLeft >= 3600 )
                    {
                        timeLeft /= 3600;
                        return await message.channel.send({ content: `**${message.author.username}** please wait ${timeLeft.toFixed(1)} more hours before using the \`${command.name}\` command again.` });
                    }
                    // Seconds
                    else
                    {
                        return await message.channel.send({ content: `**${message.author.username}** please wait ${timeLeft.toFixed(1)} more seconds before using the \`${command.name}\` command again.` });
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
                await command.execute(message, args);
            }
            catch (err)
            {
                await ErrorModule.LogCustom(err, `Execute Text-based Command Failed: `);
                await message.channel.send({ content: `**${message.author.username}** sorry, but there was a problem trying to run the \`${commandName}\` command.` });
            }

            return;

        }
    }
}
