const { ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, Role, GuildMember, EmbedBuilder } = require("discord.js");
const { DiscordClient } = require('../constants.js');
const ActionStrings = require('../JsonFiles/actionMessages.json');
const ActionGifs = require('../JsonFiles/Hidden/ActionGifLinks.json');

// REGEXS
const AuthorRegEx = new RegExp(/{AUTHOR}/g);
const ReceiverRegEx = new RegExp(/{RECEIVER}/g);
const EveryoneMentionRegEx = new RegExp(/@(everyone|here)/g);
const RoleMentionRegEx = new RegExp(/<@&(\d{17,20})>/g);
//const UserMentionRegEx = new RegExp(/<@(\!)(\d{17,20})>/g);

/**
 * Checks for [at]Everyone and [at]Here Mentions in a string
 * 
 * @param {String} string
 * @param {Boolean} [slice] True if wanting to return the string result instead of only testing the RegEx
 * 
 * @returns {Boolean|String}
 */
function TestForEveryoneMention(string, slice)
{
    if ( !slice )
    {
        return EveryoneMentionRegEx.test(string);
    }
    else
    {
        const testString = EveryoneMentionRegEx.test(string);

        if ( !testString )
        {
            return false;
        }
        else
        {
            const matchedString = string.replace('@', '');
            return matchedString;
        }
    }
}


/**
 * Check for [at]Role Mentions
 * 
 * @param {String} string 
 * @param {Boolean} [slice] True if wanting to return the string result instead of just testing the RegEx
 * 
 * @returns {Boolean|String} 
 */
function TestForRoleMention(string, slice)
{  
   if ( !slice )
   {
       return RoleMentionRegEx.test(string);
   }
   else
   {
       const testString = RoleMentionRegEx.test(string);
       
       if ( !testString )
       {
           return false;
       }
       else
       {
           let matchedString = string.replace('<@&', '');
           matchedString = matchedString.replace('>', '');
           return matchedString;
       }
   }
}


module.exports = {
    /**
     * Handles the Action Slash Commands
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async main(slashCommand)
    {
        // Grab data from options
        const PersonOption = slashCommand.options.getMentionable("person", true);
        const GifOptionRaw = slashCommand.options.get("gif");
        const GifOption = GifOptionRaw == null ? undefined : GifOptionRaw.value;
        const ButtonOptionRaw = slashCommand.options.get("button");
        const ButtonOption = ButtonOptionRaw == null ? undefined : ButtonOptionRaw.value;
        const ReasonOptionRaw = slashCommand.options.get("reason");
        const ReasonOption = ReasonOptionRaw == null ? undefined : ReasonOptionRaw.value;


        // Create Button for returning Action
        const ReturnActionActionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`return-action_${slashCommand.commandName}_${slashCommand.user.id}_${PersonOption.id}`).setStyle(ButtonStyle.Primary).setLabel(`Return ${slashCommand.commandName}`)
        );
        // Button Boolean, for knowing if the Button should be included or not (do not appear when told not too, when a GIF is wanted, and when the Mention is *not* of a User/Member)
        let displayButton = false;
        // Override for GIF-less responses, if a Role mention is used as to prevent accidental Role Pings!
        let forceDisplayEmbed = false;
        // For assembling the returned message
        let displayMessage = "";

        
        // Assemble the message!
        // @everyone and @here
        if ( (PersonOption instanceof Role) && (PersonOption.id === PersonOption.guild.id) )
        {
            displayMessage = ActionStrings['EVERYONE'][`${slashCommand.commandName}`];
            displayMessage = displayMessage.replace(AuthorRegEx, `${slashCommand.member.displayName}`);
        }
        // @role
        else if ( (PersonOption instanceof Role) && (PersonOption.id !== PersonOption.guild.id) )
        {
            forceDisplayEmbed = true;
            displayMessage = ActionStrings['ROLE'][`${slashCommand.commandName}`];
            displayMessage = displayMessage.replace(AuthorRegEx, `${slashCommand.member.displayName}`).replace(ReceiverRegEx, `<@&${PersonOption.id}>`);
        }
        // @user (self)
        else if ( (PersonOption instanceof GuildMember) && (PersonOption.id === slashCommand.user.id) )
        {
            displayMessage = ActionStrings['SELF_USER'][`${slashCommand.commandName}`];
            displayMessage = displayMessage.replace(AuthorRegEx, `${slashCommand.member.displayName}`);
        }
        // @user (this bot)
        else if ( (PersonOption instanceof GuildMember) && (PersonOption.id === DiscordClient.user.id) )
        {
            displayMessage = ActionStrings['MOOBOT'][`${slashCommand.commandName}`];
            displayMessage = displayMessage.replace(AuthorRegEx, `${slashCommand.member.displayName}`).replace(ReceiverRegEx, `${PersonOption.displayName}`);
        }
        // @user (literally any bot that isn't this one)
        else if ( (PersonOption instanceof GuildMember) && PersonOption.user.bot )
        {
            displayMessage = ActionStrings['OTHER_BOT'][`${slashCommand.commandName}`];
            displayMessage = displayMessage.replace(AuthorRegEx, `${slashCommand.member.displayName}`).replace(ReceiverRegEx, `${PersonOption.displayName}`);
        }
        // @user (literally any other User that doesn't meet the above)
        else
        {
            displayButton = true;
            displayMessage = ActionStrings['OTHER_USER'][`${slashCommand.commandName}`];
            displayMessage = displayMessage.replace(AuthorRegEx, `${slashCommand.member.displayName}`).replace(ReceiverRegEx, `${PersonOption.displayName}`);
        }


        // If custom message is given, check for stray @mentions!
        if ( ReasonOption )
        {
            if ( TestForEveryoneMention(ReasonOption) ) { forceDisplayEmbed = true; }
            if ( TestForRoleMention(ReasonOption) ) { forceDisplayEmbed = true; }
            displayMessage += ` ${ReasonOption}`;
        }

        // Hide Return Action Button if requested
        if ( ButtonOption === false ) { displayButton = false; }


        // GIF was requested
        if ( GifOption )
        {
            const ActionEmbed = new EmbedBuilder().setDescription(displayMessage)
            .setImage(ActionGifs[`${slashCommand.commandName}`][Math.floor(( Math.random() * ActionGifs[`${slashCommand.commandName}`].length ) + 0)])
            .setColor(PersonOption instanceof Role ? PersonOption.hexColor : PersonOption instanceof GuildMember ? PersonOption.displayHexColor : 'Random');

            await slashCommand.reply({ allowedMentions: { parse: [] }, embeds: [ActionEmbed] });
            delete ActionEmbed;
            return;
        }
        // GIF was NOT requested
        else
        {
            if ( forceDisplayEmbed )
            {
                const ActionEmbed = new EmbedBuilder().setDescription(displayMessage)
                .setColor(PersonOption instanceof Role ? PersonOption.hexColor : PersonOption instanceof GuildMember ? PersonOption.displayHexColor : 'Random');
                await slashCommand.reply({ allowedMentions: { parse: [] }, embeds: [ActionEmbed] });
                delete ActionEmbed;
                return;
            }
            else
            {
                if ( displayButton )
                {
                    await slashCommand.reply({ allowedMentions: { parse: [] }, components: [ReturnActionActionRow], content: displayMessage });
                
                    // Auto remove button after around 5 minutes, to keep chats clean
                    setTimeout(async () => {
                        return await slashCommand.editReply({ components: [] });
                    }, 60000);
                }
                else
                {
                    await slashCommand.reply({ allowedMentions: { parse: [] }, content: displayMessage });
                }
            }
        }

        return;
    }
}
