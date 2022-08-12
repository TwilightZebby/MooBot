const Discord = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");
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
const verificationString = {
    "NONE": "Disabled",
    "LOW": "Low (Verified Email)",
    "MEDIUM": "Medium (Account Age > 5 minutes)",
    "HIGH": "High (Member for > 10 mins)",
    "VERY_HIGH": "Highest (Verified Phone Number)"
};
const explicitContentString = {
    "DISABLED": "Disabled",
    "MEMBERS_WITHOUT_ROLES": "Only scan roleless Members' content",
    "ALL_MEMBERS": "Scan content from everyone"
};
const defaultNotifString = {
    "ALL_MESSAGES": "All Messages",
    "ONLY_MENTIONS": "Only @mentions"
};
const mfaString = {
    "NONE": "Disabled",
    "ELEVATED": "Enabled"
};
const nsfwString = {
    "DEFAULT": "Default",
    "EXPLICIT": "Explicit",
    "SAFE": "Safe",
    "AGE_RESTRICTED": "Age-Restricted"
};
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
    "INTERNAL_EMPLOYEE_ONLY": "Internal Employee Only",
    "INVITE_SPLASH": "Invite Splash",
    "MEMBER_PROFILES": "Member Profiles",
    "MEMBER_VERIFICATION_GATE_ENABLED": "Member Verification Gate Enabled",
    "MORE_EMOJI": "More Emoji",
    "MORE_STICKERS": "More Stickers",
    "NEWS": "News",
    "NEW_THREAD_PERMISSIONS": "New Thread Permissions",
    "PARTNERED": "Partnered",
    "PREMIUM_TIER_3_OVERRIDE": "Premium Tier 3 Override",
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
    "VERIFIED": "Verified",
    "WELCOME_SCREEN_ENABLED": "Welcome Screen Enabled",
    "BOT_DEVELOPER_EARLY_ACCESS": "Bot Developer Early Access",
    "GUILD_HOME_TEST": "Server Home Test",
    "INVITES_DISABLED": "Invites Disabled",
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
const tierStrings = {
    "NONE": "None",
    "TIER_1": "Tier 1",
    "TIER_2": "Tier 2",
    "TIER_3": "Tier 3"
};
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
    "QUARANTINED": "Quarantined",
    "SPAMMER": "Spammer"
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
 * @param {Discord.ChatInputCommandInteraction} slashCommand 
 * @returns {Boolean}
 */
function checkEmojiPermission(slashCommand)
{
    return slashCommand.appPermissions.has(Discord.PermissionFlagsBits.UseExternalEmojis);
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
        "bot": 60
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
     * @returns {Discord.ChatInputApplicationCommandData}
     */
    registerData()
    {
        /** @type {Discord.ChatInputApplicationCommandData} */
        const Data = {};

        Data.name = this.Name;
        Data.description = this.Description;
        Data.type = Discord.ApplicationCommandType.ChatInput;
        Data.dmPermission = false;
        Data.options = [
            {
                type: Discord.ApplicationCommandOptionType.Subcommand,
                name: "server",
                description: "Display information about this Server"
            },
            {
                type: Discord.ApplicationCommandOptionType.Subcommand,
                name: "user",
                description: "Display information about either yourself, or another User",
                options: [
                    {
                        type: Discord.ApplicationCommandOptionType.User,
                        name: "user",
                        description: "User to display information about",
                        required: false
                    }
                ]
            },
            {
                type: Discord.ApplicationCommandOptionType.Subcommand,
                name: "invite",
                description: "Display information about a given Discord Server Invite",
                options: [
                    {
                        type: Discord.ApplicationCommandOptionType.String,
                        name: "code",
                        description: "The Discord Invite Code or Link",
                        max_length: 150,
                        required: true
                    }
                ]
            },
            {
                type: Discord.ApplicationCommandOptionType.Subcommand,
                name: "bot",
                description: "Display information about this Bot"
            }
        ];

        return Data;
    },



    /**
     * Executes the Slash Command
     * @param {Discord.ChatInputCommandInteraction} slashCommand 
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
     * @param {Discord.ChatInputCommandInteraction} slashCommand 
     */
    async fetchServerInfo(slashCommand)
    {
        //.
    },



    /**
     * Fetches and Displays information about the triggering or targeted User
     * @param {Discord.ChatInputCommandInteraction} slashCommand 
     */
    async fetchUserInfo(slashCommand)
    {
        //.
    },



    /**
     * Fetches and Displays information about the given Discord Invite
     * @param {Discord.ChatInputCommandInteraction} slashCommand 
     */
    async fetchInviteInfo(slashCommand)
    {
        //.
    },



    /**
     * Fetches and Displays information about this Bot
     * @param {Discord.ChatInputCommandInteraction} slashCommand 
     */
    async fetchBotInfo(slashCommand)
    {
        // Defer
        await slashCommand.deferReply({ ephemeral: true });

        // Fetch App Commands
        const RegisteredGlobalCommands = await DiscordClient.application.commands.fetch();
        const RegisteredGuildCommands = await slashCommand.guild.commands.fetch();
        const TotalRegisteredCommands = RegisteredGlobalCommands.size + RegisteredGuildCommands.size;

        // Construct Embed
        const BotInfoEmbed = new Discord.EmbedBuilder()
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

        return await slashCommand.editReply({ embeds: [BotInfoEmbed] });
    },



    /**
     * Handles given Autocomplete Interactions for any Options in this Slash CMD that uses it
     * @param {Discord.AutocompleteInteraction} autocompleteInteraction 
     */
    async autocomplete(autocompleteInteraction)
    {
        //.
    }
}
