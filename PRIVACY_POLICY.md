# MooBot - Privacy Policy

## Last Updated: 22nd March 2022

**MooBot** (henseforth "**The Bot**") does __not__, and will __never__, collect & store Messages or User Data without explicit notice.

As of the current iteration, **The Bot** does not store any Messages, and only listens to the `MESSAGE_CREATE` Event from Discord's API for its Developer-only commands to function (such as `a!addgif`, `a!register`, etc), and for the "Auto Quoter Module" to function. All these commands (except for one) are viewable, as is the rest of **The Bot**'s code, in TwilightZebby's GitHub Repo ( https://github.com/TwilightZebby/MooBot ).

**The Bot** does, however, store information *explicitly given* to **The Bot** by the User for its "Self Assignable Role" system to function. The data collected is as listed:

- IDs for
    - Roles, to know which Role to grant or revoke to a Server Member upon clicking a Button on a "Role Menu"
    - Messages, specifically only Messages sent by **The Bot** that also contains a "Role Menu"
    - Channels, and Guilds, as to know where the "Role Menu"'s Message is
    - Custom Emojis, if given, to be displayed in the specified Button on a "Role Menu"
- Strings specified to be displayed as Labels for Buttons, or as Titles/Descriptions on Embeds, for "Role Menus"

Should the User want to remove a "Role Menu", all they need to do is delete the Message containing the "Role Menu". **The Bot** will detect this (by listening to the `MESSAGE_DELETE` API Event) and thus, remove all data it has regarding that "Role Menu".

The Developer of **The Bot**, TwilightZebby, is contactable via the listed methods below should any queries be asked about **The Bot**:

- GitHub, preferrably via opening an Issue Ticket or Discussion on **The Bot**'s [GitHub Repo](https://github.com/TwilightZebby/MooBot);
- Discord, by asking TwilightZebby in Dr1fterX's Discord Server ( found at https://discord.gg/URH5E34FZf );
    - Please note, TwilightZebby has his Discord Direct Messages (DM's) disabled unless you are also in one of very few servers that he has them enabled for, hense why this isn't offered as a contact method
    - TwilightZebby's Discord Name: `TwilightZebby#1955`, and Discord User ID: `156482326887530498`
- Twitter, [@TwilightZebby](https://twitter.com/TwilightZebby)

Please also see [Discord's own Privacy Policy](https://discord.com/privacy).

*This Privacy Policy is subject to change at any time.*
