const Discord = require('discord.js');
const { client } = require('../constants.js');


module.exports = {
    name: 'register',
    description: `Used for registering Slash Commands into the Bot`,
    
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

        // Check that given Slash Command name is valid
        let slashCommand = client.slashCommands.get(args[0]);

        if ( !slashCommand )
        {
            return await message.reply({ content: `**${message.author.username}** sorry, but I don't recognise **${args[0]}** as a valid Slash Command that I have.`, allowedMentions: { parse: [], repliedUser: false } });
        }


        // No guild ID was given, register command globally
        if ( args.length === 1 )
        {
            await client.application.commands.create(await slashCommand.registerData())
            .then(async () => { return await message.reply({ content: `Successfully registered that Slash Command!`, allowedMentions: { parse: [], repliedUser: false } }) })
            .catch(async (err) => { return await message.reply({ content: `Sorry, but there was an error while attempting to register that Slash Command.`, allowedMentions: { parse: [], repliedUser: false } }); })
        }
        else
        {
            // Make sure given guild ID is valid
            let guildID = args[1];
            let testGuild = await client.guilds.fetch(guildID)
            .catch(async (err) => { return await message.reply({ content: `Sorry, but that wasn't a valid Server ID...`, allowedMentions: { parse: [], repliedUser: false } }) });

            await client.application.commands.create(await slashCommand.registerData(), guildID)
            .then(async (appCmd) => { 
                await message.reply({ content: `Successfully registered that Slash Command to the **${testGuild.name}** Server!`, allowedMentions: { parse: [], repliedUser: false } });

                // Purely for the "notathing" slash command at the moment
                if ( slashCommand.slashPermissions && ["838517664661110795", "284431454417584128"].includes(guildID) )
                {
                    switch(guildID)
                    {
                        case "838517664661110795":
                            // Catch for seasonal commands so I can test freely
                            if ( slashCommand.category === "seasonal" ) { break; }
                            let testingGuild = await client.guilds.fetch("838517664661110795");
                            await testingGuild.commands.permissions.add({ command: appCmd.id, permissions: slashCommand.slashPermissions });
                            break;

                        case "284431454417584128":
                            let dr1fterxGuild = await client.guilds.fetch("284431454417584128");
                            await dr1fterxGuild.commands.permissions.add({ command: appCmd.id, permissions: slashCommand.slashPermissions });
                            break;

                        default:
                            break;
                    }
                }

                return;
            });
        }

        return;

    }
}
