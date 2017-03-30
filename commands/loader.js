//loads the commands in from ./commands and builds the help menu
//the help menu displays only the commands that a user can use
module.exports = function commandLoad(bot,info)
{
  'use strict';
  const commands = {};
  const config = info.config;
  const utility = info.utility;
  const fs = require('fs');

  fs.readdir(__dirname, (err, items) =>
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      items.sort();
      for(let i = 0; i < items.length; i ++)
      {   
        if(items[i] !== 'loader.js' && items[i].endsWith('.js'))
        {
          const commandName = items[i].slice(0,-3);
          commands[commandName] = require(__dirname + '/' + items[i])(bot,info);

          if(!commands[commandName])
          {
            delete commands[commandName];
          }
        }
      }
    }
  });

  commands['help'] = 
  {
    inline: true,
    alias: ['?'],
    description: '(Shows help menu)',
    permissions: 'public',
    action: function(details)
    {    
      //concatenates an array to one line
      const concatArr = function(arr)
      {
        let s = '';
        for(let i = 0; i < arr.length; i++)
        {
          if(arr[i] != null)
          {
            if(i == (arr.length - 1))
            {
              s += details.prefix + arr[i];
            }
            else
            {
              s += details.prefix + arr[i] + ', ';
            }
          }
        }
        return s;
      };

      let lines = [];
      const filter = function(filterArr,key)
      {

        let aliasStr = '';
        let field = {};
        if(utility.searchArr(filterArr,commands[key]['permissions']))
        {
          if(typeof commands[key]['alias'] === 'object')
          {
            aliasStr= ' ' + concatArr(commands[key]['alias']);
          }
          field.name = details.prefix + key + ', ' + aliasStr;
          field.value = commands[key]['description'];
          field.inline = commands[key].inline;
          return field;
        }
        else
        {
          return false;
        }
      };
      let filterArr =[];
      if(details.isAdministrator)
      {
        filterArr = ['public','mod','elevated','private'];
      }
      else if(details.isMod)
      {
        filterArr = ['public','mod','elevated'];
      }
      else if(details.isElevated)
      {
        filterArr = ['public','elevated'];
      }
      else
      {
        filterArr = ['public'];
      }
      let count = 0;
      Object.keys(commands).forEach(function(key)
      { 
        let filtered = filter(filterArr,key);
        if(filtered != false)
        {
          lines.push(filtered);
        }
        
        count ++;
        if(count == Object.keys(commands).length)
        {
          bot.sendMessage({
            to: details.channelID,
            embed: {
              title: 'Help',
              description: 'You can PM the bot :heart:',
              fields: lines
            } 
          });
        }
      });

    }
  };

  return commands;
};