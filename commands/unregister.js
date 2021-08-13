const Discord = require('discord.js');
const { client } = require('../constants.js');


module.exports = {
    name: 'unregister',
    description: `Used for removing registered Slash Commands from the Bot`,
    
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

        // First, check that given Slash Command name is valid
        let slashCommand = client.slashCommands.get(args[0]);

        if ( !slashCommand )
        {
            return await message.reply({ content: `**${message.author.username}** sorry, but I don't recognise **${args[0]}** as a valid Slash Command that I have.`, allowedMentions: { parse: [], repliedUser: false } });
        }



        // No Guild ID given
        if ( args.length === 1 )
        {
            // Check that the given Slash Command does exist globally
            let fetchedAllSlashCommands = await client.application.commands.fetch();
            let foundSlashCommand = fetchedAllSlashCommands.find(appCommand => appCommand.name === args[0]);

            // Slash Command not found, assume not registered
            if ( !foundSlashCommand )
            {
                return await message.reply({ content: `**${message.author.username}** sorry, but it seems like the **${args[0]}** Slash Command isn't registered.`, allowedMentions: { parse: [], repliedUser: false } });
            }
            // Slash Command found
            else
            {
                // Attempt deletion of Slash Command
                await client.application.commands.delete(foundSlashCommand.id)
                .then(async () => { return await message.reply({ content: `Successfully unregistered that Slash Command!`, allowedMentions: { parse: [], repliedUser: false } }); })
                .catch(async (err) => { return await message.reply({ content: `Sorry, but an error occurred while attempting to unregister that Slash Command.`, allowedMentions: { parse: [], repliedUser: false } }); });
            }
        }
        // Guild ID was given
        else
        {
            // Make sure given guild ID is valid
            let guildID = args[1];
            let testGuild = await client.guilds.fetch(guildID)
            .catch(async (err) => { return await message.reply({ content: `Sorry, but that wasn't a valid Server ID...`, allowedMentions: { parse: [], repliedUser: false } }) });

            // Check that Slash Command does exist within that Server
            let fetchedGuildSlashCommands = await client.application.commands.fetch({ guildId: guildID });
            let foundGuildSlashCommand = fetchedGuildSlashCommands.find(appCommand => appCommand.name === args[0]);

            // Slash Command not found, assume not registered in that Server
            if ( !foundGuildSlashCommand )
            {
                return await message.reply({ content: `**${message.author.username}** sorry, but it seems like the **${args[0]}** Slash Command isn't registered in that Server.`, allowedMentions: { parse: [], repliedUser: false } });
            }
            // Slash Command found
            else
            {
                // Attempt deletion of Slash Command
                await client.application.commands.delete(foundGuildSlashCommand.id, guildID)
                .then(async () => { return await message.reply({ content: `Successfully unregistered that Slash Command for the given Server!`, allowedMentions: { parse: [], repliedUser: false } }); })
                .catch(async (err) => { return await message.reply({ content: `Sorry, but an error occurred while attempting to unregister that Slash Command for the given Server.`, allowedMentions: { parse: [], repliedUser: false } }); });
            }
        }

        return;

    }
}
