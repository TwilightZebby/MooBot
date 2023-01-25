const { ButtonInteraction } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");

module.exports = {
    // Button's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "role",

    // Button's Description
    Description: `Handles granting or revoking Roles via Role Menus`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 5,



    /**
     * Executes the Button
     * @param {ButtonInteraction} buttonInteraction 
     */
    async execute(buttonInteraction)
    {
        // Just in case
        await buttonInteraction.deferReply({ ephemeral: true });

        // Fetch Role ID
        const RoleID = buttonInteraction.customId.split("_").pop();

        // Check what Menu Type this is
        const RoleMenuJson = require('../../JsonFiles/Hidden/RoleMenus.json');
        const MenuData = RoleMenuJson[buttonInteraction.message.id];

        switch (MenuData["MENU_TYPE"])
        {
            // Classic Role Menu. Grants Role if doesn't have it, revokes Role if does have it.
            case "TOGGLE":
                await toggleRole(buttonInteraction, RoleID);
                break;


            // Swappable Role Menu. Members can only have ONE Role at a time per SWAPPABLE Menu. Example use case: Colour Roles.
            // This is placeholder for the time being. Swappable Role Menus will come in a future update to this Bot
            /* case "SWAP":
                await swapRole(buttonInteraction, RoleID);
                break; */


            default:
                buttonInteraction.editReply({ content: `An error occurred while trying to process that Button press...` });
                break;
        }

        return;
    }
}






/**
 * Handles Role Button Interactions from TOGGLE Menu Types
 * @param {ButtonInteraction} buttonInteraction 
 * @param {String} RoleID
 */
async function toggleRole(buttonInteraction, RoleID)
{
    // Check if Member already has the Role
    // Using Forced Fetches to ensure updated Role Caches for the Member
    const Member = await buttonInteraction.guild.members.fetch({ user: buttonInteraction.user.id, force: true });

    if ( Member.roles.cache.has(RoleID) )
    {
        // Member DOES already have this Role, so REVOKE it instead
        try
        {
            await Member.roles.remove(RoleID, `Role Menu in #${buttonInteraction.channel.name}`)
            .then(async Member => {
                await buttonInteraction.editReply({ content: `Successfully __revoked__ the <@&${RoleID}> Role from you.` });
                return;
            });
        }
        catch (err)
        {
            //console.error(err);
            await buttonInteraction.editReply({ content: `Sorry, something went wrong while trying to __revoke__ the <@&${RoleID}> Role from you...` });
        }

        return;
    }
    else
    {
        // Member does NOT have Role, so GRANT it
        try
        {
            await Member.roles.add(RoleID, `Role Menu in #${buttonInteraction.channel.name}`)
            .then(async Member => {
                await buttonInteraction.editReply({ content: `Successfully __granted__ the <@&${RoleID}> Role to you.` });
                return;
            });
        }
        catch (err)
        {
            //console.error(err);
            await buttonInteraction.editReply({ content: `Sorry, something went wrong while trying to __grant__ the <@&${RoleID}> Role to you...` });
        }

        return;
    }
}






/**
 * Handles Role Button Interactions from SWAP Menu Types
 * @param {ButtonInteraction} buttonInteraction 
 * @param {String} RoleID
 */
async function swapRole(buttonInteraction, RoleID)
{
    //.
}
