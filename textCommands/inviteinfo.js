// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const fetch = require('node-fetch');

if (!globalThis.fetch) {
	globalThis.fetch = fetch;
}


// For making things readable to the User, improving UX
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
    "SEVEN_DAY_THREAD_ARCHIVE": "Seven Day Thread Archive",
    "TEXT_IN_VOICE_ENABLED": "Text in Voice Enabled",
    "THREADS_ENABLED_TESTING": "Threads Enabled Testing",
    "THREADS_ENABLED": "Threads Enabled",
    "THREAD_DEFAULT_AUTO_ARCHIVE_DURATION": "Threads Default Auto Archive Duration",
    "THREE_DAY_THREAD_ARCHIVE": "Three Day Thread Archive",
    "TICKETED_EVENTS_ENABLED": "Ticketed Events Enabled",
    "VANITY_URL": "Vanity URL",
    "VERIFIED": "Verified",
    "WELCOME_SCREEN_ENABLED": "Welcome Screen Enabled",
    "BOT_DEVELOPER_EARLY_ACCESS": "Bot Developer Early Access",
    "MEMBER_LIST_DISABLED": "Member List Disabled" // Not used at all, not since Fortnut's 2019 Blackout Event, but thought I'd add it to the list as a "just in case" thing
};


module.exports = {
    // Command Name
    name: 'inviteinfo',
    // Description of command
    description: `Shows general information about the Discord Server Invite, if it exists`,
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
    //guildOnly: true,

    // Is at least one argument required?
    requiresArguments: true,

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
        // Grab inputted Invite code
        const inviteCode = arguments.shift();

        // Attempt to fetch Invite
        /** @type {?Discord.Invite} */
        let fetchedInvite = null;
        try {
            fetchedInvite = await client.fetchInvite(inviteCode);
        } catch (err) {
            //console.error(err);
            return await message.reply({ content: `Sorry, but that Invite Code doesn't exist on Discord!`, allowedMentions: { parse: [], repliedUser: false } });
        }

        // Invite Code fetched, now grab data from it and assemble into an Embed
        const inviteInfoEmbed = new Discord.MessageEmbed().setAuthor({ name: `Data for Invite Code: ${inviteCode}` });
        if ( fetchedInvite.createdAt !== null ) { inviteInfoEmbed.addFields({ name: `Invite Created`, value: `<t:${Math.floor(fetchedInvite.createdAt.getTime() / 1000)}:R>` }); }
        if ( fetchedInvite.expiresAt !== null ) { inviteInfoEmbed.addFields({ name: `Invite Expires`, value: `<t:${Math.floor(fetchedInvite.expiresAt.getTime() / 1000)}:R>` }); }
        if ( fetchedInvite.guild !== null )
        {
            inviteInfoEmbed.setAuthor({ iconURL: fetchedInvite.guild.iconURL({ dynamic: true, format: 'png' }), name: `Data for Invite Code: ${inviteCode}` });
            if ( fetchedInvite.guild.description !== null ) { inviteInfoEmbed.setDescription(fetchedInvite.guild.description); }
            inviteInfoEmbed.addFields({
                name: `Server's Information`,
                value: `**Name:** ${fetchedInvite.guild.name}\n**Partnered:** ${fetchedInvite.guild.partnered}\n**Verified:** ${fetchedInvite.guild.verified}`
            });
            
            // Server Features, grab from raw API to ensure newer Features are reflected too
            let rawData = await client.api.invites(`${inviteCode}`).get();
            let rawFeatures = rawData["guild"]["features"];
            let guildFeatures = [];
            rawFeatures.forEach(feature => guildFeatures.push(festuresString[feature]));
            inviteInfoEmbed.addFields({ name: `Server's Feature Flags`, value: `${guildFeatures.sort().join(', ').slice(0, 1023)}` });
        }

        return await message.reply({ embeds: [inviteInfoEmbed], allowedMentions: { parse: [], repliedUser: false } });
    }
};
