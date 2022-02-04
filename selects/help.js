// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const HelpCommand = require('../slashCommands/help.js');

module.exports = {
    // Select's Name, used as start of its Custom ID
    name: 'help',
    // Select's description, purely for documentation
    description: `Used for Help Pagination`,

    // Select's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 6,



    /**
     * Main function that runs this Select
     * 
     * @param {Discord.SelectMenuInteraction} selectInteraction Select Interaction
     */
    async execute(selectInteraction)
    {
        // Ensure User is original User
        const userID = selectInteraction.customId.slice(5);
        if ( selectInteraction.user.id !== userID )
        {
            return await selectInteraction.reply({ content: `Sorry, you can't use this Select Menu!`, ephemeral: true });
        }

        // Grab selected value
        const selectedValue = selectInteraction.values.shift();
        // Fetch Embed
        const updateEmbed = HelpCommand.constructEmbed(selectedValue);

        // Update default option in Select to reflect current page
        let selectPagination;
        switch(selectedValue)
        {
            case "text":
                selectPagination = new Discord.MessageActionRow().addComponents(
                    new Discord.MessageSelectMenu().setCustomId(`help_${selectInteraction.user.id}`)
                    .setMinValues(1).setMaxValues(1)
                    .setOptions([
                        { label: `Information`, value: `info`, description: `General information about the Bot`, emoji: 'ℹ' },
                        { label: `Slash Commands`, value: `slash`, description: `What I can do when slashing`, emoji: "<:MessageIconSlashCommands:785919558376488990>" },
                        { label: `Context Commands`, value: `context`, description: `Things I can do with right-clicky bois`, emoji: "<:IconIntegration:775420929567227926>" },
                        { label: `Text-based Commands`, value: `text`, description: `My commands that still use old-fashion Text Prefixes`, emoji: "<:ChannelText:779036156175188001>", default: true }
                    ])
                );
                break;

            case "context":
                selectPagination = new Discord.MessageActionRow().addComponents(
                    new Discord.MessageSelectMenu().setCustomId(`help_${selectInteraction.user.id}`)
                    .setMinValues(1).setMaxValues(1)
                    .setOptions([
                        { label: `Information`, value: `info`, description: `General information about the Bot`, emoji: 'ℹ' },
                        { label: `Slash Commands`, value: `slash`, description: `What I can do when slashing`, emoji: "<:MessageIconSlashCommands:785919558376488990>" },
                        { label: `Context Commands`, value: `context`, description: `Things I can do with right-clicky bois`, emoji: "<:IconIntegration:775420929567227926>", default: true },
                        { label: `Text-based Commands`, value: `text`, description: `My commands that still use old-fashion Text Prefixes`, emoji: "<:ChannelText:779036156175188001>" }
                    ])
                );
                break;

            case "slash":
                selectPagination = new Discord.MessageActionRow().addComponents(
                    new Discord.MessageSelectMenu().setCustomId(`help_${selectInteraction.user.id}`)
                    .setMinValues(1).setMaxValues(1)
                    .setOptions([
                        { label: `Information`, value: `info`, description: `General information about the Bot`, emoji: 'ℹ' },
                        { label: `Slash Commands`, value: `slash`, description: `What I can do when slashing`, emoji: "<:MessageIconSlashCommands:785919558376488990>", default: true },
                        { label: `Context Commands`, value: `context`, description: `Things I can do with right-clicky bois`, emoji: "<:IconIntegration:775420929567227926>" },
                        { label: `Text-based Commands`, value: `text`, description: `My commands that still use old-fashion Text Prefixes`, emoji: "<:ChannelText:779036156175188001>" }
                    ])
                );
                break;

            case "info":
            default:
                selectPagination = new Discord.MessageActionRow().addComponents(
                    new Discord.MessageSelectMenu().setCustomId(`help_${selectInteraction.user.id}`)
                    .setMinValues(1).setMaxValues(1)
                    .setOptions([
                        { label: `Information`, value: `info`, description: `General information about the Bot`, emoji: 'ℹ', default: true },
                        { label: `Slash Commands`, value: `slash`, description: `What I can do when slashing`, emoji: "<:MessageIconSlashCommands:785919558376488990>" },
                        { label: `Context Commands`, value: `context`, description: `Things I can do with right-clicky bois`, emoji: "<:IconIntegration:775420929567227926>" },
                        { label: `Text-based Commands`, value: `text`, description: `My commands that still use old-fashion Text Prefixes`, emoji: "<:ChannelText:779036156175188001>" }
                    ])
                );
                break;
        }

        // Update message with new page
        return await selectInteraction.update({ embeds: [updateEmbed], components: [selectPagination] });
    }
};
