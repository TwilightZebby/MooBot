const { PermissionFlagsBits, Message, DMChannel, Collection } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");
const Config = require("../../config.js");

module.exports = {
    /**
     * Checks for a Text Command in a sent Message, and runs it if true
     * @param {Message} message Source Message that triggered this
     * @returns {Promise<Boolean|*>} False if not a Command
     */
    async Main(message)
    {
        // Check for Prefix (including @mention of the Bot itself)
        const EscapePrefix = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const PrefixRegex = new RegExp(`^(<@!?${DiscordClient.user.id}>|${EscapePrefix(Config.PREFIX)})\\s*`);

        if ( !PrefixRegex.test(message.content) )
        {
            // No prefix found, thus not an attempt to use a Text Command
            return false;
        }
        else
        {
            // Slice off Prefix and assemble command
            const [, MatchedPrefix] = message.content.match(PrefixRegex);
            const Arguments = message.content.slice(MatchedPrefix.length).trim().split(/ +/);
            const CommandName = Arguments.shift().toLowerCase();
            const Command = Collections.TextCommands.get(CommandName) || Collections.TextCommands.find(cmd => cmd.Alias && cmd.Alias.includes(CommandName));

            if ( !Command ) { return null; }

            // DM Usage
            if ( Command.Scope === 'DM' && !(message.channel instanceof DMChannel) )
            {
                return await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: "Sorry, but that Command can only be used in DMs with me." });
            }

            // Guild Usage
            if ( Command.Scope === 'GUILD' && (message.channel instanceof DMChannel) )
            {
                return await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: "Sorry, but that Command can only be used in Servers, not in DMs with me." });
            }


            // Command Permission Checks
            if ( Command.PermissionLevel )
            {
                switch ( Command.PermissionLevel )
                {
                    case "DEVELOPER":
                        // Bot's Dev
                        if ( message.author.id !== Config.BotDevID )
                        {
                            return await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: "Sorry, but that Command can only be used by my developer!" });
                        }
                        break;

                    case "SERVER_OWNER":
                        // Bot's Dev, and Server Owners
                        if ( message.author.id !== Config.BotDevID && message.author.id !== message.guild.ownerId )
                        {
                            return await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: "Sorry, but that Command can only be used by the Owner of this Server!" });
                        }
                        break;

                    case "ADMIN":
                        // Bot's Dev, Server Owners, and those with "ADMIN" Permission
                        if ( message.author.id !== Config.BotDevID && message.author.id !== message.guild.ownerId && !message.member.permissions.has(PermissionFlagsBits.Administrator) )
                        {
                            return await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: "Sorry, but that Command can only be used by the Owner of this Server, and those with the \"ADMINISTRATOR\" Permission." });
                        }
                        break;

                    case "MODERATOR":
                        // Bot's Dev, Server Owners, those with "ADMIN" Permission, and Server Moderators
                        if ( message.author.id !== Config.BotDevID && message.author.id !== message.guild.ownerId && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers) && !message.member.permissions.has(PermissionFlagsBits.KickMembers) && !message.member.permissions.has(PermissionFlagsBits.ManageChannels) && !message.member.permissions.has(PermissionFlagsBits.ManageGuild) && !message.member.permissions.has(PermissionFlagsBits.ManageMessages) && !message.member.permissions.has(PermissionFlagsBits.ManageRoles) && !message.member.permissions.has(PermissionFlagsBits.ManageThreads) && !message.member.permissions.has(PermissionFlagsBits.ModerateMembers) )
                        {
                            return await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: "Sorry, but that Command can only be used by this Server's Moderators, those with the \"ADMINISTRATOR\" Permission, and this Server's Owner." });
                        }
                        break;

                    case "EVERYONE":
                    default:
                        break;
                }
            }



            // Command Argument Checks
            // Required Arguments Check
            if ( Command.ArgumentsRequired && ( !Arguments.length || Arguments.length === 0 ) )
            {
                return await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: "Sorry, but this Command requires arguments to be included in its usage.\n" });
            }

            // Minimum Arguments Check
            if ( Command.ArgumentsRequired && Arguments.length < Command.MinimumArguments )
            {
                let minArgErrMsg = `Sorry, but this Command requires a **minimum** of ${Command.MinimumArguments} arguments, while you only included ${Arguments.length} arguments.`;
                return await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: minArgErrMsg });
            }

            // Maximum Arguments Check
            if ( Arguments.length > Command.MaximumArguments )
            {
                let maxArgErrMsg = `Sorry, but this Command requires a **maximum** of ${Command.MaximumArguments} arguments, while you included ${Arguments.length} arguments.`;
            }



            // Cooldown Checks
            if ( !Collections.TextCooldowns.has(Command.Name) )
            {
                // No active cooldown, start a new one
                Collections.TextCooldowns.set(Command.Name, new Collection());
            }

            // Set initial values
            const Now = Date.now();
            /** @type {Collection} */
            const Timestamps = Collections.TextCooldowns.get(Command.Name);
            const CooldownAmount = ( Command.Cooldown || 3 ) * 1000;

            // Cooldown
            if ( Timestamps.has(message.author.id) )
            {
                // Cooldown hit, tell User to cool off a little hehe
                const ExpirationTime = Timestamps.get(message.author.id) + CooldownAmount;

                if ( Now < ExpirationTime )
                {
                    let timeLeft = ( ExpirationTime - Now ) / 1000; // How much time is left of cooldown, in seconds

                    switch (timeLeft)
                    {
                        // MINUTES
                        case timeLeft >= 60 && timeLeft < 3600:
                            timeLeft = timeLeft / 60; // For UX
                            let cooldownMinutesMessage = `Please wait ${timeLeft.toFixed(1)} more minutes before using this Command again.`;
                            return await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: cooldownMinutesMessage });

                        // HOURS
                        case timeLeft >= 3600 && timeLeft < 86400:
                            timeLeft = timeLeft / 3600; // For UX
                            let cooldownHoursMessage = `Please wait ${timeLeft.toFixed(1)} more hours before using this Command again.`;
                            return await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: cooldownHoursMessage });

                        // DAYS
                        case timeLeft >= 86400 && timeLeft < 2.628e+6:
                            timeLeft = timeLeft / 86400; // For UX
                            let cooldownDaysMessage = `Please wait ${timeLeft.toFixed(1)} more days before using this Command again.`;
                            return await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: cooldownDaysMessage });

                        // MONTHS
                        case timeLeft >= 2.628e+6:
                            timeLeft = timeLeft / 2.628e+6; // For UX
                            let cooldownMonthsMessage = `Please wait ${timeLeft.toFixed(1)} more months before using this Command again.`;
                            return await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: cooldownMonthsMessage });

                        // SECONDS
                        default:
                            let cooldownSecondsMessage = `Please wait ${timeLeft.toFixed(1)} more seconds before using this Command again.`;
                            return await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: cooldownSecondsMessage });
                    }
                }
            }
            else
            {
                Timestamps.set(message.author.id, Now);
                setTimeout(() => Timestamps.delete(message.author.id), CooldownAmount);
            }



            // Attempt to run Command
            try { await Command.execute(message, Arguments); }
            catch (err)
            {
                //console.error(err);
                await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: "Sorry, but there was a problem trying to run this Command." });
            }

            return;
        }
    }
}
