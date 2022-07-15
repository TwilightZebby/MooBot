// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');


// Activity IDs
const ActivityIDs = new Discord.Collection().set("poker", "755827207812677713")
.set("chess", "832012774040141894").set("sketch", "902271654783242291")
.set("youtube", "880218394199220334").set("letter", "879863686565621790")
.set("snacks", "879863976006127627").set("spell", "852509694341283871")
.set("checkers", "832013003968348200").set("blazing", "832025144389533716")
.set("putt", "945737671223947305").set("land", "903769130790969345")
.set("bobble", "947957217959759964").set("ask", "976052223358406656");

// Boost Requirements for Activities
const NoBoostRequirement = [ "youtube", "sketch", "snacks", "ask" ];
const T1BoostRequirement = [ "poker", "chess", "letter", "spell", "checkers", "blazing", "putt", "land", "bobble" ];
const T2BoostRequirement = [  ];
const T3BoostRequirement = [  ];

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
    "ask": "Ask Away"
};


module.exports = {
    // Slash Command's Name, MUST BE LOWERCASE AND NO SPACES
    name: 'start',
    // Slash Command's description
    description: `Starts a Discord Activity or Game in a Voice Channel`,
    // Category of Slash Command, used for Help (text) Command
    category: 'general',

    // Slash Command's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 120,


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
                type: "CHANNEL",
                name: "channel",
                description: "Voice Channel to start the Activity in",
                required: true,
                channelTypes: [ 2 ]
            },
            {
                type: "STRING",
                name: "activity",
                description: "Name of the Activity to start",
                required: true,
                choices: [
                    { name: "YouTube Together", value: "youtube" }, // No Boost Requirement
                    { name: "Sketch Heads", value: "sketch" }, // No Boost Requirement
                    { name: "Word Snacks", value: "snacks" }, // No Boost Requirement
                    { name: "Ask Away", value: "ask" }, // No Boost Requirement
                    { name: "Poker Night", value: "poker" }, // Boost T1
                    { name: "Chess in the Park", value: "chess" }, // Boost T1
                    { name: "Letter League", value: "letter" }, // Boost T1
                    { name: "SpellCast", value: "spell" }, // Boost T1
                    { name: "Checkers in the Park", value: "checkers" }, // Boost T1
                    { name: "Blazing 8s", value: "blazing" }, // Boost T1
                    { name: "Putt Party", value: "putt" }, // Boost T1
                    { name: "Land-io", value: "land" }, // Boost T1
                    { name: "Bobble League", value: "bobble" }, // Boost T1
                ]
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
        // Ensure no DM usage
        if ( slashCommand.channel instanceof Discord.DMChannel )
        {
            return await slashCommand.reply({ content: CONSTANTS.errorMessages.SLASH_COMMAND_GUILDS_ONLY, ephemeral: true });
        }


        // Fetch arguments
        const argumentChannel = slashCommand.options.getChannel("channel", true);
        const argumentActivity = slashCommand.options.get("activity").value;


        // Check given Channel, as an edge case
        if ( !(argumentChannel instanceof Discord.VoiceChannel) )
        {
            await slashCommand.reply({ content: `That wasn't a valid Voice Channel!\nPlease try again, selecting a Voice Channel (not Stage, Text, Announcement, Thread, Category, Directory, or DM Channel)`, ephemeral: true });
            delete argumentChannel, argumentActivity;
            return;
        }


        // Check for Invite Permission
        if ( !argumentChannel.permissionsFor(client.user.id).has(Discord.Permissions.FLAGS.CREATE_INSTANT_INVITE, true) )
        {
            await slashCommand.reply({ content: `Sorry, but I don't seem to have the \`CREATE_INVITE\` Permission for the **${argumentChannel.name}** Voice Channel.\nThis Permission is required for this Slash Command to work!`, ephemeral: true });
            delete argumentChannel, argumentActivity;
            return;
        }


        // Check Boost Requirement ;-;
        const serverCurrentBoost = slashCommand.guild.premiumTier === "NONE" ? 0 : slashCommand.guild.premiumTier === "TIER_1" ? 1 : slashCommand.guild.premiumTier === "TIER_2" ? 2 : 3;
        if ( serverCurrentBoost === 0 && !NoBoostRequirement.includes(argumentActivity) )
        {
            return await slashCommand.reply({ content: `Sorry, but Discord has set the **${ValueToName[argumentActivity]}** Activity to require a minimum of at least Server Boost Tier 1, yet this Server is currently not at any Server Boost Tier! ;-;`, ephemeral: true });
        }
        else if ( serverCurrentBoost <= 1 && !NoBoostRequirement.includes(argumentActivity) && !T1BoostRequirement.includes(argumentActivity) )
        {
            return await slashCommand.reply({ content: `Sorry, but Discord has set the **${ValueToName[argumentActivity]}** Activity to require a minimum of at least Server Boost Tier 2, yet this Server is currently at Server Boost Tier ${serverCurrentBoost} ;-;`, ephemeral: true });
        }
        else if ( serverCurrentBoost <= 2 && !NoBoostRequirement.includes(argumentActivity) && !T1BoostRequirement.includes(argumentActivity) && !T2BoostRequirement.includes(argumentActivity) )
        {
            return await slashCommand.reply({ content: `Sorry, but Discord has set the **${ValueToName[argumentActivity]}** Activity to require a minimum of at least Server Boost Tier 3, yet this Server is currently at Server Boost Tier ${serverCurrentBoost} ;-;`, ephemeral: true });
        }


        // Pick Activity ID based off selected Activity
        let activitySnowflake = ActivityIDs.get(argumentActivity);

        // Create Invite Link to Activity in Voice Channel
        await argumentChannel.createInvite({
            maxAge: 600, // Ten Minutes
            maxUses: 1, // Only usable once
            targetType: 2,
            targetApplication: activitySnowflake,
            reason: `/start Command, for Voice Activities`
        })
        // Send User the link
        .then(async (invite) => {
            await slashCommand.reply({ content: `[Click here to start the **${ValueToName[argumentActivity]}** Activity inside the <#${argumentChannel.id}> Voice Channel](<https://discord.gg/${invite.code}>)\n\n__Notes:__\n- This will auto-join you to the Voice Channel if you aren't already inside it\n- This link will expire in 10 minutes, and is only usable once per use of this command\n- Currently this only works on Desktop and Browser Discord, not Mobile. Sorry Mobile Users!`, ephemeral: true });
            delete argumentChannel, argumentActivity;
            return;
        });

        return;
    }
};
