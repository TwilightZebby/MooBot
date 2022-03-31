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
.set("putt", "945737671223947305").set("land", "903769130790969345");


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
                    { name: "Poker Night", value: "poker" },
                    { name: "Chess in the Park", value: "chess" },
                    { name: "YouTube Together", value: "youtube" },
                    { name: "Sketch Heads", value: "sketch" },
                    { name: "Letter League", value: "letter" },
                    { name: "Word Snacks", value: "snacks" },
                    { name: "SpellCast", value: "spell" },
                    { name: "Checkers in the Park", value: "checkers" },
                    { name: "Blazing 8s", value: "blazing" },
                    { name: "Putt Party", value: "putt" },
                    { name: "Land-io", value: "land" }
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
            await slashCommand.reply({ content: `That wasn't a valid Voice Channel!\nPlease try again, selecting a Voice Channel (not Stage, Text, Announcement, Store, Thread, Category, Directory, or DM Channel)`, ephemeral: true });
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


        // Pick Activity ID based off selected Activity
        let activitySnowflake = ActivityIDs.get(argumentActivity);

        // Create Invite Link to Activity in Voice Channel
        await argumentChannel.createInvite({
            maxAge: 600, // Ten Minutes
            targetType: 2,
            targetApplication: activitySnowflake
        })
        // Send User the link
        .then(async (invite) => {
            await slashCommand.reply({ content: `[Click here to start the **${argumentActivity}** Activity inside the <#${argumentChannel.id}> Voice Channel](<https://discord.gg/${invite.code}>)\n\n__Notes:__\n- This will auto-join you to the Voice Channel if you aren't already inside it\n- This link will expire in 10 minutes\n- Currently this only works on Desktop and Browser Discord, not Mobile. Sorry Mobile Users!`, ephemeral: true });
            delete argumentChannel, argumentActivity;
            return;
        });

        return;
    }
};
