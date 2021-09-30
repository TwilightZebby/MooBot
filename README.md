# Actions Bot
A small Discord Bot made for Dr1fterX's [Discord Server](https://discord.gg/URH5E34FZf) to add Kawaii-Bot style Slash Commands.

---
# Questions

## Who is Dr1fterX?

> Dr1fterX is a small-ish Live Streamer on Twitch, and used to create content for the Black Plasma Gaming channel on YouTube before that YT Channel was archived in early 2020.
> You can find his Twitch Channel over at [twitch.tv/Dr1fterX](https://twitch.tv/Dr1fterX)

## What kind of Slash Commands are there?

> Mainly ones like /hug, /bonk, /headpat, etc. You know, roleplay-style. (Think similar to the now shutdown Kawaii Bot)


## Why did you make this Bot?

> Mixture of "felt like it" and "wanted to finally bring back some of the old functionality/commands from the long-dead Kawaii Bot"


## How many Slash Commands are there/will there be?

> For now I am limiting myself to a maximum of 10.
> Even though Discord's API supports up to 100 Guild Slash Commands per Bot per Guild, and another 100 Global Slash Commands per Bot; I am using this lower limit to prevent flooding the Slash Command Interface/GUI :)
> 
> *(Well actually the true limit is 62.5k commands per scope, should you account for sub-commands and sub-command groups. But the UI still needs improving for this lol)*


## Can I add this Bot to my own Server?

> **No.**
> 
> This Bot is only made for use on Dr1fterX's Discord Server. Go search on [top.gg](https://top.gg) or ask on [r/discord_bots](https://www.reddit.com/r/Discord_Bots/) if you want your own Bot like this.

---
# Full command list

## Action Slash Commands

| Command  | Description                 | Has Context Version?\* |
|----------|-----------------------------|------------------------|
| /bonk    | Bonks someone               | Yes                    |
| /boop    | Boops someone               | Yes                    |
| /headpat | Give someone a headpat      | Yes                    |
| /hug     | Give someone a cuddle       | No                     |
| /kiss    | Slap a kiss on someone      | No                     |
| /sleep   | Tell someone to go to sleep | No                     |
| /slap    | Slap someone                | No                     |

\* *"Has Context Version?" refers to if the Slash Command has a Context Command version as well*

### Action Slash Command Options/Arguments
*What parameters can be passed to the Action Slash Commands for extra functionality*

| Option | Requirement | Input Type                   | Description                                         |
|--------|-------------|------------------------------|-----------------------------------------------------|
| person | required    | Any User or Role Mention\*\* | Used as the receiver of the Command                 |
| gif    | optional    | True/False                   | Should a GIF be included in the sent message?       |
| reason | optional    | A String                     | A custom message to attach after the action message |


\*\* *In the sent message, @user and @role mentions are suppressed so they don't send a ping/notification. @everyone/@here mentions are replaced with plain-text "everyone"*


## Other Slash Commands

| Command       | Description                                                |
|---------------|------------------------------------------------------------|
| /start\*\*\*  | Used to trigger one of Discord's built-in Voice Activities |

\*\*\* *This Slash Command will be removed from the Actions Bot once Discord fully releases their (currently in testing) Social Activites feature. As an additional note, all this command does is generate an Invite Link for the chosen Voice Channel, with included data to also point to the chosen Social Activity (such as YouTube Together, Poker Night, etc). As an additional note, if you want to help Discord test their Voice Game/Activity features - you can join their official server at [discord.gg/discordgameslab](https://discord.gg/discordgameslab)*



## Text Commands

| Command           | Description                                                       | Limitation        |
|-------------------|-------------------------------------------------------------------|-------------------|
| a!register        | Adds a new Slash Command to the Bot                               | Developer\*\*\*\* |
| a!registercontext | Adds a new Context Command to the Bot                             | Developer\*\*\*\* |
| a!delete          | Removes an existing Slash Command from the Bot                    | Developer\*\*\*\* |
| a!deletecontext   | Removes an existing Context Command from the Bot                  | Developer\*\*\*\* |
| a!setmsg          | Adds a custom pre-set Action Message for a User                   | Developer\*\*\*\* |
| a!clearmsgs       | Removes all custom pre-set Action Messages for a User             | Developer\*\*\*\* |
| a!addgif          | Adds a new GIF link to an Action Slash Command                    | Developer\*\*\*\* |

\*\*\*\* *Developer-limited Commands can only be used by TwilightZebby himself.*
