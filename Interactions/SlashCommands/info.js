const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, ApplicationCommandOptionType, AutocompleteInteraction, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, TextChannel, VoiceChannel, StageChannel, NewsChannel, CategoryChannel, GuildVerificationLevel, GuildExplicitContentFilter, GuildDefaultMessageNotifications, GuildMFALevel, GuildNSFWLevel, GuildPremiumTier, Routes } = require("discord.js");
const { DiscordClient } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");
const LocalizedStrings = require("../../JsonFiles/stringMessages.json");
const Package = require('../../package.json');
const fetch = require('node-fetch');

if (!globalThis.fetch) { globalThis.fetch = fetch; }



// EMOJIS
const EMOJI_OWNER_CROWN = "<:ServerOwner:997752070436298804>";
const EMOJI_PARTNER = "<:Partnered:997752065789014067>";
const EMOJI_VERIFIED = "<:Verified:997752050920202270>";
const EMOJI_TIER_ONE = "<:BoostTier1:997752054305013800>";
const EMOJI_TIER_TWO = "<:BoostTier2:997752055395524698>";
const EMOJI_TIER_THREE = "<:BoostTier3:997752056788029460>";
const EMOJI_BOOST = "<:Boost:997752053155766343>";
const EMOJI_CHANNEL_TEXT = "<:ChannelText:997752062500671590>";
const EMOJI_CHANNEL_VOICE = "<:ChannelVoice:997752063612162138>";
const EMOJI_CHANNEL_STAGE = "<:ChannelStage:997752061330464818>";
const EMOJI_CHANNEL_NEWS = "<:ChannelAnnouncements:997752058092466236>";
const EMOJI_CHANNEL_CATEGORY = "<:ChannelCategory:997752059807928431>";
const EMOJI_ROLE = "<:Role:997752069605822507>";
const EMOJI_EMOJI = "<:Emoji:997752064778174515>";
const EMOJI_STICKER = "<:Sticker:997752072848019527>";
const EMOJI_TIMEOUT = "<:timeout:997752074366369814>";



// For making things readable to the User, improving UX
/**
 * Readable Guild Verification Level
 * @param {GuildVerificationLevel} guildVerificationLevel 
 * @returns {String}
 */
function readableVerificationLevel(guildVerificationLevel) {
    let readableString = "";
    switch (guildVerificationLevel)
    {
        case GuildVerificationLevel.None:
            readableString = "Unrestricted";
            break;

        case GuildVerificationLevel.Low:
            readableString = "Low (Verified Email)";
            break;

        case GuildVerificationLevel.Medium:
            readableString = "Medium (Account Age >5 minutes)";
            break;

        case GuildVerificationLevel.High:
            readableString = "High (Member for >10 minutes)";
            break;

        case GuildVerificationLevel.VeryHigh:
            readableString = "Highest (Verified Phone Number)";
            break;
    }
    return readableString;
}

/**
 * Readable Guild Explicit Content Filter
 * @param {GuildExplicitContentFilter} guildExplicitContentLevel 
 * @returns {String}
 */
function readableExplicitFilter(guildExplicitContentLevel)
{
    let readableString = "";
    switch (guildExplicitContentLevel)
    {
        case GuildExplicitContentFilter.Disabled:
            readableString = "Disabled";
            break;

        case GuildExplicitContentFilter.MembersWithoutRoles:
            readableString = "Only scan roleless Members' content";
            break;

        case GuildExplicitContentFilter.AllMembers:
            readableString = "Scan content from everyone";
            break;
    }
    return readableString;
}

/**
 * Readable Default Message Notification
 * @param {GuildDefaultMessageNotifications} defaultMessageNotification 
 * @returns {String}
 */
function readableDefaultNotification(defaultMessageNotification)
{
    let readableString = "";
    switch(defaultMessageNotification)
    {
        case GuildDefaultMessageNotifications.AllMessages:
            readableString = "All Messages";
            break;

        case GuildDefaultMessageNotifications.OnlyMentions:
            readableString = "Only @mentions";
            break;
    }
    return readableString;
}

/**
 * Readable MFA Level
 * @param {GuildMFALevel} mfaLevel 
 * @returns {String}
 */
