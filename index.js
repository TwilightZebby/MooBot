// LIBRARIES
const fs = require("fs");
const Discord = require("discord.js");


// GLOBAL STUFF
const { client } = require("./constants.js");
const { CONFIG, TOKEN, ErrorLogChannelID, ErrorLogGuildID, Dr1fterXBirthdayRoleID, Dr1fterXGuildID, Dr1fterXSocialChannelID, TestBirthdayRoleID, TestSocialChannelID } = require("./config.js");


// MAPS / COLLECTIONS
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.contextCommands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.slashCooldowns = new Discord.Collection();
client.contextCooldowns = new Discord.Collection();
client.potato = new Discord.Collection();
client.jail = new Discord.Collection();
client.suspect = new Discord.Collection();


// BRING IN TEXT COMMANDS
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for ( const file of commandFiles )
{
    const tempCMD = require(`./commands/${file}`);
    client.commands.set(tempCMD.name, tempCMD);
}


// BRING IN SLASH COMMANDS
const slashCommandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));

for ( const file of slashCommandFiles )
{
    const tempSlash = require(`./slashCommands/${file}`);
    client.slashCommands.set(tempSlash.name, tempSlash);
}


// BRING IN CONTEXT COMMANDS
const contextCommandFiles = fs.readdirSync('./contextCommands').filter(file => file.endsWith('.js'));

for ( const file of contextCommandFiles )
{
    const tempContext = require(`./contextCommands/${file}`);
    client.contextCommands.set(tempContext.name, tempContext);
}








/******************************************************************************* */

// READY EVENT
client.once('ready', () => {

    client.user.setPresence({
        status: 'online'
    });

    // Refreshes the status
    /* setInterval(() => {
        client.user.setPresence({
            status: 'online'
        });
    }, 1.08e+7); */

    console.log("I am ready!");



    // Timer loop thingy for giving and revoking of the Birthday Role
    setInterval(async () => {

        const dateCheckJSON = require('./hiddenJsonFiles/dateCheck.json');
        const birthdayDatesJSON = require('./hiddenJsonFiles/birthdayDates.json');

        let timeNow = new Date(Date.now());
        let nowMonth = timeNow.getMonth();
        let nowDate = timeNow.getDate();

        if ( dateCheckJSON["lastCheckedDate"] === nowDate )
        {
            // It's still the same day, do nothing
            delete timeNow, nowMonth, nowDate;
            return;
        }
        else
        {
            // *****New day, sort out roles
            let birthdayStore = Object.values(birthdayDatesJSON);
            let guild = await client.guilds.fetch({ guild: ErrorLogGuildID });
            /**
             * @type {Discord.TextChannel}
             */
            let socialChannel = await guild.channels.fetch(TestSocialChannelID);

            // First, check to see if there were any for yesterday, and revoke Birthday Role from them
            let yesterdayBirthdays = birthdayStore.filter(birthObj => birthObj.birthMonth === dateCheckJSON["lastCheckedMonth"] && birthObj.birthDate === dateCheckJSON["lastCheckedDate"]);
            if ( !yesterdayBirthdays.length || yesterdayBirthdays.length === 0 )
            {
                // There are none stored for yesterday, so move on to today!
            }
            else
            {
                // There are some stored for yesterday, so revoke Birthday Role!
                for ( const yesterBirth of yesterdayBirthdays )
                {
                    let birthMember = await guild.members.fetch(yesterBirth.userID);
                    await birthMember.roles.remove(TestBirthdayRoleID);
                }
            }


            // Embed Stuff so we can merge all Birthdays into the same Embed to prevent spamming chat or hitting rate limit haha
            let embed = new Discord.MessageEmbed().setColor('RED')
            .setTitle(`BIRTHDAY TIME!`)
            .setThumbnail("https://media0.giphy.com/media/E5jCN5tsN21Ec/giphy.gif")
            .setTimestamp(timeNow);

            let memberStrings = [];

            // Check for today
            let todayBirthdays = birthdayStore.filter(birthObj => birthObj.birthMonth === nowMonth && birthObj.birthDate === nowDate);

            if ( !todayBirthdays.length || todayBirthdays.length === 0 )
            {
                // There are none stored for today, so move on!
            }
            else
            {
                for ( const todayBirth of todayBirthdays )
                {
                    let birthMember = await guild.members.fetch(todayBirth.userID);
                    memberStrings.push(`**\<\@${birthMember.user.id}\>**`);
                    await birthMember.roles.add(TestBirthdayRoleID);
                }
            }





            // Let's not forget about Feb 29th!
            if ( (timeNow.getFullYear() % 4 !== 0) && (nowMonth === 1 && nowDate === 28) )
            {
                let feb29Birthdays = birthdayStore.filter(birthObj => birthObj.birthMonth === 1 && birthObj.birthDate === 29);

                if ( !feb29Birthdays.length || feb29Birthdays.length === 0 )
                {
                    // There are none stored for Feb29, so move on!
                }
                else
                {
                    for ( const todayBirth of feb29Birthdays )
                    {
                        let birthMember = await guild.members.fetch(todayBirth.userID);
                        memberStrings.push(`**\<\@${birthMember.user.id}\>**`);
                        await birthMember.roles.add(TestBirthdayRoleID);
                    }
                }

            }


            // Final check, just to make sure we aren't sending messages when there isn't actually any birthdays haha
            if ( !memberStrings || !memberStrings.length || memberStrings.length <= 0 )
            {
                return;
            }

            // Send Birthday Message!
            embed.setDescription(`Happy Birthday ${memberStrings.join(', ')}!\n\nYou have just been given the \<\@\&${TestBirthdayRoleID}\> role for the next 24 hours!\n\nEveryone <:ayaya:545260084012253186> in chat!`);
            await socialChannel.send({ embeds: [embed] });

            delete embed, memberStrings;







            // FINALLY, change the "lastChecked" stuff to be today, ready for tomorrow
            dateCheckJSON["lastCheckedDate"] = nowDate;
            dateCheckJSON["lastCheckedMonth"] = nowMonth;

            fs.writeFile('./hiddenJsonFiles/dateCheck.json', JSON.stringify(dateCheckJSON, null, 4), async (err) => {
                if (err)
                {
                    return console.error(err, `Attempted writing to ./hiddenJsonFiles/dateCheck.json: `);
                }
            });

            return;
        }

    }, 300000);
    // 300000 = 5 mins, for testing
    // 2.16e+7 = 6 hours, for production

});



















