// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const { PREFIX } = require('../config.js');
const PACKAGE = require('../package.json');

module.exports = {
    // Slash Command's Name, MUST BE LOWERCASE AND NO SPACES
    name: 'help',
    // Slash Command's description
    description: `Shows information about this bot, as well as its commands`,
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
        
        return data;
    },




    /**
     * Main function that runs this Slash Command
     * 
     * @param {Discord.CommandInteraction} slashCommand Slash Command Interaction
     */
    async execute(slashCommand)
    {

        // Ensure not used in DMs
        if ( slashCommand.channel instanceof Discord.DMChannel )
        {
            return await slashCommand.reply({ content: CONSTANTS.errorMessages.SLASH_COMMAND_GUILDS_ONLY, ephemeral: true });
        }

        // Construct initial embed
        const initialEmbed = this.constructEmbed("info");

        // Construct Select Menu for pagination
        const selectPagination = new Discord.MessageActionRow().addComponents(
            new Discord.MessageSelectMenu().setCustomId(`help_${slashCommand.user.id}`)
            .setMinValues(1).setMaxValues(1)
            .setOptions([
                { label: `Information`, value: `info`, description: `General information about the Bot`, emoji: 'ℹ', default: true },
                { label: `Slash Commands`, value: `slash`, description: `What I can do when slashing`, emoji: "<:MessageIconSlashCommands:785919558376488990>" },
                { label: `Context Commands`, value: `context`, description: `Things I can do with right-clicky bois`, emoji: "<:IconIntegration:775420929567227926>" },
                { label: `Text-based Commands`, value: `text`, description: `My commands that still use old-fashion Text Prefixes`, emoji: "<:ChannelText:779036156175188001>" }
            ])
        );

        // Send to User
        return await slashCommand.reply({ embeds: [initialEmbed], components: [selectPagination], ephemeral: true });
    },







    /**
     * Construct the Embed Page that will be displayed
     * 
     * @param {String} embedPage One of either "info", "slash", "context", "text"
     * 
     * @returns {Discord.MessageEmbed}
     */
    constructEmbed(embedPage)
    {
        switch (embedPage)
        {
            case "text":
                // Grab the commands
                let textCommandsEveryone = client.textCommands.filter(command => !command.limitation || command.limitation === "everyone").map(command => command.name); // Text CMDs everyone can use
                let textCommandsModerator = client.textCommands.filter(command => command.limitation === "moderator").map(command => command.name); // CMDs only those with Moderator Permissions and above can use
                let textCommandsAdmin = client.textCommands.filter(command => command.limitation === "admin").map(command => command.name); // CMDs only those with Admin Permission and above can use
                let textCommandsOwner = client.textCommands.filter(command => command.limitation === "owner").map(command => command.name); // CMDs only Server Owners and above can use
                let textCommandsDeveloper = client.textCommands.filter(command => command.limitation === "developer").map(command => command.name); // CMDs only the Bot's Developer can use, while hiding `shutdown` command.

                // Construct Embed
                let textCommandsEmbed = new Discord.MessageEmbed().setColor('AQUA')
                .setTitle(`Text-based Commands`)
                .setDescription(`All the Text-based Commands I have, sorted by Permission Level.\nThese are useable either by \`@mention\`ing the Bot, or through use of my \`${PREFIX}\` Prefix`);

                // ***** Populate Embed with Commands
                // Catch for edge case of no text commands
                if ( textCommandsEveryone.length < 1 && textCommandsModerator.length < 1 && textCommandsAdmin.length < 1 && textCommandsOwner.length < 1 && textCommandsDeveloper.length < 1 )
                {
                    textCommandsEmbed.addFields({ name: `\u200B`, value: `*No Text Commands found or available*` });
                }
                else
                {
                    // Only add the field if there is a command for that permission level
                    if ( textCommandsEveryone.length >= 1 ) { textCommandsEmbed.addFields({ name: `General Commands`, value: textCommandsEveryone.join(', ') }); }
                    if ( textCommandsModerator.length >= 1 ) { textCommandsEmbed.addFields({ name: `Moderator Commands`, value: textCommandsModerator.join(', ') }); }
                    if ( textCommandsAdmin.length >= 1 ) { textCommandsEmbed.addFields({ name: `Admin Commands`, value: textCommandsAdmin.join(', ') }); }
                    if ( textCommandsOwner.length >= 1 ) { textCommandsEmbed.addFields({ name: `Server Owner Commands`, value: textCommandsOwner.join(', ') }); }
                    if ( textCommandsDeveloper.length >= 1 ) { textCommandsEmbed.addFields({ name: `Developer Commands`, value: textCommandsDeveloper.join(', ') }); }
                }

                // Return Embed
                return textCommandsEmbed;

            case "context":
                // Fetch Context Commands
                let contextCommands = client.contextCommands.map(command => command.name);

                // Construct Embed
                let contextCommandEmbed = new Discord.MessageEmbed().setColor('AQUA')
                .setTitle(`Context Commands`)
                .setDescription(`All the Context Commands I have.\nThese are usable when right-clicking on a Message or User.`);

                // Edge case for no Context Commands
                if ( !contextCommands.length || contextCommands.length < 1 )
                {
                    contextCommandEmbed.addFields({ name: `\u200B`, value: `*No Context Commands found or available*` });
                }
                else
                {
                    contextCommandEmbed.addFields({ name: `\u200B`, value: contextCommands.join(', ') });
                }

                return contextCommandEmbed;

            case "slash":
                // Fetch Slash Commands
                let slashCommands = client.slashCommands.map(command => command.name);

                // Construct Embed
                let slashCommandsEmbed = new Discord.MessageEmbed().setColor('AQUA')
                .setTitle(`Slash Commands`)
                .setDescription(`All the Slash Commands I have.`);

                // Edge case for no Slash Commands
                if ( !slashCommands.length || slashCommands.length < 1 )
                {
                    slashCommandsEmbed.addFields({ name: `\u200B`, value: `*No Slash Commands found or available*` });
                }
                else
                {
                    // Populate Embed
                    slashCommandsEmbed.addFields({ name: `\u200B`, value: slashCommands.join(', ') });
                }

                return slashCommandsEmbed;

            case "info":
            default:
                // Fetch uptime, in human-readable format
                let uptime = client.uptime / 1000; // SECONDS
                let uptimeUnit = "seconds";
                
                if ( uptime >= 60 && uptime < 3600 ) { uptime /= 60; uptimeUnit = "minutes"; } // Minutes
                else if ( uptime >= 3600 && uptime < 86400 ) { uptime /= 3600; uptimeUnit = "hours"; } // Hours
                else if ( uptime >= 86400 && uptime < 2.628e+6 ) { uptime /= 86400; uptimeUnit = "days"; } // Days
                else if ( uptime >= 2.628e+6 ) { uptime /= 2.628e+6; uptimeUnit = "months"; } // Months

                return new Discord.MessageEmbed().setColor('AQUA')
                .setTitle(`General Information`)
                .setDescription(`Adds some Kawaii-bot style Slash Commands, among other things, for Dr1fterX's Discord Server. Made and developed by TwilightZebby#1955`)
                .addFields(
                    { name: `Uptime`, value: `${uptime.toFixed(1)} ${uptimeUnit}`, inline: true },
                    { name: `Bot Version`, value: `${PACKAGE.version}`, inline: true },
                    { name: `Discord.JS Version`, value: `${PACKAGE.dependencies['discord.js']}`, inline: true },
                    { name: `GitHub Repository`, value: `[github.com/TwilightZebby/ActionsBot](https://github.com/TwilightZebby/ActionsBot)` }
                );
        }
    }
};
