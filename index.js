// LIBRARIES
const fs = require('fs');
const Discord = require('discord.js');



// GLOBAL STUFF
const { client } = require('./constants.js');
const { PREFIX, TOKEN } = require('./config.js');



// MAPS AND COLLECTIONS
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.cooldowns = new Discord.Collection();



// BRING IN COMMANDS
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const slashCommandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
    const tempCMD = require(`./commands/${file}`);
    client.commands.set(tempCMD.name, tempCMD);
}

for (const file of slashCommandFiles) {
    const tempSlashCMD = require(`./slashCommands/${file}`);
    client.slashCommands.set(tempSlashCMD.name, tempSlashCMD);
}
































/**
 * @type {Discord.Guild}
 */
let ErrorGuild;

/**
 * @type {Discord.TextChannel}
 */
let ErrorChannel;

/**
 * @type {Discord.Guild}
 */
let Dr1fterXGuild;

// DISCORD READY EVENT
client.once('ready', async () => {

    ErrorGuild = await client.guilds.fetch('720258928470130760');
    ErrorChannel = ErrorGuild.channels.resolve('720578054480724050');
    Dr1fterXGuild = await client.guilds.fetch('284431454417584128');

    await client.user.setPresence(
        {
            activity: {
                name: `my commands`,
                type: 'LISTENING'
            },
            status: 'online'
        }
    );


    // Refresh
    client.setInterval(async function(){
        await client.user.setPresence(
            {
                activity: {
                    name: `my commands`,
                    type: 'LISTENING'
                },
                status: 'online'
            }
        );
    }, 1.08e+7);

    console.log("I am ready!");

});





































// DEBUGGING AND ERROR LOGGING
const ErrorModule = require('./bot_modules/errorLogger.js');


// WARNINGS
process.on('warning', async (warning) => {

    // Log to console
    console.warn(warning);

    // Log to Discord
    return await ErrorChannel.send(`**WARNING:**
    \`\`\`
    ${warning}
    \`\`\``);

});


client.on('warn', async (warning) => {

    // Log to console
    console.warn(warning);

    // Log to Discord
    return await ErrorChannel.send(`**DISCORD WARNING:**
    \`\`\`
    ${warning}
    \`\`\``);

});






// Unhandled Promise Rejections
process.on('unhandledRejection', async (error) => {

    // Log to console
    console.error(error);

    // Log to Discord
    return await ErrorChannel.send(`**Unhandled Promise Rejection:**
    \`\`\`
    ${error}
    \`\`\`
    **STACK TRACE:**
    \`\`\`
    ${error.stack}
    \`\`\``);

});





// DISCORD ERRORS
client.on('error', async (error) => {

    // Log to console
    console.error(error);

    // Log to Discord
    return await ErrorChannel.send(`**DISCORD ERROR:**
    \`\`\`
    ${error}
    \`\`\`
    **STACK TRACE:**
    \`\`\`
    ${error.stack}
    \`\`\``);

});





// Discord Ratelimit Error
client.on('rateLimit', async (rateLimitInfo) => {

    // Log to console
    console.warn(rateLimitInfo);

    // Log to Discord
    return await ErrorChannel.send(`\`\`\`DISCORD RATELIMIT:
    Timeout: ${rateLimitInfo.timeout} ms
    Limit: ${rateLimitInfo.limit}
    Method: ${rateLimitInfo.method}
    Path: ${rateLimitInfo.path}
    Route: ${rateLimitInfo.route}
    \`\`\``);

});














































































































































const SlashModule = require('./bot_modules/slashModule.js');


