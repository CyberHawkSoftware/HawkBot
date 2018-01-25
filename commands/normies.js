//Lists the amount of normies in a server
module.exports = function command(bot, info)
{
  'use strict';
  return {
    name: 'Normies',
    inline: true,
    alias: ['n'],
    description: 'Gets a list of people without a role',
    permissions: 'public',
    action: function(details)
    {
      const getNormies = function()
      {
        let normies = [];
        Object.keys(bot.servers[details.serverID].members).forEach((memberID) =>
        {
          if(bot.servers[details.serverID].members[memberID].roles.length === 0 && bot.servers[details.serverID].members[memberID].bot == false)
          {
            normies.push(`<@${memberID}>`);
          }
        });
        return normies;
      };
      if(bot.servers[details.serverID])
      {
        let normies = getNormies().join('\n');
        if(normies.length > 2000)
        {
          bot.sendMessage(details.serverID, {embed: {title: 'Error', description: 'This server is full of normies.'}});
        }
        else
        {
          let normieEmbed = 
          {
            title: 'Normies',
            description: normies
          };
          bot.sendMessage(details.serverID, {embed: normiesEmbed});
        }
      }
      else
      {
        bot.sendMessage(details.serverID, {embed: {title: 'Error', description: `Uh oh, you're not in a server or the command is borked.`}});
      }
    }
  };
};