function readableMFALevel(mfaLevel)
{
    let readableString = "";
    switch(mfaLevel)
    {
        case GuildMFALevel.None:
            readableString = "None";
            break;

        case GuildMFALevel.Elevated:
            readableString = "Enabled";
            break;
    }
    return readableString;
}

/**
 * Readable NSFW Level
 * @param {GuildNSFWLevel} nsfwLevel 
 * @returns {String}
 */
function readableNSFWLevel(nsfwLevel)
{
    let readableString = "";
    switch(nsfwLevel)
    {
        case GuildNSFWLevel.Default:
            readableString = "Default";
            break;

        case GuildNSFWLevel.Safe:
            readableString = "Safe";
            break;

        case GuildNSFWLevel.AgeRestricted:
            readableString = "Age Restricted";
            break;

        case GuildNSFWLevel.Explicit:
            readableString = "Explicit";
            break;
    }
    return readableString;
}

// This stays as a map because it's using the raw values returned from the API
const festuresString = {
    "ANIMATED_BANNER": "Animated Banner",
    "ANIMATED_ICON": "Animated Icon",
    "AUTO_MODERATION": "Auto Moderation",
    "BANNER": "Banner",
    "BOOSTING_TIERS_EXPERIMENT_MEDIUM_GUILD": "Boosting Tiers Experiment Medium Server",
    "BOOSTING_TIERS_EXPERIMENT_SMALL_GUILD": "Boosting Tiers Experiment Small Server",
    "COMMERCE": "Commerce",
    "CREATOR_MONETIZABLE": "Creator Monetizable",
    "CREATOR_MONETIZABLE_DISABLED": "Creator Monetizable Disabled",
    "COMMUNITY": "Community",
    "DISCOVERABLE_DISABLED": "Discoverable Disabled",
    "DISCOVERABLE": "Discoverable",
    "ENABLED_DISCOVERABLE_BEFORE": "Enabled Discoverable Before",
    "EXPOSED_TO_ACTIVITIES_WTP_EXPERIMENT": "Exposed To Activity Experiment",
    "HAD_EARLY_ACTIVITIES_ACCESS": "Had Early Acivities Access",
    "HAS_DIRECTORY_ENTRY": "Has Directory Entry",
    "HUB": "Hub",
    "INTERNAL_EMPLOYEE_ONLY": "**Internal Employee Only**",
    "INVITE_SPLASH": "Invite Splash",
    "MEMBER_PROFILES": "Member Profiles",
    "MEMBER_VERIFICATION_GATE_ENABLED": "Member Verification Gate Enabled",
    "MORE_EMOJI": "More Emoji",
    "MORE_STICKERS": "More Stickers",
    "NEWS": "News",
    "NEW_THREAD_PERMISSIONS": "New Thread Permissions",
    "PARTNERED": "**Partnered**",
    "PREMIUM_TIER_3_OVERRIDE": "**Premium Tier 3 Override**",
    "PREVIEW_ENABLED": "Preview Enabled",
    "PRIVATE_THREADS": "Private Threads",
    "RELAY_ENABLED": "Relay Enabled",
    "ROLE_ICONS": "Role Icons",
    "ROLE_SUBSCRIPTIONS_ENABLED": "Role Subscriptions Enabled",
    "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE": "Role Subscriptions Available For Purchase",
    "TEXT_IN_VOICE_ENABLED": "Text in Voice Enabled",
    "THREADS_ENABLED_TESTING": "Threads Enabled Testing",
    "THREADS_ENABLED": "Threads Enabled",
    "THREAD_DEFAULT_AUTO_ARCHIVE_DURATION": "Threads Default Auto Archive Duration",
    "TICKETED_EVENTS_ENABLED": "Ticketed Events Enabled",
    "VANITY_URL": "Vanity URL",
    "VERIFIED": "**Verified**",
    "WELCOME_SCREEN_ENABLED": "Welcome Screen Enabled",
    "BOT_DEVELOPER_EARLY_ACCESS": "Bot Developer Early Access",
    "GUILD_HOME_TEST": "Server Home Test",
    "INVITES_DISABLED": "**Invites Disabled**",
    // From here onwards are deprecated Server Features
    "MEMBER_LIST_DISABLED": "~~Member List Disabled~~", // Not used at all, not since Fortnut's 2019 Blackout Event
    "VIP_REGIONS": "~~VIP Regions~~", // Replaced with 384kbps max bitrate
    "CHANNEL_BANNER": "~~Channel Banner~~", // Experiment that was never shipped
    "EXPOSED_TO_BOOSTING_TIERS_EXPERIMENT": "~~Exposed to Boosting Tiers Experiment~~", // Unknown
    "PUBLIC_DISABLED": "~~Public Disabled~~", // Removed in favor of COMMUNITY
    "PUBLIC": "~~Public~~", // Removed in favor of COMMUNITY
    "FEATURABLE": "~~Featureable~~", // Used to control which Servers were displayed in the Featured section on Server Discovery
    "FORCE_RELAY": "~~Force Relay~~", // Technical back-end stuff that may be unused now
    "LURKABLE": "~~Lurkable~~", // Unknown
    "MONETIZATION_ENABLED": "~~Monetization Enabled~~", // Allowed the Server to cash out Ticketed Stage payouts
    "THREE_DAY_THREAD_ARCHIVE": "~~Three Day Thread Archive~~", // Used for unlocking the 3-day Auto Archive option for Threads at T1 Boost. Made free as of 25th April 2022
    "SEVEN_DAY_THREAD_ARCHIVE": "~~Seven Day Thread Archive~~" // Used for unlocking the 7-day Auto Archive option for Threads at T2 Boost. Made free as of 25th April 2022
};

