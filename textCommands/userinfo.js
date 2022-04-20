// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');
const UTILITY = require('../modules/utilityModule.js');



// EMOJIS
const EMOJI_OWNER_CROWN = "<:ServerOwner:961186488626847774>";
const EMOJI_BOOST = "<:Boost:961186488635228170>";
const EMOJI_ROLE = "<:Role:961186488551342150>";
const EMOJI_TIMEOUT = "<:timeout:966309135685652480>";



// User Flags in UX friendly format
const UserFlagsToStrings = {
    "DISCORD_EMPLOYEE": "Discord Employee",
    "PARTNERED_SERVER_OWNER": "Partnered Server Owner",
    "HYPESQUAD_EVENTS": "HypeSquad Events",
    "BUGHUNTER_LEVEL_1": "Bug Hunter Tier 1",
    "BUGHUNTER_LEVEL_2": "Bug Hunter Tier 2",
    "HOUSE_BRAVERY": "HypeSquad Bravery House",
    "HOUSE_BRILLIANCE": "HypeSquad Brilliance House",
    "HOUSE_BALANCE": "HypeSquad Balance House",
    "EARLY_SUPPORTER": "Early Nitro Supporter",
    "VERIFIED_BOT": "Verified Bot",
    "EARLY_VERIFIED_BOT_DEVELOPER": "Early Verified Bot Developer",
    "DISCORD_CERTIFIED_MODERATOR": "Discord Certified Moderator",
    "BOT_HTTP_INTERACTIONS": "HTTP Interactions-only Bot"
};



module.exports = {
    // Command Name
    name: 'userinfo',
    // Description of command
    description: `Shows information about either the User who ran this Command, or another Server Member`,
    // Category of Command, used for Help Command
    category: 'general',

    // Alias(es) of command, if any
    // Uncomment if there will be some
    //alias: [],

    // Command Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 120,

    // Is command intended for DM usage with the Bot only?
    // DO NOT HAVE THIS AND "guildOnly" UNCOMMENTED - ONLY ONE OR THE OTHER OR NEITHER
    //dmOnly: true,

    // Is command intended for Guild usage only?
    // DO NOT HAVE THIS AND "dmOnly" UNCOMMENTED - ONLY ONE OR THE OTHER OR NEITHER
    guildOnly: true,

    // Is at least one argument required?
    //requiresArguments: true,

    // What is the minimum required arguments?
    // THIS REQUIRES "requiresArguments" TO BE UNCOMMENTED
    //minimumArguments: 2,

    // What is the maximum required arguments?
    // Is usable/settable no matter if "requiresArguments" is un/commented
    maximumArguments: 1,

    // Command Limitation - limits who can use this Command
    //    - "developer" for TwilightZebby only
    //    - "owner" for Guild Owners & TwilightZebby
    //    - "admin" for those with the ADMIN Guild Permission, Guild Owners, & TwilightZebby
    //    - "moderator" for those with Moderator-level Guild Permissions, Admins, Guild Owners, & TwilightZebby
    //    - "everyone" (or commented out) for everyone to use this command
    limitation: "moderator",



    /**
     * Main function that runs the command
     * 
     * @param {Discord.Message} message Origin Message that triggered this command
     * @param {Array<String>} arguments The given arguments of the command. Can be empty if no arguments were passed!
     */
    async execute(message, arguments)
    {
        /** @type {Discord.GuildMember} */
        let targetMember;

        if ( arguments?.length > 0 )
        {
            // Another Server Member was given
            if ( UTILITY.TestForUserMention(arguments[0]) )
            {
                targetMember = await message.guild.members.fetch(UTILITY.TestForUserMention(arguments[0], true));
            }
            else
            {
                try {
                    targetMember = await message.guild.members.fetch(arguments[0]);
                } catch (err) {
                    return await message.reply({ content: `Sorry, that was an invalid User \`@mention\`, or an invalid User ID, or was a User not in this Server.`, allowedMentions: { parse: [], repliedUser: false } });
                }
            }
        }
        else
        {
            // Use Author Member
            targetMember = await message.member.fetch();
        }



        // Grab the data to display in Embed
        const userEmbed = new Discord.MessageEmbed();
        userEmbed.setAuthor({ iconURL: targetMember.displayAvatarURL({ dynamic: true, format: 'png' }), name: `${targetMember.user.username}#${targetMember.user.discriminator}` });
        userEmbed.setColor(targetMember.displayHexColor);
        userEmbed.addFields({
            name: `>> General Member Information`,
            value: `**Display Name:** \`${targetMember.displayName}\`${message.guild.ownerId === targetMember.id ? `\n**Is Server Owner** ${EMOJI_OWNER_CROWN}` : ""}\n**Highest Role:** <@&${targetMember.roles.highest.id}>\n**Joined Server:** <t:${Math.floor(targetMember.joinedAt.getTime() / 1000)}:R>\n**Role Count:** ${EMOJI_ROLE} ${targetMember.roles.cache.size}${targetMember.pending ? `\nHas yet to pass Membership Screening` : ""}${targetMember.premiumSince != null ? `\n**Boosting Server Since:** ${EMOJI_BOOST} <t:${Math.floor(targetMember.premiumSince.getTime() / 1000)}:R>` : ""}${targetMember.isCommunicationDisabled() ? `\nIs currently Timed-out ${EMOJI_TIMEOUT}` : ""}`
        });
        userEmbed.addFields({
            name: `>> General User Information`,
            value: `**Account Created:** <t:${Math.floor(targetMember.user.createdAt.getTime() / 1000)}:R>\n**Bot User:** ${targetMember.user.bot}${targetMember.user.system ? `\nIs Discord's official System User` : ""}`
        });
        // Now for the User's Flags
        const rawUserFlags = await targetMember.user.fetchFlags();
        const userFlagStrings = [];
        rawUserFlags.toArray().forEach(flag => userFlagStrings.push(UserFlagsToStrings[flag]));
        if ( rawUserFlags.has(1 << 20) ) { userFlagStrings.push("**Known Spammer**"); }
        
        if ( userFlagStrings.length > 0 ) { userEmbed.addFields({ name: `>> User Flags`, value: userFlagStrings.join(', ') }); }
        userEmbed.setFooter({ text: `${targetMember.id}` });

        return await message.reply({ embeds: [userEmbed], allowedMentions: { parse: [], repliedUser: false } });
    }
};
