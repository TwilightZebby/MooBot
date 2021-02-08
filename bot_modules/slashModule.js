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
*/

// THIS MODULE
module.exports = {

    /**
     * Registers the bonk Slash Command
     * 
     * @param {Boolean} isGlobal True if Global, False if Guild
     * @param {String} [guildID] Provide Guild ID if Guild Command, otherwise ignore
     */
    async RegisterBonk(isGlobal, guildID) {

        // Data
        const data = {};
        data.name = "bonk";
        data.description = "Bonk somebody";
        data.options = new Array();

        const option = {};
        option.name = "person";
        option.description = "Either a name or an @mention";
        option.type = 3; // String
        option.required = true;

        data.options.push(option);


        const secondOption = {};
        secondOption.name = "GIF";
        secondOption.description = "True to use a GIF, otherwise leave blank";
        secondOption.type = 5; // Boolean
        secondOption.required = false;

        data.options.push(secondOption);

        if ( isGlobal ) {
            client.api.applications(client.user.id).commands().post({data});
        }
        else {
            client.api.applications(client.user.id).guilds(guildID).commands().post({data});
        }

        return;

    },


























    /**
     * Registers the hug Slash Command
     * 
     * @param {Boolean} isGlobal True if Global, False if Guild
     * @param {String} [guildID] Provide Guild ID if Guild Command, otherwise ignore
     */
    async RegisterHug(isGlobal, guildID) {

        // Data
        const data = {};
        data.name = "hug";
        data.description = "Give someone a cuddle";
        data.options = new Array();

        const option = {};
        option.name = "person";
        option.description = "Either a name or an @mention";
        option.type = 3; // String
        option.required = true;

        data.options.push(option);


        const secondOption = {};
        secondOption.name = "GIF";
        secondOption.description = "True to use a GIF, otherwise leave blank";
        secondOption.type = 5; // Boolean
        secondOption.required = false;

        data.options.push(secondOption);

        if ( isGlobal ) {
            client.api.applications(client.user.id).commands().post({data});
        }
        else {
            client.api.applications(client.user.id).guilds(guildID).commands().post({data});
        }

        return;

    },































    /**
     * Registers the poke Slash Command
     * 
     * @param {Boolean} isGlobal True if Global, False if Guild
     * @param {String} [guildID] Provide Guild ID if Guild Command, otherwise ignore
     */
    async RegisterHeadpat(isGlobal, guildID) {

        // Data
        const data = {};
        data.name = "headpat";
        data.description = "Comfort someone with a headpat";
        data.options = new Array();

        const option = {};
        option.name = "person";
        option.description = "Either a name or an @mention";
        option.type = 3; // String
        option.required = true;

        data.options.push(option);


        const secondOption = {};
        secondOption.name = "GIF";
        secondOption.description = "True to use a GIF, otherwise leave blank";
        secondOption.type = 5; // Boolean
        secondOption.required = false;

        data.options.push(secondOption);

        if ( isGlobal ) {
            client.api.applications(client.user.id).commands().post({data});
        }
        else {
            client.api.applications(client.user.id).guilds(guildID).commands().post({data});
        }

        return;

    },










































    /**
     * Registers the sleep Slash Command
     * 
     * @param {Boolean} isGlobal True if Global, False if Guild
     * @param {String} [guildID] Provide Guild ID if Guild Command, otherwise ignore
     */
    async RegisterSleep(isGlobal, guildID) {

        // Data
        const data = {};
        data.name = "sleep";
        data.description = "Tell someone to go sleep!";
        data.options = new Array();

        const option = {};
        option.name = "person";
        option.description = "Either a name or an @mention";
        option.type = 3; // String
        option.required = true;

        data.options.push(option);


        const secondOption = {};
        secondOption.name = "GIF";
        secondOption.description = "True to use a GIF, otherwise leave blank";
        secondOption.type = 5; // Boolean
        secondOption.required = false;

        data.options.push(secondOption);

        if ( isGlobal ) {
            client.api.applications(client.user.id).commands().post({data});
        }
        else {
            client.api.applications(client.user.id).guilds(guildID).commands().post({data});
        }

        return;

    },






































    /**
     * Registers the boop Slash Command
     * 
     * @param {Boolean} isGlobal True if Global, False if Guild
     * @param {String} [guildID] Provide Guild ID if Guild Command, otherwise ignore
     */
    async RegisterBoop(isGlobal, guildID) {

        // Data
        const data = {};
        data.name = "boop";
        data.description = "Boop someone!";
        data.options = new Array();

        const option = {};
        option.name = "person";
        option.description = "Either a name or an @mention";
        option.type = 3; // String
        option.required = true;

        data.options.push(option);


        const secondOption = {};
        secondOption.name = "GIF";
        secondOption.description = "True to use a GIF, otherwise leave blank";
        secondOption.type = 5; // Boolean
        secondOption.required = false;

        data.options.push(secondOption);

        if ( isGlobal ) {
            client.api.applications(client.user.id).commands().post({data});
        }
        else {
            client.api.applications(client.user.id).guilds(guildID).commands().post({data});
        }

        return;

    },



































    /**
     * Registers the kiss Slash Command
     * 
     * @param {Boolean} isGlobal True if Global, False if Guild
     * @param {String} [guildID] Provide Guild ID if Guild Command, otherwise ignore
     */
    async RegisterKiss(isGlobal, guildID) {

        // Data
        const data = {};
        data.name = "kiss";
        data.description = "Slap a kiss on someone *blushes*";
        data.options = new Array();

        const option = {};
        option.name = "person";
        option.description = "Either a name or an @mention";
        option.type = 3; // String
        option.required = true;

        data.options.push(option);


        const secondOption = {};
        secondOption.name = "GIF";
        secondOption.description = "True to use a GIF, otherwise leave blank";
        secondOption.type = 5; // Boolean
        secondOption.required = false;

        data.options.push(secondOption);

        if ( isGlobal ) {
            client.api.applications(client.user.id).commands().post({data});
        }
        else {
            client.api.applications(client.user.id).guilds(guildID).commands().post({data});
        }

        return;

    },






































    /**
     * Registers the Slash Commands within Discord's Slash Command API
     * 
     * @param {String} command Either name of a Slash Command, or "all"
     * @param {String} scope Either Guild ID, or "global"
     */
    async RegisterCommands(command, scope) {

        if ( scope === "global" ) {
            // GLOBAL SLASH COMMAND(s)

            if ( command === "all" ) {
                // ALL SLASH COMMANDS (global)

                await this.RegisterPing(true);
                await this.RegisterBonk(true);
                await this.RegisterHug(true);
                await this.RegisterHeadpat(true);
                await this.RegisterSleep(true);
                await this.RegisterBoop(true);
                await this.RegisterKiss(true);

            }
            else {
                // SPECIFIC SLASH COMMANDS (global)

                switch (command) {
    
                    case "bonk":
                        return await this.RegisterBonk(true);
    
                    case "hug":
                        return await this.RegisterHug(true);
    
                    case "headpat":
                        return await this.RegisterHeadpat(true);
    
                    case "sleep":
                        return await this.RegisterSleep(true);
    
                    case "boop":
                        return await this.RegisterBoop(true);
    
                    case "kiss":
                        return await this.RegisterKiss(true);
    
                    default:
                        break;
    
                }

            }

        }
        else {
            // GUILD SLASH COMMANDS

            if ( command === "all" ) {
                // ALL SLASH COMMANDS (guild)

                await this.RegisterBonk(false, scope);
                await this.RegisterHug(false, scope);
                await this.RegisterHeadpat(false, scope);
                await this.RegisterSleep(false, scope);
                await this.RegisterBoop(false, scope);
                await this.RegisterKiss(false, scope);

            }
            else {
                // SPECIFIC SLASH COMMANDS (guild)

                switch (command) {
    
                    case "bonk":
                        return await this.RegisterBonk(false, scope);
    
                    case "hug":
                        return await this.RegisterHug(false, scope);
    
                    case "headpat":
                        return await this.RegisterHeadpat(false, scope);
    
                    case "sleep":
                        return await this.RegisterSleep(false, scope);
    
                    case "boop":
                        return await this.RegisterBoop(false, scope);
    
                    case "kiss":
                        return await this.RegisterKiss(false, scope);
    
                    default:
                        break;
    
                }

            }

        }

        return;

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

            if ( command === "all" ) {
                // ALL SLASH COMMANDS (global)

                for (let i = 0; i < cachedCommands.length; i++) {
                    client.api.applications(client.user.id).commands(cachedCommands[i].id).delete();
                }

            }
            else {
                // SPECIFIC SLASH COMMANDS (global)

                let temp = cachedCommands.find(element => element.name === command);
                client.api.applications(client.user.id).commands(temp.id).delete();

            }

        }
        else {
            // GUILD SLASH COMMANDS

            let cachedCommands = await client.api.applications(client.user.id).guilds(scope).commands().get();

            if ( command === "all" ) {
                // ALL SLASH COMMANDS (guild)

                for (let i = 0; i < cachedCommands.length; i++) {
                    client.api.applications(client.user.id).guilds(scope).commands(cachedCommands[i].id).delete();
                }

            }
            else {
                // SPECIFIC SLASH COMMANDS (guild)

                let temp = cachedCommands.find(element => element.name === command);
                client.api.applications(client.user.id).guilds(scope).commands(temp.id).delete();

            }

        }

        return;

    },

















    /**
     * Responds to a Slash Command Interaction
     * 
     * @param {*} eventData
     * @param {Number} type Response Type. 3 = w/ MSG Eat Input; 4 = w/ MSG show Input; 5 = w/out MSG show Input
     * @param {String} [message]
     * @param {Discord.MessageEmbed} [embed]
     * @param {*} [allowedMentions]
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async Callback(eventData, type, message, embed, allowedMentions) {
        /* 
        * RESPONSE TYPES
        * 1 = Pong                        = ACK a ping
        * 2 = ACK                         = ACK a command without sending a message, eating the Input
        * 3 = ChannelMessage              = ACK a command, respond with a message, eat Input
        * 4 = ChannelMessageWithSource    = ACK a command, respond with a message, show Input
        * 5 = ACKWithSource               = ACK a command without sending message, show Input
        */

        
        let data;

        if ( message == undefined ) {

            data = {
                "type": `${type}`
            };

        }
        else {

            data = {
                "type": `${type}`,
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
     * Responds to a Slash Command Interaction using Ephemeral Messages (only the User can see)
     * 
     * @param {*} eventData
     * @param {Number} type Response Type. 3 = w/ MSG Eat Input; 4 = w/ MSG show Input; 5 = w/out MSG show Input
     * @param {String} message
     * 
     * @returns {Promise<*>} 
     */
    async CallbackEphemeral(eventData, type, message) {
        /* 
        * RESPONSE TYPES
        * 1 = Pong                        = ACK a ping
        * 2 = ACK                         = ACK a command without sending a message, eating the Input
        * 3 = ChannelMessage              = ACK a command, respond with a message, eat Input
        * 4 = ChannelMessageWithSource    = ACK a command, respond with a message, show Input
        * 5 = ACKWithSource               = ACK a command without sending message, show Input
        */


        let data = {
            "type": `${type}`,
            "data": {
                "tts": false,
                "content": message,
                "embeds": [],
                "allowed_mentions": [],
                "flags": 64
            }
        };


        return client.api.interactions(eventData.id)[eventData.token].callback().post({data});

    }

};
