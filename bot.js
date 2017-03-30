"use strict";
const discord = require('discord.io');
const fs = require('fs');
const info = {};
info.config = require('./config.json');
const bot = new discord.Client({token: info.config.api.discord_token, autorun: true });
info.utility = require('./lib/utility.js')(bot, info);
info.commands = require('./commands/loader.js')(bot,info);
info.db = require('./lib/db.js')(bot, info);
info.web = require('./lib/portal.js')(bot,info);
info.time = require('./tz-pretty.json');
info.manualKill = false;
const utility = info.utility;
const config = info.config;
const commands = info.commands;
let db = info.db;
info.start = new Date();
//When the bot is ready
bot.on('ready', function() {
console.log(bot.username + " - (" + bot.id + ")");
    //Set the bot's "Playing" to the config file's playing
    bot.setPresence({
        game:{
        name: utility.filter(info.config.playing)
        }
    });
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
//was it a direct message?
  details.isDirectMessage = details.channelID in bot.directMessages ? true : false;
  if(details.isDirectMessage)
  {
    //checks to see if it started with the prefix(possibly a command)
    details.isCommandForm = utility.isCommandForm(message);
    if(details.isCommandForm)
    {
      details.prefix = config.prefix;
      details.isMod = false;
      details.isElevated = false;
      details.isAdministrator = utility.isAdministrator(details.userID);
      let cmd = utility.stripPrefix(message);
      let keyword = cmd.split(' ')[0];
      details.input = cmd.replace(keyword, '').trim();
      //split up the remaining into something similar to command line args
      details.args = cmd.split(' ');
      keyword = keyword.toLowerCase();
      if(commands[keyword] && typeof commands[keyword].action === 'function')
      {
        processCommand(keyword, details);
      }
      else
      {
        //didn't find command
        for(let index in commands)
        {
          if(commands[index] && typeof commands[index].alias === 'object')
          {
              //is the keyword an alias
            if(commands[index].alias.indexOf(keyword) > -1)
            {
              processCommand(index, details);
            }
          }
        }
      } 
    }
  }
  else
  {
    if(bot.channels[channelID].guild_id != undefined)
    {
      //checks to see if it started with the Server defined prefix(possibly a command)
      utility.isServerCommandForm(message, bot.channels[channelID].guild_id).then((info) =>
      {
        details.isCommandForm = info.isCommand;
        //console.log(`This is COMMAND FORM ${isCommand}`);
        //if the message is in command form, process it
        if(details.isCommandForm)
        {
          details.prefix = info.prefix;
          //is the message sender listed as an administrator?
          details.isAdministrator = utility.isAdministrator(details.userID);
          if(details.isDirectMessage)
          {
            details.isMod = false;
            details.isElevated = false;
          }
          else
          {
            if(!details.isAdministrator)
            {
              details.serverID = utility.getServerID(details.channelID);
              //does the message sender have elevated priveleges?
              try{
                details.isMod = utility.checkModPerm(details.userID, details.serverID);
                if(!details.isMod)
                {
                  //if sender is not a mod, check to see if they are elevated
                  details.isElevated = utility.checkCommandPerm(details.userID, details.serverID);
                }
              }
              catch(err)
              {
                console.log(err);
                details.isMod = false;
                details.isElevated = false;
              }
            }
            details.serverID = utility.getServerID(details.channelID);
          }
          //separate the command from the rest of the string
          let cmd = utility.stripServerPrefix(message, info.prefix);
          let keyword = cmd.split(' ')[0];
          details.input = cmd.replace(keyword, '').trim();
          //split up the remaining into something similar to command line args
          details.args = cmd.split(' ');
          keyword = keyword.toLowerCase();
          //if the command exists, check the permissions.
          if(commands[keyword] && typeof commands[keyword].action === 'function')
          {
            db.checkEnabled(details.serverID, keyword).then((enabled) =>
            {
              if(enabled || keyword === 'help')
              {
                processCommand(keyword, details);
              }
              else
              {
                disabled(details);
              }
            }).catch((err) =>
            {
              console.log(err);
            });
          }
          else
          {
            //didn't find command
            for(let index in commands)
            {
              if(commands[index] && typeof commands[index].alias === 'object')
              {
                  //is the keyword an alias
                if(commands[index].alias.indexOf(keyword) > -1)
                { 
                  db.checkEnabled(details.serverID, index).then((enabled) =>
                  {
                    if(enabled || index === 'help')
                    {
                      processCommand(index, details);
                    }
                    else
                    {
                      disabled(details);
                    }
                  }).catch((err) =>
                  {
                    console.log(err);
                  });
                }
              }
            }
          }  
        }
      }).catch((info) =>
      {
        //console.log(info);
      });
    } 
  }
});
//When the bot disconnects (may it be from code, or on Discord's end')
bot.on('disconnect',function(errMsg, code)
{
  //if you didn't manually kill the bot
  if(info.reload)
  {
    commands = require('./commands/loader.js')(bot, info);
    info.reload = false;
    bot.connect();
  }
  else if(!info.manualKill)
  {
    //reconnect and log the instance into log.txt
    bot.connect();
    fs.appendFile('log.txt', 'Error occured: Error Code ' + code +' - attempting to login ' + new Date() + '\n' , function (err) {});
  }
  else
  {
    console.log('Kill command used.');
    process.exit(0);
  }
});
function processCommand(command, details)
{
  if(commands[command].permissions == 'public')
  {
    commands[command].action(details);
  }
  else if(commands[command].permissions == 'elevated' && (details.isMod || details.isElevated || details.isAdministrator))
  {
    commands[command].action(details);
  }
  else if(commands[command].permissions == 'mod' && (details.isMod || details.isAdministrator))
  {
    commands[command].action(details);
  }
  else if(commands[command].permissions == 'private' && details.isAdministrator)
  {
    commands[command].action(details);
  }
}
function disabled(details)
{
  bot.sendMessage({
    to: details.channelID,
    embed: {
      title: 'Disabled',
      description: 'Looks like that command was disabled'
    }
  });
}