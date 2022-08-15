const { ModalSubmitInteraction } = require("discord.js");
const { Collections } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");

module.exports = {
    /**
     * Handles and runs received Modals
     * @param {ModalSubmitInteraction} modalInteraction 
     */
    async Main(modalInteraction)
    {
        // Grab first part of Custom ID
        const ModalCustomId = modalInteraction.customId.split("_").shift();
        const Modal = Collections.Modals.get(ModalCustomId)

        if ( !Modal )
        {
            // Couldn't find the file for this Modal
            return await modalInteraction.reply({ ephemeral: true, content: LocalizedErrors[modalInteraction.locale].MODAL_GENERIC_FAILED_RARE });
        }


        // Attempt to process Modal
        try { await Modal.execute(modalInteraction); }
        catch (err)
        {
            //console.error(err);
            if ( modalInteraction.deferred )
            {
                await modalInteraction.editReply({ content: LocalizedErrors[modalInteraction.locale].MODAL_GENERIC_FAILED });
            }
            else
            {
                await modalInteraction.reply({ ephemeral: true, content: LocalizedErrors[modalInteraction.locale].MODAL_GENERIC_FAILED });
            }
        }

        return;
    }
}
