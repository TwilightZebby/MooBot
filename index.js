const { RateLimitError, DMChannel, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Webhook, Colors, TextChannel } = require("discord.js");
const { Statuspage, StatuspageUpdates } = require("statuspage.js");
const fs = require("fs");
const { DiscordClient, Collections, DiscordStatusClient } = require("./constants.js");
const Config = require("./config.js");


// Because I need this to be mutable
DiscordClient.st1gBotGrace = false;



/******************************************************************************* */
// BRING IN FILES FOR COMMANDS AND INTERACTIONS
// Text Commands
const TextCommandFiles = fs.readdirSync("./TextCommands").filter(file => file.endsWith(".js"));
for ( const File of TextCommandFiles )
{
    const TempCommand = require(`./TextCommands/${File}`);
    Collections.TextCommands.set(TempCommand.Name, TempCommand);
}

// Slash Commands
const SlashCommandFiles = fs.readdirSync("./Interactions/SlashCommands").filter(file => file.endsWith(".js"));
for ( const File of SlashCommandFiles )
{
    const TempCommand = require(`./Interactions/SlashCommands/${File}`);
    Collections.SlashCommands.set(TempCommand.Name, TempCommand);
}

// Context Commands
const ContextCommandFiles = fs.readdirSync("./Interactions/ContextCommands").filter(file => file.endsWith(".js"));
for ( const File of ContextCommandFiles )
{
    const TempCommand = require(`./Interactions/ContextCommands/${File}`);
    Collections.ContextCommands.set(TempCommand.Name, TempCommand);
}

// Buttons
const ButtonFiles = fs.readdirSync("./Interactions/Buttons").filter(file => file.endsWith(".js"));
for ( const File of ButtonFiles )
{
    const TempButton = require(`./Interactions/Buttons/${File}`);
    Collections.Buttons.set(TempButton.Name, TempButton);
}

// Selects
const SelectFiles = fs.readdirSync("./Interactions/Selects").filter(file => file.endsWith(".js"));
for ( const File of SelectFiles )
{
    const TempSelect = require(`./Interactions/Selects/${File}`);
    Collections.Selects.set(TempSelect.Name, TempSelect);
}

// Modals
const ModalFiles = fs.readdirSync("./Interactions/Modals").filter(file => file.endsWith(".js"));
for ( const File of ModalFiles )
{
    const TempModal = require(`./Interactions/Modals/${File}`);
    Collections.Modals.set(TempModal.Name, TempModal);
}








/******************************************************************************* */
// DISCORD - READY EVENT
DiscordClient.once('ready', () => {
    DiscordClient.user.setPresence({ status: 'online' });
    console.log(`${DiscordClient.user.username}#${DiscordClient.user.discriminator} is online and ready!`);
});








/******************************************************************************* */
// DEBUGGING AND ERROR LOGGING
// Warnings
process.on('warning', (warning) => { return console.warn("***WARNING: ", warning); });
DiscordClient.on('warn', (warning) => { return console.warn("***DISCORD WARNING: ", warning); });

// Unhandled Promise Rejections
process.on('unhandledRejection', (err) => { return console.error("***UNHANDLED PROMISE REJECTION: ", err); });

// Discord Errors
DiscordClient.on('error', (err) => { return console.error("***DISCORD ERROR: ", err); });

// Discord Rate Limit - Only uncomment when debugging
//DiscordClient.rest.on('rateLimited', (RateLimitError) => { return console.log("***DISCORD RATELIMIT HIT: ", RateLimitError); });








/******************************************************************************* */
// DISCORD - MESSAGE CREATE EVENT
const TextCommandHandler = require("./BotModules/Handlers/TextCommandHandler.js");
const AntiSt1gBotSpam = require("./BotModules/AntiSt1gBotSpamModule.js");
const ToDThreadModule = require("./BotModules/ToDThreadModule.js");

DiscordClient.on('messageCreate', async (message) => {
    // Partials
    if ( message.partial ) { return; }

    // Bots
    if ( message.author.bot )
    { 
        // Anti-St1gBot-Spam
        if ( message.channel.id === Config.Dr1fterXSocialChannel && ( message.author.id === Config.St1gBotUserID || message.author.id === Config.St1gCheckerBotUserID ) )
        { await AntiSt1gBotSpam.Main(message); }

        // ToD Bot Thread Creation
        if ( message.guildId === Config.ErrorLogGuildID && message.author.id === Config.TruthOrDareBotID )
        { await ToDThreadModule.Main(message); }

        return;
    }

    // System Messages
    if ( message.system || message.author.system ) { return; }

    // DM Channel Messages
    if ( message.channel instanceof DMChannel ) { return; }

    // Safe-guard against Discord Outages
    if ( !message.guild.available ) { return; }



    // Check for (and handle) Commands
    let textCommandStatus = await TextCommandHandler.Main(message);
    if ( textCommandStatus === false )
    {
        // No Command detected
        return;
    }
    else if ( textCommandStatus === null )
    {
        // Prefix was detected, but wasn't a command on the bot
        return;
    }
    else
    {
        // Command failed or successful
        return;
    }
});








