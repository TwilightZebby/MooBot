// Imports
const Discord = require('discord.js');
const fs = require('fs');
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

            let memberStrings = []; // To store who's birthday it is today for displaying in Embed

            // Check there are actually birthdays today!
            let birthdaysToday = birthdayStore.filter(birthday => birthday.month === monthNow && birthday.date === dateNow);

            if ( !birthdaysToday.length || birthdaysToday.length === 0 )
            {
                // No birthdays today, move on!
            }
            else
            {
                // There are birthdays today
                for ( const birthday of birthdaysToday )
                {
                    let birthMember = await guild.members.fetch(birthday.userID);
                    memberStrings.push(`**${birthMember.user.username}**`);
                    await birthMember.roles.add('877467249856892950'); // Replace with ID of Birthday Role in Dr1fterX's Guild in Production!
                }
            }


            // Feb 29th (when NOT a leap year)
            if ( (timeNow.getFullYear() % 4 !== 0) && (monthNow === 1 && dateNow === 28) )
            {
                let birthdaysFeb29 = birthdayStore.filter(birthday => birthday.month === 1 && birthday.date === 29);

                if ( !birthdaysFeb29.length || birthdaysFeb29.length === 0 )
                {
                    // No birthdays for Feb 29th, move on
                }
                else
                {
                    for ( const birthday of birthdaysFeb29 )
                    {
                        let birthMember = await guild.members.fetch(birthday.userID);
                        memberStrings.push(`**${birthMember.user.username}**`);
                        await birthMember.roles.add('877467249856892950'); // Replace with ID of Birthday Role in Dr1fterX's Guild in Production!
                    }
                }
            }


            // Ensure there are actually birthdays today, to avoid sending message when there isn't a birthday
            if ( !memberStrings || !memberStrings.length || memberStrings.length === 0 ) { return; }


            // There are birthdays today, send that Embed!
            birthdayEmbed.setDescription(`Happy Birthday ${memberStrings.join(', ')}!\n\nYou have been given the \<\@\&877467249856892950\> Role for the next 24 hours!\n\nEveryone <:ayaya:545260084012253186> in chat!`); // Replace Role ID with that from Dr1fterX's Guild in Production!
            await socialChannel.send({ embeds: [birthdayEmbed], allowedMentions: { parse: [] } });

            delete birthdayEmbed, memberStrings;



            // Update last checked JSON to be today, ready for tomorrow
            dateCheckJSON["lastCheckedDate"] = dateNow;
            dateCheckJSON["lastCheckedMonth"] = monthNow;
            
            fs.writeFile('./hiddenJsonFiles/dateCheck.json', JSON.stringify(dateCheckJSON, null, 4), (err) => {
                if (err)
                {
                    return console.error(err);
                }
            });

            return;
        }
    }
}
