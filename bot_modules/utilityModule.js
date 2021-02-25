// LIBRARY IMPORTS
const Discord = require('discord.js');

// MODULE IMPORTS
//const ErrorModule = require('../bot_modules/errorLogger.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');



// THIS MODULE
module.exports = {
    /**
     * Check for [at]everyone and/or [at]here mentions
     * 
     * @param {String} string 
     * @param {Boolean} [slice] True if wanting to return the string result instead of just testing the RegEx
     * 
     * @returns {Promise<Boolean|String>} 
     */
    async TestForEveryoneMention(string, slice) {

        const everyoneRegex = new RegExp(/@(everyone|here)/g);
        
        if ( !slice ) {
            return everyoneRegex.test(string);
        }
        else {

            const testString = everyoneRegex.test(string);

            if ( !testString ) {
                return false;
            }
            else {
                const matchedString = string.replace('@', '');
                return matchedString;
            }

        }

        // END OF MODULE
    },





































    /**
     * Check for [at]role Mentions
     * 
     * @param {String} string 
     * @param {Boolean} [slice] True if wanting to return the string result instead of just testing the RegEx
     * 
     * @returns {Promise<Boolean|String>} 
     */
    async TestForRoleMention(string, slice) {

        const roleRegex = new RegExp(/<@&(\d{17,19})>/g);
        
        if ( !slice ) {
            return roleRegex.test(string);
        }
        else {

            const testString = roleRegex.test(string);
            
            if ( !testString ) {
                return false;
            }
            else {
                let matchedString = string.replace('<@&', '');
                matchedString = matchedString.replace('>', '');
                return matchedString;
            }

        }

        // END OF MODULE
    },









































    /**
     * Check for \#channel Mentions
     * 
     * @param {String} string 
     * @param {Boolean} [slice] True if wanting to return the string result instead of just testing the RegEx
     * 
     * @returns {Promise<Boolean|String>} 
     */
    async TestForChannelMention(string, slice) {

        const channelRegex = new RegExp(/<#(\d{17,19})>/g);
        
        if ( !slice ) {
            return channelRegex.test(string);
        }
        else {

            const testString = channelRegex.test(string);
            
            if ( !testString ) {
                return false;
            }
            else {
                let matchedString = string.replace('<#', '');
                matchedString = matchedString.replace('>', '');
                return matchedString;
            }

        }

        // END OF MODULE
    },











































    /**
     * Check for [at]user Mentions
     * 
     * @param {String} string 
     * @param {Boolean} [slice] True if wanting to return the string result instead of just testing the RegEx
     * 
     * @returns {Promise<Boolean|String>} 
     */
    async TestForUserMention(string, slice) {

        const userRegex = new RegExp(/<@!?(\d{17,19})>/g);
        
        if ( !slice ) {
            return userRegex.test(string);
        }
        else {

            const testString = userRegex.test(string);
            
            if ( !testString ) {
                return false;
            }
            else {
                let matchedString = string.replace('<@', '');
                matchedString = matchedString.replace('!', '');
                matchedString = matchedString.replace('>', '');
                return matchedString;
            }

        }

        // END OF MODULE
    },









































    /**
     * Check for if the given [at]User mention matches the Author's ID
     * 
     * @param {String} string 
     * @param {Discord.GuildMember} member
     * 
     * @returns {Promise<Boolean>} 
     */
    async TestForSelfMention(string, member) {

        let matchedString = string.replace('<@', '');
        matchedString = matchedString.replace('!', '');
        matchedString = matchedString.replace('>', '');

        
        if ( matchedString === member.user.id ) {
            return true;
        }
        else if ( matchedString === member.user["id"] ) {
            // For Slash Commands
            return true;
        }
        else {
            return false;
        }


        // END OF MODULE
    }

};
