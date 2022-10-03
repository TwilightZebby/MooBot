const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, ApplicationCommandOptionType, AutocompleteInteraction, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, TextChannel, VoiceChannel, StageChannel, NewsChannel, CategoryChannel, GuildVerificationLevel, GuildExplicitContentFilter, GuildDefaultMessageNotifications, GuildMFALevel, GuildNSFWLevel, GuildPremiumTier, Routes, Invite, ChannelType, InviteTargetType, GuildMember } = require("discord.js");
const { DiscordClient } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");
const LocalizedStrings = require("../../JsonFiles/stringMessages.json");
const Package = require('../../package.json');
const fetch = require('node-fetch');

if (!globalThis.fetch) { globalThis.fetch = fetch; }



// REGEXS
const RegexDiscordInviteShort = new RegExp(/(?<domain>(?:dsc|dis|discord|invite)\.(?:gd|gg|io|me))\/(?<code>[\w-]+)/gim);
const RegexDiscordInviteLong = new RegExp(/(?<domain>(?:discord(?:app)?|watchanimeattheoffice)\.com)\/(?:invites?|friend-invites?)\/(?<code>[\w-]+)/gim);

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
const EMOJI_CHANNEL_RULES = "<:ChannelRules:1009372446362714174>";
const EMOJI_SCHEDULED_EVENT = "<:ScheduledEvent:1009372447503552514>";
const EMOJI_ROLE = "<:Role:997752069605822507>";
const EMOJI_EMOJI = "<:Emoji:997752064778174515>";
const EMOJI_STICKER = "<:Sticker:997752072848019527>";
const EMOJI_TIMEOUT = "<:timeout:997752074366369814>";
const EMOJI_MEMBERSHIP_GATING = "<:MembershipGating:1009751578070224946>";
const EMOJI_STATUS_IDLE = "<:StatusIdle:1009372448979947550>";
// Badges
const EMOJI_VERIFIED_BOT = "<:BadgeBotVerified:1026417284799021087>";
const EMOJI_SUPPORTS_APP_COMMANDS = "<:BadgeBotSupportsAppCommands:1026426199347560468>";
const EMOJI_BUG_HUNTER_TIER_1 = "<:BadgeUserBugHunterTier1:1026417286111838228>";
const EMOJI_BUG_HUNTER_TIER_2 = "<:BadgeUserBugHunterTier2:1026417287252672562>";
const EMOJI_CERTIFIED_MOD = "<:BadgeUserCertifiedMod:1026417288406110208>";
const EMOJI_EARLY_SUPPORTER = "<:BadgeUserEarlySupporter:1026417290268389426>";
const EMOJI_EARLY_VERIFIED_BOT_DEV = "<:BadgeUserEarlyVerifiedBotDev:1026417291522490449>";
const EMOJI_HYPESQUAD_BALANCE = "<:BadgeUserHypeSquadBalance:1026417292680105984>";
const EMOJI_HYPESQUAD_BRAVERY = "<:BadgeUserHypeSquadBravery:1026417293967773696>";
const EMOJI_HYPESQUAD_BRILLIANCE = "<:BadgeUserHypeSquadBrilliance:1026417295221862411>";
const EMOJI_HYPESQUAD_EVENTS = "<:BadgeUserHypeSquadEvents:1026417296421437480>";
const EMOJI_PARTNERED_SERVER_OWNER = "<:BadgeUserPartneredServerOwner:1026417297625202709>";
const EMOJI_STAFF = "<:BadgeUserStaff:1026417298808000512>";



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
    "GUILD_HOME_OVERRIDE": "Server Home Override",
    "INCREASED_THREAD_LIMIT": "Increased Thread Limit",
    "CREATOR_MONETIZABLE_WHITEGLOVE": "Creator Monetizable Whiteglove",
    "CREATOR_MONETIZABLE_PROVISIONAL": "Creator Monetizable Provisional",
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


/**
 * Readable User Flags
 * @param {String} userFlag 
 * @returns {String}
 */