// Sneaky trick to use SLASH COMMANDS
client.on('raw', async (evt) => {

    if ( evt.t !== 'INTERACTION_CREATE' ) { return; }

    // Prevent Discord Outages breaking the bot
    if ( !Dr1fterXGuild.available ) { return; }

    const {d: data} = evt;

    if ( data.type !== 2 ) { return; }

    const CommandData = data.data;
    const GuildMember = await ErrorGuild.members.fetch(data.member.user.id);


    const fetchedSlashCommand = client.slashCommands.get(CommandData.name);

    if ( !fetchedSlashCommand ) {
        await SlashModule.CallbackEphemeral(data, 3, `Sorry ${GuildMember.displayName} - something prevented me from executing the **${CommandData.name}** command...`);
        return;
    }
    else {












        // COMMAND COOLDOWNS
        if ( !client.cooldowns.has(fetchedSlashCommand.name) ) {
            client.cooldowns.set(fetchedSlashCommand.name, new Discord.Collection());
        }


        const now = Date.now();
        const timestamps = client.cooldowns.get(fetchedSlashCommand.name);
        const cooldownAmount = (fetchedSlashCommand.cooldown || 3) * 1000;


        if ( timestamps.has(GuildMember.user.id) ) {

            const expirationTime = timestamps.get(GuildMember.user.id) + cooldownAmount;

            if ( now < expirationTime ) {

                let timeLeft = (expirationTime - now) / 1000;

                // Minutes
                if ( timeLeft >= 60 && timeLeft < 3600 ) {
                    timeLeft /= 60;
                    return await SlashModule.CallbackEphemeral(data, 3, `${GuildMember.displayName} - Please wait ${timeLeft.toFixed(1)} more minutes before using the \`${fetchedSlashCommand.name}\` command`);
                }
                // Hours
                else if ( timeLeft >= 3600 ) {
                    timeLeft /= 3600;
                    return await SlashModule.CallbackEphemeral(data, 3, `${GuildMember.displayName} - Please wait ${timeLeft.toFixed(1)} more hours before using the \`${fetchedSlashCommand.name}\` command`);
                }
                // Seconds
                else {
                    return await SlashModule.CallbackEphemeral(data, 3, `${GuildMember.displayName} - Please wait ${timeLeft.toFixed(1)} more seconds before using the \`${fetchedSlashCommand.name}\` command`);
                }

            }

        }
        else {
            timestamps.set(GuildMember.user.id, now);
            setTimeout(() => timestamps.delete(GuildMember.user.id), cooldownAmount);
        }







        // execute slash commmand
        try {
            await fetchedSlashCommand.execute(ErrorGuild, data, CommandData, GuildMember);
        } catch (err) {
            await ErrorModule.LogCustom(err, `(**INDEX.JS** - Execute __slash__ command fail)`);
            await SlashModule.CallbackEphemeral(data, 3, `Sorry ${GuildMember.displayName} - there was an error trying to run that command...`);
        }


        return;
    }

});














































// DISCORD MESSAGE POSTED EVENT
// - Commands (not Slash versions)
client.on('message', async (message) => {

    // Prevent Discord Outages crashing the Bot
    if ( !message.guild.available ) { return; }


    // Ignore DM Messages
    if ( message.channel instanceof Discord.DMChannel ) { return; }









    // Prevent other Bots/System stuff triggering us
    if ( message.author.bot || message.author.flags.has('SYSTEM') || message.system ) { return; }



    // Prefix Check
    const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);


    if ( !prefixRegex.test(message.content) ) {
        // No PREFIX found, do nothing
        return;
    }
    else {

        // Slice PREFIX and fetch Command
        const [, matchedPrefix] = message.content.match(prefixRegex);
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName);


        if ( !command ) {
            // No command found, do nothing
            return;
        }



        // COMMAND LIMITATIONS
        if ( command.limitation ) {
            switch(command.limitation) {

                case "twilightzebby":
                    if ( message.author.id !== "156482326887530498" ) {
                        return await message.channel.send(`${message.member.displayName} sorry, but this command is limited to just TwilightZebby#1955`);
                    }
                    break;



                default:
                    break;

            }
        }








        // COMMAND COOLDOWNS
        if ( !client.cooldowns.has(command.name) ) {
            client.cooldowns.set(command.name, new Discord.Collection());
        }


        const now = Date.now();
        const timestamps = client.cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;


        if ( timestamps.has(message.author.id) ) {

            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if ( now < expirationTime ) {

                let timeLeft = (expirationTime - now) / 1000;

                // Minutes
                if ( timeLeft >= 60 && timeLeft < 3600 ) {
                    timeLeft /= 60;
                    return await client.throttleCheck(message.channel, `${message.member.displayName} Please wait ${timeLeft.toFixed(1)} more minutes before using the \`${command.name}\` command`, message.author.id);
                }
                // Hours
                else if ( timeLeft >= 3600 ) {
                    timeLeft /= 3600;
                    return await client.throttleCheck(message.channel, `${message.member.displayName} Please wait ${timeLeft.toFixed(1)} more hours before using the \`${command.name}\` command`, message.author.id);
                }
                // Seconds
                else {
                    return await client.throttleCheck(message.channel, `${message.member.displayName} Please wait ${timeLeft.toFixed(1)} more seconds before using the \`${command.name}\` command`, message.author.id);
                }

            }



        }
        else {
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }

















        // EXECUTE COMMAND
        try {
            await command.execute(message, args);
        } catch (err) {
            await ErrorModule.LogCustom(err, `(**INDEX.JS** - Execute command fail)`);
            return await message.channel.send(`Sorry ${message.member.displayName} - there was an error trying to run that command...`);
        }
    }

});





client.login(TOKEN);
