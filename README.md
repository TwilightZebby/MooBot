# Actions Bot
A small Discord Bot made for Dr1fterX's [Discord Server](https://discord.gg/URH5E34FZf) to add silly Slash Commands.

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


## Can I add this Bot to my own Server?

> **No.**
> 
> This Bot is only made for use on Dr1fterX's Discord Server. Go search on [top.gg](https://top.gg) or ask on [r/discord_bots](https://www.reddit.com/r/Discord_Bots/) if you want your own Bot like this.

---
# Full command list

## Slash Commands

| Command  | Description                 |
|----------|-----------------------------|
| /bonk    | Bonks someone               |
| /boop    | Boops someone               |
| /headpat | Give someone a headpat      |
| /hug     | Give someone a cuddle       |
| /kiss    | Slap a kiss on someone      |
| /sleep   | Tell someone to go to sleep |

### Slash Command Options/Arguments
*What parameters can be passed to the Slash Commands for extra functionality*

| Option | Requirement | Input Type                                   | Description                                   |
|--------|-------------|----------------------------------------------|-----------------------------------------------|
| person | required    | A String, or a User/Role/Everyone @mention\* | Used as the receiver of the Command           |
| gif    | optional    | True/False                                   | Should a GIF be included in the sent message? |

\* *In the sent message, @user and @role mentions are suppressed so they don't send a ping/notification. @everyone/@here mentions are replaced with plain-text "everyone"*


## Text Commands

| Command    | Description                                                     | Limitation    |
|------------|-----------------------------------------------------------------|---------------|
| a!register | Adds a new Slash Command to the Bot                             | Developer\*\* |
| a!delete   | Removes an existing Slash Command from the Bot                  | Developer\*\* |

\*\* *Developer-limited Commands can only be used by TwilightZebby himself.*
