const { ModalSubmitInteraction, ModalMessageModalSubmitInteraction } = require("discord.js");
const { Collections } = require("../../constants.js");

module.exports = {
    /**
     * Handles and runs received Modals
     * @param {ModalSubmitInteraction|ModalMessageModalSubmitInteraction} modalInteraction 
     */
    async Main(modalInteraction)
    {
        // Grab first part of Custom ID
        const ModalCustomId = modalInteraction.customId.split("_").shift();
        const Modal = Collections.Modals.get(ModalCustomId)

        if ( !Modal )
        {
            // Couldn't find the file for this Modal
            return await modalInteraction.reply({ ephemeral: true, content: "Sorry, but there was a problem trying to process that Modal submission." });
        }


        // Attempt to process Modal
        try { await Modal.execute(modalInteraction); }
        catch (err)
        {
            //console.error(err);
            if ( modalInteraction.deferred )
            {
                await modalInteraction.editReply({ content: "Sorry, but there was a problem trying to process that Modal submission." });
            }
            else
            {
                await modalInteraction.reply({ ephemeral: true, content: "Sorry, but there was a problem trying to process that Modal submission." });
            }
        }

        return;
    }
}
