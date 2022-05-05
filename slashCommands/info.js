// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const PACKAGE = require('../package.json');
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
const EMOJI_TIMEOUT = "<:timeout:966309135685652480>";



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
    "TEXT_IN_VOICE_ENABLED": "Text in Voice Enabled",
    "THREADS_ENABLED_TESTING": "Threads Enabled Testing",
    "THREADS_ENABLED": "Threads Enabled",
    "THREAD_DEFAULT_AUTO_ARCHIVE_DURATION": "Threads Default Auto Archive Duration",
    "TICKETED_EVENTS_ENABLED": "Ticketed Events Enabled",
    "VANITY_URL": "Vanity URL",
    "VERIFIED": "Verified",
    "WELCOME_SCREEN_ENABLED": "Welcome Screen Enabled",
    "BOT_DEVELOPER_EARLY_ACCESS": "Bot Developer Early Access",
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
    "BOT_HTTP_INTERACTIONS": "HTTP Interactions-only Bot"
};

module.exports = {
    // Slash Command's Name, MUST BE LOWERCASE AND NO SPACES
    name: 'info',
    // Slash Command's description
    description: `Fetch information about this Server, an Invite, a User, or this Bot.`,
    // Category of Slash Command, used for Help (text) Command
    category: 'general',

    // Slash Command's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 60,


    /**
     * Returns data used for registering this Slash Command
     * 
     * @returns {Discord.ChatInputApplicationCommandData}
     */
    registerData()
    {
        const data = {};

        // Slash Command's Name, Description, and Application Command Type
        data.name = this.name;
        data.description = this.description;
        data.type = "CHAT_INPUT";
        data.options = [
            {
                type: "SUB_COMMAND",
                name: "server",
                description: "Display information about this Server"
            },
            {
                type: "SUB_COMMAND",
                name: "invite",
                description: "Display information about a given Discord Invite code",
                options: [
                    {
                        type: "STRING",
                        name: "code",
                        description: "The Discord Invite code (the bit after \"discord.gg/\")",
                        required: true
                    }
                ]
            },
            {
                type: "SUB_COMMAND",
                name: "user",
                description: "Display information about either yourself, or a given User",
                options: [
                    {
                        type: "USER",
                        name: "user",
                        description: "The User to display information about",
                        required: false
                    }
                ]
            },
            {
                type: "SUB_COMMAND",
                name: "bot",
                description: "Display information about this Bot"
            }
        ];
        
        return data;
    },




    /**
     * Main function that runs this Slash Command
     * 
     * @param {Discord.CommandInteraction} slashCommand Slash Command Interaction
     */
    async execute(slashCommand)
    {
        const subCommandName = slashCommand.options.getSubcommand();

        switch (subCommandName)
        {
            case "server":
                return await this.serverInfo(slashCommand);
            
            case "invite":
                return await this.inviteInfo(slashCommand);

            case "user":
                return await this.userInfo(slashCommand);

            case "bot":
                return await this.botInfo(slashCommand);

            default:
                return await slashCommand.reply({ content: CONSTANTS.errorMessages.SLASH_COMMAND_GENERIC_FAILED, ephemeral: true });
        }
    },






    /**
     * For sending current Server Info
     * 
     * @param {Discord.CommandInteraction} slashCommand Slash Command Interaction
     */
    async serverInfo(slashCommand)
    {
        // Defer
        await slashCommand.deferReply();

        // Fetch Guild
        const currentGuild = await slashCommand.guild.fetch();

        // Check for External Emoji Permission
        const externalEmojiPermission = this.checkEmojiPermission(slashCommand);

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

        if ( externalEmojiPermission )
        {
            infoEmbed.setDescription(`${guildPartnered ? `${EMOJI_PARTNER}` : ""}  ${guildVerified ? `${EMOJI_VERIFIED}` : ""}\n${guildDescription}`);
            infoEmbed.setTimestamp(currentGuild.createdAt);
            infoEmbed.addFields({ name: `>> General Information`, value: `**Created:** <t:${Math.floor(guildCreatedTime / 1000)}:R>\n**Owner**: ${EMOJI_OWNER_CROWN} ${guildOwner.user.username}#${guildOwner.user.discriminator} (<@${guildOwner.id}>)\n**Boost Level:** ${guildBoostTier === "TIER_3" ? `${EMOJI_TIER_THREE}` : guildBoostTier === "TIER_2" ? `${EMOJI_TIER_TWO}` : guildBoostTier === "TIER_1" ? `${EMOJI_TIER_ONE}` : ""} ${tierStrings[guildBoostTier]}\n**Boost Count:** ${EMOJI_BOOST} ${guildBoostCount}\n**Channels:** ${totalChannelCount} (${EMOJI_CHANNEL_TEXT} ${textChannelCount}, ${EMOJI_CHANNEL_NEWS} ${announcementChannelCount}, ${EMOJI_CHANNEL_VOICE} ${voiceChannelCount}, ${EMOJI_CHANNEL_STAGE} ${stageChannelCount}, ${EMOJI_CHANNEL_CATEGORY} ${categoryChannelCount})\n**Emojis:** ${EMOJI_EMOJI} ${totalEmojiCount}\n**Stickers:** ${EMOJI_STICKER} ${totalStickerCount}\n**Roles:** ${EMOJI_ROLE} ${totalRoleCount}${guildVanityInviteCode !== null ? `\n**Vanity URL:** https://discord.gg/${guildVanityInviteCode}` : ""}` });
            infoEmbed.addFields({ name: `>> Security & Moderation`, value: `**Verification Level:** ${verificationString[guildVerificationLevel]}\n**Explicit Content Filter:** ${explicitContentString[guildContentFilter]}\n**Default Notifications:** ${defaultNotifString[guildDefaultNotifications]}\n**2FA-enabled Moderation:** ${mfaString[guildMFALevel]}\n**NSFW Level:** ${nsfwString[guildNSFWLevel]}` });
            infoEmbed.addFields({ name: `>> Server's Feature Flags`, value: `${guildFeatures.sort().join(', ').slice(0, 1023)}` });
        }
        else
        {
            infoEmbed.setDescription(`${guildPartnered ? `**Partnered!**` : ""}  ${guildVerified ? ` **Verified!**` : ""}\n${guildDescription}`);
            infoEmbed.setTimestamp(currentGuild.createdAt);
            infoEmbed.addFields({ name: `>> General Information`, value: `**Created:** <t:${Math.floor(guildCreatedTime / 1000)}:R>\n**Owner**: ${guildOwner.user.username}#${guildOwner.user.discriminator} (<@${guildOwner.id}>)\n**Boost Level:** ${tierStrings[guildBoostTier]}\n**Boost Count:** ${guildBoostCount}\n**Channels:** ${totalChannelCount} (T: ${textChannelCount}, N: ${announcementChannelCount}, V: ${voiceChannelCount}, S: ${stageChannelCount}, C: ${categoryChannelCount})\n**Emojis:** ${totalEmojiCount}\n**Stickers:** ${totalStickerCount}\n**Roles:** ${totalRoleCount}${guildVanityInviteCode !== null ? `\n**Vanity URL:** https://discord.gg/${guildVanityInviteCode}` : ""}` });
            infoEmbed.addFields({ name: `>> Security & Moderation`, value: `**Verification Level:** ${verificationString[guildVerificationLevel]}\n**Explicit Content Filter:** ${explicitContentString[guildContentFilter]}\n**Default Notifications:** ${defaultNotifString[guildDefaultNotifications]}\n**2FA-enabled Moderation:** ${mfaString[guildMFALevel]}\n**NSFW Level:** ${nsfwString[guildNSFWLevel]}` });
            infoEmbed.addFields({ name: `>> Server's Feature Flags`, value: `${guildFeatures.sort().join(', ').slice(0, 1023)}` });
        }

        return await slashCommand.editReply({ embeds: [infoEmbed], allowedMentions: { parse: [], repliedUser: false } });
    },






    /**
     * For sending Invite Link Info
     * 
     * @param {Discord.CommandInteraction} slashCommand Slash Command Interaction
     */
    async inviteInfo(slashCommand)
    {
        // Defer
        await slashCommand.deferReply();

        // Grab given code
        const inviteCode = slashCommand.options.getString("code", true);

        // Attempt to fetch invite
        /** @type {?(Discord.Invite)} */
        let fetchedInvite = null;
        try {
            fetchedInvite = await client.fetchInvite(inviteCode);
        } catch (err) {
            return await slashCommand.editReply({ content: `Sorry, but that Invite Code doesn't exist on Discord!`, allowedMentions: { parse: [], repliedUser: false } })
        }

        // Check for External Emoji Permission
        const externalEmojiPermission = this.checkEmojiPermission(slashCommand);

        // Invite Code fetched, now grab data from it and assemble into an Embed
        const inviteInfoEmbed = new Discord.MessageEmbed().setAuthor({ name: `Data for Invite Code: ${inviteCode}`, url: `https://discord.gg/${inviteCode}` });
        if ( fetchedInvite.inviter !== null ) { inviteInfoEmbed.addFields({ name: `>> Invite Creator`, value: `**Username:** ${fetchedInvite.inviter.username}\n**Bot User:** ${fetchedInvite.inviter.bot}` }); }
        if ( fetchedInvite.createdAt !== null ) { inviteInfoEmbed.addFields({ name: `>> Invite Created`, value: `<t:${Math.floor(fetchedInvite.createdAt.getTime() / 1000)}:R>` }); }
        if ( fetchedInvite.expiresAt !== null ) { inviteInfoEmbed.addFields({ name: `>> Invite Expires`, value: `<t:${Math.floor(fetchedInvite.expiresAt.getTime() / 1000)}:R>` }); }
        if ( fetchedInvite.guild !== null )
        {
            inviteInfoEmbed.setAuthor({ iconURL: fetchedInvite.guild.iconURL({ dynamic: true, format: 'png' }), name: `Data for Invite Code: ${inviteCode}`, url: `https://discord.gg/${inviteCode}` });
            if ( fetchedInvite.guild.description !== null ) { inviteInfoEmbed.setDescription(fetchedInvite.guild.description); }

            if ( externalEmojiPermission )
            {
                inviteInfoEmbed.addFields({
                    name: `>> Server's Information`,
                    value: `**Name:** ${fetchedInvite.guild.name}\n**Partnered:** ${fetchedInvite.guild.partnered ? `${EMOJI_PARTNER}` : ""} ${fetchedInvite.guild.partnered}\n**Verified:** ${fetchedInvite.guild.verified ? `${EMOJI_VERIFIED}` : ""} ${fetchedInvite.guild.verified}`
                });
            }
            else
            {
                inviteInfoEmbed.addFields({
                    name: `>> Server's Information`,
                    value: `**Name:** ${fetchedInvite.guild.name}\n**Partnered:** ${fetchedInvite.guild.partnered}\n**Verified:** ${fetchedInvite.guild.verified}`
                });
            }
            
            
            // Server Features, grab from raw API to ensure newer Features are reflected too
            let rawData = await client.api.invites(`${inviteCode}`).get();
            let rawFeatures = rawData["guild"]["features"];
            let guildFeatures = [];
            rawFeatures.forEach(feature => guildFeatures.push(festuresString[feature]));
            inviteInfoEmbed.addFields({ name: `>> Server's Feature Flags`, value: `${guildFeatures.sort().join(', ').slice(0, 1023)}` });
        }

        return await slashCommand.editReply({ embeds: [inviteInfoEmbed], allowedMentions: { parse: [], repliedUser: false } });
    },






    /**
     * For sending User Info
     * 
     * @param {Discord.CommandInteraction} slashCommand Slash Command Interaction
     */
    async userInfo(slashCommand)
    {
        // Defer
        await slashCommand.deferReply();

        /** @type {Discord.GuildMember} */
        let targetMember;
        
        const fetchedArgument = slashCommand.options.getMember("user");
        if ( !fetchedArgument || fetchedArgument === null )
        {
            // If the User Argument wasn't filled, use the Member of the Slash Command instead
            targetMember = await slashCommand.guild.members.fetch(slashCommand.user.id);
        }
        else
        {
            // Target Member, as given in the User Argument
            targetMember = await slashCommand.guild.members.fetch(fetchedArgument.id);
        }

        // Check for External Emoji Permission
        const externalEmojiPermission = this.checkEmojiPermission(slashCommand);

        // Grab the data to display in Embed
        const userEmbed = new Discord.MessageEmbed();
        userEmbed.setAuthor({ iconURL: targetMember.displayAvatarURL({ dynamic: true, format: 'png' }), name: `${targetMember.user.username}#${targetMember.user.discriminator}` });
        userEmbed.setColor(targetMember.displayHexColor);

        if ( externalEmojiPermission )
        {
            userEmbed.addFields({
                name: `>> General Member Information`,
                value: `**Display Name:** \`${targetMember.displayName}\`${slashCommand.guild.ownerId === targetMember.id ? `\n**Is Server Owner** ${EMOJI_OWNER_CROWN}` : ""}\n**Highest Role:** <@&${targetMember.roles.highest.id}>\n**Joined Server:** <t:${Math.floor(targetMember.joinedAt.getTime() / 1000)}:R>\n**Role Count:** ${EMOJI_ROLE} ${targetMember.roles.cache.size}${targetMember.pending ? `\nHas yet to pass Membership Screening` : ""}${targetMember.premiumSince != null ? `\n**Boosting Server Since:** ${EMOJI_BOOST} <t:${Math.floor(targetMember.premiumSince.getTime() / 1000)}:R>` : ""}${targetMember.isCommunicationDisabled() ? `\nIs currently Timed-out ${EMOJI_TIMEOUT}` : ""}`
            });
        }
        else
        {
            userEmbed.addFields({
                name: `>> General Member Information`,
                value: `**Display Name:** \`${targetMember.displayName}\`${slashCommand.guild.ownerId === targetMember.id ? `\n**Is Server Owner**` : ""}\n**Highest Role:** <@&${targetMember.roles.highest.id}>\n**Joined Server:** <t:${Math.floor(targetMember.joinedAt.getTime() / 1000)}:R>\n**Role Count:** ${targetMember.roles.cache.size}${targetMember.pending ? `\nHas yet to pass Membership Screening` : ""}${targetMember.premiumSince != null ? `\n**Boosting Server Since:** <t:${Math.floor(targetMember.premiumSince.getTime() / 1000)}:R>` : ""}${targetMember.isCommunicationDisabled() ? `\nIs currently Timed-out` : ""}`
            });
        }
        
        userEmbed.addFields({
            name: `>> General User Information`,
            value: `**Account Created:** <t:${Math.floor(targetMember.user.createdAt.getTime() / 1000)}:R>\n**Bot User:** ${targetMember.user.bot}${targetMember.user.system ? `\nIs Discord's official System User` : ""}`
        });
        // Now for the User's Flags
        const rawUserFlags = await targetMember.user.fetchFlags();
        const userFlagStrings = [];
        rawUserFlags.toArray().forEach(flag => userFlagStrings.push(UserFlagsToStrings[flag]));
        if ( rawUserFlags.has(1 << 20) ) { userFlagStrings.push("**Known Spammer**"); }
        
        if ( userFlagStrings.length > 0 ) { userEmbed.addFields({ name: `>> User Flags`, value: userFlagStrings.join(', ') }); }
        userEmbed.setFooter({ text: `${targetMember.id}` });

        return await slashCommand.editReply({ embeds: [userEmbed], allowedMentions: { parse: [], repliedUser: false } });
    },






    /**
     * For sending Info about this Bot
     * 
     * @param {Discord.CommandInteraction} slashCommand Slash Command Interaction
     */
    async botInfo(slashCommand)
    {
        // Defer
        await slashCommand.deferReply();

        // Fetch current Uptime
        const currentMillisecondsUptime = client.millisecondsUptime;
        // Fetch App Commands registered
        const registeredGlobalCommands = await client.application.commands.fetch();
        const registeredGuildCommands = await slashCommand.guild.commands.fetch();
        const registeredAppCommands = registeredGlobalCommands.size + registeredGuildCommands.size;

        // Construct into embed
        const botEmbed = new Discord.MessageEmbed();
        botEmbed.setAuthor({ name: `${client.user.username} Information`, iconURL: `${client.user.avatarURL({ dynamic: true, format: 'png' })}` });
        botEmbed.setDescription(`A private General Purpose Bot. Has features such as \`/headpat\`, \`/bonk\`, Self-Role Menus, and more.\n[Click here for my full feature documentation](https://github.com/TwilightZebby/MooBot#features-list)`);
        botEmbed.addFields(
            { name: `Developer`, value: `TwilightZebby#1955`, inline: true },
            { name: `Bot Version`, value: `${PACKAGE.version}`, inline: true },
            { name: `Discord.JS Version`, value: `${PACKAGE.dependencies['discord.js']}`, inline: true },

            { name: `Global Commands`, value: `${registeredGlobalCommands.size}`, inline: true },
            { name: `Server Commands`, value: `${registeredGuildCommands.size}`, inline: true },
            { name: `Total App Commands`, value: `${registeredAppCommands}`, inline: true },

            { name: `Current Uptime`, value: `${currentMillisecondsUptime === null ? `Unknown` : `<t:${Math.floor(currentMillisecondsUptime / 1000)}:R>`}`, inline: true },
            { name: `Servers`, value: `${client.guilds.cache.size}`, inline: true },
            { name: `\u200B`, value: `\u200B`, inline: true }
        );

        return await slashCommand.editReply({ embeds: [botEmbed], allowedMentions: { parse: [], repliedUser: false } });
    },






    /**
     * Checks that the Bot has the ability to use Custom External Emojis in its responses
     * 
     * @param {Discord.CommandInteraction} slashCommand Slash Command Interaction
     * 
     * @returns {Boolean}
     */
    checkEmojiPermission(slashCommand)
    {
        return slashCommand.guild.roles.everyone.permissions.has('USE_EXTERNAL_EMOJIS');
    }
};
