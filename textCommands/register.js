// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Command Name
    name: 'register',
    // Description of command
    description: `Used to register a Slash or Context Command to Discord's API for the Bot`,
    // Category of Command, used for Help Command
    category: 'management',

    // Alias(es) of command, if any
    // Uncomment if there will be some
    //alias: [],

    // Command Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 10,

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
    minimumArguments: 3,

    // What is the maximum required arguments?
    // Is usable/settable no matter if "requiresArguments" is un/commented
    //maximumArguments: 5,

    // Command Limitation - limits who can use this Command
    //    - "developer" for TwilightZebby only
    //    - "owner" for Guild Owners & TwilightZebby
    //    - "admin" for those with the ADMIN Guild Permission, Guild Owners, & TwilightZebby
    //    - "moderator" for those with Moderator-level Guild Permissions, Admins, Guild Owners, & TwilightZebby
    //    - "everyone" (or commented out) for everyone to use this command
    limitation: "developer",



    /**
     * Main function that runs the command
     * 
     * @param {Discord.Message} message Origin Message that triggered this command
     * @param {Array<String>} arguments The given arguments of the command. Can be empty if no arguments were passed!
     */
    async execute(message, arguments)
    {

        // Make sure first argument is specifying a valid Command type
        const argumentCommandType = arguments.shift().toLowerCase();
        if ( !["slash", "context"].includes(argumentCommandType) )
        {
            return await message.reply({ content: `That first argument wasn't either **slash** or **context**! (A type of Application Command)`, allowedMentions: { parse: [], repliedUser: false } });
        }


        // Ensure second argument is an existing Command in the Bot
        let applicationCommand;
        const argumentCommandName = arguments.shift();
        if ( argumentCommandType === "slash" )
        {
            // SLASH COMMAND
            applicationCommand = client.slashCommands.get(argumentCommandName.toLowerCase());

            if ( !applicationCommand )
            {
                return await message.reply({ content: `I do not recognise **${argumentCommandName}** as a valid Slash Command of mine.`, allowedMentions: { parse: [], repliedUser: false } });
            }
        }
        else if ( argumentCommandType === "context" )
        {
            // CONTEXT COMMAND
            applicationCommand = client.contextCommands.get(argumentCommandName.split(" ").join("_"));

            if ( !applicationCommand )
            {
                return await message.reply({ content: `I do not recognise **${argumentCommandName}** as a valid Context Command of mine.`, allowedMentions: { parse: [], repliedUser: false } });
            }
        }


        // Register based on scope
        const argumentCommandScope = arguments.shift().toLowerCase();
        if ( argumentCommandScope === "global" )
        {
            // Register Command Globally
            await client.application.commands.create(applicationCommand.registerData())
            .then(async () => { return await message.reply({ content: `Successfully globally registered the **${argumentCommandName}** ${argumentCommandType} command`, allowedMentions: { parse: [], repliedUser: false } }) })
            .catch(async (err) => { return await message.reply({ content: CONSTANTS.errorMessages.GENERIC, allowedMentions: { parse: [], repliedUser: false } }) });
        }
        else
        {
            // Register Command to a specific Guild
            // Ensure given Guild ID is one the Bot is in
            let checkGuild = await client.guilds.fetch(argumentCommandScope)
            .catch(async (err) => { return await message.reply({ content: `Either the provided Server ID wasn't valid, or its for a Server I am not in.`, allowedMentions: { parse: [], repliedUser: false } }) });

            // Register Command
            await client.application.commands.create(applicationCommand.registerData(), argumentCommandScope)
            .then(async (appCmd) => { return await message.reply({ content: `Successfully registered the **${argumentCommandName}** ${argumentCommandType} command to the **${checkGuild.name}** Server`, allowedMentions: { parse: [], repliedUser: false } }) });
        }

        return;
    }
};