function readableUserFlags(userFlag)
{
    let readableString = "";
    switch(userFlag)
    {
        case "BotHTTPInteractions":
            readableString = "HTTP Interactions Bot";
            break;

        case "BugHunterLevel1":
            readableString = "Bug Hunter Tier 1";
            break;

        case "BugHunterLevel2":
            readableString = "Bug Hunter Tier 2";
            break;

        case "CertifiedModerator":
            readableString = "Certified Moderator";
            break;

        case "HypeSquadOnlineHouse1":
            readableString = "HypeSquad Bravery House";
            break;

        case "HypeSquadOnlineHouse2":
            readableString = "HypeSquad Brilliance House";
            break;

        case "HypeSquadOnlineHouse3":
            readableString = "HypeSquad Balance House";
            break;

        case "Hypesquad":
            readableString = "HypeSquad Events";
            break;

        case "Partner":
            readableString = "Partnered Server Owner";
            break;

        case "PremiumEarlySupporter":
            readableString = "Early Nitro Supporter";
            break;

        case "Quarantined":
            readableString = "**Quarantined**";
            break;

        case "Spammer":
            readableString = "**Spammer**";
            break;

        case "Staff":
            readableString = "Discord Employee";
            break;

        case "TeamPseudoUser":
            readableString = "Team (Pseudo User)";
            break;

        case "VerifiedBot":
            readableString = "Verified Bot";
            break;

        case "VerifiedDeveloper":
            readableString = "Early Verified Bot Developer";
            break;
    }
    return readableString;
}

/**
 * Readable User Flags, returns Emoji strings
 * @param {String} userFlag 
 * @returns {String}
 */
function readableUserFlagsEmoji(userFlag)
{
    let readableString = "";
    switch(userFlag)
    {
        case "BugHunterLevel1":
            readableString = EMOJI_BUG_HUNTER_TIER_1;
            break;

        case "BugHunterLevel2":
            readableString = EMOJI_BUG_HUNTER_TIER_2;
            break;

        case "CertifiedModerator":
            readableString = EMOJI_CERTIFIED_MOD;
            break;

        case "HypeSquadOnlineHouse1":
            readableString = EMOJI_HYPESQUAD_BRAVERY;
            break;

        case "HypeSquadOnlineHouse2":
            readableString = EMOJI_HYPESQUAD_BRILLIANCE;
            break;

        case "HypeSquadOnlineHouse3":
            readableString = EMOJI_HYPESQUAD_BALANCE;
            break;

        case "Hypesquad":
            readableString = EMOJI_HYPESQUAD_EVENTS;
            break;

        case "Partner":
            readableString = EMOJI_PARTNERED_SERVER_OWNER;
            break;

        case "PremiumEarlySupporter":
            readableString = EMOJI_EARLY_SUPPORTER;
            break;

        case "Staff":
            readableString = EMOJI_STAFF;
            break;

        case "VerifiedBot":
            readableString = EMOJI_VERIFIED_BOT;
            break;

        case "VerifiedDeveloper":
            readableString = EMOJI_EARLY_VERIFIED_BOT_DEV;
            break;

        default:
            // To catch the Flags that DON'T have Badges connected with them
            readableString = "NULL";
            break;
    }
    return readableString;
}


/**
 * Readable Channel Types
 * @param {ChannelType} channelType 
 * @returns {String}
 */
function readableChannelType(channelType)
{
    let readableString = "";
    switch(channelType)
    {
        case ChannelType.DM:
            readableString = "DM";
            break;

        case ChannelType.GroupDM:
            readableString = "Group DM";
            break;

        case ChannelType.GuildCategory:
            readableString = "Category";
            break;

        case ChannelType.GuildDirectory:
            readableString = "Directory";
            break;

        case ChannelType.GuildForum:
            readableString = "Forum";
            break;

        case ChannelType.GuildAnnouncement:
            readableString = "Announcement";
            break;
            
        case ChannelType.AnnouncementThread:
            readableString = "Thread (in Announcement)";
            break;

        case ChannelType.PrivateThread:
            readableString = "Private Thread";
            break;

        case ChannelType.PublicThread:
            readableString = "Public Thread";
            break;

        case ChannelType.GuildStageVoice:
            readableString = "Stage";
            break;

        case ChannelType.GuildText:
            readableString = "Text";
            break;

        case ChannelType.GuildVoice:
            readableString = "Voice";
            break;
    }
    return readableString;
}


/**
 * Readable Bot Application Flags
 * @param {String} applicationFlag 
 * @returns {String}
 */
