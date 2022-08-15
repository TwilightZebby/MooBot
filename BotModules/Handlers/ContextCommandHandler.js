const { ContextMenuCommandInteraction, DMChannel, Collection } = require("discord.js");
const { Collections } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");

module.exports = {
    /**
     * Handles and runs received Context Commands
     * @param {ContextMenuCommandInteraction} contextInteraction 
     */
    async Main(contextInteraction)
    {
        // Catch for spaces in Context Command Names
        if ( contextInteraction.commandName.includes(" ") )
        {
            contextInteraction.commandName = contextInteraction.commandName.split("_").join(" ");
        }

        const ContextCommand = Collections.ContextCommands.get(contextInteraction.commandName);

        if ( !ContextCommand )
        {
            // Couldn't find the file for this Context Command
            return await contextInteraction.reply({ ephemeral: true, content: LocalizedErrors[contextInteraction.locale].CONTEXT_COMMAND_GENERIC_FAILED_RARE });
        }

        // DM Check
        if ( ContextCommand.Scope === 'DM' && !(contextInteraction.channel instanceof DMChannel) )
        {
            return await contextInteraction.reply({ ephemeral: true, content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_DMS_ONLY });
        }

        // Guild Check
        if ( ContextCommand.Scope === 'GUILD' && (contextInteraction.channel instanceof DMChannel) )
        {
            return await contextInteraction.reply({ ephemeral: true, content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_GUILDS_ONLY });
        }



        // Context Command Cooldowns
        if ( !Collections.ContextCooldowns.has(ContextCommand.Name) )
        {
            // No active Cooldowns found, create new one
            Collections.ContextCooldowns.set(ContextCommand.Name, new Collection());
        }

        // Set initial values
        const Now = Date.now();
        /** @type {Collection} */
        const Timestamps = Collections.ContextCooldowns.get(ContextCommand.Name);
        const CooldownAmount = ( ContextCommand.Cooldown || 3 ) * 1000;

        // Cooldown
        if ( Timestamps.has(contextInteraction.user.id) )
        {
            // Cooldown hit, tell User to cool off a little bit
            const ExpirationTime = Timestamps.get(contextInteraction.user.id) + CooldownAmount;

            if ( Now < ExpirationTime )
            {
                let timeLeft = ( ExpirationTime - Now ) / 1000; // How much time is left of cooldown, in seconds

                switch (timeLeft)
                {
                    // MINUTES
                    case timeLeft >= 60 && timeLeft < 3600:
                        timeLeft = timeLeft / 60; // For UX
                        let cooldownMinutesMessage = LocalizedErrors[contextInteraction.locale].CONTEXT_COMMAND_COOLDOWN_MINUTES.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await contextInteraction.reply({ ephemeral: true, content: cooldownMinutesMessage });

                    // HOURS
                    case timeLeft >= 3600 && timeLeft < 86400:
                        timeLeft = timeLeft / 3600; // For UX
                        let cooldownHoursMessage = LocalizedErrors[contextInteraction.locale].CONTEXT_COMMAND_COOLDOWN_HOURS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await contextInteraction.reply({ ephemeral: true, content: cooldownHoursMessage });

                    // DAYS
                    case timeLeft >= 86400 && timeLeft < 2.628e+6:
                        timeLeft = timeLeft / 86400; // For UX
                        let cooldownDaysMessage = LocalizedErrors[contextInteraction.locale].CONTEXT_COMMAND_COOLDOWN_DAYS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await contextInteraction.reply({ ephemeral: true, content: cooldownDaysMessage });

                    // MONTHS
                    case timeLeft >= 2.628e+6:
                        timeLeft = timeLeft / 2.628e+6; // For UX
                        let cooldownMonthsMessage = LocalizedErrors[contextInteraction.locale].CONTEXT_COMMAND_COOLDOWN_MONTHS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await contextInteraction.reply({ ephemeral: true, content: cooldownMonthsMessage });

                    // SECONDS
                    default:
                        let cooldownSecondsMessage = LocalizedErrors[contextInteraction.locale].CONTEXT_COMMAND_COOLDOWN_SECONDS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await contextInteraction.reply({ ephemeral: true, content: cooldownSecondsMessage });
                }
            }
        }
        else
        {
            // Create new cooldown
            Timestamps.set(contextInteraction.user.id, Now);
            setTimeout(() => Timestamps.delete(contextInteraction.user.id), CooldownAmount);
        }



        // Attempt to run Command
        try { await ContextCommand.execute(contextInteraction); }
        catch (err)
        {
            //console.error(err);
            if ( contextInteraction.deferred )
            {
                await contextInteraction.editReply({ content: LocalizedErrors[contextInteraction.locale].CONTEXT_COMMAND_GENERIC_FAILED });
            }
            else
            {
                await contextInteraction.reply({ ephemeral: true, content: LocalizedErrors[contextInteraction.locale].CONTEXT_COMMAND_GENERIC_FAILED });
            }
        }

        return;
    }
}
