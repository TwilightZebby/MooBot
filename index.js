// LIBRARIES
const fs = require("fs");
const Discord = require("discord.js");


// GLOBAL STUFF
const { client } = require("./constants.js");
const { CONFIG, TOKEN, ErrorLogChannelID, ErrorLogGuildID } = require("./config.js");


// MAPS / COLLECTIONS
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.contextCommands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.slashCooldowns = new Discord.Collection();
client.contextCooldowns = new Discord.Collection();
client.hotPotato = new Discord.Collection();


// BRING IN TEXT COMMANDS
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for ( const file of commandFiles )
{
    const tempCMD = require(`./commands/${file}`);
    client.commands.set(tempCMD.name, tempCMD);
}


// BRING IN SLASH COMMANDS
const slashCommandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));

for ( const file of slashCommandFiles )
{
    const tempSlash = require(`./slashCommands/${file}`);
    client.slashCommands.set(tempSlash.name, tempSlash);
}


// BRING IN CONTEXT COMMANDS
const contextCommandFiles = fs.readdirSync('./contextCommands').filter(file => file.endsWith('.js'));

for ( const file of contextCommandFiles )
{
    const tempContext = require(`./contextCommands/${file}`);
    client.contextCommands.set(tempContext.name, tempContext);
}








/******************************************************************************* */

// READY EVENT
client.once('ready', () => {

    client.user.setPresence({
        status: 'online'
    });

    // Refreshes the status
    /* setInterval(() => {
        client.user.setPresence({
            status: 'online'
        });
    }, 1.08e+7); */

    console.log("I am ready!");

});



















/******************************************************************************* */

// DEBUGGING AND ERROR LOGGING
const ErrorModule = require('./modules/errorLog.js');


// Warnings
process.on('warning', (warning) => {
    console.warn(warning);
    return;
});

client.on('warn', (warning) => {
    console.warn(warning);
    return;
});







// Unhandled Promise Rejections
process.on('unhandledRejection', async (error) => {
    await ErrorModule.LogCustom(error, `Unhandled Promise Rejection: `);
    return;
});








// Discord Errors
client.on('error', async (error) => {
    await ErrorModule.LogCustom(error, `Discord Error: `);
    return;
});






// Discord Rate Limit
client.on('rateLimit', async (rateLimitInfo) => {
    await ErrorModule.LogMessage(`Discord Ratelimit: \n\`\`\`Timeout: ${rateLimitInfo.timeout} \nLimit: ${rateLimitInfo.limit} \nMethod: ${rateLimitInfo.method} \nPath: ${rateLimitInfo.path} \nRoute: ${rateLimitInfo.route} \nGlobal: ${rateLimitInfo.global}\`\`\``);
    return;
});































/******************************************************************************* */
// MESSAGE CREATE EVENT (when a new message is sent)

const TextCommandHandler = require('./modules/textCommandHandler.js');

client.on('messageCreate', async (message) => {
    
    // Prevent other Bots and System stuff from triggering this Bot
    if ( message.author.bot || message.system || message.author.system ) { return; }

    // Ignore DM Messages
    if ( message.channel instanceof Discord.DMChannel ) { return; }

    // Prevent Discord Outages from crashing or breaking the Bot
    if ( !message.guild.available ) { return; }











    // Command Handler
    let textCommandSuccess = await TextCommandHandler.Main(message);
    if ( textCommandSuccess === false )
    {
        // No command prefix detected, so not a command
        return;
    }
    else if ( textCommandSuccess !== false && textCommandSuccess !== true )
    {
        // Command failed or otherwise
        return;
    }
    else
    {
        // Command successful
        return;
    }

});





























/******************************************************************************* */
// INTERACTION CREATE EVENT (when a Slash Command, Button, Select Menu, Context Command is used)

const SlashCommandHandler = require('./modules/slashCommandHandler.js');
const ButtonHandler = require('./modules/buttonHandler.js');
const SelectMenuHandler = require('./modules/selectMenuHandler.js');
const ContextCommandHandler = require('./modules/contextCommandHandler.js');

client.on('interactionCreate', async (interaction) => {

    if ( interaction.isCommand() )
    {
        // Is a Slash Command
        return await SlashCommandHandler.Main(interaction);
    }
    else if ( interaction.isButton() )
    {
        // Is a Button Component
        return await ButtonHandler.Main(interaction);
    }
    else if ( interaction.isSelectMenu() )
    {
        // Is a Select Menu (aka Dropdown)
        return await SelectMenuHandler.Main(interaction);
    }
    else if ( interaction.isContextMenu() )
    {
        // Is a Context Command (either User- or Message-based)
        return await ContextCommandHandler.Main(interaction);
    }
    else
    {
        // Is neither of the four above types
        return;
    }

});



























/******************************************************************************* */

client.login(TOKEN);
