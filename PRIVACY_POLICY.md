# MooBot - Privacy Policy
Last Updated: 26th January 2023

---

**MooBot** (henseforth "**The Bot**") does __not__, and will __never__, collect & store Messages or User Data without explicit notice.

As of the current iteration, **The Bot** does not store any Messages, and only listens to the `MESSAGE_CREATE` Event from Discord's API for its Developer-only commands to function. All these commands are viewable, as is the rest of **The Bot**'s code, in TwilightZebby's GitHub Repo ( https://github.com/TwilightZebby/MooBot ).

**The Bot** does, however, store information *explicitly given* to **The Bot** by the User for its "Self Assignable Role" system to function. The data collected is as listed:

- IDs for
    - Roles, to know which Role to grant or revoke to a Server Member upon clicking a Button on a "Role Menu"
    - Messages, specifically only Messages sent by **The Bot** that also contains a "Role Menu"
    - Channels, and Guilds, as to know where the "Role Menu"'s Message is
    - Custom Emojis, if given, to be displayed in the specified Button on a "Role Menu"
- Strings specified to be displayed as Labels for Buttons, or as Titles/Descriptions on Embeds, for "Role Menus"

Should the User want to remove a "Role Menu", all they need to do is delete the Message containing the "Role Menu". **The Bot** will detect this (by listening to the `MESSAGE_DELETE` API Event) and thus, remove all data it has regarding that "Role Menu".

The Developer of **The Bot**, TwilightZebby, is contactable for matters regarding **The Bot** via GitHub, preferrably via opening an Issue Ticket or Discussion on **The Bot**'s [GitHub Repo](https://github.com/TwilightZebby/MooBot).

Please also see [Discord's own Privacy Policy](https://discord.com/privacy).

*This Privacy Policy is subject to change at any time.*
