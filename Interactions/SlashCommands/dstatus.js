const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, PermissionFlagsBits, ApplicationCommandOptionType, ChannelType, TextChannel, ThreadChannel } = require("discord.js");
const fs = require('fs');
const { DiscordClient } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");
const LocalizedStrings = require("../../JsonFiles/stringMessages.json");

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "dstatus",

    // Command's Description
    Description: `Enable/Disable receiving Discord Outage updates in your Server`,

    // Command's Category
    Category: "GENERAL",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 30,

    // Cooldowns for specific subcommands and/or subcommand-groups
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandCooldown: {
        "subscribe": 30,
        "unsubscribe": 30
    },

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "GUILD",

    // Scope of specific Subcommands Usage
    //     One of the following: DM, GUILD, ALL
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandScope: {
        "subscribe": "GUILD",
        "unsubscribe": "GUILD"
    },



    /**
     * Returns data needed for registering Slash Command onto Discord's API
     * @returns {ChatInputApplicationCommandData}
     */
    registerData()
    {
        /** @type {ChatInputApplicationCommandData} */
        const Data = {};

        Data.name = this.Name;
        Data.description = this.Description;
        Data.type = ApplicationCommandType.ChatInput;
        Data.dmPermission = false;
        Data.defaultMemberPermissions = PermissionFlagsBits.ManageGuild;
        Data.options = [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "subscribe",
                description: "Subscribe (enable) to receiving Discord Outage updates",
                options: [
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "channel",
                        description: "Channel to receive Discord Outage updates in",
                        channel_types: [ ChannelType.GuildText, ChannelType.PublicThread ], // Public Threads only allowed because Forum Channels
                        required: true
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "unsubscribe",
                description: "Unsubscribe (disable) receiving Discord Outage updates"
            }
        ]

        return Data;
    },



    /**
     * Executes the Slash Command
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async execute(slashCommand)
    {
        // Grab Subscommand and act on it
        const SubcommandName = slashCommand.options.getSubcommand(true);

        switch (SubcommandName)
        {
            case "subscribe":
                await subscribeToFeed(slashCommand);
                break;

            case "unsubscribe":
                await unsubscribeFromFeed(slashCommand);
                break;
        }

        return;
    },



    /**
     * Handles given Autocomplete Interactions for any Options in this Slash CMD that uses it
     * @param {AutocompleteInteraction} autocompleteInteraction 
     */
    async autocomplete(autocompleteInteraction)
    {
        //.
    }
}




/**
 * Subscribe the selected Channel to the Discord Outage Feed
 * @param {ChatInputCommandInteraction} slashCommand 
 */
async function subscribeToFeed(slashCommand)
{
    // Grab Input Channel
    /** @type {TextChannel|ThreadChannel} */
    const InputChannel = slashCommand.options.getChannel("channel", true);

    // Check Bot has permissions to send Messages in that Channel
    const BotChannelPermissions = InputChannel.permissionsFor(DiscordClient.user.id);
    if ( !BotChannelPermissions.has(PermissionFlagsBits.ViewChannel) || (!BotChannelPermissions.has(PermissionFlagsBits.SendMessages) || !BotChannelPermissions.has(PermissionFlagsBits.SendMessagesInThreads)) )
    {
        return await slashCommand.reply({ ephemeral: true, content: `Sorry, but my Discord Outage Feed cannot be subscribed to Channels (or Forum Posts/Threads) in which I do not have both the "View Channel" and "Send Messages" (or "Send Messages in Threads/Posts" if a Forum Post/Thread) Permissions!` });
    }

    // Check Server isn't already subscribed to feed
    const DiscordOutageFeedJson = require("../../JsonFiles/Hidden/StatusSubscriptions.json");
    if ( !DiscordOutageFeedJson[`${slashCommand.guildId}`] || !DiscordOutageFeedJson[`${slashCommand.guildId}`]["DISCORD_FEED_CHANNEL_ID"] )
    {
        // Subscribe Server to Feed, using given Channel ID
        DiscordOutageFeedJson[`${slashCommand.guildId}`] = { "DISCORD_FEED_CHANNEL_ID": InputChannel.id };

        fs.writeFile('./JsonFiles/Hidden/StatusSubscriptions.json', JSON.stringify(DiscordOutageFeedJson, null, 4), async (err) => {
            if ( err ) { return await slashCommand.reply({ ephemeral: true, content: `Sorry, something went wrong while trying to subscribe to the Discord Outage Feed... Please try again later.` }); }
        });

        // ACK to User
        await slashCommand.reply({ ephemeral: true, content: `Successfully subscribed this Server to the Discord Outage Feed!
Any Discord Outages will be notified about in the <#${InputChannel.id}> Channel.` });
        return;
    }
    else
    {
        return await slashCommand.reply({ ephemeral: true, content: `This Server is already subscribed to the Discord Outage Feed! (Currently posting to <#${DiscordOutageFeedJson[`${slashCommand.guildId}`]["DISCORD_FEED_CHANNEL_ID"]}> )
If you want to remove the existing Feed in this Server, please use the </dstatus unsubscribe:${slashCommand.commandId}> Command.` });
    }
}




/**
 * Unsubscribe the selected Channel from the Discord Outage Feed
 * @param {ChatInputCommandInteraction} slashCommand 
 */
async function unsubscribeFromFeed(slashCommand)
{
    // Check if Server actually *is* subscribed to the Feed right now
    const DiscordOutageFeedJson = require("../../JsonFiles/Hidden/StatusSubscriptions.json");
    if ( !DiscordOutageFeedJson[`${slashCommand.guildId}`] || !DiscordOutageFeedJson[`${slashCommand.guildId}`]["DISCORD_FEED_CHANNEL_ID"] )
    {
        return await slashCommand.reply({ ephemeral: true, content: `You cannot unsubscribe this Server from the Discord Outage Feed when it is *not currently* subscribed!` });
    }

    // Unsubscribe!
    delete DiscordOutageFeedJson[`${slashCommand.guildId}`].DISCORD_FEED_CHANNEL_ID;

    fs.writeFile('./JsonFiles/Hidden/StatusSubscriptions.json', JSON.stringify(DiscordOutageFeedJson, null, 4), async (err) => {
        if ( err ) { return await slashCommand.reply({ ephemeral: true, content: `Sorry, something went wrong while trying to unsubscribe from the Discord Outage Feed... Please try again later.` }); }
    });

    // ACK to User
    await slashCommand.reply({ ephemeral: true, content: `Successfully unsubscribed from the Discord Outage Feed.
This Server will no longer receive notifications from this Bot about Discord's Outages.` });
    return;
}
