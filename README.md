<p align="center"><img src="http://www.cyberhawk.co/logo-alt.svg"></p>
<h1 align="center">HawkBot</h1>
[![GitHub issues](https://img.shields.io/github/issues/CyberHawkSoftware/HawkBot.svg)](https://github.com/CyberHawkSoftware/HawkBot/issues)  
In order to get the bot up and running you will need to get a few things in order.  
 
 * You must have NodeJS installed
 * You must have ffmpeg on your system.
 * `run npm install` after downloading.
 * make sure you have `./mp3`, `config.json`  

####It has been tested on Linux, OSX, and Windows! It runs well on a Raspberry Pi!

[![Join the chat at https://gitter.im/CyberHawkSoftware/HawkBot](https://badges.gitter.im/CyberHawkSoftware/HawkBot.svg)](https://gitter.im/CyberHawkSoftware/HawkBot?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

#
####Here are sample files to use
config.json
```json

{
    "prefix": ";",
    "playing": "Try ;help ;)",
    "administrators": [
        ""
    ],
    "log_channel":"",
    "voice_channel":"",
    "voice_channel_chat": "",
    "ffmpeg_loc": "",
    "api": {
        "discord_token": ""
    }
}
```

+ prefix - This is what makes a command stand out.
+ playing - Sets the bot's "playing" status to this string.
+ administrators - Snowflake ID of the users that can use ANY AND ALL commands.
+ log_channel - The channel's Snowflake ID that you want important messages to go to.
+ voice_channel - Snowflake ID of the voice channel you want the bot to play the music on.
+ voice_channel_chat - Chat channel associated with the voice channel (or just a random channel), this is where the bot announces that a playlist is done.
+ ffmpeg_loc - The location of ffmpeg, if you installed in on a Unix system it's most likely `/usr/bin/ffmpeg`. I will be uploading instructions if you are using Debian 8 (It's currently not included).
+ discord_token - This is where you will need to put your discord bot token. [Instructions here](https://discordapp.com/developers/applications/)

setup.sh
```sh
#!/bin/sh
mkdir mp3
npm install
```
 You can use setup.sh to make the `./mp3` and run `npm install` for you.