/**
 * Readable Boosting Tiers
 * @param {GuildPremiumTier} premiumTier 
 * @returns {String}
 */
function readableGuildPremiumTier(premiumTier)
{
    let readableString = "";
    switch(premiumTier)
    {
        case GuildPremiumTier.None:
            readableString = "None";
            break;

        case GuildPremiumTier.Tier1:
            readableString = "Tier 1";
            break;

        case GuildPremiumTier.Tier2:
            readableString = "Tier 2";
            break;

        case GuildPremiumTier.Tier3:
            readableString = "Tier 3";
            break;
    }
    return readableString;
}

/**
 * Readable Boosting Tiers, returns Emoji Strings
 * @param {GuildPremiumTier} premiumTier 
 * @returns {String}
 */
function readableGuildPremiumTierEmoji(premiumTier)
{
    let readableString = "";
    switch(premiumTier)
    {
        case GuildPremiumTier.None:
            readableString = "";
            break;

        case GuildPremiumTier.Tier1:
            readableString = EMOJI_TIER_ONE;
            break;

        case GuildPremiumTier.Tier2:
            readableString = EMOJI_TIER_TWO;
            break;

        case GuildPremiumTier.Tier3:
            readableString = EMOJI_TIER_THREE;
            break;
    }
    return readableString;
}


const UserFlagsToStrings = {
    "DISCORD_EMPLOYEE": "Discord Employee",
    "PARTNERED_SERVER_OWNER": "Partnered Server Owner",
    "HYPESQUAD_EVENTS": "HypeSquad Events",
    "BUGHUNTER_LEVEL_1": "Bug Hunter Tier 1",
    "BUGHUNTER_LEVEL_2": "Bug Hunter Tier 2",
    "HOUSE_BRAVERY": "HypeSquad Bravery House",
    "HOUSE_BRILLIANCE": "HypeSquad Brilliance House",
    "HOUSE_BALANCE": "HypeSquad Balance House",
    "EARLY_SUPPORTER": "Early Nitro Supporter",
    "VERIFIED_BOT": "Verified Bot",
    "EARLY_VERIFIED_BOT_DEVELOPER": "Early Verified Bot Developer",
    "DISCORD_CERTIFIED_MODERATOR": "Discord Certified Moderator",
    "BOT_HTTP_INTERACTIONS": "HTTP Interactions-only Bot",
    "QUARANTINED": "**Quarantined**",
    "SPAMMER": "**Spammer**"
};

const ChannelTypesToStrings = {
    "GUILD_TEXT": "Text",
    "DM": "DM",
    "GUILD_VOICE": "Voice",
    "GROUP_DM": "Group DM",
    "GUILD_CATEGORY": "Category",
    "GUILD_NEWS": "Announcement",
    "GUILD_NEWS_THREAD": "Thread (in Announcement Channel)",
    "GUILD_PUBLIC_THREAD": "Thread (Public)",
    "GUILD_PRIVATE_THREAD": "Thread (Private)",
    "GUILD_STAGE_VOICE": "Stage",
    "GUILD_DIRECTORY": "Directory",
    "GUILD_STORE": "~~Store~~",
    "UNKNOWN": "*Unknown Channel Type*"
}



