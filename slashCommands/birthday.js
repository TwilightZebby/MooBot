// Imports
const Discord = require('discord.js');
const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

const Month31Days = [ 0, 2, 4, 6, 7, 9, 11 ];
const Month30Days = [ 3, 5, 8, 10 ];
const IntToMonths = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];


module.exports = {
    // Slash Command's Name, MUST BE LOWERCASE AND NO SPACES
    name: 'birthday',
    // Slash Command's description
    description: `Main Birthday Slash Command`,
    // Category of Slash Command, used for Help (text) Command
    category: 'general',

    // Slash Command's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 180,


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
        data.options = [
            {
                type: 'SUB_COMMAND',
                name: 'set',
                description: 'Set/Edit the Month and Day your Birthday is on so you can receive the Birthday Role',
                options: [
                    {
                        type: 'STRING',
                        name: 'month',
                        description: 'The Month your Birthday is in',
                        required: true,
                        choices: [
                            { name: "January", value: "0" },
                            { name: "February", value: "1" },
                            { name: "March", value: "2" },
                            { name: "April", value: "3" },
                            { name: "May", value: "4" },
                            { name: "June", value: "5" },
                            { name: "July", value: "6" },
                            { name: "August", value: "7" },
                            { name: "September", value: "8" },
                            { name: "October", value: "9" },
                            { name: "November", value: "10" },
                            { name: "December", value: "11" }
                        ]
                    },
                    {
                        type: 'INTEGER',
                        name: 'date',
                        description: 'The Date of your Birthday',
                        required: true,
                        minValue: 0,
                        maxValue: 31
                        // Can't use pre-set choices for the Date as Discord only allows a max of 25 choices per option, and there are up to 31 days in a month!
                    },
                    {
                        type: 'STRING',
                        name: 'timezone',
                        description: 'Your Timezone, used to identify when your midnight is',
                        autocomplete: true,
                        required: true,
                        choices: [
                            { name: "UTC", value: "Etc/UTC" },
                            { name: "America/Los_Angeles", value: "America/Los_Angeles" },
                            { name: "America/Phoenix", value: "America/Phoenix" },
                            { name: "America/Costa_Rica", value: "America/Costa_Rica" },
                            { name: "America/New_York", value: "America/New_York" },
                            { name: "America/Dominica", value: "America/Dominica" },
                            { name: "Atlantic/South_Georgia", value: "Atlantic/South_Georgia" },
                            { name: "Atlantic/Cape_Verde", value: "Atlantic/Cape_Verde" },
                            { name: "Europe/London", value: "Europe/London" },
                            { name: "Europe/Paris", value: "Europe/Paris" },
                            { name: "Europe/Amsterdam", value: "Europe/Amsterdam" },
                            { name: "Europe/Stockholm", value: "Europe/Stockholm" },
                            { name: "Europe/Warsaw", value: "Europe/Warsaw" },
                            { name: "Africa/Johannesburg", value: "Africa/Johannesburg" },
                            { name: "Antarctica/Mawson", value: "Antarctica/Mawson" },
                            { name: "Australia/Sydney", value: "Australia/Sydney" },
                            { name: "Asia/Tokyo", value: "Asia/Tokyo" },
                            { name: "Asia/Hong_Kong", value: "Asia/Hong_Kong" }
                        ]
                    }
                ]
            },
            {
                type: 'SUB_COMMAND',
                name: 'remove',
                description: 'Remove your saved Birthday from the Bot, stopping you from receiving the Birthday Role'
            }
        ];
        
        return data;
    },




    /**
     * Main function that runs this Slash Command
     * 
     * @param {Discord.CommandInteraction} slashCommand Slash Command Interaction
     */
    async execute(slashCommand)
    {

        // .
        

    },






    /**
     * Removes the User from the Birthdays Store
     * 
     * @param {Discord.CommandInteraction} slashCommand 
     */
    async remove(slashCommand)
    {
        // In case it takes longer than 3 seconds
        await slashCommand.deferReply({ ephemeral: true });

        let birthdayJSON = require('../hiddenJsonFiles/birthdayDates.json');

        // Check User does exist in JSON already
        if ( !birthdayJSON[slashCommand.user.id] )
        {
            return await slashCommand.editReply({ content: `You currently don't have your birthday saved with me, as such I cannot delete data that I don't have!`, ephemeral: true });
        }

        // User DOES exist, thus remove from JSON
        delete birthdayJSON[slashCommand.user.id];

        fs.writeFile('./hiddenJsonFiles/birthdayDates.json', JSON.stringify(birthdayJSON, null, 4), async (err) => {
            if (err)
            {
                return await slashCommand.editReply({ content: CONSTANTS.errorMessages.SLASH_COMMAND_GENERIC_FAILED.replace("{{commandName}}", slashCommand.commandName), ephemeral: true });
            }
        });

        return await slashCommand.editReply({ content: `✅ Successfully removed your birthday, you will no longer receive the Birthday Role.`, ephemeral: true });
    },








    /**
     * Adds or Edits a Birthday in the Birthday Store for a User
     * 
     * @param {Discord.CommandInteraction} slashCommand 
     */
    async set(slashCommand)
    {
        // In case it takes longer than 3 seconds
        await slashCommand.deferReply({ ephemeral: true });

        // Fetch JSON and Slash Command Arguments
        let birthdayJSON = require('../hiddenJsonFiles/birthdayDates.json');
        let monthValue = parseInt(slashCommand.options.get("month").value); // 0 for Jan, 11 for Dec
        let dateValue = parseInt(slashCommand.options.get("date").value);
    }
};
