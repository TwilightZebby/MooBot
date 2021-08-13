const Discord = require('discord.js');
const { client } = require('../constants.js');


module.exports = {
    name: 'registercontext',
    description: `Used for registering Context Commands into the Bot`,
    
    // Cooldown is in seconds
    cooldown: 10,

    // Limitation
    //    - "dev" for TwilightZebby only
    //    - "owner" for Server Owners and TwilightZebby
    //    - Comment out for everyone
    limitation: "dev",

    // Uncomment for making the command only usable in DMs with the Bot
    //    - DO NOT have both this AND "guildOnly" uncommented, only one or neither
    //dmOnly: true,

    // Uncomment for making the command only usable in Servers
    //   - DO NOT have both this AND "dmOnly" uncommented, only one or neither
    //guildOnly: true,

    // Required Arguments?
    //   - Does the command require arguments? (at least one) Comment out if works without arguments
    requiresArgs: true,
    
    // Argument Checks
    //   - Minimum required arguments, only use if "requiresArgs" is uncommented
    //minimumArgs: 1,
    //   - Maximum required arguments, can be used regardless of if "requiresArgs" is commented out or not
    maximumArgs: 2,


    /**
     * Entry point that runs the command
     * 
     * @param {Discord.Message} message Origin message that triggered this command
     * @param {Array<String>} args The given arguments of the command. Be sure to check for no arguments!
     */
    async execute(message, args) {

        // Check that given Context Command name is valid
        let contextCommand = client.contextCommands.get(args[0]);

        if ( !contextCommand )
        {
            return await message.reply({ content: `**${message.author.username}** sorry, but I don't recognise **${args[0]}** as a valid Context Command that I have.`, allowedMentions: { parse: [], repliedUser: false } });
        }


        // No guild ID was given, register command globally
        if ( args.length === 1 )
        {
            await client.application.commands.create(await contextCommand.registerData())
            .then(async () => { return await message.reply({ content: `Successfully registered that Context Command!`, allowedMentions: { parse: [], repliedUser: false } }) })
            .catch(async (err) => { return await message.reply({ content: `Sorry, but there was an error while attempting to register that Context Command.`, allowedMentions: { parse: [], repliedUser: false } }); })
        }
        else
        {
            // Make sure given guild ID is valid
            let guildID = args[1];
            let testGuild = await client.guilds.fetch(guildID)
            .catch(async (err) => { return await message.reply({ content: `Sorry, but that wasn't a valid Server ID...`, allowedMentions: { parse: [], repliedUser: false } }) });

            await client.application.commands.create(await contextCommand.registerData(), guildID)
            .then(async () => { return await message.reply({ content: `Successfully registered that Context Command to the **${testGuild.name}** Server!`, allowedMentions: { parse: [], repliedUser: false } }) });
        }

        return;

    }
}
