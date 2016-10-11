<p align="center"><img src="http://www.cyberhawk.co/logo-alt.svg"></p>
<h1 align="center">HawkBot</h1>
[![GitHub issues](https://img.shields.io/github/issues/CyberHawkSoftware/HawkBot.svg)](https://github.com/CyberHawkSoftware/HawkBot/issues) [![Join the chat at https://gitter.im/CyberHawkSoftware/HawkBot](https://badges.gitter.im/CyberHawkSoftware/HawkBot.svg)](https://gitter.im/CyberHawkSoftware/HawkBot?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)  
In order to get the bot up and running you will need to get a few things in order.  
 
 * You must have NodeJS installed
 * You must have ffmpeg on your system.
 * `run npm install` after downloading.
 * make sure you have a `config.json` - a sample one is provided below

####Shoutout to Frosthaven for the overall idea of the layout and a few functions from utility as well as the memory command! :)  
####It has been tested on Linux, OSX, and Windows! It runs well on a Raspberry Pi!



#
####Here is a sample config file to use, also a copy in the repo `config.example.json`  
config.json
```json

{
    "prefix": ";",
    "playing": "Try %prefixhelp ;)",
    "administrators": [""],
    "mod_roles":[""],
    "elevated_roles":[""],
    "log_channel":"",
    "voice_channel":"",
    "voice_channel_chat": "",
    "ffmpeg_loc": "",
    "api": {
        "discord_token": ""
    }
}
```

+ `prefix` - This is what makes a command stand out.
+ `playing` - Sets the bot's "playing" status to this string. You can use %prefix to handle automatically changing the text to what the prefix is set as.
+ `administrators` - Snowflake ID of the users that can use ANY AND ALL commands.
+ `mod_roles` - Snowflake IDs of the roles that are able to use mod commands.
+ `elevated_roles` - Snowflake IDs of the roles that are able to use elevated commands.
+ `log_channel` - The channel's Snowflake ID that you want important messages to go to.
+ `voice_channel` - Snowflake ID of the voice channel you want the bot to play the music on.
+ `voice_channel_chat` - Chat channel associated with the voice channel (or just a random channel), this is where the bot announces that a playlist is done.
+ `ffmpeg_loc` - The location of ffmpeg, if you installed in on a Unix system it's most likely `/usr/bin/ffmpeg`. I will be uploading instructions if you are using Debian 8 (It's currently not included).
+ `discord_token` - This is where you will need to put your discord bot token. [Instructions here](https://discordapp.com/developers/applications/)

Just run `npm install` after you've cloned the repo. `setup.js` will run after you install to automatically create the `./mp3` folder.
