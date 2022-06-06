↖ *Want to jump to a specific section/question? Use the navigation menu!* (Which doesn't seem to exist on the GitHub Mobile App 😅)

⚠ **This README File is currently in the process of being rewritten. If you want to see the old version, please see the `main` branch by [clicking here](https://github.com/TwilightZebby/MooBot/tree/main#moobot).**

# MooBot
A small general-purpose Discord Bot made by TwilightZebby, originally for Dr1fterX's [Discord Server](https://discord.gg/URH5E34FZf), but can be used in other Servers on a case-by-case basis.

---
# Questions

## What kind of features are there?

> Originally intended to only add Kawaii-bot style Slash Commands (such as `/bonk`, `/boop`, `/headpat`, etc), this Bot has since expanded into a general-purpose Bot to add other features like a Temperature Converter, Button-Role System, and more.
> 
> All of this Bot's features are [listed below](https://github.com/TwilightZebby/MooBot#features-list).


## Why did you make this Bot?

> This Bot was born out from a mixture of "felt like it" and a want to bring back some of the commands from the long-since discontinued Kawaii Bot.
> The Bot, with its original name of "Actions Bot", was originally first added to Dr1fterX's Server in January 2021, getting renamed to "MooBot" in March 2022.


## Why did you rename the Bot?

> The original name, "Actions Bot", was picked because of the simple nature of the bot - to add action-based Slash Commands.
> Now that the Bot is being used for more features, which are less action-based (such as Button-Roles or the Temperature Convertor), TwilightZebby thought a name change was in order since "Actions Bot" isn't accurate anymore.

### Why did you pick "MooBot" as the new name?

> "MooBot" was picked as a reference to an old meme in Dr1fterX's community in which TwilightZebby was a cow. Yes, as in the animal.
> 
> That meme has since long vanished as per TwilightZebby's request, and he would humbly request no one refer to him as a cow anymore. He's a bot now! ;3 


## How many Slash Commands are there/will there be?

> ~~For now TwilightZebby is limiting himself to a maximum of 11.~~
> ~~Even though Discord's API supports up to 100 Guild Slash Commands per Bot per Guild, and another 100 Global Slash Commands per Bot; TwilightZebby is using this lower limit to prevent flooding the Slash Command Interface/GUI :)~~
> 
> ~~*(Well actually the true limit is 62.5k commands per scope, should you account for sub-commands and sub-command groups. But the UI still needs improving for this lol)*~~

> While the above used to be true, Discord's Application Commands system has since started to improve greatly. As such, TwilightZebby is slowly allowing more Slash Commands to be added (but would like to keep below 20 total until the Slash Command List is improved to support compacted Sub-Commands).


## Can I add this Bot to my own Server?

> ~~**No.**~~
> 
> ~~This Bot is only made for use on Dr1fterX's Discord Server. Go search on [top.gg](https://top.gg) or ask on [r/discord_bots](https://www.reddit.com/r/Discord_Bots/) if you want your own Bot like this.~~
>
> As of April 2022, TwilightZebby is allowing this MooBot to be added to other Servers, with limitations (won't add to your Server if I don't know you personally, and won't make a permanent public invite link for this Bot - you'd have to ask TwilightZebby directly for the Bot's invite).

---
# Command List
*🛡 denotes if the command can only be used by Server Moderators, that is, Users with elevated permissions, such as "Manage Roles".*

- Action Commands
    - `/bonk`
    - `/boop`
    - `/headpat`
    - `/hug`
    - `/kiss`
    - `/pummel`
    - `/slap`
    - `/sleep`
- `/info`
    - `/info bot`
    - `/info server`
    - `/info invite`
    - `/info user`
- Role Menu Commands
    - `/rolemenu create` 🛡
    - `/rolemenu configure` 🛡
- `/potato`
- `/start`
- `/temperature`
- Server-Specific Commands
    - Dr1fterX's Server ("St1g Gaming")
        - `/rule`

---
# Features List

## Action Commands
![Screenshot of the bonk command's response in a Discord Chat](https://i.imgur.com/kMjSwvb.png)
> *Example of one of the Action Commands used in a Text Channel*

These are Slash Commands which are based on, or inspired by, the old Kawaii Bot style commands.

They have three arguments, one required & two optional, when typing the Command - in order, they are the target User/Role, if a GIF should be included in the responce, and a custom reason for using the Command.
![Screenshot of the headpat command being typed in, as an example of the three arguments](https://i.imgur.com/nxZbNXa.png)

The Bot will automatically suppress (remove the ping from) any mentions included in both the target User/Role, and the custom reason, when sending the message in chat. Furthermore, to prevent against accidental pings caused by the rare case of Discord breaking the `allowed_mentions` field in their API (it has happened once before!), Role and `@everyone` pings are sent inside an Embed (since Discord doesn't process mentions into pings if they are inside an Embed).

Should an Action Command be used, when targeting a specific User and with *no* GIF attached, a "Return action" button is included. This allows the target of the action to return the favor (so to speak). The Button is removed after one use or after ~5 minutes, whichever is first.

## Information Commands
MooBot has a selection of classic Information Commands, allowing you to see some information about a Server, User, Discord Invite, or MooBot itself.

### Bot Information Sub-Command (`/info bot`)
![Screenshot of the Bot Information Sub Command's response](https://i.imgur.com/mdZ4z4f.png)
> *Example of the response for the Bot Info Sub-Command*

Brings up basic information about MooBot itself, including:

- A link to this GitHub Repo
- The Bot's current version
- The version of the [Discord.JS Library](https://discord.js.org/#/) the Bot is currently running on
- How many Application Commands (Slash & Context) the Bot has, both globally, and in the current Server
    - *(Some Application Commands can be registered to only be seen/usable within a specific Server)*
- The current uptime for the Bot (i.e. how long it has been online in its current session)
- How many Servers MooBot is currently in

### Invite Information Sub-Command (`/info invite`)
![Screenshot of the Invite Information Sub Command's response](https://i.imgur.com/De6t828.png)
> *Example of the response for the Invite Info Sub-Command*

Brings up information about the Server Invite (and its target Server), including (if returned in Discord's API):

- Who created the Invite
- When the Invite was created
- When the Invite will expire
- The Channel Type & Name that the Invite points
- ***Limited*** information about the Server the Invite points to, including:
    - Server's Description
    - Server's Name
    - Server's Partnered and Verified Status
    - Server's current total, and online, Member count
    - The Feature Flags the Server has ([See more info about Feature Flags here](https://github.com/Delitefully/DiscordLists#guild-feature-glossary))

### Server Information Sub-Command (`/info server`)
![Screenshot of the Server Information Sub Command's response](https://i.imgur.com/5DOZb3i.png)
> *Example of the response for the Server Info Sub-Command*

Brings up information about the Server this Sub-Command was used in, including:

- Server's Name & Description
- Partnered and Verified Status
- When the Server was created
- The current Owner of the Server
- The current number of Boosts the Server has, and its current Boost Tier/Level
- The number of Channels the Server has, and how many of each *type* of Channel the Server has
    - If the Server has the `"Use External Emojis"` Permission disabled for the `@everyone` Role, this will switch from using Emojis to using Initials for the Channel Types - due to a limitation with Discord's API.
    - The initials are as follows:
        - T = Text; N = News/Announcement; V = Voice; S = Stage; C = Category
- The number of Custom Emojis, Stickers, and Roles
- The *approximate* total number of Server Members, and how many are currently online
- Current status of Security & Moderation Server Settings (as found in `Server Settings > Moderation`, or `Server Settings > Overview`)
- Current NSFW Status, (currently something only force-set by Discord themselves?)
- The Feature Flags the Server has ([See more info about Feature Flags here](https://github.com/Delitefully/DiscordLists#guild-feature-glossary))
