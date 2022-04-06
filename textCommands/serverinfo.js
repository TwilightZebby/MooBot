// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const fetch = require('node-fetch');

if (!globalThis.fetch) {
	globalThis.fetch = fetch;
}


// EMOJIS
const EMOJI_OWNER_CROWN = "<:ServerOwner:961186488626847774>";
const EMOJI_PARTNER = "<:Partnered:961186488530395146>";
const EMOJI_VERIFIED = "<:Verified:961186488626839592>";
const EMOJI_TIER_ONE = "<:BoostTier1:961186488601698304>";
const EMOJI_TIER_TWO = "<:BoostTier2:961186488610082896>";
const EMOJI_TIER_THREE = "<:BoostTier3:961186488467464212>";
const EMOJI_BOOST = "<:Boost:961186488635228170>";
const EMOJI_CHANNEL_TEXT = "<:ChannelText:961186488480063518>";
const EMOJI_CHANNEL_VOICE = "<:ChannelVoice:961186488480043058>";
const EMOJI_CHANNEL_STAGE = "<:ChannelStage:961187713070006322>";
const EMOJI_CHANNEL_NEWS = "<:ChannelAnnouncements:961186488098361345>";
const EMOJI_CHANNEL_CATEGORY = "<:ChannelCategory:961186488572313620>";
const EMOJI_ROLE = "<:Role:961186488551342150>";
const EMOJI_EMOJI = "<:Emoji:961188706369286164>";
const EMOJI_STICKER = "<:Sticker:961186488664600576>";


// LINKS



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
    "AUTO_MODERATION": "[Auto Moderation",
    "BANNER": "Banner",
    "BOOSTING_TIERS_EXPERIMENT_MEDIUM_GUILD": "Boosting Tiers Experiment Medium Guild",
    "BOOSTING_TIERS_EXPERIMENT_SMALL_GUILD": "Boosting Tiers Experiment Small Guild",
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
    "SEVEN_DAY_THREAD_ARCHIVE": "Seven Day Thread Archive",
    "TEXT_IN_VOICE_ENABLED": "Text in Voice Enabled",
    "THREADS_ENABLED_TESTING": "Threads Enabled Testing",
    "THREADS_ENABLED": "Threads Enabled",
    "THREAD_DEFAULT_AUTO_ARCHIVE_DURATION": "Threads Default Auto Archive Duration",
    "THREE_DAY_THREAD_ARCHIVE": "Three Day Thread Archive",
    "TICKETED_EVENTS_ENABLED": "Ticketed Events Enabled",
    "VANITY_URL": "Vanity URL",
    "VERIFIED": "Verified",
    "WELCOME_SCREEN_ENABLED": "Welcome Screen Enabled"
};
const tierStrings = {
    "NONE": "None",
    "TIER_1": "Tier 1",
    "TIER_2": "Tier 2",
    "TIER_3": "Tier 3"
}



