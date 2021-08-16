const Discord = require('discord.js');
const { client } = require('../constants.js');


module.exports = {
    name: 'start',
    description: `Start a Discord Voice Activity or Game in a Voice Channel`,
    
    // Cooldown is in seconds
    cooldown: 120,

    // Uncomment for making the command only usable in DMs with the Bot
    //    - DO NOT have both this AND "guildOnly" uncommented, only one or neither
    //dmOnly: true,

    // Uncomment for making the command only usable in Servers
    //   - DO NOT have both this AND "dmOnly" uncommented, only one or neither
    guildOnly: true,


    /**
     * Returns data to be used for registering the Slash Command
     * 
     * @returns {Discord.ApplicationCommandData} 
     */
    async registerData() {

        const data = {};
        data.name = this.name;
        data.description = this.description;
        data.type = "CHAT_INPUT"; // Slash Command
        data.options = [
            {
                type: "CHANNEL",
                name: "channel",
                description: "Voice Channel to start the Activity in",
                required: true
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
                    { name: "Betrayal.io", value: "betrayal" },
                    { name: "Fishington.io", value: "fishington" }
                ]
            }
        ];

        return data;

    },


    /**
     * Entry point that runs the slash command
     * 
     * @param {Discord.CommandInteraction} slashInteraction Slash Command Interaction
     */
    async execute(slashInteraction) {

        // Fetch arguments
        const argChannel = slashInteraction.options.getChannel("channel", true);
        const argActivity = slashInteraction.options.get("activity").value;

        
        // Check given channel
        if ( !(argChannel instanceof Discord.VoiceChannel) )
        {
            await slashInteraction.reply({ content: `That wasn't a Voice Channel!\nPlease try again with a valid Voice Channel.`, ephemeral: true });
            delete argActivity, argChannel;
            return;
        }


        // Check for Invite Permission
        if ( !argChannel.permissionsFor(client.user.id).has(Discord.Permissions.FLAGS.CREATE_INSTANT_INVITE, true) )
        {
            await slashInteraction.reply({ content: `Sorry, but it seems like I don't have the \`CREATE_INVITE\` Permission for that Voice Channel.\nThis Permission is required for this Slash Command to work!`, ephemeral: true });
            delete argChannel, argActivity;
            return;
        }


        let activitySnowflake = argActivity === "poker" ? "755827207812677713" :
            argActivity === "chess" ? "832012774040141894" :
                argActivity === "youtube" ? "755600276941176913" :
                    argActivity === "betrayal" ? "773336526917861400" :
                        "814288819477020702"; // Last one is Fishington.io


        // Create Link
        await argChannel.createInvite({
            maxAge: 600,
            targetType: 2,
            targetApplication: activitySnowflake
        })
        .then(async (invite) => {
            await slashInteraction.reply({ content: `[Click here to start the **${argActivity}** Activity inside the <#${argChannel.id}> Voice Channel](<https://discord.gg/${invite.code}>)\n\n__Notes:__\n- This will auto-join you to the Voice Channel if you aren't already inside it\n- This link will expire in 10 minutes\n- Currently this only works on Desktop and Browser Discord, not Mobile. Sorry Mobile Users!`, ephemeral: true });
            delete argChannel, argActivity;
            return;
        });

        return;

    }
}
