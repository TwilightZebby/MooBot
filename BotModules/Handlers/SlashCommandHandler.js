const { ChatInputCommandInteraction, ApplicationCommandOptionType, DMChannel, Collection } = require("discord.js");
const { Collections } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");

module.exports = {
    /**
     * Handles and runs received Slash Commands
     * @param {ChatInputCommandInteraction} slashInteraction 
     */
    async Main(slashInteraction)
    {
        const SlashCommand = Collections.SlashCommands.get(slashInteraction.commandName);

        if ( !SlashCommand )
        {
            // Couldn't find the file for this Slash Command
            return await slashInteraction.reply({ ephemeral: true, content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_GENERIC_FAILED_RARE });
        }

        // Checks for SubCommand or SubCommand-Groups, so that they can have their own Cooldowns
        const SubcommandCheck = slashInteraction.options.data.find(cmd => cmd.type === ApplicationCommandOptionType.Subcommand);
        const SubcommandGroupCheck = slashInteraction.options.data.find(cmd => cmd.type === ApplicationCommandOptionType.SubcommandGroup);
        if ( SubcommandGroupCheck != undefined ) { return await this.SubcommandGroup(slashInteraction, SlashCommand); }
        if ( SubcommandCheck != undefined ) { return await this.Subcommand(slashInteraction, SlashCommand); }

        // DM Check
        if ( SlashCommand.Scope === 'DM' && !(slashInteraction.channel instanceof DMChannel) )
        {
            return await slashInteraction.reply({ ephemeral: true, content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_DMS_ONLY });
        }

        // Guild Check
        if ( SlashCommand.Scope === 'GUILD' && (slashInteraction.channel instanceof DMChannel) )
        {
            return await slashInteraction.reply({ ephemeral: true, content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_GUILDS_ONLY });
        }



        // Slash Command Cooldowns
        if ( !Collections.SlashCooldowns.has(SlashCommand.Name) )
        {
            // No active Cooldowns found, create new one
            Collections.SlashCooldowns.set(SlashCommand.Name, new Collection());
        }

        // Set initial values
        const Now = Date.now();
        /** @type {Collection} */
        const Timestamps = Collections.SlashCooldowns.get(SlashCommand.Name);
        const CooldownAmount = ( SlashCommand.Cooldown || 3 ) * 1000;

        // Cooldown
        if ( Timestamps.has(slashInteraction.user.id) )
        {
            // Cooldown hit, tell User to cool off a little bit
            const ExpirationTime = Timestamps.get(slashInteraction.user.id) + CooldownAmount;

            if ( Now < ExpirationTime )
            {
                let timeLeft = ( ExpirationTime - Now ) / 1000; // How much time is left of cooldown, in seconds

                switch (timeLeft)
                {
                    // MINUTES
                    case timeLeft >= 60 && timeLeft < 3600:
                        timeLeft = timeLeft / 60; // For UX
                        let cooldownMinutesMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_MINUTES.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownMinutesMessage });

                    // HOURS
                    case timeLeft >= 3600 && timeLeft < 86400:
                        timeLeft = timeLeft / 3600; // For UX
                        let cooldownHoursMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_HOURS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownHoursMessage });

                    // DAYS
                    case timeLeft >= 86400 && timeLeft < 2.628e+6:
                        timeLeft = timeLeft / 86400; // For UX
                        let cooldownDaysMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_DAYS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownDaysMessage });

                    // MONTHS
                    case timeLeft >= 2.628e+6:
                        timeLeft = timeLeft / 2.628e+6; // For UX
                        let cooldownMonthsMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_MONTHS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownMonthsMessage });

                    // SECONDS
                    default:
                        let cooldownSecondsMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_SECONDS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownSecondsMessage });
                }
            }
        }
        else
        {
            // Create new cooldown
            Timestamps.set(slashInteraction.user.id, Now);
            setTimeout(() => Timestamps.delete(slashInteraction.user.id), CooldownAmount);
        }



        // Attempt to run Command
        try { await SlashCommand.execute(slashInteraction); }
        catch (err)
        {
            //console.error(err);
            if ( slashInteraction.deferred )
            {
                await slashInteraction.editReply({ content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_GENERIC_FAILED });
            }
            else
            {
                await slashInteraction.reply({ ephemeral: true, content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_GENERIC_FAILED });
            }
        }

        return;
    },



    /**
     * Handles and runs received Slash Commands, when a Subcommand is used
     * @param {ChatInputCommandInteraction} slashInteraction 
     * @param {*} SlashCommand File with Slash Command's data
     */
    async Subcommand(slashInteraction, SlashCommand)
    { 
        // Grab data
        const SubcommandName = slashInteraction.options.getSubcommand();
        const CombinedName = `${slashInteraction.commandName}_${SubcommandName}`;

        // DM Check
        if ( SlashCommand.SubcommandScope[SubcommandName] === 'DM' && !(slashInteraction.channel instanceof DMChannel) )
        {
            return await slashInteraction.reply({ ephemeral: true, content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_DMS_ONLY });
        }
 
        // Guild Check
        if ( SlashCommand.SubcommandScope[SubcommandName] === 'GUILD' && (slashInteraction.channel instanceof DMChannel) )
        {
            return await slashInteraction.reply({ ephemeral: true, content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_GUILDS_ONLY });
        }
 
 
 
        // Slash Command Cooldowns
        if ( !Collections.SlashCooldowns.has(CombinedName) )
        {
            // No active Cooldowns found, create new one
            Collections.SlashCooldowns.set(CombinedName, new Collection());
        }
 
        // Set initial values
        const Now = Date.now();
        /** @type {Collection} */
        const Timestamps = Collections.SlashCooldowns.get(CombinedName);
        const CooldownAmount = ( SlashCommand.SubcommandCooldown[SubcommandName] || 3 ) * 1000;
 
        // Cooldown
        if ( Timestamps.has(slashInteraction.user.id) )
        {
            // Cooldown hit, tell User to cool off a little bit
            const ExpirationTime = Timestamps.get(slashInteraction.user.id) + CooldownAmount;
 
            if ( Now < ExpirationTime )
            {
                let timeLeft = ( ExpirationTime - Now ) / 1000; // How much time is left of cooldown, in seconds
 
                switch (timeLeft)
                {
                    // MINUTES
                    case timeLeft >= 60 && timeLeft < 3600:
                        timeLeft = timeLeft / 60; // For UX
                        let cooldownMinutesMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_MINUTES.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownMinutesMessage });

                    // HOURS
                    case timeLeft >= 3600 && timeLeft < 86400:
                        timeLeft = timeLeft / 3600; // For UX
                        let cooldownHoursMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_HOURS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownHoursMessage });

                    // DAYS
                    case timeLeft >= 86400 && timeLeft < 2.628e+6:
                        timeLeft = timeLeft / 86400; // For UX
                        let cooldownDaysMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_DAYS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownDaysMessage });

                    // MONTHS
                    case timeLeft >= 2.628e+6:
                        timeLeft = timeLeft / 2.628e+6; // For UX
                        let cooldownMonthsMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_MONTHS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownMonthsMessage });

                    // SECONDS
                    default:
                        let cooldownSecondsMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_SECONDS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownSecondsMessage });
                }
            }
        }
        else
        {
            // Create new cooldown
            Timestamps.set(slashInteraction.user.id, Now);
            setTimeout(() => Timestamps.delete(slashInteraction.user.id), CooldownAmount);
        }
 
 
 
        // Attempt to run Command
        try { await SlashCommand.execute(slashInteraction); }
        catch (err)
        {
            //console.error(err);
            if ( slashInteraction.deferred )
            {
                await slashInteraction.editReply({ content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_GENERIC_FAILED });
            }
            else
            {
                await slashInteraction.reply({ ephemeral: true, content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_GENERIC_FAILED });
            }
        }
 
        return;
    },



    /**
     * Handles and runs received Slash Commands, when a Subcommand Group is used
     * @param {ChatInputCommandInteraction} slashInteraction 
     * @param {*} SlashCommand File with Slash Command's data
     */
    async SubcommandGroup(slashInteraction, SlashCommand)
    { 
        // Grab data
        const SubcommandGroupName = slashInteraction.options.getSubcommandGroup();
        const SubcommandName = slashInteraction.options.getSubcommand();
        const CombinedSubcommandName = `${SubcommandGroupName}_${SubcommandName}`;
        const CombinedName = `${slashInteraction.commandName}_${SubcommandGroupName}_${SubcommandName}`;

        // DM Check
        if ( SlashCommand.SubcommandScope[CombinedSubcommandName] === 'DM' && !(slashInteraction.channel instanceof DMChannel) )
        {
            return await slashInteraction.reply({ ephemeral: true, content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_DMS_ONLY });
        }
 
        // Guild Check
        if ( SlashCommand.SubcommandScope[CombinedSubcommandName] === 'GUILD' && (slashInteraction.channel instanceof DMChannel) )
        {
            return await slashInteraction.reply({ ephemeral: true, content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_GUILDS_ONLY });
        }
 
 
 
        // Slash Command Cooldowns
        if ( !Collections.SlashCooldowns.has(CombinedName) )
        {
            // No active Cooldowns found, create new one
            Collections.SlashCooldowns.set(CombinedName, new Collection());
        }
 
        // Set initial values
        const Now = Date.now();
        /** @type {Collection} */
        const Timestamps = Collections.SlashCooldowns.get(CombinedName);
        const CooldownAmount = ( SlashCommand.SubcommandCooldown[CombinedSubcommandName] || 3 ) * 1000;
 
        // Cooldown
        if ( Timestamps.has(slashInteraction.user.id) )
        {
            // Cooldown hit, tell User to cool off a little bit
            const ExpirationTime = Timestamps.get(slashInteraction.user.id) + CooldownAmount;
 
            if ( Now < ExpirationTime )
            {
                let timeLeft = ( ExpirationTime - Now ) / 1000; // How much time is left of cooldown, in seconds
 
                switch (timeLeft)
                {
                    // MINUTES
                    case timeLeft >= 60 && timeLeft < 3600:
                        timeLeft = timeLeft / 60; // For UX
                        let cooldownMinutesMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_MINUTES.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownMinutesMessage });

                    // HOURS
                    case timeLeft >= 3600 && timeLeft < 86400:
                        timeLeft = timeLeft / 3600; // For UX
                        let cooldownHoursMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_HOURS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownHoursMessage });

                    // DAYS
                    case timeLeft >= 86400 && timeLeft < 2.628e+6:
                        timeLeft = timeLeft / 86400; // For UX
                        let cooldownDaysMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_DAYS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownDaysMessage });

                    // MONTHS
                    case timeLeft >= 2.628e+6:
                        timeLeft = timeLeft / 2.628e+6; // For UX
                        let cooldownMonthsMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_MONTHS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownMonthsMessage });

                    // SECONDS
                    default:
                        let cooldownSecondsMessage = LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_COOLDOWN_SECONDS.replace("{{commandCooldown}}", `${timeLeft.toFixed(1)}`);
                        return await slashInteraction.reply({ ephemeral: true, content: cooldownSecondsMessage });
                }
            }
        }
        else
        {
            // Create new cooldown
            Timestamps.set(slashInteraction.user.id, Now);
            setTimeout(() => Timestamps.delete(slashInteraction.user.id), CooldownAmount);
        }
 
 
 
        // Attempt to run Command
        try { await SlashCommand.execute(slashInteraction); }
        catch (err)
        {
            //console.error(err);
            if ( slashInteraction.deferred )
            {
                await slashInteraction.editReply({ content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_GENERIC_FAILED });
            }
            else
            {
                await slashInteraction.reply({ ephemeral: true, content: LocalizedErrors[slashInteraction.locale].SLASH_COMMAND_GENERIC_FAILED });
            }
        }
 
        return;
    }
}
