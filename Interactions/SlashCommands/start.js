const Discord = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");
const LocalizedStrings = require("../../JsonFiles/stringMessages.json");

// Activity IDs
const ActivityIds = new Discord.Collection().set("poker", "755827207812677713")
.set("chess", "832012774040141894").set("sketch", "902271654783242291")
.set("youtube", "880218394199220334").set("letter", "879863686565621790")
.set("snacks", "879863976006127627").set("spell", "852509694341283871")
.set("checkers", "832013003968348200").set("blazing", "832025144389533716")
.set("putt", "945737671223947305").set("land", "903769130790969345")
.set("bobble", "947957217959759964").set("ask", "976052223358406656")
.set("meme", "950505761862189096");

// Boost Requirements for Activities
const NoBoostRequirement = [ "youtube", "sketch", "snacks", "ask", "meme" ];
const T1BoostRequirement = [ "poker", "chess", "letter", "spell", "checkers", "blazing", "putt", "land", "bobble" ];
const T2BoostRequirement = [  ];
const T3BoostRequirement = [  ];

// iOS supported Activities
const iosActivities = [ "land", "spell", "letter", "chess", "blazing", "bobble" ];

// For mapping values back into Activity Names
const ValueToName = {
    "youtube": "YouTube Together",
    "sketch": "Sketch Heads",
    "snacks": "Word Snacks",
    "poker": "Poker Night",
    "chess": "Chess in the Park",
    "letter": "Letter League",
    "spell": "SpellCast",
    "checkers": "Checkers in the Park",
    "blazing": "Blazing 8s",
    "putt": "Putt Party",
    "land": "Land-io",
    "bobble": "Bobble League",
    "ask": "Ask Away",
    "meme": "Know What I Meme"
};

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "start",

    // Command's Description
    Description: `Starts a Discord Activity or Game in a Voice Channel`,

    // Command's Category
    Category: "GENERAL",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 120,

    // Cooldowns for specific subcommands and/or subcommand-groups
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandCooldown: {
        "example": 3
    },

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "GUILD",

    // Scope of specific Subcommands Usage
    //     One of the following: DM, GUILD, ALL
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandScope: {
        "example": "GUILD"
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
        Data.defaultMemberPermissions = Discord.PermissionFlagsBits.UseEmbeddedActivities;
        Data.options = [
            {
                type: Discord.ApplicationCommandOptionType.Channel,
                name: "channel",
                description: "Voice Channel to start the Activity in",
                channel_types: [ Discord.ChannelType.GuildVoice ],
                required: true
            },
            {
                type: Discord.ApplicationCommandOptionType.String,
                name: "activity",
                description: "Name of Activity to start",
                required: true,
                choices: [
                    { name: "YouTube Together", value: "youtube" }, // No Boost Requirement
                    { name: "Sketch Heads", value: "sketch" }, // No Boost Requirement
                    { name: "Word Snacks", value: "snacks" }, // No Boost Requirement
                    { name: "Ask Away", value: "ask" }, // No Boost Requirement
                    { name: "Know What I Meme", value: "meme" }, // No Boost Requirement
                    { name: "Poker Night", value: "poker" }, // Boost T1
                    { name: "Chess in the Park", value: "chess" }, // Boost T1
                    { name: "Letter League", value: "letter" }, // Boost T1
                    { name: "SpellCast", value: "spell" }, // Boost T1
                    { name: "Checkers in the Park", value: "checkers" }, // Boost T1
                    { name: "Blazing 8s", value: "blazing" }, // Boost T1
                    { name: "Putt Party", value: "putt" }, // Boost T1
                    { name: "Land-io", value: "land" }, // Boost T1
                    { name: "Bobble League", value: "bobble" } // Boost T1
                ]
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
        // Fetch Options
        const ChannelOption = slashCommand.options.getChannel("channel", true);
        const ActivityOption = slashCommand.options.get("activity", true).value;

        // Edge case check on Channel type
        if ( !(ChannelOption instanceof Discord.VoiceChannel) )
        {
            return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale].START_COMMAND_NOT_A_VOICE_CHANNEL });
        }

        // Check for Invite Permission
        if ( !ChannelOption.permissionsFor(DiscordClient.user.id).has(Discord.PermissionFlagsBits.CreateInstantInvite, true) )
        {
            return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale].START_COMMAND_NO_INVITE_PERMISSION.replace("{{CHANNEL_NAME}}", ChannelOption.name) });
        }

        // Check Boost Requirement
        const CurrentServerBoostTier = slashCommand.guild.premiumTier === Discord.GuildPremiumTier.None ? 0 : slashCommand.guild.premiumTier === Discord.GuildPremiumTier.Tier1 ? 1 : slashCommand.guild.premiumTier === Discord.GuildPremiumTier.Tier2 ? 2 : 3;
        if ( CurrentServerBoostTier === 0 && !NoBoostRequirement.includes(ActivityOption) )
        {
            return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale].START_COMMAND_REQUIRES_BOOST.replace("{{ACTIVITY_NAME}}", ValueToName[ActivityOption]).replace("{{BOOST_TIER}}", "1") });
        }
        else if ( CurrentServerBoostTier <= 1 && !NoBoostRequirement.includes(ActivityOption) && !T1BoostRequirement.includes(ActivityOption) )
        {
            return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale].START_COMMAND_REQUIRES_BOOST.replace("{{ACTIVITY_NAME}}", ValueToName[ActivityOption]).replace("{{BOOST_TIER}}", "2") });
        }
        else if ( CurrentServerBoostTier <= 2 && !NoBoostRequirement.includes(ActivityOption) && !T1BoostRequirement.includes(ActivityOption) && !T2BoostRequirement.includes(ActivityOption) )
        {
            return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale].START_COMMAND_REQUIRES_BOOST.replace("{{ACTIVITY_NAME}}", ValueToName[ActivityOption]).replace("{{BOOST_TIER}}", "3") });
        }


        // Grab Activity ID
        const ActivitySnowflakeId = ActivityIds.get(ActivityOption);

        // Construct correct version of the message
        let successMessage = iosActivities.includes(ActivityOption) ? LocalizedStrings[slashCommand.locale].START_COMMAND_ACTIVITY_INVITE_IOS_SUPPORT : LocalizedStrings[slashCommand.locale].START_COMMAND_ACTIVITY_INVITE_NO_MOBILE_SUPPORT;
        successMessage = successMessage.replace("{{ACTIVITY_NAME}}", ValueToName[ActivityOption]).replace("{{CHANNEL_ID}}", ChannelOption.id)

        // Create Invite Link to Activity in Voice Channel
        await ChannelOption.createInvite({
            maxAge: 600, // Ten minutes
            maxUses: 1, // Only usable once
            targetType: Discord.InviteTargetType.EmbeddedApplication, // Voice Activities
            targetApplication: ActivitySnowflakeId,
            reason: `/start Command used to start the ${ValueToName[ActivityOption]} Voice Activity`
        })
        .then(async invite => {
            return await slashCommand.reply({ ephemeral: true, content: successMessage.replace("{{INVITE_CODE}}", invite.code) });
        });
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