/******************************************************************************* */
// DISCORD - INTERACTION CREATE EVENT
const SlashCommandHandler = require("./BotModules/Handlers/SlashCommandHandler.js");
const ContextCommandHandler = require("./BotModules/Handlers/ContextCommandHandler.js");
const ButtonHandler = require("./BotModules/Handlers/ButtonHandler.js");
const SelectHandler = require("./BotModules/Handlers/SelectHandler.js");
const AutocompleteHandler = require("./BotModules/Handlers/AutocompleteHandler.js");
const ModalHandler = require("./BotModules/Handlers/ModalHandler.js");

DiscordClient.on('interactionCreate', async (interaction) => {
    if ( interaction.isChatInputCommand() )
    {
        // Slash Command
        return await SlashCommandHandler.Main(interaction);
    }
    else if ( interaction.isContextMenuCommand() )
    {
        // Context Command
        return await ContextCommandHandler.Main(interaction);
    }
    else if ( interaction.isButton() )
    {
        // Button
        return await ButtonHandler.Main(interaction);
    }
    else if ( interaction.isAnySelectMenu() )
    {
        // Select
        return await SelectHandler.Main(interaction);
    }
    else if ( interaction.isAutocomplete() )
    {
        // Autocomplete
        return await AutocompleteHandler.Main(interaction);
    }
    else if ( interaction.isModalSubmit() )
    {
        // Modal
        return await ModalHandler.Main(interaction);
    }
    else
    {
        // Unknown or unhandled new type of Interaction
        return console.log(`****Unrecognised or new unhandled Interaction type triggered:\n${interaction.type}\n${interaction}`);
    }
});








/******************************************************************************* */
// DISCORD - GUILD CREATE EVENT
DiscordClient.on('guildCreate', async (guild) => {
    // Log whenever the Bot is added to a Guild
    //   This is purely so the Bot's Developer, TwilightZebby, can have an approval system
    //   and thus, force the Bot to leave Servers TwilightZebby hasn't allowed to add the Bot to

    const GuildOwner = await guild.fetchOwner();

    // Embed
    const GuildJoinedEmbed = new EmbedBuilder().setColor(Colors.Green)
    .setTitle(`Joined ${guild.name}`)
    .setThumbnail(guild.iconURL({ extension: 'png' }))
    .addFields(
        { name: `Guild Owner`, value: `**User ID:** ${GuildOwner.id}\n**Tag:** ${GuildOwner.user.tag}\n**Mention:** <@${GuildOwner.id}>` },
        { name: `Guild Info`, value: `**Approx. Member Count:** ${guild.approximateMemberCount}` }
    );

    // Buttons
    const ButtonActionRow = new ActionRowBuilder().addComponents([
        new ButtonBuilder().setCustomId(`guild-approve_${guild.id}`).setEmoji('✅').setLabel(`Approve`).setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`guild-reject_${guild.id}`).setEmoji('❌').setLabel(`Reject`).setStyle(ButtonStyle.Danger)
    ]);

    // Send
    const LoggingGuild = await DiscordClient.guilds.fetch({ guild: Config.ErrorLogGuildID });
    /** @type {TextChannel} */
    const LoggingChannel = LoggingGuild.channels.fetch(Config.GuildLogChannelID);
    await LoggingChannel.send({ allowedMentions: { parse: [] }, embeds: [GuildJoinedEmbed], components: [ButtonActionRow] });

    return;
});








