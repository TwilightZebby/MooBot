const Discord = require('discord.js');
const { client } = require('../constants.js');
const UtilityModule = require('../modules/utilityModule.js');

// REGEXS
const authorRegEx = new RegExp(/{author}/g);
const everyoneMentionRegex = new RegExp(/@(everyone|here)/g);
const roleRegEx = new RegExp(/{role}/g);
const receiverRegEx = new RegExp(/{receiver}/g);


module.exports = {
    name: 'present',
    description: `[ELVES] Craft a Present for someone! | [SANTA] Deliver a present for someone!`,
    category: 'seasonal',
    
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
            id: "520245254046089236",
            type: 2,
            permission: true
        },
        {
            id: "520245461383381002",
            type: 2,
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
        data.defaultPermission = false;
        data.options = [
            {
                type: "USER",
                name: "person",
                description: "The person to receive the Present",
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

        const FESTIVEMESSAGES = require('../jsonFiles/festiveMessages.json');
        let displayMessage;

        // Grab given arguments
        let personArgument = slashInteraction.options.getMember("person", true);
        let reasonArgument = slashInteraction.options.get("reason");
        let reasonOption = reasonArgument == null ? undefined : reasonArgument.value;


        // Test for self-mentions
        if ( personArgument.id === slashInteraction.user.id )
        {
            return await slashInteraction.reply({ content: `Sorry, you can't use this command on yourself!`, ephemeral: true });
        }

        // Test for mentions of someone in the same Festive House
        if ( personArgument.roles.cache.has('496038912402128918') )
        {
            return await slashInteraction.reply({ content: `Sorry, but you can't use this command on your own Winter House Members!`, ephemeral: true });
        }


        if ( slashInteraction.member.roles.cache.has('520245254046089236') )
        {
            // Elves Message
            displayMessage = FESTIVEMESSAGES[`elves`];
        }
        else
        {
            // Santa Message
            displayMessage = FESTIVEMESSAGES[`santa`];
        }


        // Construct Message
        if ( !reasonOption )
        {
            displayMessage = displayMessage.replace(authorRegEx, `${slashInteraction.member.displayName}`);
            displayMessage = displayMessage.replace(receiverRegEx, `${personArgument.displayName}`);
        }
        else
        {
            displayMessage = displayMessage.replace(authorRegEx, `${slashInteraction.member.displayName}`);
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
