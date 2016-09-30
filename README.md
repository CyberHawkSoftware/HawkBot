<p align="center"><img src="http://www.cyberhawk.co/logo.svg"></p>
<h1 align="center">HawkBot</h1>
In order to get the bot up and running you will need to get a few things in order.  
 
 * You must have ffmpeg on your system.
 * `run npm install` after downloading.
 * make sure you have `./mp3`, `config.json`

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

setup.sh
```sh
#!/bin/sh
mkdir mp3
npm install
```
 You can use setup.sh to make the `./mp3` and run `npm install` for you.
