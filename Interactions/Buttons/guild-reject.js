const { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { DiscordClient } = require("../../constants.js");

module.exports = {
    // Button's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "guild-reject",

    // Button's Description
    Description: `Rejects a Guild from using this Bot`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 10,



    /**
     * Executes the Button
     * @param {ButtonInteraction} buttonInteraction 
     */
    async execute(buttonInteraction)
    {
        await buttonInteraction.deferUpdate();

        // Force Bot to leave the Guild
        const GuildId = buttonInteraction.customId.split("_").pop();
        const FetchedGuild = await DiscordClient.guilds.fetch({ guild: GuildId });

        await FetchedGuild.leave()
        .then(async LeftGuild => {
            const RejectedActionRow = new ActionRowBuilder().addComponents([
                new ButtonBuilder().setCustomId(`disabled`).setDisabled(true).setEmoji('❌').setLabel(`Rejected`).setStyle(ButtonStyle.Danger)
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
