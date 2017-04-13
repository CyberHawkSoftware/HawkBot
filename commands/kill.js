//Kills the bot, just in case it's acting up ;)
module.exports = function command(bot, info)
{
  'use strict';
  return {
    inline: true,
    alias: ['ki'],
    description: 'Kills the bot',
    permissions: 'private',
    action: function(details)
    {
      info.manualKill = true;
      bot.disconnect();
    }
  };
};