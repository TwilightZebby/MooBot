↖ *Want to jump to a specific heading? Use the navigation menu! (Which doesn't exist on GitHub's Mobile App sadly)*

# MooBot

A small general-purpose Discord Bot made by TwilightZebby; originally for Dr1fterX's [Discord Server](https://discord.gg/URH5E34FZf), but can be used in other Servers on a case-by-case basis.

---

# Features

## Notes
### Command Permissions
All of these Slash and Context Commands can be restricted to only be used by specific Users/Roles, in specific Channels, or by everyone everywhere in Server Settings > Integerations.

Sadly, though, this Settings Page is only viewable on Desktop and Web Browser versions of Discord, not Mobile App versions.

Furthermore, some of these Commands, such as `/lockemoji`, have default Permission requirements set - meaning that they won't be viewable or usable in the Command Pickers unless you have the relevant Permission (or are Server Owner, or have Admin Permission); unless an override has been set on the Command itself by the Server's Admins/Owner.

### Context Commands & Where to Find Them
By now, most Users are aware of Slash Commands (`/boop` for example) and how to use them - but not many are aware of Context Commands. Hence, this section here to explain where they are!

__Message Context Commands__ are Commands used on a specific Message in Chat, and can be found:
- **Desktop/Web:** Right-click a Message -> Apps
- **Mobile:** Long-press (press-and-hold) a Message -> Apps

__User Context Commands__ are Commands used on a specific User in Servers, and can be found:
- **Desktop/Web:** Right-click a Username or profile picture either in Chat or Member List -> Apps
- **Mobile:** Long-press (press-and-hold) a Username or profile picture in Chat or Member List -> Apps

## Action Slash Commands
### `/bonk`
> *Outputs a message in chat, bonking the specified User, Role, or Everyone.*

### `/boop`
> *Outputs a message in chat, booping the specified User, Role, or Everyone.*

### `/headpat`
> *Outputs a message in chat, giving the specified User, Role, or Everyone a headpat.*

### `/hug`
> *Outputs a message in chat, giving the specified User, Role, or Everyone a cuddle.*

### `/kiss`
> *Outputs a message in chat, kissing the specified User, Role, or Everyone.*

### Other Action Command Features
- __All__ the Action Commands have an option of including a "Return Action" Button alongside their responses.
  - This Button allows the Target User (__not__ Role or Everyone) to return the Action within a 2 minute timeframe from when the Command was run.
  - This Button is only shown if:
    - The Target is a specific User, __not__ a Role or Everyone;
    - The User running the Command has __not__ disabled the button using the `button` argument;
    - __AND__ a GIF has __not__ been requested to be included by the User running the Command using the `gif` argument

<!-- Divider
























-->

## `/temperature`
> *Converts the given temperature between degrees C, F, and K.*

## `"Convert Temperature"` (Message Context Command)
> *Used to convert up to 10 temperatures in the specified Message between degrees C, F, and K.*

 
## `/rule`
> *Used to fetch and display a specific Rule for the Server this is used in.*

> **Warning**
> *This Command is, __by default__, not usable in any Server the Bot is added to. If requested to, this Command can be manually setup by the Bot's Developer, TwilightZebby, to be usable in the Server in question.*


## `/dstatus`
### `/dstatus subscribe`
> *Subscribes the Server this is used in to the Discord Outage Feed.*

### `/dstatus unsubscribe`
> *Unsubscribes the Server this is used in from the Discord Outage Feed.*


## `/lockemoji`
> *Upload a Custom Emoji to the Server this is used in, while also locking that Emoji behind one of the Server's Roles.*

**NOTES:**
- Role-locked Custom Emojis can only be used by those in that Server with the Role.
- Server Owners and those with the Admin Permission do __NOT__ bypass this - they will need the Role in question to be able to use the Emoji in question!
  - *This is a restriction on Discord's end, there is nothing I can do about that*
- It is __not__ possible to Role-lock an already uploaded Custom Emoji, nor change which Role an already uploaded Custom Emoji is locked behind.

<!-- Divider
























-->

## `/info`
> **Note**
> All information Commands only display information that is already public - that is, publicly accessible via Discord's public Bots & Apps API.
> 
> Additionally, all information Commands respond ephemerally - so only the User running the Command can see the Command's response.

### `/info user`
> *Displays information about a User or Bot.*
> 
> *If no User or Bot is specified, this will display information about the User running the Command.*

### `/info invite`
> *Displays information about the given Server Invite Link; and __very__ basic information about the Server that Invite Link points to.*

### `/info server`
> *Displays information about the Server this Command was used in.*

### `/info bot`
> *Displays information about MooBot itself.*

<!-- Divider
























-->

## Self-assignable Role Menus
You can use MooBot to create your own Self-assignable Role Menus for your Server. These will make use of Discord's Bot Buttons feature; which support both text and Emoji labels as well as being in four different colours.

Commands for Role Menu Setup/Configuration are as follows:

### `/rolemenu create`
> *Used to start creating a new Role Menu for the Channel this was used in.*

### `/rolemenu configure`
> *Use to bring up a guide on how to configure/edit your existing Role Menus made with this Bot.*

### `"Edit Role Menu"` (Message Context Command)
> *Used to start the configuration process for editing an existing Role Menu made with this Bot.*

### `"Delete Role Menu"` (Message Context Command)
> *Used to delete an existing Role Menu made with this Bot*

<!-- Divider
























-->

---

# Questions
## Why did you make this Bot?
> This Bot was born from a mixture of "felt like it" and a want to bring back some of the commands from the Kawaii Bot (that was discontinued when I originally made this Bot, but apparently has made a return in 2022?).
> The Bot, with its original name of "Actions Bot", was originally first added to Dr1fterX's Server in January 2021. The Bot was later renamed to "MooBot" in March 2022.

## Why was the Bot renamed from "Actions Bot" to "MooBot"?
> The original name, "Actions Bot", was picked because of the simple nature of the bot - to add action-based Slash Commands.
> Now that the Bot is being used for more features, which are less action-based (such as Button-Roles or the Temperature Convertor), TwilightZebby thought a name change was in order since "Actions Bot" isn't accurate anymore.
>
> "MooBot" became the name picked as a reference to an *old* meme in Dr1fterX's community, in which TwilightZebby was a cow (yes, as in the animal).
> That meme has long since vanished as per TwilightZebby's request. He humbly requests no one refer to him as a cow anymore because of the expiry of that meme. :)

## Can I add this Bot to my own Server?
> No, unless I consider you a friend, in which case maybe.
> 
> If I do consider you a friend, you are free to ask if you can add MooBot to your Server. I won't be generating permanent public invite links; hence the need to ask first.
