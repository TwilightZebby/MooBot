# MooBot
A small general-purpose Discord Bot made by TwilightZebby, for Dr1fterX's [Discord Server](https://discord.gg/URH5E34FZf).

---
# Questions

## Who is Dr1fterX?

> Dr1fterX is a small-ish Live Streamer on Twitch, and used to create content for the [Black Plasma Gaming](https://www.youtube.com/c/BlackPlasmaGaming) channel on YouTube before that YT Channel was archived in early 2020.
> You can find his Twitch Channel over at [twitch.tv/Dr1fterX](https://twitch.tv/Dr1fterX)


## What kind of features are there?

> Originally intended to only add Kawaii-bot style Slash Commands (such as `/bonk`, `/boop`, `/headpat`, etc), this Bot has since expanded into a general-purpose Bot to add other features like a Temperature Converter, Button-Role System, and more.


## Why did you make this Bot?

> This Bot was born out from a mixture of "felt like it" and a want to bring back some of the commands from the long-since discontinued Kawaii Bot.
> The Bot, with its original name of "Actions Bot", was originally added to Dr1fterX's Server in January 2021, getting renamed to "MooBot" in March 2022.


## Why did you rename the Bot?

> The original name, "Actions Bot", was picked because of the simple nature of the bot - to add action-based Slash Commands.
> Now that the Bot is being used for more features, which are less action-based (such as the `/potato` command or the Temperature Convertor), TwilightZebby thought a name change was in order since "Actions Bot" isn't accurate anymore.

### Why did you pick "MooBot" as the new name?

> "MooBot" was picked as a reference to an old meme in Dr1fterX's community in which TwilightZebby was a cow. Yes, as in the animal.
> 
> That meme has since long vanished as per TwilightZebby's request, and he would humbly request no one refer to him as a cow anymore. He's a bot now! ;3 


## How many Slash Commands are there/will there be?

> ~~For now TwilightZebby is limiting himself to a maximum of 11.~~
> ~~Even though Discord's API supports up to 100 Guild Slash Commands per Bot per Guild, and another 100 Global Slash Commands per Bot; TwilightZebby is using this lower limit to prevent flooding the Slash Command Interface/GUI :)~~
> 
> ~~*(Well actually the true limit is 62.5k commands per scope, should you account for sub-commands and sub-command groups. But the UI still needs improving for this lol)*~~

> While the above used to be true, Discord's Application Commands system has since started to improve greatly. As such, TwilightZebby is slowly allowing more Slash Commands to be added (but would like to keep below 20 total until the Slash Command List is improved to support hidden and compacted Commands).


## Can I add this Bot to my own Server?

> **No.**
> 
> This Bot is only made for use on Dr1fterX's Discord Server. Go search on [top.gg](https://top.gg) or ask on [r/discord_bots](https://www.reddit.com/r/Discord_Bots/) if you want your own Bot like this.


---
# Full command list

## Action Slash Commands

| Command  | Description                 | Note                                                         |
|----------|-----------------------------|--------------------------------------------------------------|
| /bonk    | Bonks someone               |                                                              |
| /boop    | Boops someone               |                                                              |
| /headpat | Give someone a headpat      |                                                              |
| /hug     | Give someone a cuddle       |                                                              |
| /kiss    | Slap a kiss on someone      |                                                              |
| /pummel  | Pummel someone, JoJo style  | Does *not* have the GIF toggle option, will always use a GIF |
| /slap    | Slap someone                |                                                              |
| /sleep   | Tell someone to go to sleep | Does *not* have a "Return to Sender" Button                  |


### Action Slash Command Options/Arguments
*What parameters can be passed to the Action Slash Commands for extra functionality*

| Option | Requirement | Input Type                   | Description                                         |
|--------|-------------|------------------------------|-----------------------------------------------------|
| person | required    | Any User or Role Mention\*   | Used as the receiver of the Command                 |
| gif    | optional    | True/False                   | Should a GIF be included in the sent message?       |
| reason | optional    | A String                     | A custom message to attach after the action message |


\* *In the sent message, @user and @role mentions are suppressed so they don't send a ping/notification. @everyone/@here mentions are replaced with plain-text "everyone"*


## Other Slash Commands

| Command       | Description                                                | Note                                                                       |
|---------------|------------------------------------------------------------|----------------------------------------------------------------------------|
| /start\*\*    | Used to trigger one of Discord's built-in Voice Activities | Will be removed when Discord fully releases their Voice Activities feature |
| /potato       | Starts a Hot Potato game for the current Channel           |                                                                            |
| /rolemenu     | Used to create or edit Self-Assignable Role Menus          | Only usable by those with the `MANAGE_ROLES` Permission                    |

\*\* *This Slash Command will be removed from this Bot once Discord fully releases their (currently in testing) Social Activites feature. As an additional note, all this command does is generate an Invite Link for the chosen Voice Channel, with included data to also point to the chosen Social Activity (such as Watch Together, Poker Night, etc). As an additional note, if you want to help Discord test their Voice Game/Activity features - you can join their official server at [discord.gg/discordgameslab](https://discord.gg/discordgameslab)*


## Context Commands
*These are commands that appear when you right-click a Message or User in chat, and found under the "Apps" sub-menu of the Context Menu*

*Note: Context Commands are correctly __only__ available/usage on Desktop/Browser Discord, due to the Mobile apps not having support for them yet*

| Command             | Type    | Description                                                                    |
|---------------------|---------|--------------------------------------------------------------------------------|
| Convert Temperature | Message | If there is a temperature in the source message, it will be converted to C/F/K |


## Text Commands

| Command               | Description                                            | Limitation      |
|-----------------------|--------------------------------------------------------|-----------------|
| a!register            | Adds a new Slash/Context Command to the Bot            | Developer\*\*\* |
| a!unregister          | Removes an existing Slash/Context Command from the Bot | Developer\*\*\* |
| a!addgif              | Adds a new GIF link to the specified Action Slash CMD  | Developer\*\*\* |
| a!clearcomp           | Clears components from a Message sent by this Bot      | Developer\*\*\* |
| a!say                 | Silly Command                                          | Developer\*\*\* |

\*\*\* *Developer-limited Commands can only be used by TwilightZebby himself.*