/******************************************************************************* */

// DEBUGGING AND ERROR LOGGING
const ErrorModule = require('./modules/errorLog.js');


// Warnings
process.on('warning', (warning) => {
    console.warn(warning);
    return;
});

client.on('warn', (warning) => {
    console.warn(warning);
    return;
});







// Unhandled Promise Rejections
process.on('unhandledRejection', async (error) => {
    await ErrorModule.LogCustom(error, `Unhandled Promise Rejection: `);
    return;
});








// Discord Errors
client.on('error', async (error) => {
    await ErrorModule.LogCustom(error, `Discord Error: `);
    return;
});






// Discord Rate Limit
client.on('rateLimit', async (rateLimitInfo) => {
    await ErrorModule.LogMessage(`Discord Ratelimit: \n\`\`\`Timeout: ${rateLimitInfo.timeout} \nLimit: ${rateLimitInfo.limit} \nMethod: ${rateLimitInfo.method} \nPath: ${rateLimitInfo.path} \nRoute: ${rateLimitInfo.route} \nGlobal: ${rateLimitInfo.global}\`\`\``);
    return;
});































/******************************************************************************* */
// MESSAGE CREATE EVENT (when a new message is sent)

const TextCommandHandler = require('./modules/textCommandHandler.js');

client.on('messageCreate', async (message) => {
    
    // Prevent other Bots and System stuff from triggering this Bot
    if ( message.author.bot || message.system || message.author.system ) { return; }

    // Ignore DM Messages
    if ( message.channel instanceof Discord.DMChannel ) { return; }

    // Prevent Discord Outages from crashing or breaking the Bot
    if ( !message.guild.available ) { return; }











    // Command Handler
    let textCommandSuccess = await TextCommandHandler.Main(message);
    if ( textCommandSuccess === false )
    {
        // No command prefix detected, so not a command
        return;
    }
    else if ( textCommandSuccess !== false && textCommandSuccess !== true )
    {
        // Command failed or otherwise
        return;
    }
    else
    {
        // Command successful
        return;
    }

});





























/******************************************************************************* */
// INTERACTION CREATE EVENT (when a Slash Command, Button, Select Menu, Context Command is used)

const SlashCommandHandler = require('./modules/slashCommandHandler.js');
const ButtonHandler = require('./modules/buttonHandler.js');
const SelectMenuHandler = require('./modules/selectMenuHandler.js');
const ContextCommandHandler = require('./modules/contextCommandHandler.js');

client.on('interactionCreate', async (interaction) => {

    if ( interaction.isCommand() )
    {
        // Is a Slash Command
        return await SlashCommandHandler.Main(interaction);
    }
    else if ( interaction.isButton() )
    {
        // Is a Button Component
        return await ButtonHandler.Main(interaction);
    }
    else if ( interaction.isSelectMenu() )
    {
        // Is a Select Menu (aka Dropdown)
        return await SelectMenuHandler.Main(interaction);
    }
    else if ( interaction.isContextMenu() )
    {
        // Is a Context Command (either User- or Message-based)
        return await ContextCommandHandler.Main(interaction);
    }
    else
    {
        // Is neither of the four above types
        return;
    }

});





























/******************************************************************************* */
// MEMBER LEFT GUILD EVENT

client.on('guildMemberRemove', async (member) => {

    const birthdayDatesJSON = require('./hiddenJsonFiles/birthdayDates.json');
    
    // Check if they are in the JSON, if yes, remove
    if ( birthdayDatesJSON[`${member.user.id}`] )
    {
        delete birthdayDatesJSON[`${member.user.id}`];
        
        fs.writeFile('./hiddenJsonFiles/birthdayDates.json', JSON.stringify(birthdayDatesJSON, null, 4), async (err) => {
            if (err)
            {
                return console.error(err, `Attempted writing to ./hiddenJsonFiles/birthdayDates.json: `);
            }
        });
    }

    return;

});



























/******************************************************************************* */

client.login(TOKEN);
