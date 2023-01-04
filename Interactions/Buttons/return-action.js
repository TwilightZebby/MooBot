const { ButtonInteraction } = require("discord.js");
const ActionStrings = require('../../JsonFiles/actionMessages.json');

// REGEXS
const AuthorRegEx = new RegExp(/{AUTHOR}/g);
const ReceiverRegEx = new RegExp(/{RECEIVER}/g);

module.exports = {
    // Button's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "return-action",

    // Button's Description
    Description: `Used to return an Action`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 5,



    /**
     * Executes the Button
     * @param {ButtonInteraction} buttonInteraction 
     */
    async execute(buttonInteraction)
    {
        // Parse arguments out of Custom ID
        const ButtonArguments = buttonInteraction.customId.split("_");
        const ActionName = ButtonArguments[1].toLowerCase();
        const OriginalUserId = ButtonArguments[2];
        const OriginalTargetId = ButtonArguments[3];


        // Ensure User who pressed Button is the Original Target User
        if ( buttonInteraction.user.id !== OriginalTargetId )
        {
            return await buttonInteraction.reply({ ephemeral: true, content: "You cannot return an Action that wasn't aimed at you!" });
        }

        // Fetch Members, so we can use their Display/Nick Names
        const OriginalMember = await buttonInteraction.guild.members.fetch(OriginalUserId)
        .catch(async err => { return await buttonInteraction.reply({ ephemeral: true, content: "Sorry, but there was a problem trying to process that Button press." }); });
        const OriginalTargetMember = await buttonInteraction.guild.members.fetch(OriginalTargetId)
        .catch(async err => { return await buttonInteraction.reply({ ephemeral: true, content: "Sorry, but there was a problem trying to process that Button press." }); });

        // Construct Message
        let displayMessage = ActionStrings['RETURN'][`${ActionName}`];
        displayMessage = displayMessage.replace(AuthorRegEx, `${OriginalTargetMember.displayName}`).replace(ReceiverRegEx, `${OriginalMember.displayName}`);

        // Remove Button from original Message
        await buttonInteraction.update({ components: [] });

        // Send Message
        return await buttonInteraction.followUp({ allowedMentions: { parse: [] }, content: displayMessage });
    }
}
