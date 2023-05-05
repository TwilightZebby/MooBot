const { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require('fs');
const { DiscordClient } = require("../../constants.js");

module.exports = {
    // Button's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "guild-block",

    // Button's Description
    Description: `Rejects a Guild from using this Bot AND adds it to the Block List`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 10,



    /**
     * Executes the Button
     * @param {ButtonInteraction} buttonInteraction 
     */
    async execute(buttonInteraction)
    {
        // Ensure only Zebby can use
        if ( buttonInteraction.user.id !== "156482326887530498" )
        {
            await buttonInteraction.reply({ ephemeral: true, content: `Sorry, only my Developer can use this Button!` });
            return;
        }


        await buttonInteraction.deferUpdate();

        let moobotBlocklist = require('../../JsonFiles/Hidden/ServerBlocklist.json');

        // Force Bot to leave the Guild
        const GuildId = buttonInteraction.customId.split("_").pop();
        const FetchedGuild = await DiscordClient.guilds.fetch({ guild: GuildId });

        await FetchedGuild.leave()
        .then(async LeftGuild => {
            // Add to Block List
            moobotBlocklist["blocklist"].push(`${LeftGuild.id}`);
            fs.writeFile('./JsonFiles/Hidden/ServerBlocklist.json', JSON.stringify(moobotBlocklist, null, 4), async err => {
                if ( err ) { console.error(err); }
            });


            // ACK
            const RejectedActionRow = new ActionRowBuilder().addComponents([
                new ButtonBuilder().setCustomId(`disabled`).setDisabled(true).setEmoji('❌').setLabel(`Blocked`).setStyle(ButtonStyle.Danger)
            ]);
            await buttonInteraction.editReply({ components: [RejectedActionRow] });

            return;
        })
        .catch(async err => {
            //console.error(err);
            await buttonInteraction.followUp({ ephemeral: true, content: `Sorry, but there was an error trying to reject & leave that Guild...` });
            return;
        });

        return;
    }
}