module.exports = {
    // Command Name
    name: 'serverinfo',
    // Description of command
    description: `Shows general information about the Server this command was used in.`,
    // Category of Command, used for Help Command
    category: 'general',

    // Alias(es) of command, if any
    // Uncomment if there will be some
    //alias: [],

    // Command Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 300,

    // Is command intended for DM usage with the Bot only?
    // DO NOT HAVE THIS AND "guildOnly" UNCOMMENTED - ONLY ONE OR THE OTHER OR NEITHER
    //dmOnly: true,

    // Is command intended for Guild usage only?
    // DO NOT HAVE THIS AND "dmOnly" UNCOMMENTED - ONLY ONE OR THE OTHER OR NEITHER
    guildOnly: true,

    // Is at least one argument required?
    //requiresArguments: true,

    // What is the minimum required arguments?
    // THIS REQUIRES "requiresArguments" TO BE UNCOMMENTED
    //minimumArguments: 2,

    // What is the maximum required arguments?
    // Is usable/settable no matter if "requiresArguments" is un/commented
    //maximumArguments: 5,

    // Command Limitation - limits who can use this Command
    //    - "developer" for TwilightZebby only
    //    - "owner" for Guild Owners & TwilightZebby
    //    - "admin" for those with the ADMIN Guild Permission, Guild Owners, & TwilightZebby
    //    - "moderator" for those with Moderator-level Guild Permissions, Admins, Guild Owners, & TwilightZebby
    //    - "everyone" (or commented out) for everyone to use this command
    limitation: "moderator",



    /**
     * Main function that runs the command
     * 
     * @param {Discord.Message} message Origin Message that triggered this command
     * @param {Array<String>} arguments The given arguments of the command. Can be empty if no arguments were passed!
     */
    async execute(message, arguments)
    {
        // Fetch Guild and its data that we want to display
        const currentGuild = message.guild;

        // General
        const guildId = currentGuild.id;
        const guildName = currentGuild.name;
        const guildIcon = currentGuild.iconURL({ dynamic: true, format: 'png' });
        const guildDescription = ( currentGuild.description || " " );
        const guildCreatedTime = currentGuild.createdAt.getTime();
        const guildOwner = await currentGuild.fetchOwner();
        const guildPartnered = currentGuild.partnered;
        const guildVerified = currentGuild.verified;
        const guildBoostTier = currentGuild.premiumTier;
        const guildBoostCount = currentGuild.premiumSubscriptionCount;
        const guildVanityInviteCode = ( currentGuild.vanityURLCode || null );

        // Security & Moderation
        const guildVerificationLevel = currentGuild.verificationLevel;
        const guildContentFilter = currentGuild.explicitContentFilter;
        const guildDefaultNotifications = currentGuild.defaultMessageNotifications;
        const guildMFALevel = currentGuild.mfaLevel;
        const guildNSFWLevel = currentGuild.nsfwLevel;

        // Server Features
        let rawData = await client.api.guilds(currentGuild.id).get();
        const rawFeatures = rawData["features"];
        let guildFeatures = [];
        rawFeatures.forEach(feature => guildFeatures.push(festuresString[feature]));
        

        // Channel
        const guildChannels = await currentGuild.channels.fetch();
        const totalChannelCount = guildChannels.size;
        let textChannelCount = 0;
        let voiceChannelCount = 0;
        let stageChannelCount = 0;
        let announcementChannelCount = 0;
        let categoryChannelCount = 0;
        guildChannels.forEach(channel => {
            if ( channel instanceof Discord.TextChannel ) { textChannelCount += 1; }
            else if ( channel instanceof Discord.VoiceChannel ) { voiceChannelCount += 1; }
            else if ( channel instanceof Discord.StageChannel ) { stageChannelCount += 1; }
            else if ( channel instanceof Discord.NewsChannel ) { announcementChannelCount += 1; }
            else if ( channel instanceof Discord.CategoryChannel ) { categoryChannelCount += 1; }
        });

        // Roles
        const guildRoles = await currentGuild.roles.fetch();
        const totalRoleCount = guildRoles.size;

        // Emojis & Stickers
        const guildEmojis = await currentGuild.emojis.fetch();
        const totalEmojiCount = guildEmojis.size;
        const guildStickers = await currentGuild.stickers.fetch();
        const totalStickerCount = guildStickers.size;


        // Assemble into Embed
        const infoEmbed = new Discord.MessageEmbed().setAuthor({ name: guildName, iconURL: guildIcon })
            .setFooter({ text: guildId });
        infoEmbed.setDescription(`${guildPartnered ? `${EMOJI_PARTNER}` : ""}  ${guildVerified ? `${EMOJI_VERIFIED}` : ""}\n${guildDescription}`);
        infoEmbed.setTimestamp(currentGuild.createdAt);
        infoEmbed.addFields({ name: `>> General Information`, value: `**Created:** <t:${Math.floor(guildCreatedTime / 1000)}:R>\n**Owner**: ${EMOJI_OWNER_CROWN} ${guildOwner.user.username}#${guildOwner.user.discriminator} (<@${guildOwner.id}>)\n**Boost Level:** ${guildBoostTier === "TIER_3" ? `${EMOJI_TIER_THREE}` : guildBoostTier === "TIER_2" ? `${EMOJI_TIER_TWO}` : guildBoostTier === "TIER_1" ? `${EMOJI_TIER_ONE}` : ""} ${tierStrings[guildBoostTier]}\n**Boost Count:** ${EMOJI_BOOST} ${guildBoostCount}\n**Channels:** ${totalChannelCount} (${EMOJI_CHANNEL_TEXT} ${textChannelCount}, ${EMOJI_CHANNEL_NEWS} ${announcementChannelCount}, ${EMOJI_CHANNEL_VOICE} ${voiceChannelCount}, ${EMOJI_CHANNEL_STAGE} ${stageChannelCount}, ${EMOJI_CHANNEL_CATEGORY} ${categoryChannelCount})\n**Emojis:** ${EMOJI_EMOJI} ${totalEmojiCount}\n**Stickers:** ${EMOJI_STICKER} ${totalStickerCount}\n**Roles:** ${EMOJI_ROLE} ${totalRoleCount}${guildVanityInviteCode !== null ? `\n**Vanity URL:** https://discord.gg/${guildVanityInviteCode}` : ""}` });
        infoEmbed.addFields({ name: `>> Security & Moderation`, value: `**Verification Level:** ${verificationString[guildVerificationLevel]}\n**Explicit Content Filter:** ${explicitContentString[guildContentFilter]}\n**Default Notifications:** ${defaultNotifString[guildDefaultNotifications]}\n**2FA-enabled Moderation:** ${mfaString[guildMFALevel]}\n**NSFW Level:** ${nsfwString[guildNSFWLevel]}` });
        infoEmbed.addFields({ name: `>> Server's Feature Flags`, value: `${guildFeatures.sort().join(', ')}` });

        return await message.reply({ embeds: [infoEmbed], allowedMentions: { parse: [], repliedUser: false } });
    }
};
