// LIBRARIES
const fs = require('fs');
const Discord = require('discord.js');


// GLOBAL STUFF
const CONSTANTS = require('./constants.js'); // Mostly for the strings
const { client } = require('./constants.js'); // Makes things easier
const CONFIG = require('./config.js');
const UTILITY = require('./modules/utilityModule.js');


// MAPS AND COLLECTIONS
client.textCommands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.contextCommands = new Discord.Collection();
client.buttons = new Discord.Collection();
client.selects = new Discord.Collection();

client.cooldowns = new Discord.Collection();
client.slashCooldowns = new Discord.Collection();
client.contextCooldowns = new Discord.Collection();
client.buttonCooldowns = new Discord.Collection();
client.selectCooldowns = new Discord.Collection();

client.potato = new Discord.Collection();


// BRING IN ALL THE COMMANDS AND INTERACTIONS
// Text-based Commands
const textCommandFiles = fs.readdirSync('./textCommands').filter(file => file.endsWith('.js'));
for ( const file of textCommandFiles )
{
    const tempCMD = require(`./textCommands/${file}`);
    client.textCommands.set(tempCMD.name, tempCMD);
}

// Slash Commands
const slashCommandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));
for ( const file of slashCommandFiles )
{
    const tempCMD = require(`./slashCommands/${file}`);
    client.slashCommands.set(tempCMD.name, tempCMD);
}

// Context Commands
const contextCommandFiles = fs.readdirSync('./contextCommands').filter(file => file.endsWith('.js'));
for ( const file of contextCommandFiles )
{
    const tempCMD = require(`./contextCommands/${file}`);
    client.contextCommands.set(tempCMD.name, tempCMD);
}

// Buttons
const buttonFiles = fs.readdirSync('./buttons').filter(file => file.endsWith('.js'));
for ( const file of buttonFiles )
{
    const tempCMD = require(`./buttons/${file}`);
    client.buttons.set(tempCMD.name, tempCMD);
}

// Selects
const selectFiles = fs.readdirSync('./selects').filter(file => file.endsWith('.js'));
for ( const file of selectFiles )
{
    const tempCMD = require(`./selects/${file}`);
    client.selects.set(tempCMD.name, tempCMD);
}








/******************************************************************************* */
// DISCORD - READY EVENT
client.once('ready', () => {
    client.user.setPresence({
        status: 'online'
    });

    console.log("I am ready!");
});



















/******************************************************************************* */
// DEBUGGING AND ERROR LOGGING
// Warnings
process.on('warning', (warning) => { return console.warn("***WARNING: ", warning) });
client.on('warn', (warning) => { return console.warn("***DISCORD WARNING: ", warning) });

// Unhandled Promise Rejections
process.on('unhandledRejection', (err) => { return console.error("******UNHANDLED PROMISE REJECTION: ", err) });

// Discord Errors
client.on('error', (err) => { return console.error("******DISCORD ERROR: ", err) });

// Discord Rate Limit
// Uncomment only for debugging purposes
//client.on('rateLimit', (rateLimitInfo) => { return console.log("***DISCORD RATELIMIT HIT: ", rateLimitInfo) });



















/******************************************************************************* */
// DISCORD - MESSAGE CREATE EVENT
const TextCommandHandler = require('./modules/textCommandHandler.js');
const AutoQuote = require('./modules/autoQuoteModule.js');

client.on('messageCreate', async (message) => {
    // Prevent other Bots and Discord's System stuff from triggering this Bot
    if ( message.author.bot || message.system || message.author.system ) { return; }

    // Ignore DM Messages
    if ( message.channel instanceof Discord.DMChannel ) { return; }

    // Prevent Discord Outages from crashing or breaking Bot
    if ( !message.guild.available ) { return; }



    // Command Handler
    let textCommandSuccess = await TextCommandHandler.Main(message);
    if ( textCommandSuccess === false )
    {
        // No command prefix detected
        if ( UTILITY.messageLinkRegex.test(message.content) ) { await AutoQuote.main(message); } // Auto Quote Module
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
// DISCORD - INTERACTION CREATE EVENT
const SlashCommandHandler = require('./modules/slashCommandHandler.js');
const ButtonHandler = require('./modules/buttonHandler.js');
const SelectMenuHandler = require('./modules/selectMenuHandler.js');
const ContextCommandHandler = require('./modules/contextCommandHandler.js');
const AutoCompleteHandler = require('./modules/autoCompleteHandler.js');

client.on('interactionCreate', async (interaction) => {
    if ( interaction.isCommand() )
    {
        // Is a Slash Command
        return await SlashCommandHandler.Main(interaction);
    }
    else if ( interaction.isContextMenu() )
    {
        // Is a Context Command
        return await ContextCommandHandler.Main(interaction);
    }
    else if ( interaction.isButton() )
    {
        // Is a Button Component
        return await ButtonHandler.Main(interaction);
    }
    else if ( interaction.isSelectMenu() )
    {
        // Is a Select Component
        return await SelectMenuHandler.Main(interaction);
    }
    else if ( interaction.isAutocomplete() )
    {
        // Is an AutoComplete Interaction
        return await AutoCompleteHandler.Main(interaction);
    }
    else
    {
        // Is none of the above types
        return console.log(`Unrecognised or new Interaction type triggered`);
    }
});



























/******************************************************************************* */

client.login(CONFIG.TOKEN);
