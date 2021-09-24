const Discord = require('discord.js');
const { client } = require('../constants.js');
const UtilityModule = require('../modules/utilityModule.js');

// REGEXS
const authorRegEx = new RegExp(/{author}/g);
const everyoneMentionRegex = new RegExp(/@(everyone|here)/g);
const roleRegEx = new RegExp(/{role}/g);
const receiverRegEx = new RegExp(/{receiver}/g);


module.exports = {
    name: 'nightmare',
    description: `Slip into the dreams of sleeping fools and doom them!`,
    
    // Cooldown is in seconds
    cooldown: 5,

    // Uncomment for making the command only usable in DMs with the Bot
    //    - DO NOT have both this AND "guildOnly" uncommented, only one or neither
    //dmOnly: true,

    // Uncomment for making the command only usable in Servers
    //   - DO NOT have both this AND "dmOnly" uncommented, only one or neither
    guildOnly: true,


    // Slash Command Permission object
    slashPermissions: [
        {
            id: "136391162876395520",
            type: 2,
            permission: true
        },
        {
            id: "627869563219869696",
            type: 1,
            permission: true
        }
    ],


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
                type: "USER",
                name: "person",
                description: "The person you want to give nightmares",
                required: true
            },
            {
                type: "STRING",
                name: "reason",
                description: "A custom message to add onto the end of the built-in messages",
                required: false
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

        const SPOOKYMESSAGES = require('../jsonFiles/spoopyMessages.json');
        let displayMessage;

        // Grab given arguments
        let personArgument = slashInteraction.options.getMember("person", true);
        let reasonArgument = slashInteraction.options.get("reason");
        let reasonOption = reasonArgument == null ? undefined : reasonArgument.value;

        displayMessage = SPOOKYMESSAGES[`phantoms`];


        // Construct Message
        if ( !reasonOption )
        {
            displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
            displayMessage = displayMessage.replace(receiverRegEx, `${personArgument.displayName}`);
        }
        else
        {
            displayMessage = displayMessage.replace(authorRegEx, `${slashCommand.member.displayName}`);
            displayMessage = displayMessage.replace(receiverRegEx, `${personArgument.displayName}`);
            displayMessage += ` ${reasonOption}`;

            // Check reason argument for sneaky mentions
            if ( await UtilityModule.TestForEveryoneMention(reasonOption) )
            {
                displayMessage = displayMessage.replace(everyoneMentionRegex, `everyone`);
            }

            if ( await UtilityModule.TestForRoleMention(reasonOption) )
            {
                return await slashInteraction.reply({ content: `Sorry, but @role mentions aren't allowed in custom reasons/messages!`, ephemeral: true });
            }
        }

        return slashInteraction.reply({ content: displayMessage, allowedMentions: { parse: [] } });

    }
}
