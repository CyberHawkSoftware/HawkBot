//Suggestion command
module.exports = function command(bot, info)
{
  'use strict';
  return {
    inline: true,
    name: 'Suggestion',
    alias: ['su'],
    description: '<suggestion> Submits a suggestion to the developer of HawkBot :)',
    //public, elevated, mod, or private
    permissions: 'public',
    action: function(details)
    {
      bot.sendMessage(info.config.suggestion_channel, {
        embed: {
          title: 'Suggestion',
          description: details.input,
          footer: {text: `${details.user}#${bot.users[details.userID].discriminator}` || details.userID}
        }
      }).catch((err) =>
      {
        console.log(`In suggestion: ${err}`);
      });
    }
  };
};