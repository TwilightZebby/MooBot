const { Message, CategoryChannel, TextChannel } = require("discord.js");
const fs = require('fs');
const { DiscordClient } = require('../constants.js');
const { ErrorLogGuildID, GifCategoryChannelID } = require('../config.js');

module.exports = {
    // Command's Name
    //     Use camelCase or full lowercase
    Name: "addgif",

    // Command's Description
    Description: `Adds the linked GIF to one of the Action Slash Commands`,

    // Command's Category
    Category: "MANAGEMENT",

    // Alias(es) of Command, if any
    Alias: [ "ag" ],

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 10,

    // Scope of Command's usage
    //     One of the following: DM, GUILD
    Scope: "GUILD",

    // Are arguments required?
    ArgumentsRequired: true,

    // Minimum amount of Arguments required
    //     REQUIRES "ArgumentsRequired" TO BE TRUE IF TO BE SET AS AN INTEGER
    MinimumArguments: 2,

    // Maximum amount of Arguments allowed
    //     Does NOT require "ArgumentsRequired" to be true, but should be more than Minimum if set
    MaximumArguments: null,

    // Command Permission Level
    //     One of the following: DEVELOPER, SERVER_OWNER, ADMIN, MODERATOR, EVERYONE
    PermissionLevel: "DEVELOPER",



    /**
     * Executes the Text Command
     * @param {Message} message Origin Message that triggered this Command
     * @param {?Array<String>} arguments Given arguments, can be empty!
     */
    async execute(message, arguments)
    {
        // Grab JSON and Arguments
        const GifJson = require('../JsonFiles/Hidden/ActionGifLinks.json');
        const ActionCommandName = arguments.shift().toLowerCase();
        const GifUrl = arguments.shift();

        // Check Action Command does exist
        if ( !GifJson[ActionCommandName] )
        {
            await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: `**${ActionCommandName}** is __not__ a valid Action Slash Command I have!` });
            return;
        }

        // Add GIF link to JSON
        GifJson[ActionCommandName].push(GifUrl);

        // Save to JSON
        fs.writeFile('./JsonFiles/Hidden/ActionGifLinks.json', JSON.stringify(GifJson, null, 4), async (err) => {
            if ( err )
            { 
                await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: `An error occurred while trying to save that new GIF link for the ${ActionCommandName} Action Command.` });
                return;
            }
        });


        // Save a copy of the GIF to the relevant Channel on private Server
        const PrivateGuild = await DiscordClient.guilds.fetch({ guild: ErrorLogGuildID });
        /** @type {CategoryChannel} */
        const GifCategory = PrivateGuild.channels.fetch(GifCategoryChannelID);
        /** @type {TextChannel} */
        const GifChannel = GifCategory.children.cache.find(channel => channel.name === ActionCommandName);
        await GifChannel.send({ content: GifUrl, allowedMentions: { parse: [] } });

        // ACK to user
        await message.reply({ allowedMentions: { parse: [] }, content: `Successfully added the linked GIF to the **${ActionCommandName}** Action Slash Command.` });
        return;
    }
}
