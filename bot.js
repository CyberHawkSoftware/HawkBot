"use strict";
const discord = require('discord.io');
const fs = require('fs');

//I wanted this to be done synchronously to avoid accessing the buffStr before anything is written to it.
const rulesFile = "rules.txt";
let otherBuff = fs.readFileSync(rulesFile);
const rules = otherBuff.toString();

const info = {};
info.config = require('./config.json');
const bot = new discord.Client({token: info.config.api.discord_token, autorun: true });
info.utility = require('./lib/utility.js')(bot, info);
info.audio = require('./lib/audio.js')(bot, info);
info.commands = require('./commands/loader.js')(bot,info);
info.rules = info.utility.codeBlock(rules,"md");
info.manualKill = false;
const utility = info.utility;
const config = info.config;
const commands = info.commands;
//When the bot is ready
bot.on('ready', function() {
console.log(bot.username + " - (" + bot.id + ")");
    //Set the bot's "Playing" to the config file's playing
    bot.setPresence({
        game:{
        name: utility.switch(info.config.playing)
        }
    });
    //Start the audio lib
    info.audio.initiate();
});
//When there is a message fired that the bot can see, process it
bot.on('message', function(user, userID, channelID, message, event) {
    const details = {
        user: user,
        userID: userID,
        channelID: channelID,
        message: message,
        event: event
    };
    //checks to see if it started with the prefix(possibly a command)
    details.isCommandForm = utility.isCommandForm(message);
    //was it a direct message?
    details.isDirectMessage = details.channelID in bot.directMessages ? true : false;

    //if the message is in command form, process it
    if(details.isCommandForm)
    {
        details.serverID = utility.getServerID(details.channelID);
        //is the message sender listed as an administrator?
        details.isAdministrator = utility.isAdministrator(details.userID);
        if(!details.isAdministrator)
        {
            //does the message sender have elevated priveleges?
            details.isMod = utility.checkModPerm(details.userID, details.serverID);
            if(!details.isMod)
            {
                //if sender is not a mod, check to see if they are elevated
                details.isElevated = utility.checkCommandPerm(details.userID, details.serverID);
            }
        }
        //separate the command from the rest of the string
        let cmd = utility.stripPrefix(message);
        let keyword = cmd.split(' ')[0];
        details.input = cmd.replace(keyword, '').trim();
        //split up the remaining into something similar to command line args
        details.args = cmd.split(' ');
        keyword = keyword.toLowerCase();
        //if the command exists, check the permissions.
        if(commands[keyword] && typeof commands[keyword].action === "function")
        {
            
            if(commands[keyword].permissions == "public")
            {
                commands[keyword].action(details);
            }
            else if(commands[keyword].permissions == "elevated" && (details.isMod || details.isElevated || details.isAdministrator))
            {
                commands[keyword].action(details);
            }
            else if(commands[keyword].permissions == "mod" && (details.isMod || details.isAdministrator))
            {
                commands[keyword].action(details);
            }
            else if(commands[keyword].permissions == "private" && details.isAdministrator)
            {
                commands[keyword].action(details);
            }
        }
        else
        {
            //didn't find command
            for(let index in commands)
            {
                if(commands[index] && typeof commands[index].alias === "object")
                {
                    //is the keyword an alias
                    if(commands[index].alias.indexOf(keyword) > -1)
                    {
                        if(commands[index].permissions == "public")
                        {
                            commands[index].action(details);
                        }
                        else if(commands[index].permissions == "elevated" && (details.isMod || details.isElevated || details.isAdministrator))
                        {
                            commands[index].action(details);
                        }
                        else if(commands[index].permissions == "mod" && (details.isMod || details.isAdministrator))
                        {
                            commands[index].action(details);
                        }
                        else if(commands[index].permissions == "private" && details.isAdministrator)
                        {
                            commands[index].action(details);
                        }
                        break;
                    }
                }
            }
        }
        
    }
});
//When the bot disconnects (may it be from code, or on Discord's end')
bot.on("disconnect",function(errMsg, code){
    //if you didn't manually kill the bot
    if(!info.manualKill)
    {
        //reconnect, initiate audio, and log the instance into log.txt
        //LEAVING THE VOICE CHANNEL IS EXTREMELY IMPORTANT. If you don't, the bot will not be able to get back into
        //the voice channel properly on a reconnect.
        bot.leaveVoiceChannel(info.config.voice_channel);
        bot.connect();
        fs.appendFile('log.txt', 'Error occured: Error Code ' + code +' - attempting to login ' + new Date() + '\n' , function (err) {});
    }
    else
    {
        console.log("Kill command used.");
        process.exit(0);
    }
});