// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');



module.exports = {
    // REGEXS
    everyoneRegex = new RegExp(/@(everyone|here)/g),
    roleRegex = new RegExp(/<@&(\d{17,19})>/g),
    channelRegex = new RegExp(/<#!?(\d{17,19})>/g),
    userRegex = new RegExp(/<@!?(\d{17,19})>/g),





    /**
     * Checks for [at]Everyone and [at]Here Mentions in a string
     * 
     * @param {String} string
     * @param {Boolean} [slice] True if wanting to return the string result instead of only testing the RegEx
     * 
     * @returns {Boolean|String}
     */
    TestForEveryoneMention(string, slice)
    {
        if ( !slice )
        {
            return this.everyoneRegex.test(string);
        }
        else
        {
            const testString = this.everyoneRegex.test(string);

            if ( !testString )
            {
                return false;
            }
            else
            {
                const matchedString = string.replace('@', '');
                return matchedString;
            }
        }
    },















    /**
     * Check for [at]Role Mentions
     * 
     * @param {String} string 
     * @param {Boolean} [slice] True if wanting to return the string result instead of just testing the RegEx
     * 
     * @returns {Boolean|String} 
     */
     async TestForRoleMention(string, slice)
     {  
        if ( !slice )
        {
            return this.roleRegex.test(string);
        }
        else
        {
            const testString = this.roleRegex.test(string);
            
            if ( !testString )
            {
                return false;
            }
            else
            {
                let matchedString = string.replace('<@&', '');
                matchedString = matchedString.replace('>', '');
                return matchedString;
            }
        }
    },









































    /**
     * Check for #channel Mentions (including Voice Channel Mentions)
     * 
     * @param {String} string 
     * @param {Boolean} [slice] True if wanting to return the string result instead of just testing the RegEx
     * 
     * @returns {Boolean|String} 
     */
    async TestForChannelMention(string, slice)
    {
        if ( !slice )
        {
            return this.channelRegex.test(string);
        }
        else
        {
            const testString = this.channelRegex.test(string);
            
            if ( !testString )
            {
                return false;
            }
            else
            {
                let matchedString = string.replace('<#', '');
                matchedString = matchedString.replace('!', ''); // To catch VC Mentions
                matchedString = matchedString.replace('>', '');
                return matchedString;
            }
        }
    },











































    /**
     * Check for [at]User Mentions
     * 
     * @param {String} string 
     * @param {Boolean} [slice] True if wanting to return the string result instead of just testing the RegEx
     * 
     * @returns {Boolean|String} 
     */
    async TestForUserMention(string, slice)
    {
        if ( !slice )
        {
            return this.userRegex.test(string);
        }
        else
        {
            const testString = this.userRegex.test(string);
            
            if ( !testString )
            {
                return false;
            }
            else
            {
                let matchedString = string.replace('<@', '');
                matchedString = matchedString.replace('!', ''); // To catch those User Mentions with Nicknames
                matchedString = matchedString.replace('>', '');
                return matchedString;
            }
        }
    },









































    /**
     * Check for if the given [at]User mention matches the Author's ID
     * 
     * @param {String} string 
     * @param {Discord.User} user
     * 
     * @returns {Boolean} 
     */
    async TestForSelfMention(string, user)
    {
        let matchedString = string.replace('<@', '');
        matchedString = matchedString.replace('!', '');
        matchedString = matchedString.replace('>', '');

        if ( matchedString === user.id )
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}
