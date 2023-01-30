const { ButtonInteraction } = require("discord.js");

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
            // Classic Role Menu. Grants Role if User doesn't have it, revokes Role if User does have it.
            case "TOGGLE":
                await toggleRole(buttonInteraction, RoleID);
                break;


            // Swappable Role Menu. Users can only have ONE Role at a time per SWAPPABLE Menu. Example use case: Colour Roles.
            case "SWAP":
                await swapRole(buttonInteraction, RoleID);
                break;
                

            // Single-use Role Menu. Users can only use a SINGLE-USE Menu once, and cannot remove the Role they get nor swap it. Example use case: Team Roles for events.
            case "SINGLE":
                await singleRole(buttonInteraction, RoleID);
                break;


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
    // Using Forced Fetches to ensure updated Role Caches for the Member
    const Member = await buttonInteraction.guild.members.fetch({ user: buttonInteraction.user.id, force: true });

    // Grab all the Role IDs on that Menu, to check if the Member already has a Role from this Menu
    const MenuButtons = buttonInteraction.message.components;
    let menuRoleIds = [];
    MenuButtons.forEach(row => {
        row.components.forEach(button => {
            menuRoleIds.push(button.customId.split("_").pop());
        });
    });

    let memberHasRole = false;
    let roleAlreadyHave = null;
    menuRoleIds.forEach(Id => {
        if ( Member.roles.cache.has(Id) )
        {
            memberHasRole = true;
            roleAlreadyHave = Id;
            return;
        }
    });


    // Member does NOT have any Roles from this Menu, so grant the selected Role
    if ( !memberHasRole )
    {
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
    }
    // Member DOES have a Role from this Menu already
    else
    {
        // If selecting Role Member already has, revoke it
        if ( Member.roles.cache.has(RoleID) )
        {
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
        }
        // Otherwise, swap the two Roles
        else
        {
            try
            {
                await Member.roles.remove(roleAlreadyHave, `Role Menu in ${buttonInteraction.channel.name} - Swapping Roles (Revoking current Role)`)
                .then(async TempMember => {
                    await Member.roles.add(RoleID, `Role Menu in ${buttonInteraction.channel.name} - Swapping Roles (Granting new Role)`)
                    .then(async TempMemberTheSecond => {
                        await buttonInteraction.editReply({ content: `Successfully swapped the <@&${roleAlreadyHave}> Role for the <@&${RoleID}> Role for you.` });
                        return;
                    });
                });
            }
            catch (err)
            {
                //console.error(err);
                await buttonInteraction.editReply({ content: `Sorry, something went wrong while trying to __swap__ between the <@&${roleAlreadyHave}> and <@&${RoleID}> Roles for you...` });
            }
        }
    }

    return;
}






/**
 * Handles Role Button Interactions from SINGLE Menu Types
 * @param {ButtonInteraction} buttonInteraction 
 * @param {String} RoleID
 */
async function singleRole(buttonInteraction, RoleID)
{
    // Using Forced Fetches to ensure updated Role Caches for the Member
    const Member = await buttonInteraction.guild.members.fetch({ user: buttonInteraction.user.id, force: true });

    // Grab all the Role IDs on that Menu, to check if the Member already has a Role from this Menu
    const MenuButtons = buttonInteraction.message.components;
    let menuRoleIds = [];
    MenuButtons.forEach(row => {
        row.components.forEach(button => {
            menuRoleIds.push(button.customId.split("_").pop());
        });
    });

    let memberHasRole = false;
    let roleAlreadyHave = null;
    menuRoleIds.forEach(Id => {
        if ( Member.roles.cache.has(Id) )
        {
            memberHasRole = true;
            roleAlreadyHave = Id;
            return;
        }
    });


    // Member does NOT have any Roles from this Menu, so grant the selected Role
    if ( !memberHasRole )
    {
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
    }
    // Member DOES have a Role from this Menu already
    else
    {
        // Reject because this is a single-use Menu and Members can't even self-revoke Roles from this type of Menu
        await buttonInteraction.editReply({ content: `Sorry! You cannot swap or revoke Roles from yourself using Single-use Role Menus.\nThese Single-use Role Menus are designed to only be usable once per User per Menu.\n\n*You already have the <@&${roleAlreadyHave}> Role from this Menu!*` });
        return;
    }
}
