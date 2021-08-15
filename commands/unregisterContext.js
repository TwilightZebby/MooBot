const Discord = require('discord.js');
const { client } = require('../constants.js');


module.exports = {
    name: 'unregistercontext',
    description: `Used for removing registered Context Commands from the Bot`,
    
    // Cooldown is in seconds
    cooldown: 10,

    // Limitation
    //    - "dev" for TwilightZebby only
    //    - "owner" for Server Owners and TwilightZebby
    //    - Comment out for everyone
    limitation: "owner",

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
    //minimumArgs: 2,
    //   - Maximum required arguments, can be used regardless of if "requiresArgs" is commented out or not
    maximumArgs: 2,


    /**
     * Entry point that runs the command
     * 
     * @param {Discord.Message} message Origin message that triggered this command
     * @param {Array<String>} args The given arguments of the command. Be sure to check for no arguments!
     */
    async execute(message, args) {

        // First, check that given Context Command name is valid
        let contextCommand = client.contextCommands.get(args[0]);

        if ( !contextCommand )
        {
            return await message.reply({ content: `**${message.author.username}** sorry, but I don't recognise **${args[0]}** as a valid Context Command that I have.`, allowedMentions: { parse: [], repliedUser: false } });
        }



        // No Guild ID given
        if ( args.length === 1 )
        {
            // Check that the given Context Command does exist globally
            let fetchedAllContextCommands = await client.application.commands.fetch();
            let foundContextCommand = fetchedAllContextCommands.find(appCommand => appCommand.name === args[0] && appCommand.type !== "CHAT_INPUT");

            // Context Command not found, assume not registered
            if ( !foundContextCommand )
            {
                return await message.reply({ content: `**${message.author.username}** sorry, but it seems like the **${args[0]}** Context Command isn't registered.`, allowedMentions: { parse: [], repliedUser: false } });
            }
            // Context Command found
            else
            {
                // Attempt deletion of Context Command
                await client.application.commands.delete(foundContextCommand.id)
                .then(async () => { return await message.reply({ content: `Successfully unregistered that Context Command!`, allowedMentions: { parse: [], repliedUser: false } }); })
                .catch(async (err) => { return await message.reply({ content: `Sorry, but an error occurred while attempting to unregister that Context Command.`, allowedMentions: { parse: [], repliedUser: false } }); });
            }
        }
        // Guild ID was given
        else
        {
            // Make sure given guild ID is valid
            let guildID = args[1];
            let testGuild = await client.guilds.fetch(guildID)
            .catch(async (err) => { return await message.reply({ content: `Sorry, but that wasn't a valid Server ID...`, allowedMentions: { parse: [], repliedUser: false } }) });

            // Check that Context Command does exist within that Server
            let fetchedGuildContextCommands = await client.application.commands.fetch({ guildId: guildID });
            let foundGuildContextCommand = fetchedGuildContextCommands.find(appCommand => appCommand.name === args[0] && appCommand.type !== "CHAT_INPUT");

            // Context Command not found, assume not registered in that Server
            if ( !foundGuildContextCommand )
            {
                return await message.reply({ content: `**${message.author.username}** sorry, but it seems like the **${args[0]}** Context Command isn't registered in that Server.`, allowedMentions: { parse: [], repliedUser: false } });
            }
            // Context Command found
            else
            {
                // Attempt deletion of Context Command
                await client.application.commands.delete(foundGuildContextCommand.id, guildID)
                .then(async () => { return await message.reply({ content: `Successfully unregistered that Context Command for the given Server!`, allowedMentions: { parse: [], repliedUser: false } }); })
                .catch(async (err) => { return await message.reply({ content: `Sorry, but an error occurred while attempting to unregister that Context Command for the given Server.`, allowedMentions: { parse: [], repliedUser: false } }); });
            }
        }

        return;

    }
}
