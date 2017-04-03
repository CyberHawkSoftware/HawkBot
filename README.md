<p align="center"><img src="http://www.cyberhawk.co/logo-alt.svg"></p>
<h1 align="center">HawkBot</h1>
In order to get the bot up and running you will need to get a few things in order.  
 
 * You must have NodeJS installed
 * You must have ffmpeg on your system.
 * `run npm install` after downloading.
 * make sure you have a `config.json` - a sample one is provided below

#### Shoutout to Frosthaven for the overall idea of the layout and a few functions from utility as well as the memory command! :)  
#### It has been tested on Linux, OSX, and Windows! It runs well on a Raspberry Pi!



#
#### Here is a sample config file to use, also a copy in the repo `config.example.json`  
config.json
```json

{
    "prefix": ";",
    "playing": "Try %prefixhelp ;)",
    "administrators": [""],
    "mod_roles":[""],
    "elevated_roles":[""],
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
+ `discord_token` - This is where you will need to put your discord bot token. [Instructions here](https://discordapp.com/developers/applications/)

Just run `npm install` after you've cloned the repo. `setup.js` will run after you install to automatically create the `./mp3` folder.
Once you're all set to go, please use `npm start` to actually start the bot.
