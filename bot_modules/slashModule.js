// LIBRARY IMPORTS
const Discord = require('discord.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');


/*
 * type list:
 * 1 = SubCommand
 * 2 = SubCommandGroup
 * 3 = String
 * 4 = Integer
 * 5 = Boolean
 * 6 = User
 * 7 = Channel
 * 8 = Role
 * 9 = Mentionable (User)
*/


/* 
* RESPONSE TYPES
* 1 = Pong                                 = ACK a ping
* 4 = ChannelMessageWithSource             = ACK a command, responding with a message immediately
* 5 = DeferredChannelMessageWithSource     = ACK a command to edit into a response later - shows "loading" state for User
*/

// THIS MODULE
module.exports = {

    /**
     * Registers the Slash Commands within Discord's Slash Command API
     * 
     * @param {String} command Name of a Slash Command
     * @param {String} scope Either Guild ID, or "global"
     * @param {Discord.Message} message 
     */
    async RegisterCommands(command, scope, message) {

        // Fetch Slash Command
        const fetchedSlashCommand = client.slashCommands.get(command);

        if ( !fetchedSlashCommand ) {
            return await message.channel.send(`Sorry ${message.member.displayName} - that isn't a valid Slash Command I have`);
        }
        

        if ( scope === "global" ) {

            try {
                await fetchedSlashCommand.register(true);
            } catch (err) {
                console.error(err);
                return await message.channel.send(`Sorry ${message.member.displayName} - I was unable to globally register the **${command}** Slash Command`);
            }

            return await message.channel.send(`Successfully registered the **${command}** Slash Command globally`);

        }
        else {

            try {
                await fetchedSlashCommand.register(false, scope);
            } catch (err) {
                console.error(err);
                return await message.channel.send(`Sorry ${message.member.displayName} - I was unable to register the **${command}** Slash Command to the Guild with ID ${scope}`);
            }

            return await message.channel.send(`Successfully registered the **${command}** Slash Command to the Guild with ID ${scope}`);

        }


    },











    /**
     * Removes the Slash Commands from the Slash Command API
     * 
     * @param {String} command Either name of a Slash Command, or "all"
     * @param {String} scope Either Guild ID, or "global"
     */
    async DeleteCommands(command, scope) {
        
        if ( scope === "global" ) {
            // GLOBAL SLASH COMMAND(s)

            let cachedCommands = await client.api.applications(client.user.id).commands().get();

            // SPECIFIC SLASH COMMANDS (global)

            let temp = cachedCommands.find(element => element.name === command);
            client.api.applications(client.user.id).commands(temp.id).delete();

        }
        else {
            // GUILD SLASH COMMANDS

            let cachedCommands = await client.api.applications(client.user.id).guilds(scope).commands().get();

            // SPECIFIC SLASH COMMANDS (guild)

            let temp = cachedCommands.find(element => element.name === command);
            client.api.applications(client.user.id).guilds(scope).commands(temp.id).delete();

        }

        return;

    },

















    /**
     * Responds immediately to a Slash Command Interaction
     * 
     * @param {*} eventData
     * @param {String} [message]
     * @param {Discord.MessageEmbed} [embed]
     * @param {*} [allowedMentions]
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async Callback(eventData, message, embed, allowedMentions) {
                
        let data;

        if ( message == undefined ) {

            data = {
                "type": `${type}`
            };

        }
        else {

            data = {
                "type": `4`,
                "data": {
                    "tts": false,
                    "content": message,
                    "embeds": embed == undefined ? [] : [embed],
                    "allowed_mentions": allowedMentions == undefined ? [] : allowedMentions
                }
            };

        }


        return client.api.interactions(eventData.id)[eventData.token].callback().post({data});

    },



































    /**
     * Responds immediately to a Slash Command Interaction using Ephemeral Messages (only the User can see)
     * 
     * @param {*} eventData
     * @param {String} message
     * 
     * @returns {Promise<*>} 
     */
    async CallbackEphemeral(eventData, message) {
        
        let data = {
            "type": `4`,
            "data": {
                "tts": false,
                "content": message,
                "embeds": [],
                "allowed_mentions": [],
                "flags": 64
            }
        };


        return client.api.interactions(eventData.id)[eventData.token].callback().post({data});

    },



























    /**
     * Delayed Response to a Slash Command Interaction
     * 
     * @param {*} eventData
     * @param {String} message
     * 
     * @returns {Promise<*>} 
     */
    async CallbackDelayed(eventData) {
        
        let data = {
            "type": `5`,
            "data": {
                "flags": 64
            }
        };


        return client.api.interactions(eventData.id)[eventData.token].callback().post({data});

    },



















    /**
     * Edit the original response to a Slash Command
     * 
     * @param {*} eventData
     * @param {String} [message]
     * @param {Discord.MessageEmbed} [embed]
     * @param {*} [allowedMentions]
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async CallbackEditOriginal(eventData, message, embed, allowedMentions) {

        let data;

        if ( message == undefined ) {

            data = {};

        }
        else {

            data = {
                "content": message,
                "embeds": embed == undefined ? [] : [embed],
                "allowed_mentions": allowedMentions == undefined ? [] : allowedMentions
            };

        }


        return client.api.webhooks(client.user.id)[eventData.token].messages("@original").patch({data});

    },
































    /**
     * Sends a follow-up message to a Slash Command AFTER its initial response
     * 
     * @param {*} eventData
     * @param {String} [message]
     * @param {Discord.MessageEmbed} [embed]
     * @param {*} [allowedMentions]
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async CallbackFollowUp(eventData, message, embed, allowedMentions) {

        let data;

        if ( message == undefined ) {

            data = {};

        }
        else {

            data = {
                "tts": false,
                "content": message == undefined ? " " : message,
                "embeds": embed == undefined ? [] : [embed],
                "allowed_mentions": allowedMentions == undefined ? [] : allowedMentions
            };

        }


        return client.api.webhooks(client.user.id)[eventData.token].post({data});

    },

































    /**
     * Sends an Ephemeral follow-up message to a Slash Command AFTER its initial response
     * 
     * @param {*} eventData
     * @param {String} message
     * 
     * @returns {Promise<*>} 
     */
    async CallbackEphemeralFollowUp(eventData, message) {
       
        let data = {
            "tts": false,
            "content": message,
            "embeds": [],
            "allowed_mentions": [],
            "flags": 64
        };

        return client.api.webhooks(client.user.id)[eventData.token].post({data});

    }

};
