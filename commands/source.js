//Gives a link to the source code on github
module.exports = function command(bot, info)
{
  'use strict';
  return {
    name: 'Source',
    inline: true,
    alias: ['so'],
    description: 'Gets the bot\'s source',
    permissions: 'public',
    action: function(details)
    {
      bot.sendMessage(details.channelID, {
        content: 'https://github.com/CyberHawkSoftware/HawkBot'
      }).catch((err) =>
      {
        console.log(`In source: ${err}`);
      });
    }
  };
};