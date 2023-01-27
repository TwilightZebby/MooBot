const { ChatInputCommandInteraction, ChatInputApplicationCommandData, AutocompleteInteraction, ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommandOptionChoiceData } = require("discord.js");
const { DiscordClient } = require("../../constants.js");
const Config = require("../../config.js");

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "unregister",

    // Command's Description
    Description: `Unregisters an App Command from Discord's API for the Bot`,

    // Command's Category
    Category: "DEVELOPER",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 10,

    // Cooldowns for specific subcommands and/or subcommand-groups
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandCooldown: {
        "example": 3
    },

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "GUILD",
    
    // Scope of specific Subcommands Usage
    //     One of the following: DM, GUILD, ALL
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandScope: {
        "example": "GUILD"
    },



    /**
     * Returns data needed for registering Slash Command onto Discord's API
     * @returns {ChatInputApplicationCommandData}
     */
    registerData()
    {
        /** @type {ChatInputApplicationCommandData} */
        const Data = {};

        Data.name = this.Name;
        Data.description = this.Description;
        Data.type = ApplicationCommandType.ChatInput;
        Data.dmPermission = false;
        Data.defaultMemberPermissions = PermissionFlagsBits.Administrator;
        Data.options = [
            {
                type: ApplicationCommandOptionType.String,
                name: "commandid",
                description: "ID of App Command to unregister",
                maxLength: 20,
                required: true
            },
            {
                type: ApplicationCommandOptionType.String,
                name: "scope",
                description: "Where to unregister command from",
                autocomplete: true,
                required: true
            }
        ];

        return Data;
    },



    /**
     * Executes the Slash Command
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async execute(slashCommand)
    {
        // Defer
        await slashCommand.deferReply({ ephemeral: true });

        // Check only Bot Dev can use this
        if ( slashCommand.user.id !== Config.BotDevID ) { return await slashCommand.editReply({ content: "Sorry, but that Slash Command can only be used by my developer!" }) }

        // Grab Inputs
        const InputCommandId = slashCommand.options.getString("commandid", true);
        const InputScope = slashCommand.options.getString("scope", true);

        // Unregister based on Scope
        if ( InputScope === "global" )
        {
            // Globally unregister
            return await DiscordClient.application.commands.delete(InputCommandId)
            .then(async () => { return await slashCommand.editReply({ content: "Successfully unregistered that App Command." }); })
            .catch(async (err) => { return await slashCommand.editReply({ content: "Something went wrong while attempting to unregister that App Command." }); });
        }
        else
        {
            // Unregister on a per-Guild basis
            return await DiscordClient.application.commands.delete(InputCommandId, InputScope)
            .then(async () => { return await slashCommand.editReply({ content: `Successfully unregistered that App Command from the Guild with the ID of ${InputScope}` }); })
            .catch(async (err) => { return await slashCommand.editReply({ content: `Something went wrong while attempting to unregister that App Command from the Guild with the ID of ${InputScope}` }); });
        }
    },



    /**
     * Handles given Autocomplete Interactions for any Options in this Slash CMD that uses it
     * @param {AutocompleteInteraction} autocompleteInteraction 
     */
    async autocomplete(autocompleteInteraction)
    {
        // Fetch which option this Autocomplete is for
        const CurrentOption = autocompleteInteraction.options.getFocused(true);

        switch (CurrentOption.name)
        {
            case "scope":
                return await this.autocompleteScope(autocompleteInteraction);

            default:
                return await autocompleteInteraction.respond([{name: "ERROR: Unable to process, please contact this Bot's developer.", value: "ERROR_FAILED" }]);
        }
    },



    /**
     * Handles Autocomplete for the Scope Option
     * @param {AutocompleteInteraction} autocompleteInteraction 
     */
     async autocompleteScope(autocompleteInteraction)
     {
         // Grab currently typed Input
         const TypedInput = autocompleteInteraction.options.getFocused();
         /** @type {Array<ApplicationCommandOptionChoiceData>} */
         let filteredResults = [{name: "Global", value: "global"}]; // To ensure Global Scope is selectable
         // Bring in Guilds Bot is in, so that we can register per-Guild if wanted
         const BotGuilds = await DiscordClient.guilds.fetch();
         
         // Confirm not blank input
         if ( !TypedInput || TypedInput == "" || TypedInput == " " )
         {
             // Blank Input, default to all Guilds
             BotGuilds.forEach(guild => filteredResults.push({name: guild.name, value: guild.id}));
         }
         else
         {
             // Not a blank input, filter based on input
             let lowerCaseInput = TypedInput.toLowerCase();
             let filteredGuilds = BotGuilds.filter(guild => guild.id.match(TypedInput) || guild.name.toLowerCase().startsWith(lowerCaseInput) || guild.name.toLowerCase().includes(lowerCaseInput));
             filteredGuilds.forEach(guild => filteredResults.push({name: guild.name, value: guild.id}));
         }
 
         // Ensure below 25 option limit
         if ( filteredResults.length > 25 ) { filteredResults.slice(0, 24); }
 
         // Respond
         return await autocompleteInteraction.respond(filteredResults);
     }
}