function readableApplicationFlags(applicationFlag)
{
    let readableString = "";
    switch(applicationFlag)
    {
        case "ApplicationCommandBadge":
            readableString = "Supports Application Commands";
            break;

        case "Embedded":
            readableString = "Embedded";
            break;

        case "EmbeddedFirstParty":
            readableString = "Embedded First Party";
            break;

        case "EmbeddedReleased":
            readableString = "Embedded Released";
            break;

        case "GatewayGuildMembers":
            readableString = "Has Guild Members Intent (Verified)";
            break;

        case "GatewayGuildMembersLimited":
            readableString = "Has Guild Members Intent";
            break;

        case "GatewayMessageContent":
            readableString = "Has Message Content Intent (Verified)";
            break;

        case "GatewayMessageContentLimited":
            readableString = "Has Message Content Intent";
            break;

        case "GatewayPresence":
            readableString = "Has Presence Intent (Verified)";
            break;

        case "GatewayPresenceLimited":
            readableString = "Has Presence Intent";
            break;

        case "GroupDMCreate":
            readableString = "Group DM Create";
            break;

        case "ManagedEmoji":
            readableString = "Managed Emoji";
            break;

        case "RPCHasConnected":
            readableString = "RPC Has Connected";
            break;

        case "VerificationPendingGuildLimit":
            readableString = "Verification blocked by unusual growth";
            break;
    }
    return readableString;
}


