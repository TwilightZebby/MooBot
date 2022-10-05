const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, PermissionFlagsBits, ApplicationCommandOptionType, ChannelType, TextChannel, ThreadChannel, ForumChannel } = require("discord.js");
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

    // Ensure that, if a Thread is selected, only Threads within Forum Channels can be picked, not Threads in Text|Announcement Channels
    if ( InputChannel instanceof ThreadChannel && !(InputChannel.parent instanceof ForumChannel) )
    {
        return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale]["DSTATUS_COMMAND_INVALID_THREAD_CHANNEL"] });
    }

    // Check Bot has permissions to create Webhooks in that Channel
    const BotChannelPermissions = InputChannel.permissionsFor(DiscordClient.user.id);
    if ( !BotChannelPermissions.has(PermissionFlagsBits.ViewChannel) || !BotChannelPermissions.has(PermissionFlagsBits.ManageWebhooks) )
    {
        return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale]["DSTATUS_COMMAND_MISSING_WEBHOOKS_PERMISSION"] });
    }

    // Check Server isn't already subscribed to feed
    const DiscordOutageFeedJson = require("../../JsonFiles/Hidden/StatusSubscriptions.json");
    if ( !DiscordOutageFeedJson[`${slashCommand.guildId}`] || !DiscordOutageFeedJson[`${slashCommand.guildId}`]["DISCORD_FEED_WEBHOOK_ID"] )
    {
        // Subscribe Server to Feed, by creating a Webhook in that Channel
        let feedWebhook;
        let threadId = null;
        if ( InputChannel instanceof TextChannel ) { feedWebhook = await InputChannel.createWebhook({ name: "Dis-Outage Feed", avatar: "https://i.imgur.com/gXWXIpr.png", reason: `${slashCommand.user.username}#${slashCommand.user.discriminator} subscribed to the Discord Outage Feed` }); }
        else 
        { 
            feedWebhook = await InputChannel.parent.createWebhook({ name: "Dis-Outage Feed", avatar: "https://i.imgur.com/gXWXIpr.png", reason: `${slashCommand.user.username}#${slashCommand.user.discriminator} subscribed to the Discord Outage Feed` });
            threadId = InputChannel.id;
        }

        DiscordOutageFeedJson[`${slashCommand.guildId}`] = { "DISCORD_FEED_WEBHOOK_ID": feedWebhook.id, "DISCORD_FEED_THREAD_ID": threadId };

        fs.writeFile('./JsonFiles/Hidden/StatusSubscriptions.json', JSON.stringify(DiscordOutageFeedJson, null, 4), async (err) => {
            if ( err ) { return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale]["DSTATUS_COMMAND_FAILED_TO_SUBSCRIBE"] }); }
        });

        // ACK to User
        await slashCommand.reply({ ephemeral: true, content: LocalizedStrings[slashCommand.locale]["DSTATUS_COMMAND_SUBSCRIPTION_SUCCESSFUL"].replace("{{CHANNEL}}", `<#${InputChannel.id}>`) });
        return;
    }
    else
    {
        return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale]["DSTATUS_COMMAND_ALREADY_SUBSCRIBED"].replace("{{COMMAND}}", `</dstatus unsubscribe:${slashCommand.commandId}>`) });
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
    if ( !DiscordOutageFeedJson[`${slashCommand.guildId}`] || !DiscordOutageFeedJson[`${slashCommand.guildId}`]["DISCORD_FEED_WEBHOOK_ID"] )
    {
        return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale]["DSTATUS_COMMAND_ALREADY_UNSUBSCRIBED"] });
    }

    // Unsubscribe!
    // First, remove Webhook, if possible
    const FeedWebhook = await DiscordClient.fetchWebhook(DiscordOutageFeedJson[`${slashCommand.guildId}`]["DISCORD_FEED_WEBHOOK_ID"]);
    let webhookDeletionErrorMessage = null;
    try {
        await FeedWebhook.delete(`${slashCommand.user.username}#${slashCommand.user.discriminator} unsubscribed from the Discord Outage Feed`);
    } 
    catch (err) {
        //console.error(err);
        webhookDeletionErrorMessage = LocalizedErrors[slashCommand.locale]["DSTATUS_COMMAND_FAILED_WEBHOOK_DELETION"];
    }    

    delete DiscordOutageFeedJson[`${slashCommand.guildId}`];

    fs.writeFile('./JsonFiles/Hidden/StatusSubscriptions.json', JSON.stringify(DiscordOutageFeedJson, null, 4), async (err) => {
        if ( err ) { return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale]["DSTATUS_COMMAND_FAILED_TO_UNSUBSCRIBE"] }); }
    });

    // ACK to User
    await slashCommand.reply({ ephemeral: true, content: `${LocalizedStrings[slashCommand.locale]["DSTATUS_COMMAND_UNSUBSCRIPTION_SUCCESSFUL"]}${webhookDeletionErrorMessage != null ? `\n\n${webhookDeletionErrorMessage}` : ""}` });
    delete FeedWebhook;
    return;
}