/******************************************************************************* */
// STATUSPAGE - INCIDENT UPDATE EVENT
DiscordStatusClient.on("incident_update", async (incident) => {
    // Bring in JSON to update it
    const FeedSubscriptionJson = require("./JsonFiles/Hidden/StatusSubscriptions.json");
    const FeedSubscriptionObject = Object.values(FeedSubscriptionJson);
    

    // Check if this is a new outage, or an update to an ongoing one
    const ExistingOutage = Collections.DiscordStatusUpdates.get(incident.id);
    if ( !ExistingOutage )
    {
        // New Outage, so new Message(s)
        const OutageEmbedNew = new EmbedBuilder()
        .setColor(incident.impact === "none" ? 'DEFAULT' : incident.impact === "minor" ? '#13b307' : incident.impact === "major" ? '#e8e409' : '#940707')
        .setTitle(incident.name)
        .setDescription(`Impact: ${incident.impact}`)
        .addFields(incident.incident_updates.reverse().map(incidentUpdate => { return { name: `${incidentUpdate.status.charAt(0).toUpperCase() + incidentUpdate.status.slice(1)} ( <t:${Math.floor(incidentUpdate.updated_at.getTime() / 1000)}:R> )`, value: (incidentUpdate.body || "No information available.") } }).slice(-24))
        .setTimestamp(incident.created_at);

        // Link Button to link to Outage Page
        const OutagePageLinkButton = new ActionRowBuilder().addComponents([
            new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Status Page").setURL(incident.shortlink)
        ]);

        // Send via Webhooks, while storing sent message IDs for editing later updates into
        const SentMessageCollection = new Collection();

        FeedSubscriptionObject.forEach(async (item) => {
            // Fetch Webhook
            await DiscordClient.fetchWebhook(item.DISCORD_FEED_WEBHOOK_ID)
            .then(async webhookItem => {
                // Send Message, Checking if thread_id is needed to be included in the payload or not
                if ( FeedSubscriptionJson[`${webhookItem.guildId}`]["DISCORD_FEED_THREAD_ID"] != null )
                {
                    await webhookItem.send({ allowedMentions: { parse: [] }, threadId: FeedSubscriptionJson[`${webhookItem.guildId}`]["DISCORD_FEED_THREAD_ID"], content: `**Discord Outage:**`, embeds: [OutageEmbedNew], components: [OutagePageLinkButton] })
                    .then(sentMessage => { SentMessageCollection.set(webhookItem.id, sentMessage.id); })
                    .catch(err => {
                        console.error(err);
                        return;
                    });
                }
                else
                {
                    await webhookItem.send({ allowedMentions: { parse: [] }, content: `**Discord Outage:**`, embeds: [OutageEmbedNew], components: [OutagePageLinkButton] })
                    .then(sentMessage => { SentMessageCollection.set(webhookItem.id, sentMessage.id); })
                    .catch(err => {
                        console.error(err);
                        return;
                    });
                }
            })
            .catch(err => {
                console.error(err);
                return;
            });
        });

        // Store
        Collections.DiscordStatusUpdates.set(incident.id, SentMessageCollection);
        return;
    }
    else
    {
        // Ongoing Outage, so edit Message(s)
        const OutageEmbedUpdate = new EmbedBuilder()
        .setColor(incident.impact === "none" ? 'DEFAULT' : incident.impact === "minor" ? '#13b307' : incident.impact === "major" ? '#e8e409' : '#940707')
        .setTitle(incident.name)
        .setDescription(`Impact: ${incident.impact}`)
        .addFields(incident.incident_updates.reverse().map(incidentUpdate => { return { name: `${incidentUpdate.status.charAt(0).toUpperCase() + incidentUpdate.status.slice(1)} ( <t:${Math.floor(incidentUpdate.updated_at.getTime() / 1000)}:R> )`, value: (incidentUpdate.body || "No information available.") } }).slice(-24))
        .setTimestamp(incident.created_at);

        // Link Button to link to Outage Page
        const OutagePageLinkButton = new ActionRowBuilder().addComponents([
            new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Status Page").setURL(incident.shortlink)
        ]);

        // Edit Messages by cycling through Webhooks
        FeedSubscriptionObject.forEach(async (item) => {
            // Fetch Webhooks
            await DiscordClient.fetchWebhook(item.DISCORD_FEED_WEBHOOK_ID)
            .then(async webhookItem => {
                // Edit the Message(s)
                await webhookItem.editMessage(ExistingOutage.get(webhookItem.id), { allowedMentions: { parse: [] }, embeds: [OutageEmbedUpdate], components: [OutagePageLinkButton] })
                .catch(err => {
                    console.error(err);
                    return;
                });
            })
            .catch(err => {
                console.error(err);
                return;
            });
        });
        return;
    }
});








/******************************************************************************* */

DiscordClient.login(Config.TOKEN); // Login to and start the Discord Bot Client
DiscordStatusClient.start(); // Start listening for Discord Status Page Updates
