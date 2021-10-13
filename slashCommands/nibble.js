const Discord = require('discord.js');
const { client } = require('../constants.js');
const UtilityModule = require('../modules/utilityModule.js');

// REGEXS
const authorRegEx = new RegExp(/{author}/g);
const everyoneMentionRegex = new RegExp(/@(everyone|here)/g);
const roleRegEx = new RegExp(/{role}/g);
const receiverRegEx = new RegExp(/{receiver}/g);


module.exports = {
    name: 'nibble',
    description: `Nibble your Victim!`,
    
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
            id: "496038245629427752",
            type: 1,
            permission: true
        },
        {
            id: "496038998184165377",
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
        data.defaultPermission = false;
        data.options = [
            {
                type: "USER",
                name: "person",
                description: "The person you want to nibble",
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

        // Test for self-mentions
        if ( personArgument.id === slashInteraction.user.id )
        {
            return await slashInteraction.reply({ content: `Sorry, you can't use this command on yourself!`, ephemeral: true });
        }

        // Find out if User is a Vampire or ZombieZ
        if ( personArgument.roles.cache.has('496038245629427752') )
        {
            // VAMPIRE

            // Test for mentions of someone in the same Spooky House
            if ( personArgument.roles.cache.has('496038245629427752') )
            {
                return await slashInteraction.reply({ content: `Sorry, but you can't use this command on your own Halloween House Members!`, ephemeral: true });
            }

            displayMessage = SPOOKYMESSAGES[`vampire`];
        }
        else if ( personArgument.roles.cache.has('496038998184165377') )
        {
            // ZOMBIEZ

            // Test for mentions of someone in the same Spooky House
            if ( personArgument.roles.cache.has('496038998184165377') )
            {
                return await slashInteraction.reply({ content: `Sorry, but you can't use this command on your own Halloween House Members!`, ephemeral: true });
            }

            displayMessage = SPOOKYMESSAGES[`zombiez`];
        }


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
