↖ *Want to jump to a specific section/question? Use the navigation menu!* (Which doesn't seem to exist on the GitHub Mobile App 😅)

# MooBot
A small general-purpose Discord Bot made by TwilightZebby, primarily for Dr1fterX's [Discord Server](https://discord.gg/URH5E34FZf), but can be used in other Servers on a case-by-case basis.

---
# Questions

## What kind of features are there?

> Originally intended to only add Kawaii-bot style Slash Commands (such as `/bonk`, `/boop`, `/headpat`, etc), this Bot has since expanded into a general-purpose Bot to add other features like a Temperature Converter, Button-Role System, and more.
> 
> All of this Bot's features are [listed below](https://github.com/TwilightZebby/MooBot#features-list).


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

> ~~**No.**~~
> 
> ~~This Bot is only made for use on Dr1fterX's Discord Server. Go search on [top.gg](https://top.gg) or ask on [r/discord_bots](https://www.reddit.com/r/Discord_Bots/) if you want your own Bot like this.~~
>
> As of April 2022, TwilightZebby is allowing this MooBot to be added to other Servers, with limitations (won't add to your Server if I don't know you personally, and won't make a permanent public invite link for this Bot - you'd have to ask TwilightZebby directly for the Bot's invite).


---
# Features list

## Action Slash Commands
### `/bonk [target] (gif) (reason)`
*Outputs a message in chat, bonking the specified User, Role, or Everyone.*

![Screenshot of the bonk command's response in a Discord Chat](https://i.imgur.com/kMjSwvb.png)

| Argument | Type         | Description                                             | Required |
|----------|--------------|---------------------------------------------------------|----------|
| target   | @mentionable | The Target User, Role, or Everyone                      | ✔️      |
| gif      | Boolean      | Should a random GIF be included in the response?        |          |
| reason   | String       | A custom message to attach to the *end* of the response |          |

### `/boop [target] (gif) (reason)`
*Outputs a message in chat, booping the specified User, Role, or Everyone.*

![Screenshot of the boop command's response in a Discord Chat](https://i.imgur.com/10J8fet.png)

| Argument | Type         | Description                                             | Required |
|----------|--------------|---------------------------------------------------------|----------|
| target   | @mentionable | The Target User, Role, or Everyone                      | ✔️      |
| gif      | Boolean      | Should a random GIF be included in the response?        |          |
| reason   | String       | A custom message to attach to the *end* of the response |          |

### `/headpat [target] (gif) (reason)`
*Outputs a message in chat, giving the specified User, Role, or Everyone a headpat.*

![Screenshot of the headpat command's response in a Discord Chat](https://i.imgur.com/mfX0n7G.png)

| Argument | Type         | Description                                             | Required |
|----------|--------------|---------------------------------------------------------|----------|
| target   | @mentionable | The Target User, Role, or Everyone                      | ✔️      |
| gif      | Boolean      | Should a random GIF be included in the response?        |          |
| reason   | String       | A custom message to attach to the *end* of the response |          |

### `/hug [target] (gif) (reason)`
*Outputs a message in chat, giving the specified User, Role, or Everyone a cuddle.*

![Screenshot of the hug command's response in a Discord Chat](https://i.imgur.com/nBbY0Xl.png)

| Argument | Type         | Description                                             | Required |
|----------|--------------|---------------------------------------------------------|----------|
| target   | @mentionable | The Target User, Role, or Everyone                      | ✔️      |
| gif      | Boolean      | Should a random GIF be included in the response?        |          |
| reason   | String       | A custom message to attach to the *end* of the response |          |

### `/kiss [target] (gif) (reason)`
*Outputs a message in chat, kissing the specified User, Role, or Everyone.*

![Screenshot of the kiss command's response in a Discord Chat](https://i.imgur.com/34vxCpR.png)

| Argument | Type         | Description                                             | Required |
|----------|--------------|---------------------------------------------------------|----------|
| target   | @mentionable | The Target User, Role, or Everyone                      | ✔️      |
| gif      | Boolean      | Should a random GIF be included in the response?        |          |
| reason   | String       | A custom message to attach to the *end* of the response |          |

### `/pummel [target] (reason)`
*Outputs a message in chat, pummelling the specified User, Role, or Everyone.*

![Screenshot of the pummel command's response in a Discord Chat](https://i.imgur.com/uwssQbz.png)

| Argument | Type         | Description                                             | Required |
|----------|--------------|---------------------------------------------------------|----------|
| target   | @mentionable | The Target User, Role, or Everyone                      | ✔️      |
| reason   | String       | A custom message to attach to the *end* of the response |          |

### `/slap [target] (gif) (reason)`
*Outputs a message in chat, slapping the specified User, Role, or Everyone.*

![Screenshot of the slap command's response in a Discord Chat](https://i.imgur.com/9r5z1RG.png)

| Argument | Type         | Description                                             | Required |
|----------|--------------|---------------------------------------------------------|----------|
| target   | @mentionable | The Target User, Role, or Everyone                      | ✔️      |
| gif      | Boolean      | Should a random GIF be included in the response?        |          |
| reason   | String       | A custom message to attach to the *end* of the response |          |

### `/sleep [target] (gif) (reason)`
*Outputs a message in chat, telling the specified User, Role, or Everyone to go to sleep already!*

![Screenshot of the sleep command's response in a Discord Chat](https://i.imgur.com/LqiKpH6.png)

| Argument | Type         | Description                                             | Required |
|----------|--------------|---------------------------------------------------------|----------|
| target   | @mentionable | The Target User, Role, or Everyone                      | ✔️      |
| gif      | Boolean      | Should a random GIF be included in the response?        |          |
| reason   | String       | A custom message to attach to the *end* of the response |          |

### Other Action Command features
- All the Action Slash Commands, with the exemption of `/sleep` and `/pummel`, include a "Return x" Button alongside their responses, allowing the specified User (NOT Role or Everyone) Target to be able to return the Action within a short (<2 minute) window.
- All the Action Slash Commands' responses are set to *suppress* all @mentions, as a safety measure against accidental or malicious pinging


## General Slash Commands
### `/start [channel] [activity]`
*Creates an Invite Link to the specified Voice Channel, allowing for starting one of Discord's built-in (but in beta) Social Activities in that Voice Channel.*

![Screenshot of the start command's response in a Discord Chat](https://i.imgur.com/uYNQ3Tg.png)

| Argument | Type          | Description                                             | Required |
|----------|---------------|---------------------------------------------------------|----------|
| channel  | #VoiceChannel | The Voice Channel the Activity should be started in     | ✔️      |
| activity | String        | The Activity to start (from a pre-set list of options)  | ✔️      |

- ℹ *This Slash Command will be removed from this Bot once Discord fully releases their (currently in testing) Social Activites feature.*
- ℹ *All this command does is generate an Invite Link for the chosen Voice Channel, with included data to also point to the chosen Social Activity (such as Watch Together, Poker Night, etc).*
- ℹ *If you want to help Discord test their Social Activity features - you can join their official server at [discord.gg/discordgameslab](https://discord.gg/discordgameslab)*

### `/potato`
*Starts a game of Hot Potato in the current Text or Thread Channel.*

![Screenshot of the message when the potato command is used to start a Hot Potato game in a Discord Chat](https://i.imgur.com/2gh9agP.png)

- Once a Hot Potato game starts, a Message will be posted in the Channel stating so, along with who started the game, and who was the first User the Potato is passed to.
- To pass the Potato, the current "Hot User" (the one currently hold the Potato) will need to press the "Pass Potato" Button that's attached to the origin message.
- Who the Potato is passed to is picked at random, as long as the User meets the following criteria:
    - The User is NOT a Bot or System User
    - IF IN A TEXT CHANNEL: They are one of the Users who have posted at least one of the last 25 messages in chat (and thus, can be assumed active currently)
    - IF IN A THREAD CHANNEL: They are a Member of the Thread
- The Hot Potato game lasts a random amount of time, maxing out at 5 minutes
- Once the game ends (the Potato 'explodes'), the User last holding the Potato is dubbed the 'loser' of the game.
- Only one Hot Potato game can run at a time per Channel.

### `/rolemenu`
*Used to either create new, or edit existing, Role Menus*

![Screenshot of a Role Menu displayed in a Discord Chat after being set up, featuring buttons for toggling the Roles for oneself](https://i.imgur.com/ENfHgGh.png)

⚠ *Only usable by those with the `MANAGE_ROLES` Permission*

- During Menu creation or editing, the Bot will make use of Ephemeral Messages so that you can prepare your Menu without worrying about causing unread markers for other Users
- Additionally, an auto-updating preview of your Menu will be shown during this process, so you can see exactly how it will look without having to publicly display your work-in-progress menu
- To edit the Embed, add or remove Role Buttons, and to Save & Display/Update the Menu, use the select menu attached to the bottom of the auto-generating preview
- To edit the Label or Emoji of one your existing Role Buttons, simply press the Button itself on the preview

#### `/rolemenu create`
*Starts the process of creating a new Role Menu*

#### `/rolemenu configure [message]`
*Starts the process of editing an existing Role Menu*

| Argument | Type          | Description                                                          | Required |
|----------|---------------|----------------------------------------------------------------------|----------|
| message  | String        | The ID of the Message containing the existing Menu to be edited      | ✔️      |

### `/temperature [value] [scale]`
*A Slash Command version of the `Convert Temperature` Message Command - converts the given temperature between degrees C, F, and K*

![Screenshot of the temperature command's response in a Discord Chat](https://i.imgur.com/yliIr9G.png)

| Argument | Type          | Description                                                          | Required |
|----------|---------------|----------------------------------------------------------------------|----------|
| value    | Integer       | The numerical value of the original temperature to convert           | ✔️      |
| scale    | String        | The scale the original temperature is using (either C, F, or K)      | ✔️      |

### `/rule [rule]`
*Used to fetch and display a specific Server Rule*

⚠ *This Slash Command will only be registered and usable in Dr1fterX's Discord Server. It will **not** appear for other Servers.*

| Argument | Type          | Description                                                                         | Required |
|----------|---------------|-------------------------------------------------------------------------------------|----------|
| rule     | String        | The Rule to fetch. Uses Autocomplete to support either Rule number or keywords      | ✔️      |

### `/info`
*Used to display basic information about either a User, an Invite Link, the current Server, or MooBot itself; depending on the subcommand used*

#### `/info user (user)`
*Displays basic information about the User of the Slash Command, or a target User (if given)*

![Screenshot of the info user sub command's response in a Discord Chat](https://i.imgur.com/iJpghE0.png)

| Argument | Type          | Description                                | Required |
|----------|---------------|--------------------------------------------|----------|
| user     | @user         | The User to display information about      |          |

#### `/info invite [inviteCode]`
*Displays basic information about the given Invite Link, and its target Server's summary (such as its name, partnered status, etc.)*

![Screenshot of the info invite sub command's response in a Discord Chat](https://i.imgur.com/v7CFU4u.png)

| Argument       | Type          | Description                                    | Required |
|----------------|---------------|------------------------------------------------|----------|
| inviteCode     | String        | A valid Invite Code or Vanity Invite Code      | ✔️      |

#### `/info server`
*Displays basic information about the Server this command was used in. When compared to using `/info invite` on a Invite pointing to the current Server, this Command (`/info server`) provides slightly more information (such as Boost Count, NSFW status, etc)*

![Screenshot of the info server sub command's response in a Discord Chat](https://i.imgur.com/PVlqorn.png)

ℹ Note: Should the `@everyone` Role __not__ have the `Use External Emojis` Permission, then the emojis to denote Channel Types will be replaced with initials, where:

- T = Text Channels
- N = News/Announcement Channels
- V = Voice Channels
- S = Stage Channels
- C = Categories

This limitation in regards to the `Use External Emojis` Permission is on Discord's side; due to how Slash Command Responses function on Discord (inheriting that permission from the `@everyone` Role), and as such there is nothing TwilightZebby can do other than this workaround. ;-;

#### `/info bot`
*Displays basic information about MooBot itself*

![Screenshot of the info bot sub command's response in a Discord Chat](https://i.imgur.com/Zngxf0E.png)

### `/tone [indicator]`
*Displays what the given Tone Indicator means (example: `/s` denotes sarcasm)*

| Argument       | Type          | Description                               | Required |
|----------------|---------------|-------------------------------------------|----------|
| indicator      | String        | A tone indicator. Uses Autocomplete.      | ✔️      |


## Context Commands
*These are commands that appear under the "Apps" sub-menu when right-clicking on either a Message or a User in Chat*

### Message Commands
#### Convert Temperature
*If there are any temperatures detected in the Message, they will be converted into the other units of temperature measurements*

![A short video clip of the Convert Temperature Message Command in use in a Discord Chat](https://zebby.is-from.space/ioXrAz1YBK.mp4)

- Converts between degrees C, F, and K
- Supports up to 10 temperatures in a single message
- Will **not** convert temperatures lower than 0K (Absolute Zero) as those temperatures cannot possibly exist
- Only supports temperatures in the text-content of the Message, not in images or other forms of media


## Text-based Commands
*These command use the classic prefix based text commands system of old*

⚠ *Currently, all of the text-based commands are developer only, as in, only TwilightZebby can use them. As such, they will not be documentated*
