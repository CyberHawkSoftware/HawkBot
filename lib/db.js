module.exports = function utility(bot, info)
{
  'use strict';
  const Datastore = require('nedb');
  const db = {};
  db.servers = new Datastore('./lib/databases/servers.db');
  db.servers.loadDatabase();
  //set autocompaction to compact every 10 minutes
  db.servers.persistence.setAutocompactionInterval(600000);
  function loadCommands()
  {
    return new Promise((resolve, reject) =>
    {
      let commandsArr = [];
      let commands = Object.keys(info.commands).filter((command) =>
      {
        if(info.commands[command].name != undefined)
        {
          return command;
        }
      });
      for(let i = 0; i < commands.length; i++)
      {
        let commandObj = {key: commands[i], name: info.commands[commands[i]].name, enabled: true};
        commandsArr.push(commandObj);

      }
      resolve(commandsArr);
    });
    
  }

  bot.on('guildCreate', (server) =>
  {
    console.log(server.name);
    db.newServer(server.id);
  });
  bot.on('guildDelete', (server) =>
  {
    console.log(`Left ${server.name}`);
    info.botList.updateBotLists();
  })
  db.newServer = function (serverID)
  {
    loadCommands().then((commands) =>
    {
      let doc = {
        '_id': serverID,
        'prefix': info.config.prefix,
        'commands': commands
      };

      db.servers.insert(doc, (err, newDoc) =>
      {
        //console.log(newDoc);
        if(!err)
        {
          info.botList.updateBotLists();
        }
      });
    });

  };
  db.findServer = function(serverID)
  {
    return new Promise((resolve, reject) =>
    {
      db.servers.findOne({_id: serverID}, (err, doc) =>
      {
        //console.log(doc);
        resolve(doc);
      });
    });
  };
  db.getSettings = function(serverID)
  {
    return new Promise((resolve, reject) =>
    {
      db.servers.findOne({_id: serverID}, (err, doc) =>
      {
        if(err)
        {
          reject(err);
        }
        else
        {
          if(doc === null)
          {
            resolve(null);
          }
          else
          {
            resolve({prefix: doc.prefix});
          }
        }
      });
    });
  };
  db.updateServer = function(serverID, changes)
  {
    db.servers.update({_id: serverID}, {$set: changes}, (err, numReplaced) =>
    {
      if(err)
      {
        console.log(err);
      }
      else
      {
        console.log(numReplaced);
      }
    });
  };
  db.checkEnabled = function(serverID, command)
  {
    return new Promise((resolve, reject) =>
    {
      db.servers.findOne({_id: serverID}, (err, doc) =>
      {
        if(err)
        {
          console.log(err);
        }
        else
        {
          //this should be whether or not a command is enabled or not SHOULD
          let commands = doc.commands;
          for(let i = 0; i < commands.length; i ++)
          {
            if(commands[i].key === command)
            {
              resolve(commands[i].enabled);
            }
          }
          resolve(false);
        }
      });
    });
  };
  db.addCommand = function(commandName, currentSize)
  {
    return new Promise((resolve, reject) =>
    {
      let commandObj = {key: commandName, name: info.commands[commandName].name, enabled: true};
      db.servers.update({commands: {$size: currentSize}}, {$push: {commands: commandObj}}, {multi: true}, (err, numAffected) =>
      { 
        if(err)
        {
          reject(err);
        }
        resolve(numAffected);
      });
    });
  };
  db.deleteServer = function(serverID)
  {
    db.servers.remove({_id: serverID}, {}, (err, numRemoved) =>
    {
      if(err)
      {
        console.log(err)
      }
      else
      {
        info.botList.updateBotLists();
      }
    });
  };
  return db;
};