# Actions Bot - Privacy Policy

## Last Updated: 13th November 2021

**Actions Bot** (henseforth "**The Bot**") does __not__, and will __never__, collect & store Messages or User Data without explicit notice.

As of the current iteration, **The Bot** does not store any Messages, and only listens to the `MESSAGE_CREATE` Event from Discord's API for its Developer-only commands to function (such as `a!addgif`, `a!register`, etc). All these commands (except for one) are viewable, as is the rest of **The Bot**'s code, in TwilightZebby's GitHub Repro.

For full transparency, the type of data the Bot *does* uses and/or stores is listed below:

- Discord User ID - used for identifying who to grant the Birthday Role to
- User's Birth Month and Date (**not** Birth Year) - used for knowing *when* to give the User in question the Birthday Role

Furthermore, this data is only given to the Bot when explicitly given by the User through the use of the `/birthday set` command. The Birth Month and Date are stored and processed as Integers (for example, "December" becomes 11, "January" becomes 0, etc).

The data stored for a User (as listed above) is deleted should one of two conditions occur:

- Either the User in question runs the `/birthday remove` command, explicitly telling the Bot to delete their data,
- OR the User leaves Dr1fterX's Discord Server, in which the Bot will remove their data, should they have any stored.

Additionally, the Birthday Bot's [source code is open-sourced](https://github.com/TwilightZebby/ActionsBot), should one wish to see for themselves how and when data is handled by the Bot.

*This Privacy Policy is subject to change at any time.*
