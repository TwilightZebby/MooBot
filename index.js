// LIBRARIES
const fs = require('fs');
const Discord = require('discord.js');
const {Statuspage, StatuspageUpdates} = require('statuspage.js');


// GLOBAL STUFF
const CONSTANTS = require('./constants.js'); // Mostly for the strings
const { client } = require('./constants.js'); // Makes things easier
const CONFIG = require('./config.js');
const UTILITY = require('./modules/utilityModule.js');

const DiscordStatus = new StatuspageUpdates(CONFIG.DiscordStatusPageID, 10000);


// MAPS AND COLLECTIONS
client.textCommands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.contextCommands = new Discord.Collection();
client.buttons = new Discord.Collection();
client.selects = new Discord.Collection();
client.modals = new Discord.Collection();

client.cooldowns = new Discord.Collection();
client.slashCooldowns = new Discord.Collection();
client.contextCooldowns = new Discord.Collection();
client.buttonCooldowns = new Discord.Collection();
client.selectCooldowns = new Discord.Collection();

client.potato = new Discord.Collection();
client.roleMenu = new Discord.Collection();
client.statusUpdates = new Discord.Collection();

client.millisecondsUptime = null;


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

// Modals
const modalFiles = fs.readdirSync('./modals').filter(file => file.endsWith('.js'));
for ( const file of modalFiles )
{
    const tempCMD = require(`./modals/${file}`);
    client.modals.set(tempCMD.name, tempCMD);
}








/******************************************************************************* */
// DISCORD - READY EVENT
client.once('ready', () => {
    client.user.setPresence({
        status: 'online'
    });

    client.millisecondsUptime = new Date().getTime();

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
const AntiSt1gBotSpam = require('./modules/antiSt1gBotSpamModule.js');

client.on('messageCreate', async (message) => {
    //console.log(`MESSAGE_CREATE\n\n${message.channel}\n***********************************************************************************`);

    // Ignore Partial Messages
    if ( message.partial ) { return; }

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
        if ( message.channel.id === CONFIG.Dr1fterXSocialChannel && message.author.id === CONFIG.St1gBotUserID ) { await AntiSt1gBotSpam.main(message); } // Anti St1gBot Spam Module
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
const ModelHandler = require('./modules/modalHandler.js');
const AutocompleteHandler = require('./modules/autocompleteHandler.js');

client.on('interactionCreate', async (interaction) => {
    //console.log(`INTERACTION_CREATE\n\n${interaction.channel}\n***********************************************************************************`);

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
    else if ( interaction.isModalSubmit() )
    {
        // Is an Input Modal
        return await ModelHandler.Main(interaction);
    }
    else if ( interaction.isAutocomplete() )
    {
        // Is Autocomplete
        return await AutocompleteHandler.Main(interaction);
    }
    else
    {
        // Is none of the above types
        return console.log(`Unrecognised or new unhandled Interaction type triggered`);
    }
});





























/******************************************************************************* */
// DISCORD - MESSAGE DELETE EVENT
//         - The reason I had to enable Message Partials :S
//         - Used for deleting existing Role Menus from the JSON when their linked Message is deleted

client.on('messageDelete', (message) => {
    //console.log(`MESSAGE_DELETE\n\n${message.channel}\n***********************************************************************************`);

    let roleMenuJSON = require('./hiddenJsonFiles/roleMenus.json');

    // Delete from Role Menu JSON, if it exists in there
    if ( roleMenuJSON[message.id] )
    {
        delete roleMenuJSON[message.id];
        fs.writeFile('./hiddenJsonFiles/roleMenus.json', JSON.stringify(roleMenuJSON, null, 4), async (err) => {
            if ( err ) { return console.error(err); }
        });
    }

    return;
});



























/******************************************************************************* */
// STATUSPAGE - ON STATUS UPDATE

DiscordStatus.on('incident_update', async (incident) => {
    // Ensure we can actually access/send messages into the Discord Guild
    // ...So that we don't crash Bot if a Discord Outage affects sending messages!
    let discordGuild = await client.guilds.fetch(CONFIG.ErrorLogGuildID);
    
    if ( !discordGuild.available ) { return; }


    // Guild is available, thus fetch Channel for later
    /** @type {Discord.GuildTextBasedChannel} */
    let discordChannel = await discordGuild.channels.fetch(CONFIG.ErrorLogChannelID);

    // So that we know if we need to send a new message or update an existing one
    let existingUpdate = client.statusUpdates.get(incident.id);
    
    if ( !existingUpdate )
    {
        // Not existing, thus create new message
        let newStatusEmbed = new Discord.MessageEmbed()
            .setColor(incident.impact === "none" ? 'DEFAULT' : incident.impact === "minor" ? '#13b307' : incident.impact === "major" ? '#e8e409' : '#940707')
            .setTitle(incident.name)
            .setURL(incident.shortlink)
            .setDescription(`Impact: ${incident.impact}`)
            .addFields(incident.incident_updates.reverse().map(incidentUpdate => { return { name: `${incidentUpdate.status.charAt(0).toUpperCase() + incidentUpdate.status.slice(1)} ( <t:${Math.floor(incidentUpdate.updated_at.getTime() / 1000)}:R> )`, value: (incidentUpdate.body || "No information available.") } }).slice(-24))
            .setTimestamp(incident.created_at);
        
        // Send
        let sentMessage = await discordChannel.send({ content: `**Discord Outage:**`, embeds: [newStatusEmbed] });
        
        // Store
        client.statusUpdates.set(incident.id, sentMessage.id);
        return;
    }
    else
    {
        // Existing, thus update message
        // Check we have READ_MESSAGE_HISTORY Permission in the channel
        if ( !discordChannel.permissionsFor(discordGuild.me).has(Discord.Permissions.FLAGS.READ_MESSAGE_HISTORY) ) { return; }

        // Construct new Embed
        let updateStatusEmbed = new Discord.MessageEmbed()
            .setColor(incident.impact === "none" ? 'DEFAULT' : incident.impact === "minor" ? '#13b307' : incident.impact === "major" ? '#e8e409' : '#940707')
            .setTitle(incident.name)
            .setURL(incident.shortlink)
            .setDescription(`Impact: ${incident.impact}`)
            .addFields(incident.incident_updates.reverse().map(incidentUpdate => { return { name: `${incidentUpdate.status.charAt(0).toUpperCase() + incidentUpdate.status.slice(1)} ( <t:${Math.floor(incidentUpdate.updated_at.getTime() / 1000)}:R> )`, value: (incidentUpdate.body || "No information available.") } }).slice(-24))
            .setTimestamp(incident.created_at);
        
        // Fetch & Update Message
        let fetchedMessage = await discordChannel.messages.fetch(existingUpdate);
        await fetchedMessage.edit({ embeds: [updateStatusEmbed] });
        return;
    }
});


























/******************************************************************************* */

client.login(CONFIG.TOKEN);
DiscordStatus.start(); // Start listening for Discord Status Updates