/** Bot Flags to be included in seperate Embed Field to the others */
const BotIntentFlags = [ "GatewayPresence", "GatewayPresenceLimited", "GatewayMessageContent", "GatewayMessageContentLimited", "GatewayGuildMembers", "GatewayGuildMembersLimited" ];



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

        ServerInfoEmbed.setDescription(`${GuildPartnered ? `${ExternalEmojiPermission ? `${EMOJI_PARTNER} ` : "**Partnered!** "}` : ""} ${GuildVerified ? `${ExternalEmojiPermission ? `${EMOJI_VERIFIED}` : "**Verified!**"}` : ""}\n${GuildDescription}`)
        .addFields(
            {
                name: `>> General`,
                value: `${ExternalEmojiPermission ? `${EMOJI_OWNER_CROWN} ` : ""}**Owner:** ${GuildOwner.user.username}#${GuildOwner.user.discriminator}
${ExternalEmojiPermission ? `${readableGuildPremiumTierEmoji(GuildBoostTier)} ` : ""}**Boost Level:** ${readableGuildPremiumTier(GuildBoostTier)}
${ExternalEmojiPermission ? `${EMOJI_BOOST} ` : ""}**Boost Count:** ${GuildBoostCount}
${ExternalEmojiPermission ? `${EMOJI_EMOJI} ` : ""}**Emojis:** ${TotalEmojiCount}
${ExternalEmojiPermission ? `${EMOJI_STICKER} ` : ""}**Stickers:** ${TotalStickerCount}
${ExternalEmojiPermission ? `${EMOJI_ROLE} ` : ""}**Roles:** ${TotalRoleCount} / 250${TotalScheduledEvents > 0 ? `\n${ExternalEmojiPermission ? `${EMOJI_SCHEDULED_EVENT} ` : ""}**Scheduled Events:** ${TotalScheduledEvents}` : ""}${GuildVanityCode != null ? `\n**Vanity URL:** https://discord.gg/${GuildVanityCode}` : ""}${GuildApproxTotalMembers != null ? `\n**Approx. Total Members:** ${GuildApproxTotalMembers}` : ""}${GuildApproxOnlineMembers != null ? `\n**Approx. Online Members:** ${GuildApproxOnlineMembers}` : ""}`,
                inline: true
            },
            {
                 name: `>> Channels (${TotalChannelCount} / 500)`,
                value: `${ExternalEmojiPermission ? `${EMOJI_CHANNEL_TEXT} ` : ""}**Text:** ${textChannelCount}
${ExternalEmojiPermission ? `${EMOJI_CHANNEL_NEWS} ` : ""}**Announcement:** ${announcementChannelCount}
${ExternalEmojiPermission ? `${EMOJI_CHANNEL_VOICE} ` : ""}**Voice:** ${voiceChannelCount}
${ExternalEmojiPermission ? `${EMOJI_CHANNEL_STAGE} ` : ""}**Stage:** ${stageChannelCount}
${ExternalEmojiPermission ? `${EMOJI_CHANNEL_CATEGORY} ` : ""}**Category:** ${categoryChannelCount}${unknownChannelCount > 0 ? `\n${ExternalEmojiPermission ? `❓ ` : ""}**Unknown Type(s):** ${unknownChannelCount}` : ""}${AfkChannelId != null ? `\n${ExternalEmojiPermission ? `${EMOJI_STATUS_IDLE} ` : ""}**AFK:** <#${AfkChannelId}>` : ""}${SystemChannelId != null ? `\n${ExternalEmojiPermission ? `⚙ ` : ""}**System:** <#${SystemChannelId}>` : ""}${RulesChannelId != null ? `\n${ExternalEmojiPermission ? `${EMOJI_CHANNEL_RULES} ` : ""}**Rules:** <#${RulesChannelId}>` : ""}`,
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
        // Defer
        await slashCommand.deferReply({ ephemeral: true });

        // Fetch Member, be it User of Command or Target from input
        /** @type {GuildMember} */
        let fetchedMember;
        const MemberOption = slashCommand.options.getMember("user");
        if ( !MemberOption || MemberOption == null ) { fetchedMember = await slashCommand.guild.members.fetch(slashCommand.user.id); }
        else { fetchedMember = await slashCommand.guild.members.fetch(MemberOption.id).catch(async err => { return await slashCommand.editReply({ content: LocalizedErrors[slashCommand.locale].INFO_USER_COMMAND_MEMBER_NOT_PART_OF_GUILD }); }); }

        // Check for External Emoji Permission
        const ExternalEmojiPermission = checkEmojiPermission(slashCommand);

        // Grab Data
        // Member Information
        const MemberUser = fetchedMember.user;
        // Force-fetch User, to ensure up-to-date fields
        await MemberUser.fetch(true);
        // Check if standard User or Bot User
        const IsBot = fetchedMember.user.bot;
        const MemberDisplayName = ( fetchedMember.displayName || null );
        const MemberDisplayColorHex = fetchedMember.displayHexColor;
        const MemberJoinedTime = ( fetchedMember.joinedAt || null );
        const MemberHighestRole = fetchedMember.roles.highest;
        const MemberRoleCount = fetchedMember.roles.cache.filter(role => role.id !== fetchedMember.guild.id).size;
        const MemberTimedOut = ( fetchedMember.communicationDisabledUntil || null );

        // Assets
        const HasMemberAvatar = fetchedMember.avatar == null ? false : true;
        const HasGlobalAvatar = MemberUser?.avatar == null ? false : true;
        const HasGlobalBanner = MemberUser?.banner == null ? false : true;

        // User Flags
        const RawUserFlags = await MemberUser.fetchFlags(true);
        const UserFlagStrings = [];
        let userFlagEmojis = [];
        RawUserFlags.toArray().forEach(flag => UserFlagStrings.push(readableUserFlags(flag)));
        RawUserFlags.toArray().forEach(flag => userFlagEmojis.push(readableUserFlagsEmoji(flag)));
        // Filter out badgeless flags
        userFlagEmojis = userFlagEmojis.filter(emojiString => emojiString !== "NULL");

        const UserInfoEmbed = new EmbedBuilder().setAuthor({ iconURL: fetchedMember.displayAvatarURL({ extension: 'png' }), name: `${fetchedMember.user.username}#${fetchedMember.user.discriminator}` })
        .setColor(MemberDisplayColorHex);

        
        // IF NOT A BOT
        if ( !IsBot )
        {
            const MemberPending = ( fetchedMember.pending || null );
            const MemberStartedBoosting = ( fetchedMember.premiumSince || null );

            // Construct strings for Embed
            // Member Info
            let memberInformationString = "";
            if ( MemberUser.id === slashCommand.guild.ownerId ) { memberInformationString += `${ExternalEmojiPermission ? `${EMOJI_OWNER_CROWN} `: ""}**Is Server Owner**`; }
            if ( MemberDisplayName != null ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}**Display Name:** \`${MemberDisplayName}\``; }
            if ( MemberJoinedTime != null ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}**Joined Server:** <t:${Math.floor(MemberJoinedTime.getTime() / 1000)}:R>`; }
            if ( MemberHighestRole != null ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}**Highest Role:** <@&${MemberHighestRole.id}>`; }
            if ( MemberRoleCount > 0 ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}${ExternalEmojiPermission ? `${EMOJI_ROLE} ` : ""}**Role Count:** ${MemberRoleCount}`; }
            if ( MemberStartedBoosting != null ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}${ExternalEmojiPermission ? `${EMOJI_BOOST} ` : ""}**Boosting Server Since:** <t:${Math.floor(MemberStartedBoosting.getTime() / 1000)}:R>`; }
            if ( MemberPending === true ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}${ExternalEmojiPermission ? `${EMOJI_MEMBERSHIP_GATING} ` : ""}Yet to pass Membership Screening`; }
            if ( MemberTimedOut != null && MemberTimedOut.getTime() > Date.now() ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}${ExternalEmojiPermission ? `${EMOJI_TIMEOUT} ` : ""}Currently Timed-out (expires <t:${Math.floor(MemberTimedOut.getTime() / 1000)}:R>)`; }
            if ( memberInformationString.length > 1 ) { UserInfoEmbed.addFields({ name: `>> Member Information`, value: memberInformationString }); }

            // User Info
            let userInformationString = `**Mention:** <@${MemberUser.id}>
**Account Created:** <t:${Math.floor(MemberUser.createdAt.getTime() / 1000)}:R>
**Is Bot:** ${MemberUser.bot}`;
            UserInfoEmbed.addFields({ name: `>> User Information`, value: userInformationString });

            // User Flags & emojis
            if ( UserFlagStrings.length > 0 ) { UserInfoEmbed.addFields({ name: `>> User Flags`, value: UserFlagStrings.sort().join(', ').slice(0, 1023) }) }
            if ( userFlagEmojis.length > 0 && ExternalEmojiPermission ) { UserInfoEmbed.setDescription(userFlagEmojis.join(" ")); }

            // Asset Buttons
            const UserInfoActionRow = new ActionRowBuilder();
            if ( MemberRoleCount > 0 ) { UserInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId(`info-user-role_${MemberUser.id}`).setLabel("Roles").setEmoji(EMOJI_ROLE)); }
            if ( HasMemberAvatar ) { UserInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Member Avatar").setURL(fetchedMember.avatarURL())); }
            if ( HasGlobalAvatar ) { UserInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Global Avatar").setURL(MemberUser.avatarURL())); }
            if ( HasGlobalBanner ) { UserInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Global Banner").setURL(MemberUser.bannerURL())); }

            // Send Embed and Buttons
            return await slashCommand.editReply({ embeds: [UserInfoEmbed], components: [UserInfoActionRow] });
        }
        // IS A BOT
        else
        {
            // Fetch specific Bot-related Information
            const BotApplicationFlags = MemberUser.client.application.flags.toArray();
            let botApplicationFlagStrings = [];
            let botIntentFlagStrings = [];
            BotApplicationFlags.forEach(flag => {
                if ( BotIntentFlags.includes(flag) ) { botIntentFlagStrings.push(readableApplicationFlags(flag)); }
                else { botApplicationFlagStrings.push(readableApplicationFlags(flag)); }
            });
            const BotRequiresCodeGrant = ( MemberUser.client.application.botRequireCodeGrant || null );
            const BotPubliclyInvitable = ( MemberUser.client.application.botPublic || null );
            const BotDescription = ( MemberUser.client.application.description || null );

            // Construct strings for Embed
            // Member Info
            let memberInformationString = "";
            if ( MemberUser.id === slashCommand.guild.ownerId ) { memberInformationString += `${ExternalEmojiPermission ? `${EMOJI_OWNER_CROWN} `: ""}**Is Server Owner**`; }
            if ( MemberDisplayName != null ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}**Display Name:** \`${MemberDisplayName}\``; }
            if ( MemberJoinedTime != null ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}**Joined Server:** <t:${Math.floor(MemberJoinedTime.getTime() / 1000)}:R>`; }
            if ( MemberHighestRole != null ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}**Highest Role:** <@&${MemberHighestRole.id}>`; }
            if ( MemberRoleCount > 0 ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}${ExternalEmojiPermission ? `${EMOJI_ROLE} ` : ""}**Role Count:** ${MemberRoleCount}`; }
            if ( MemberTimedOut != null && MemberTimedOut.getTime() > Date.now() ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}${ExternalEmojiPermission ? `${EMOJI_TIMEOUT} ` : ""}Currently Timed-out (expires <t:${Math.floor(MemberTimedOut.getTime() / 1000)}:R>)`; }
            if ( memberInformationString.length > 1 ) { UserInfoEmbed.addFields({ name: `>> Member Information`, value: memberInformationString }); }

            // User Info
            let userInformationString = `**Mention:** <@${MemberUser.id}>
**Account Created:** <t:${Math.floor(MemberUser.createdAt.getTime() / 1000)}:R>
**Is Bot:** ${MemberUser.bot}`;
            UserInfoEmbed.addFields({ name: `>> User Information`, value: userInformationString });

            // Bot-specific Profile Badges!
            if ( botApplicationFlagStrings.includes("Supports Application Commands") ) { userFlagEmojis.unshift(EMOJI_SUPPORTS_APP_COMMANDS); }

            // Bot Information
            let botInformationString = "";
            if ( BotDescription != null ) { UserInfoEmbed.setDescription(`${userFlagEmojis.length > 0 ? `${userFlagEmojis.join(" ")}` : ""}\n${BotDescription}`); }
            else if ( BotDescription == null && userFlagEmojis.length > 0 && ExternalEmojiPermission ) { UserInfoEmbed.setDescription(userFlagEmojis.join(" ")); }
            if ( BotPubliclyInvitable != null ) { botInformationString += `**Is Publicly Invitable:** ${BotPubliclyInvitable}`; }
            if ( BotRequiresCodeGrant != null ) { botInformationString += `${botInformationString.length > 1 ? `\n` : ""}**Requires OAuth2 Grant:** ${BotRequiresCodeGrant}`; }
            if ( botIntentFlagStrings.length > 0 ) { botInformationString += `${botInformationString.length > 1 ? `\n` : ""}${botIntentFlagStrings.sort().join(`\n`).slice(0, 1023)}`; }
            if ( botInformationString.length > 1 ) { UserInfoEmbed.addFields({ name: `>> Bot Information`, value: botInformationString }); }

            // User Flags
            if ( UserFlagStrings.length > 0 ) { UserInfoEmbed.addFields({ name: `>> User Flags`, value: UserFlagStrings.sort().join(', ').slice(0, 1023) }) }
            // Bot Application Flags (that aren't Intents)
            if ( botApplicationFlagStrings.length > 0 ) { UserInfoEmbed.addFields({ name: `>> Bot Flags`, value: botApplicationFlagStrings.sort().join(', ').slice(0, 1023) }); }

            // Asset Buttons
            const UserInfoActionRow = new ActionRowBuilder();
            if ( MemberRoleCount > 0 ) { UserInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId(`info-user-role_${MemberUser.id}`).setLabel("Roles").setEmoji(EMOJI_ROLE)); }
            if ( HasMemberAvatar ) { UserInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Member Avatar").setURL(fetchedMember.avatarURL())); }
            if ( HasGlobalAvatar ) { UserInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Global Avatar").setURL(MemberUser.avatarURL())); }
            if ( HasGlobalBanner ) { UserInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Global Banner").setURL(MemberUser.bannerURL())); }

            // Send Embed and Buttons
            return await slashCommand.editReply({ embeds: [UserInfoEmbed], components: [UserInfoActionRow] });
        }
    },



    /**
     * Fetches and Displays information about the given Discord Invite
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async fetchInviteInfo(slashCommand)
    {
        // Defer
        await slashCommand.deferReply({ ephemeral: true });

        // Grab given Invite Link
        const InputInviteLink = slashCommand.options.getString("code", true);
        // Check Invite does exist on Discord
        /** @type {Invite} */
        let fetchedInvite = null;
        try { fetchedInvite = await DiscordClient.fetchInvite(InputInviteLink); }
        catch (err) { return await slashCommand.editReply({ content: LocalizedErrors[slashCommand.locale].INFO_INVITE_COMMAND_INVITE_DOES_NOT_EXIST }); }

        // Check for External Emoji Permission
        const ExternalEmojiPermission = checkEmojiPermission(slashCommand);


        // GRAB INFORMATION
        // Invite Data
        const InviteCode = fetchedInvite.code;
        const InviteCreatedTime = ( fetchedInvite.createdAt?.getTime() || null );
        const InviteExpireTime = ( fetchedInvite.expiresAt?.getTime() || null );
        const TargetApplication = ( fetchedInvite.targetApplication || null );
        const TargetType = ( fetchedInvite.targetType || null );
        const InviteChannel = ( fetchedInvite.channel || null );
        const InviteGuild = ( fetchedInvite.guild || null );
        const InviteCreatorUser = ( fetchedInvite.inviter || null );


        // Construct Embed
        const InviteInfoEmbed = new EmbedBuilder().setAuthor({ name: `Data for Invite Code: ${InviteCode}` });
        
        // General Invite Info
        let generalInviteInfo = "";
        if ( InviteCreatorUser != null ) { generalInviteInfo += `**Inviter:** ${InviteCreatorUser.username}#${InviteCreatorUser.discriminator}\n**Bot User:** ${InviteCreatorUser.bot}`; }
        if ( InviteCreatedTime != null ) { generalInviteInfo += `${generalInviteInfo.length > 1 ? `\n` : ""}**Created:** <t:${Math.floor(InviteCreatedTime / 1000)}:R>`; }
        if ( InviteExpireTime != null ) { generalInviteInfo += `${generalInviteInfo.length > 1 ? `\n` : ""}**Expires:** <t:${Math.floor(InviteExpireTime / 1000)}:R>`; }
        if ( generalInviteInfo.length > 1 ) { InviteInfoEmbed.addFields({ name: `>> General Info`, value: generalInviteInfo }); }
        
        // Invite Target Info
        let targetInviteInfo = "";
        if ( InviteChannel != null ) { targetInviteInfo += `**Channel Type:** ${readableChannelType(InviteChannel.type)}\n**Channel Name:** ${InviteChannel.name}`; }
        if ( TargetType != null && TargetType === InviteTargetType.Stream ) { targetInviteInfo += `${targetInviteInfo.length > 1 ? `\n` : ""}**Target Type:** Screenshare`; }
        if ( TargetType != null && TargetType === InviteTargetType.EmbeddedApplication ) { targetInviteInfo += `${targetInviteInfo.length > 1 ? `\n` : ""}**Target Type:** Voice Activity${(TargetApplication != null) && (TargetApplication.name != null) ? `\n**Activity Name:** ${TargetApplication.name}` : ""}`; }
        if ( targetInviteInfo.length > 1 ) { InviteInfoEmbed.addFields({ name: `>> Target Info`, value: targetInviteInfo }); }
        
        // Guild Info
        if ( InviteGuild != null )
        {
            if ( InviteGuild.description != null ) { InviteInfoEmbed.setDescription(InviteGuild.description); }
            if ( InviteGuild.icon != null ) { InviteInfoEmbed.setAuthor({ iconURL: InviteGuild.iconURL({ extension: 'png' }), name: `Data for Invite Code: ${InviteCode}` }); }
            let guildInviteInfo = `**Name:** ${InviteGuild.name}
${ExternalEmojiPermission && InviteGuild.partnered ? `${EMOJI_PARTNER} ` : ""}**Partnered:** ${InviteGuild.partnered}
${ExternalEmojiPermission && InviteGuild.verified ? `${EMOJI_VERIFIED} ` : ""}**Verified:** ${InviteGuild.verified}`;
            if ( InviteGuild.approximateMemberCount != null ) { guildInviteInfo += `\n**Approx. Total Members:** ${InviteGuild.approximateMemberCount}`; }
            if ( InviteGuild.approximatePresenceCount != null ) { guildInviteInfo += `\n**Approx. Online Members:** ${InviteGuild.approximatePresenceCount}`; }
            InviteInfoEmbed.addFields({ name: `>> Server Info`, value: guildInviteInfo });

            // Server Feature Flags, grabbing from raw API to ensure up-to-date data
            let rawData = await DiscordClient.rest.get(Routes.invite(InviteCode));
            const RawFeatures = rawData["guild"]["features"];
            let guildFeatures = [];
            RawFeatures.forEach(feature => guildFeatures.push(festuresString[feature]));
            if ( guildFeatures.length > 0 ) { InviteInfoEmbed.addFields({ name: `>> Server's Feature Flags`, value: `${guildFeatures.sort().join(', ').slice(0, 1023)}` }); }
        }

        // Construct Invite Button
        const InviteLinkButton = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Join Server").setURL(`https://discord.gg/${InviteCode}`);
        const InviteInfoActionRow = new ActionRowBuilder().addComponents(InviteLinkButton);

        return await slashCommand.editReply({ embeds: [InviteInfoEmbed], components: [InviteInfoActionRow] });
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

            { name: `\u200B`, value: `\u200B`, inline: true },
            { name: `Servers`, value: `${DiscordClient.guilds.cache.size}`, inline: true },
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
