// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');

module.exports = {
    /**
     * Checks every 6 hours to see if Birthday Role should be managed
     */
    async Main()
    {
        // Bring in JSONs
        const dateCheckJSON = require('../hiddenJsonFiles/dateCheck.json');
        const birthdayDatesJSON = require('../hiddenJsonFiles/birthdayDates.json');

        // Get current date and month
        const timeNow = new Date(Date.now());
        const monthNow = timeNow.getMonth();
        const dateNow = timeNow.getDate();

        // Check if its still the same day, if so do nothing
        if ( dateCheckJSON["lastCheckedDate"] === dateNow )
        {
            delete timeNow, monthNow, dateNow;
            return;
        }
        // It's a new day!
        else
        {
            // Objectify Birthday Store
            let birthdayStore = Object.values(birthdayDatesJSON);

            // Fetch Guild and Channel
            const guild = await client.guilds.fetch({ guild: '838517664661110795' }); // Replace with Dr1fterX's Guild ID in Production!
            /** @type {Discord.TextChannel} */
            const socialChannel = await guild.channels.fetch('876775136617967626'); // Replace with Dr1fterX's Guild's Social Channel's ID in Production!

            // Were there any Birthdays yesterday? If yes, revoke Role
            let birthdaysYesterday = birthdayStore.filter(birthday => birthday.month === dateCheckJSON["lastCheckedMonth"] && birthday.date === dateCheckJSON["lastCheckedDate"]);
            if ( !birthdaysYesterday.length || birthdaysYesterday.length === 0 )
            {
                // There were no birthdays yesterday, so move on!
            }
            else
            {
                // There WERE birthdays yesterday, revoke role
                for ( const birthday of birthdaysYesterday )
                {
                    let birthdayMember = await guild.members.fetch(birthday.userID);
                    await birthdayMember.roles.remove('877467249856892950'); // Replace with ID of Birthday Role in Dr1fterX's Guild in Production!
                }
            }


            // Construct Embed for today (allows for merging all into one embed to prevent chat spam)
            let birthdayEmbed = new Discord.MessageEmbed().setColor('RED')
            .setTitle(`BIRTHDAY TIME!`)
            .setThumbnail(`https://media0.giphy.com/media/E5jCN5tsN21Ec/giphy.gif`)
            .setTimestamp(timeNow);
        }
    }
}
