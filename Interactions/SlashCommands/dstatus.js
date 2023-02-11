const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, PermissionFlagsBits, ApplicationCommandOptionType, ChannelType, TextChannel, ThreadChannel, ForumChannel } = require("discord.js");
const fs = require('fs');
const { DiscordClient } = require("../../constants.js");

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
        // Just in case
        if ( slashCommand.channel instanceof DMChannel || slashCommand.channel instanceof PartialGroupDMChannel )
        {
            await slashCommand.reply({ ephemeral: true, content: `Sorry, but this Slash Command can__not__ be used within DMs or Group DMs.` });
            return;
        }

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
        return await slashCommand.reply({ ephemeral: true, content: "Sorry, but a Thread cannot be selected if its within a Text or Announcement Channel.\nIf you want to subscribe a Thread to the Discord Outage Feed, please pick a Thread that is within a Forum Channel.\nOtherwise, you can select a standard Text Channel instead." });
    }

    // Check Bot has permissions to create Webhooks in that Channel
    const BotChannelPermissions = InputChannel.permissionsFor(DiscordClient.user.id);
    if ( !BotChannelPermissions.has(PermissionFlagsBits.ViewChannel) || !BotChannelPermissions.has(PermissionFlagsBits.ManageWebhooks) )
    {
        return await slashCommand.reply({ ephemeral: true, content: "Sorry, but my Discord Outage Feed cannot be subscribed to Channels (or Forum Posts) in which I do not have both the \"View Channel\" and \"Manage Webhooks\" Permissions!" });
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
            if ( err ) { return await slashCommand.reply({ ephemeral: true, content: "Sorry, something went wrong while trying to subscribe to the Discord Outage Feed..." }); }
        });

        // ACK to User
        await slashCommand.reply({ ephemeral: true, content: `Successfully subscribed this Server to the Discord Outage Feed!\nAny Discord Outages will be notified about in the <#${InputChannel.id}> Channel.` });
        return;
    }
    else
    {
        return await slashCommand.reply({ ephemeral: true, content: `This Server is already subscribed to the Discord Outage Feed!\nIf you want to remove the existing Feed in this Server, please use the </dstatus unsubscribe:${slashCommand.commandId}> Command.` });
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
        return await slashCommand.reply({ ephemeral: true, content: "You cannot unsubscribe this Server from the Discord Outage Feed when it is *not currently* subscribed!" });
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
        webhookDeletionErrorMessage = "⚠ An error occurred while I was trying to delete the Webhook for this Feed. You will have to delete the Webhook manually in Server Settings > Integrations!";
    }    

    delete DiscordOutageFeedJson[`${slashCommand.guildId}`];

    fs.writeFile('./JsonFiles/Hidden/StatusSubscriptions.json', JSON.stringify(DiscordOutageFeedJson, null, 4), async (err) => {
        if ( err ) { return await slashCommand.reply({ ephemeral: true, content: "Sorry, something went wrong while trying to unsubscribe from the Discord Outage Feed..." }); }
    });

    // ACK to User
    await slashCommand.reply({ ephemeral: true, content: `Successfully unsubscribed from the Discord Outage Feed.\nThis Server will no longer receive notifications from this Bot about Discord's Outages.${webhookDeletionErrorMessage != null ? `\n\n${webhookDeletionErrorMessage}` : ""}` });
    delete FeedWebhook;
    return;
}
