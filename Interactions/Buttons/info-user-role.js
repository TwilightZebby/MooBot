const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");

module.exports = {
    // Button's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "info-user-role",

    // Button's Description
    Description: `Shows Roles a Member has, as part of /info user Subcommand`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 60,



    /**
     * Executes the Button
     * @param {ButtonInteraction} buttonInteraction 
     */
    async execute(buttonInteraction)
    {
        // Grab Target Member
        const TargetMemberId = buttonInteraction.customId.split("_").pop();
        const FetchedMember = await buttonInteraction.guild.members.fetch(TargetMemberId);
        const MemberRoles = FetchedMember.roles.cache.filter(role => role.id !== buttonInteraction.guildId); // Filter out atEveryone

        // Sort Roles by position
        const SortedMemberRoles = MemberRoles.sort((roleA, roleB) => roleB.rawPosition - roleA.rawPosition);

        // Role Mention Strings
        let roleStrings = [];
        SortedMemberRoles.forEach(role => roleStrings.push(`<@&${role.id}>`));

        // Construct Embed
        const RoleInfoEmbed = new EmbedBuilder().setColor(FetchedMember.displayHexColor)
        .setAuthor({ name: `${FetchedMember.displayName}'s Roles`, iconURL: FetchedMember.displayAvatarURL({ extension: 'png' }) })
        .setDescription(roleStrings.join(', '));

        // Send
        return buttonInteraction.reply({ ephemeral: true, embeds: [RoleInfoEmbed] });
    }
}