/**
 * Checks if the Bot has the ability to use External Emojis in Interaction Responses
 * @param {ChatInputCommandInteraction} slashCommand 
 * @returns {Boolean}
 */
function checkEmojiPermission(slashCommand)
{
    return slashCommand.appPermissions.has(PermissionFlagsBits.UseExternalEmojis);
}

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "info",

    // Command's Description
    Description: `Shows information about the Server, this Bot, a Discord Invite, or a User`,

    // Command's Category
    Category: "INFORMATION",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 60,

    // Cooldowns for specific subcommands and/or subcommand-groups
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandCooldown: {
        "server": 60,
        "invite": 60,
        "user": 60,
        "bot": 10
    },

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "ALL",

    // Scope of specific Subcommands Usage
    //     One of the following: DM, GUILD, ALL
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandScope: {
        "server": "GUILD",
        "invite": "ALL",
        "user": "GUILD",
        "bot": "ALL"
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
        Data.options = [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "server",
                description: "Display information about this Server"
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "user",
                description: "Display information about either yourself, or another User",
                options: [
                    {
                        type: ApplicationCommandOptionType.User,
                        name: "user",
                        description: "User to display information about",
                        required: false
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "invite",
                description: "Display information about a given Discord Server Invite",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "code",
                        description: "The Discord Invite Code or Link",
                        max_length: 150,
                        required: true
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "bot",
                description: "Display information about this Bot"
            }
        ];

        return Data;
    },



    /**
     * Executes the Slash Command
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async execute(slashCommand)
    {
        // Grab Subcommand used
        const SubcommandName = slashCommand.options.getSubcommand(true);

        // Fetch information based on Subcommand used
        switch(SubcommandName)
        {
            case "server":
                await this.fetchServerInfo(slashCommand);
                break;

            case "user":
                await this.fetchUserInfo(slashCommand);
                break;

            case "invite":
                await this.fetchInviteInfo(slashCommand);
                break;

            case "bot":
                await this.fetchBotInfo(slashCommand);
                break;

            default:
                await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale].SLASH_COMMAND_GENERIC_FAILED });
                break;
        }

        return;
    },



    /**
     * Fetches and Displays the current Server Information
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async fetchServerInfo(slashCommand)
    {
        // Defer
        await slashCommand.deferReply({ ephemeral: true });
        
        // Fetch Guild
        const CurrentGuild = await slashCommand.guild.fetch();

        // If outage happening, return early
        if ( !CurrentGuild.available ) { return await slashCommand.editReply({ content: LocalizedErrors[slashCommand.locale].INFO_SERVER_COMMAND_GUILD_UNAVAILABLE }); }

        // Check for External Emoji Permission
        const ExternalEmojiPermission = checkEmojiPermission(slashCommand);

        // Guild Information
        const GuildId = CurrentGuild.id;
        const GuildName = CurrentGuild.name;
        const GuildDescription = ( CurrentGuild.description || " " );
        const GuildCreatedTime = CurrentGuild.createdAt.getTime();
        const GuildOwner = await CurrentGuild.fetchOwner();
        const GuildPartnered = CurrentGuild.partnered;
        const GuildVerified = CurrentGuild.verified;
        const GuildBoostTier = CurrentGuild.premiumTier;
        const GuildBoostCount = CurrentGuild.premiumSubscriptionCount;
        const GuildVanityCode = ( CurrentGuild.vanityURLCode || null );

        // Member Counts
        const GuildApproxTotalMembers = ( CurrentGuild.approximateMemberCount || null );
        const GuildApproxOnlineMembers = ( CurrentGuild.approximatePresenceCount || null );

        // Security & Moderation
        const GuildVerificationLevel = CurrentGuild.verificationLevel;
        const GuildContentFilter = CurrentGuild.explicitContentFilter;
        const GuildDefaultNotifications = CurrentGuild.defaultMessageNotifications;
        const GuildMFALevel = CurrentGuild.mfaLevel;
        const GuildNSFWLevel = CurrentGuild.nsfwLevel;

        // Server Features
        let rawData = await DiscordClient.rest.get(Routes.guild(GuildId));
        const RawFeatures = rawData["features"];
        let guildFeatures = [];
        RawFeatures.forEach(feature => guildFeatures.push(festuresString[feature]));

        // Channel Information
        const GuildChannels = await CurrentGuild.channels.fetch();
        const TotalChannelCount = GuildChannels.size;
        let textChannelCount = 0;
        let voiceChannelCount = 0;
        let stageChannelCount = 0;
        let announcementChannelCount = 0;
        let categoryChannelCount = 0;
        let unknownChannelCount = 0;
        GuildChannels.forEach(channel => {
            if ( channel instanceof TextChannel ) { textChannelCount += 1; }
            else if ( channel instanceof VoiceChannel ) { voiceChannelCount += 1; }
            else if ( channel instanceof StageChannel ) { stageChannelCount += 1; }
            else if ( channel instanceof NewsChannel ) { announcementChannelCount += 1; }
            else if ( channel instanceof CategoryChannel ) { categoryChannelCount += 1; }
            else { unknownChannelCount += 1; }
        });
        // Special Channels
        const AfkChannelId = ( CurrentGuild.afkChannelId || null );
        const RulesChannelId = ( CurrentGuild.rulesChannelId || null );
        const SystemChannelId = ( CurrentGuild.systemChannelId || null );

        // Role Information
        const GuildRoles = await CurrentGuild.roles.fetch();
        const TotalRoleCount = GuildRoles.size;

        // Emojis & Sticker Information
        const GuildEmojis = await CurrentGuild.emojis.fetch();
        const GuildStickers = await CurrentGuild.stickers.fetch();
        const TotalEmojiCount = GuildEmojis.size;
        const TotalStickerCount = GuildStickers.size;

        // Scheduled Events
        const GuildScheduledEvents = await CurrentGuild.scheduledEvents.fetch();
        const TotalScheduledEvents = GuildScheduledEvents.size;

        // Assets
        const HasBanner = CurrentGuild.banner === null ? false : true;
        const HasIcon = CurrentGuild.icon === null ? false : true;
        const HasDiscoverySplash = CurrentGuild.discoverySplash === null ? false : true;
        const HasInviteSplash = CurrentGuild.splash === null ? false : true;

        // Construct Embed
        const ServerInfoEmbed = new EmbedBuilder().setAuthor({ name: GuildName }).setFooter({ text: "Created" }).setTimestamp(CurrentGuild.createdAt);

        // IF EXTERNAL EMOJI PERMISSION IS GRANTED TO BOT
        if ( ExternalEmojiPermission )
        {
            ServerInfoEmbed.setDescription(`${GuildPartnered ? `${EMOJI_PARTNER}` : ""} ${GuildVerified ? `${EMOJI_VERIFIED}` : ""}\n${GuildDescription}`)
            .addFields(
                {
                    name: `>> General`,
                    value: `**Owner:** ${GuildOwner.user.username}#${GuildOwner.user.discriminator}
**Boost Level:** ${readableGuildPremiumTierEmoji(GuildBoostTier)} ${readableGuildPremiumTier(GuildBoostTier)}
**Boost Count:** ${EMOJI_BOOST} ${GuildBoostCount}
**Emojis:** ${EMOJI_EMOJI} ${TotalEmojiCount}
**Stickers:** ${EMOJI_STICKER} ${TotalStickerCount}
**Roles:** ${EMOJI_ROLE} ${TotalRoleCount} / 250${GuildVanityCode != null ? `\n**Vanity URL:** https://discord.gg/${GuildVanityCode}` : ""}${GuildApproxTotalMembers != null ? `\n**Approx. Total Members:** ${GuildApproxTotalMembers}` : ""}${GuildApproxOnlineMembers != null ? `\n**Approx. Online Members:** ${GuildApproxOnlineMembers}` : ""}`,
                    inline: true
                },
                {
                    name: `>> Channels (${TotalChannelCount} / 500)`,
                    value: `${EMOJI_CHANNEL_TEXT} **Text:** ${textChannelCount}
${EMOJI_CHANNEL_NEWS} **Announcement:** ${announcementChannelCount}
${EMOJI_CHANNEL_VOICE} **Voice:** ${voiceChannelCount}
${EMOJI_CHANNEL_STAGE} **Stage:** ${stageChannelCount}
${EMOJI_CHANNEL_CATEGORY} **Category:** ${categoryChannelCount}${unknownChannelCount > 0 ? `\n**Unknown Type(s):** ${unknownChannelCount}` : ""}`,
                    inline: true
                },
                {
                    name: `>> Security & Moderation`,
                    value: `**Verification Level:** ${readableVerificationLevel(GuildVerificationLevel)}
**Explicit Content Filter:** ${readableExplicitFilter(GuildContentFilter)}
**2FA-enabled Moderation:** ${readableMFALevel(GuildMFALevel)}
**NSFW Level:** ${readableNSFWLevel(GuildNSFWLevel)}
**Default Notifications:** ${readableDefaultNotification(GuildDefaultNotifications)}`
                }
            );
            if ( guildFeatures.length > 0 ) { ServerInfoEmbed.addFields({name: `>> Feature Flags`, value: `${guildFeatures.sort().join(', ').slice(0, 1023)}`}); }
        }

        // Add Asset Buttons
        const ServerInfoActionRow = new ActionRowBuilder();
        if ( HasIcon )
        {
            ServerInfoEmbed.setAuthor({ name: GuildName, iconURL: CurrentGuild.iconURL({ extension: 'png' }) });
            ServerInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Icon").setURL(CurrentGuild.iconURL()));
        }
        if ( HasBanner ) { ServerInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Banner").setURL(CurrentGuild.bannerURL())); }
        if ( HasInviteSplash ) { ServerInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Invite Splash").setURL(CurrentGuild.splashURL())); }
        if ( HasDiscoverySplash ) { ServerInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Discovery Splash").setURL(CurrentGuild.discoverySplashURL())); }

        if ( ServerInfoActionRow.components.length > 0 ) { return await slashCommand.editReply({ embeds: [ServerInfoEmbed], components: [ServerInfoActionRow] }); }
        else { return await slashCommand.editReply({ embeds: [ServerInfoEmbed] }); }
    },



    /**
     * Fetches and Displays information about the triggering or targeted User
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async fetchUserInfo(slashCommand)
    {
        //.
    },



    /**
     * Fetches and Displays information about the given Discord Invite
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async fetchInviteInfo(slashCommand)
    {
        //.
    },



    /**
     * Fetches and Displays information about this Bot
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async fetchBotInfo(slashCommand)
    {
        // Defer
        await slashCommand.deferReply({ ephemeral: true });

        // Create Link Buttons
        const PrivacyButton = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Privacy Policy").setURL("https://github.com/TwilightZebby/MooBot/blob/main/PRIVACY_POLICY.md");
        const BotInfoActionRow = new ActionRowBuilder().addComponents(PrivacyButton);

        // Fetch App Commands
        const RegisteredGlobalCommands = await DiscordClient.application.commands.fetch();
        const RegisteredGuildCommands = await slashCommand.guild.commands.fetch();
        const TotalRegisteredCommands = RegisteredGlobalCommands.size + RegisteredGuildCommands.size;

        // Construct Embed
        const BotInfoEmbed = new EmbedBuilder()
        .setAuthor({ name: `${DiscordClient.user.username} Information`, iconURL: `${DiscordClient.user.avatarURL({ extension: 'png' })}` })
        .setDescription(`A private general purpose Bot. Has features such as </bonk:821452644295114772>, Button Role Menus, and more.`)
        .addFields(
            { name: `Developer`, value: `TwilightZebby#1955`, inline: true },
            { name: `Bot Version`, value: `${Package.version}`, inline: true },
            { name: `Discord.JS Version`, value: `${Package.dependencies['discord.js']}`, inline: true },

            { name: `Global Commands`, value: `${RegisteredGlobalCommands.size}`, inline: true },
            { name: `Server Commands`, value: `${RegisteredGuildCommands.size}`, inline: true },
            { name: `Total App Commands`, value: `${TotalRegisteredCommands}`, inline: true },

            { name: `Servers`, value: `${DiscordClient.guilds.cache.size}`, inline: true },
            { name: `\u200B`, value: `\u200B`, inline: true },
            { name: `\u200B`, value: `\u200B`, inline: true }
        );

        return await slashCommand.editReply({ embeds: [BotInfoEmbed], components: [BotInfoActionRow] });
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
