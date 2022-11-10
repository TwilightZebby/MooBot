const { DiscordClient } = require("./constants.js");
const Config = require("./config.js");

// Bring in Slash Commands for registering
const RegisterCommand = require('./Interactions/SlashCommands/register.js');
const UnregisterCommand = require('./Interactions/SlashCommands/unregister.js');
const BonkCommand = require('./Interactions/SlashCommands/bonk.js');
const BoopCommand = require('./Interactions/SlashCommands/boop.js');
const DstatusCommand = require('./Interactions/SlashCommands/dstatus.js');
const HeadpatCommand = require('./Interactions/SlashCommands/headpat.js');
const HugCommand = require('./Interactions/SlashCommands/hug.js');
const InfoCommand = require('./Interactions/SlashCommands/info.js');
const KissCommand = require('./Interactions/SlashCommands/kiss.js');
const StartCommand = require('./Interactions/SlashCommands/start.js');
const TemperatureCommand = require('./Interactions/SlashCommands/temperature.js');
const ConvertTemperatureCommand = require('./Interactions/ContextCommands/Convert_Temperature.js');

// Login Bot
DiscordClient.login(Config.TOKEN);

// Wait for Ready
DiscordClient.once('ready', async () => {
    // Bulk register Global Commands
    const CommandDataArray = [
        RegisterCommand.registerData(), UnregisterCommand.registerData(), BonkCommand.registerData(),
        BoopCommand.registerData(), DstatusCommand.registerData(), HeadpatCommand.registerData(),
        HugCommand.registerData(), InfoCommand.registerData(), KissCommand.registerData(),
        StartCommand.registerData(), TemperatureCommand.registerData(), ConvertTemperatureCommand.registerData()
    ];
    await DiscordClient.application.commands.set(CommandDataArray);

    console.log("Bulk Deployed Commands!");
});






/******************************************************************************* */
// DEBUGGING AND ERROR LOGGING
// Warnings
process.on('warning', (warning) => { return console.warn("***WARNING: ", warning); });
DiscordClient.on('warn', (warning) => { return console.warn("***DISCORD WARNING: ", warning); });

// Unhandled Promise Rejections
process.on('unhandledRejection', (err) => { return console.error("***UNHANDLED PROMISE REJECTION: ", err); });

// Discord Errors
DiscordClient.on('error', (err) => { return console.error("***DISCORD ERROR: ", err); });