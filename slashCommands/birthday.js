const Discord = require('discord.js');
const fs = require('fs');
const { client } = require('../constants.js');

const ErrorModule = require('../modules/errorLog.js');

const Month31Days = [ 0, 2, 4, 6, 7, 9, 11 ];
const Month30Days = [ 3, 5, 8, 10 ];
const IntToMonths = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];


module.exports = {
    name: 'birthday',
    description: `Main Birthday Slash Command`,
    
    // Cooldown is in seconds
    cooldown: 180,

    // Uncomment for making the command only usable in DMs with the Bot
    //    - DO NOT have both this AND "guildOnly" uncommented, only one or neither
    //dmOnly: true,

    // Uncomment for making the command only usable in Servers
    //   - DO NOT have both this AND "dmOnly" uncommented, only one or neither
    guildOnly: true,


    /**
     * Returns data to be used for registering the Slash Command
     * 
     * @returns {Discord.ApplicationCommandData} 
     */
    async registerData() {

        const data = {};
        data.name = this.name;
        data.description = this.description;
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
     * Entry point that runs the slash command
     * 
     * @param {Discord.CommandInteraction} slashInteraction Slash Command Interaction
     */
    async execute(slashInteraction) {

        let subCommandName = slashInteraction.options.getSubcommand(false);

        // Catch for no sub command
        if ( !subCommandName || subCommandName === "" )
        {
            return await slashInteraction.reply({ content: `Error: For some reason, I was not able to see the Sub-Command used...`, ephemeral: true });
        }
        // Birthday Set Sub-Command
        else if ( subCommandName === "set" )
        {
            return await this.setBirthday(slashInteraction);
        }
        // Birthday Remove Sub-Command
        else if ( subCommandName === "remove" )
        {
            return await this.removeBirthday(slashInteraction);
        }

    },




    /**
     * Method for removing Birthday
     * 
     * @param {Discord.CommandInteraction} slashInteraction 
     */
    async removeBirthday(slashInteraction) {

        // Just in case it takes longer than 3 seconds to do stuff, Defer the response to buy more time (up to 15 minutes)
        await slashInteraction.deferReply({ ephemeral: true });

        let birthdayJSON = require('../hiddenJsonFiles/birthdayDates.json');

        // If user doesn't exist in JSON already, then they can't remove a non-existant entry!
        if ( !birthdayJSON[slashInteraction.user.id] )
        {
            return await slashInteraction.editReply({ content: `I don't have a saved birthday for you. As such, I cannot delete a non-existant value!`, ephemeral: true });
        }

        // remove from JSON, then save to file
        delete birthdayJSON[slashInteraction.user.id];

        // Write to JSON file
        fs.writeFile('./hiddenJsonFiles/birthdayDates.json', JSON.stringify(birthdayJSON, null, 4), async (err) => {
            if (err)
            {
                await slashInteraction.editReply({ content: `⚠️ Oops! An error occurred while attempting to remove your Birthday...`, ephemeral: true });
                return console.error(err, `Attempted writing to ./hiddenJsonFiles/birthdayDates.json: `);
            }
        });

        return await slashInteraction.editReply({ content: `✅ Successfully removed your Birthday`, ephemeral: true });

    },




    /**
     * Method for Setting/Editing Birthday
     * 
     * @param {Discord.CommandInteraction} slashInteraction Slash Command Interaction
     */
    async setBirthday(slashInteraction) {

        // Just in case it takes longer than 3 seconds to do stuff, Defer the response to buy more time (up to 15 minutes)
        await slashInteraction.deferReply({ ephemeral: true });

        let birthdayJSON = require('../hiddenJsonFiles/birthdayDates.json');

        let monthValue = parseInt(slashInteraction.options.get("month").value); // 0 for Jan, 11 for Dec
        let dateValue = parseInt(slashInteraction.options.get("date").value);


        // Check Date
        // If a value that doesn't exist (outside the range of 1 - 31, or 1 - 30, depending on the month in question)
        if ( Month31Days.includes(monthValue) && (dateValue < 1 || dateValue > 31) )
        {
            return await slashInteraction.editReply({ content: `Sorry, but that wasn't a valid date! (Must be between 1 and 31, inclusive)`, ephemeral: true });
        }
        else if ( Month30Days.includes(monthValue) && (dateValue < 1 || dateValue > 30) )
        {
            return await slashInteraction.editReply({ content: `Sorry, but that wasn't a valid date! (Must be between 1 and 30, inclusive)`, ephemeral: true });
        }
        // Catch for Feb 30th (date doesn't exist)
        else if ( monthValue === 1 && dateValue > 29 )
        {
            return await slashInteraction.editReply({ content: `Sorry, but that wasn't a valid date! (Must be between 1 and 29, inclusive)`, ephemeral: true });
        }
        // Catch for Feb 29th (date can only exist on Leap Years)
        else if ( monthValue === 1 && dateValue === 29 )
        {
            let confirmationRow = new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton().setCustomId(`feb29_${slashInteraction.user.id}`).setLabel("Confirm").setStyle("PRIMARY"),
            );

            return await slashInteraction.editReply(
                { content: `You are about to set your Birthday as February 29th, a date that can only exist during Leap Years. As such, we will give you the Birthday Role on February 28th on other, non-leap years.\n\nPlease confirm if this is ok for you, otherwise you can safely ignore or delete this message.`,
                components: [ confirmationRow ],
                ephemeral: true
            });
        }
        else
        {
            birthdayJSON[slashInteraction.user.id] = {
                userID: slashInteraction.user.id,
                birthMonth: monthValue,
                birthDate: dateValue
            };
    
    
            // Write to JSON file
            fs.writeFile('./hiddenJsonFiles/birthdayDates.json', JSON.stringify(birthdayJSON, null, 4), async (err) => {
                if (err)
                {
                    await slashInteraction.editReply({ content: `⚠️ Oops! An error occurred while attempting to set your Birthday...`, ephemeral: true });
                    return console.error(err, `Attempted writing to ./hiddenJsonFiles/birthdayDates.json: `);
                }
            });

            return await slashInteraction.editReply({ content: `✅ Successfully set your Birthday as ${IntToMonths[monthValue]} ${dateValue}${[1, 21, 31].includes(dateValue) ? "st" : [2, 22].includes(dateValue) ? "nd" : [3, 23].includes(dateValue) ? "rd" : "th"}`, ephemeral: true });
        }

    }
}
