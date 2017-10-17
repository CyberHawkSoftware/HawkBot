'use strict';
const Client = require('dicksword.js');
const fs = require('fs');
const info = {};
info.config = require('./config.json');
const bot = new Client({
  token: info.config.api.discord_token,
  autorun: true,
  cacheOfflineUsers: true,
  game: {name: "Try <help ❤"}});
info.utility = require('./lib/utility.js')(bot, info);
info.commands = require('./commands/loader.js')(bot,info);
info.db = require('./lib/db.js')(bot, info);
//info.web = require('./lib/portal.js')(bot,info);
info.time = require('./tz-pretty.json');
info.trello = require('./plugins/trello.js')(bot,info);
info.manualKill = false;
info.botList = require('./plugins/botlist.js')(bot,info);
const utility = info.utility;
const config = info.config;
const commands = info.commands;
let db = info.db;
info.start = new Date();
//When the bot is ready
bot.on('ready', function() {
  console.log(bot.username + ' - (' + bot.id + ')');
});
//When there is a message fired that the bot can see, process it
bot.on('message', function(message) {
  const details = {
    user: message.author.username,
    userID: message.author.id,
    channelID: message.channel_id,
    message: message.content
  };
//was it a direct message?
  details.isDirectMessage = details.channelID in bot.directMessages ? true : false;
  //console.log(details.isDirectMessage);
  if(details.isDirectMessage)
  {
    //checks to see if it started with the prefix(possibly a command)
    details.isCommandForm = utility.isCommandForm(details.message);
    if(details.isCommandForm)
    {
      details.prefix = config.prefix;
      details.isAdministrator = utility.isAdministrator(details.userID);
      let cmd = utility.stripPrefix(details.message);
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
    if(bot.channels[details.channelID].guild_id != undefined)
    {
      //checks to see if it started with the Server defined prefix(possibly a command)
      utility.isServerCommandForm(details.message, bot.channels[details.channelID].guild_id).then((info) =>
      {
        details.isCommandForm = info.isCommand;
        //console.log(`This is COMMAND FORM ${isCommand}`);
        //if the message is in command form, process it
        if(details.isCommandForm)
        {
          details.prefix = info.prefix;
          //is the message sender listed as an administrator?
          details.isAdministrator = utility.isAdministrator(details.userID);

          if(!details.isAdministrator)
          {
            details.serverID = utility.getServerID(details.channelID);
            //does the message sender have elevated priveleges?
          }
          details.serverID = utility.getServerID(details.channelID);
          //separate the command from the rest of the string
          let cmd = utility.stripServerPrefix(details.message, info.prefix);
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
  else if(commands[command].permissions == 'private' && details.isAdministrator)
  {
    commands[command].action(details);
  }
}
function disabled(details)
{
  bot.sendMessage(details.channelID, {
    embed: {
      title: 'Disabled',
      description: 'Looks like that command was disabled'
    }
  });
}
