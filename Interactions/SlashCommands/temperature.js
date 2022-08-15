const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, ApplicationCommandOptionType, AutocompleteInteraction } = require("discord.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");
const LocalizedStrings = require("../../JsonFiles/stringMessages.json");

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "temperature",

    // Command's Description
    Description: `Convert a given temperature between degrees C, F, and K`,

    // Command's Category
    Category: "INFORMATIONAL",

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
    Scope: "ALL",

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
        Data.dmPermission = true;
        Data.options = [
            {
                type: ApplicationCommandOptionType.Integer,
                name: "value",
                description: "The temperature value you want to convert",
                min_value: -460,
                max_value: 1000,
                required: true
            },
            {
                type: ApplicationCommandOptionType.String,
                name: "scale",
                description: "The temperature scale of the original value",
                required: true,
                choices: [
                    { name: "Celsius", value: "c" },
                    { name: "Fahernheit", value: "f" },
                    { name: "Kelvin", value: "k" }
                ]
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
        // Grab values
        const ValueOption = slashCommand.options.getInteger("value", true);
        const ScaleOption = slashCommand.options.getString("scale", true);


        // Convert
        switch (ScaleOption)
        {
            // C TO F/K
            case "c":
                const CToF = (ValueOption * 9/5) + 32;
                const CToK = ValueOption + 273.15;
                if ( CToK < 0 ) { return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale].TEMPERATURE_COMMAND_BELOW_ABSOLUTE_ZERO.replace("{{TEMPERATURE}}", `${ValueOption}C`) }); }
                await slashCommand.reply({ ephemeral: true, content: LocalizedStrings[slashCommand.locale].TEMPERATURE_COMMAND_SINGLE_RESULT.replace("{{ORIGINAL_TEMPERATURE}}", `${ValueOption}C`).replace("{{CONVERTED_TEMPERATURE_ONE}}", `${CToF.toFixed(0)}F`).replace("{{CONVERTED_TEMPERATURE_TWO}}", `${CToK.toFixed(0)}K`) });
                break;

            // F TO C/K
            case "f":
                const FToC = (ValueOption - 32) * 5/9;
                const FToK = (ValueOption - 32) * 5/9 + 273.15;
                if ( FToK < 0 ) { return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale].TEMPERATURE_COMMAND_BELOW_ABSOLUTE_ZERO.replace("{{TEMPERATURE}}", `${ValueOption}F`) }); }
                await slashCommand.reply({ ephemeral: true, content: LocalizedStrings[slashCommand.locale].TEMPERATURE_COMMAND_SINGLE_RESULT.replace("{{ORIGINAL_TEMPERATURE}}", `${ValueOption}F`).replace("{{CONVERTED_TEMPERATURE_ONE}}", `${FToC.toFixed(0)}C`).replace("{{CONVERTED_TEMPERATURE_TWO}}", `${FToK.toFixed(0)}K`) });
                break;

            // K TO C/F
            case "k":
                const KToC = ValueOption - 273.15;
                const KToF = (ValueOption - 273.15) * 9/5 + 32;
                if ( ValueOption < 0 ) { return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale].TEMPERATURE_COMMAND_BELOW_ABSOLUTE_ZERO.replace("{{TEMPERATURE}}", `${ValueOption}K`) }); }
                await slashCommand.reply({ ephemeral: true, content: LocalizedStrings[slashCommand.locale].TEMPERATURE_COMMAND_SINGLE_RESULT.replace("{{ORIGINAL_TEMPERATURE}}", `${ValueOption}K`).replace("{{CONVERTED_TEMPERATURE_ONE}}", `${KToC.toFixed(0)}C`).replace("{{CONVERTED_TEMPERATURE_TWO}}", `${KToF.toFixed(0)}F`) });
                break;

            default:
                return await slashCommand.reply({ ephemeral: true, content: LocalizedErrors[slashCommand.locale].SLASH_COMMAND_GENERIC_FAILED });
        }

        return;
    },



    /**
     * Handles given Autocomplete Interactions for any Options in this Slash CMD that uses it
     * @param {AutocompleteInteraction} autocompleteInteraction 
     */
    async autocomplete(autocompleteInteraction)
    {
        //.
    }
}
