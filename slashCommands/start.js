// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require("discord.js");
const fetch = require('node-fetch');

if (!globalThis.fetch) {
	globalThis.fetch = fetch;
}

// MODULE IMPORTS
//const ErrorModule = require('../bot_modules/errorLogger.js');
const SlashCommands = require('../bot_modules/slashModule.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX, TOKEN } = require('../config.js');



// THIS COMMAND
module.exports = {
    name: 'start',
    description: 'Creates an Invite Link that starts a Voice Activity in a Voice Channel',

    // LIMITATIONS
    //     'twilightzebby' - Only TwilightZebby#1955 can use this command
    //     If commented out, everyone can use this command
    //limitation: 'twilightzebby',

    // If the Slash Command can only be used in Guilds
    //     Comment out if this Slash Command can also be used in DMs
    guildOnly: true,

    // Command's cooldown, in seconds
    cooldown: 10,

    /**
     * Command's functionality
     * 
     * @param {*} guild 
     * @param {*} data
     * @param {*} commandData
     * @param {Discord.GuildMember} member
     */
    async execute(guild, data, commandData, member) {

      // Check for edge case of no given arguments
      if ( !commandData.options[0] || commandData.options[0].value === undefined || commandData.options[0].value === '' )
      {
        return await SlashCommands.CallbackEphemeral(data, `Strange, I couldn't see any arguments there.... Please try again`);
      }


      // Split up arguments
      let argChannel;
      let argActivity;

      for ( const option of commandData.options )
      {
        if ( option.name === "channel" )
        {
          argChannel = option.value;
        }
        else if ( option.name === "activity" )
        {
          argActivity = option.value;
        }
      }


      // Checking the given Channel
      const targetGuild = client.guilds.resolve(guild);
      if ( !targetGuild )
      {
        await SlashCommands.CallbackEphemeral(data, `Sorry, but an error occurred. Please try again later...`);
        delete targetGuild;
        return;
      }

      const targetVoiceChannel = targetGuild.channels.resolve(argChannel);
      if ( !targetVoiceChannel )
      {
        await SlashCommands.CallbackEphemeral(data, `Sorry, but I was unable to find that Voice Channel....`);
        delete targetGuild;
        delete targetVoiceChannel;
        return;
      }

      if ( !(targetVoiceChannel instanceof Discord.VoiceChannel) )
      {
        await SlashCommands.CallbackEphemeral(data, `That wasn't a Voice Channel! Please try again with a valid Voice Channel`);
        delete targetGuild;
        delete targetVoiceChannel;
        return;
      }






      // Check for CREATE_INSTANT_INVITE Permission
      if ( !targetVoiceChannel.permissionsFor(client.user.id).has(Discord.Permissions.FLAGS.CREATE_INSTANT_INVITE, true) )
      {
        await SlashCommands.CallbackEphemeral(data, `Sorry, but it seems like I don't have the \`CREATE_INVITE\` Permission for the **${targetVoiceChannel.name}** Voice Channel.`);
        delete targetGuild;
        delete targetVoiceChannel;
        return;
      }








      // CREATE LINK
      let newInviteRaw = await fetch(`https://discord.com/api/v8/channels/${targetVoiceChannel.id}/invites`, {
        method: 'POST',
        headers: { authorization: `Bot ${TOKEN}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          max_age: 900,
          target_type: 2,
          target_application_id: argActivity == "poker" ? "755827207812677713" : 
            argActivity == "betrayal" ? "773336526917861400" : 
              argActivity == "youtube" ? "755600276941176913" : 
                argActivity == "fishington" ? "814288819477020702" : 
                  argActivity == "chess" ? "832012774040141894" :
                    "438122941302046720"
        })
      });

      let newInvite = await newInviteRaw.json();

      await SlashCommands.CallbackEphemeral(data, `[Click here to start the **${argActivity}** Activity inside the **${targetVoiceChannel.name}** Voice Channel](<https://discord.gg/${newInvite.code}>)\nNotes:\n- This will auto-join you to the Voice Channel if you aren't already inside it\n- This link will expire in 15 minutes\n- Currently this only works on Desktop and Browser Discord, not Mobile. Sorry Mobile Users!`);

      delete targetGuild;
      delete targetVoiceChannel;
      return;


      // END OF SLASH COMMAND
    },















    /**
     * Registers the Slash Command
     * 
     * @param {Boolean} isGlobal True if Global, False if Guild
     * @param {String} [guildID] Provide Guild ID if Guild Command, otherwise ignore
     */
     async register(isGlobal, guildID) {

      // Data
      const data = {};
      data.name = "start";
      data.description = "Start an Activity in a Voice Channel!";
      data.options = new Array();

      const option = {};
      option.name = "channel";
      option.description = "A Voice Channel";
      option.type = 7; // Channel
      option.required = true;

      data.options.push(option);


      const secondOption = {};
      secondOption.name = "activity";
      secondOption.description = "Name of the Activity";
      secondOption.type = 3; // String
      secondOption.required = true;
      secondOption.choices = [
        {
          "name": "Poker Night",
          "value": "poker"
        },
        {
          "name": "Betrayal.io",
          "value": "betrayal"
        },
        {
          "name": "YouTube Together",
          "value": "youtube"
        },
        {
          "name": "Fishington.io",
          "value": "fishington"
        },
        {
          "name": "Chess in the Park",
          "value": "chess"
        }/*,
        {
          "name": "Test",
          "value": "test"
        }*/
      ];

      data.options.push(secondOption);

      

      if ( isGlobal ) {
          client.api.applications(client.user.id).commands().post({data});
      }
      else {
          client.api.applications(client.user.id).guilds(guildID).commands().post({data});
      }

      return;

    }
};
