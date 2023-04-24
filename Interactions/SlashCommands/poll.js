const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, PermissionFlagsBits, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Collections } = require("../../constants.js");

const EmptyPollEmbed = new EmbedBuilder().setDescription(`*Poll is currently empty. Please use the Select Menu below to configure this Poll.*`);

const InitialSelectMenu = new ActionRowBuilder().addComponents([
    new StringSelectMenuBuilder().setCustomId(`create-poll`).setMinValues(1).setMaxValues(1).setPlaceholder("Please select an action").setOptions([
        //new StringSelectMenuOptionBuilder().setLabel("Set Poll Type").setValue("set-type").setDescription("Change how the Poll will behave once saved").setEmoji(`🔧`),
        new StringSelectMenuOptionBuilder().setLabel("Configure Embed").setValue("configure-embed").setDescription("Set the Question, Description, and Colour of the Poll").setEmoji(`<:StatusRichPresence:842328614883295232>`),
        new StringSelectMenuOptionBuilder().setLabel("Cancel Creation").setValue("cancel").setDescription("Cancels creation of this Poll").setEmoji(`❌`)
    ])
]);

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "poll",

    // Command's Description
    Description: `Create Polls that Users can vote on!`,

    // Command's Category
    Category: "MANAGEMENT",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 30,

    // Cooldowns for specific subcommands and/or subcommand-groups
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandCooldown: {
        "create": 30
    },

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "GUILD",

    // Scope of specific Subcommands Usage
    //     One of the following: DM, GUILD, ALL
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandScope: {
        "create": "GUILD"
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
        Data.defaultMemberPermissions = PermissionFlagsBits.ManageChannels;
        Data.options = [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "create",
                description: "Create a new Poll for Users to vote in"
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
        const Subcommand = slashCommand.options.getSubcommand(true);

        switch(Subcommand)
        {
            // Create a Poll
            case "create":
                // Ensure there isn't already an active Poll Creation happening in that Guild
                if ( Collections.PollCreation.has(slashCommand.guildId) )
                {
                    await slashCommand.reply({ ephemeral: true, content: `Sorry, but there seems to already be an active Poll Creation happening on this Server right now; either by yourself or someone else.\nPlease either wait for the User to finish creating their Poll, or for the inactive Creation timer to expire (which is about one hour from initial use of Command).` });
                    break;
                }

                // Send initial Message
                await slashCommand.reply({ ephemeral: true, components: [InitialSelectMenu], embeds: [EmptyPollEmbed],
                    content: `__**Poll Creation**__
Use the Select Menu to configure the Poll's Embed and Buttons. Press an existing Button to edit its label and/or emoji.

An auto-updating preview of what your new Poll will look like is shown below.`
                });

                // Create Collection Cache
                // Auto-expire cache after one hour
                let timeoutExpiry = setTimeout(() => { Collections.PollCreation.delete(slashCommand.guildId); }, 3.6e+6);

                let newPollObject = {
                    type: "SINGLE_CHOICE",
                    embed: new EmbedBuilder(),
                    choices: [],
                    buttons: [],
                    interaction: null,
                    timeout: timeoutExpiry
                };

                Collections.PollCreation.set(slashCommand.guildId, newPollObject);
                break;


            default:
                await slashCommand.reply({ ephemeral: true, content: `Sorry, an error occurred while trying to run this Command...` });
                break;
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
