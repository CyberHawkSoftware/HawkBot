//Suggestion command
module.exports = function command(bot, info)
{
  'use strict';
  return {
    inline: true,
    name: 'Suggestion',
    alias: ['su'],
    description: 'Submits a suggestion to the developer of HawkBot :)',
    //public, elevated, mod, or private
    permissions: 'public',
    action: function(details)
    {
      bot.sendMessage({
        to: '215098225147904000',
        embed: {
          title: 'Suggestion',
          description: details.input,
          footer: {text: `${details.user}#${bot.users[details.userID].discriminator}` || details.userID}
        }
      },(err, response) =>
      {
        if(err)
        {
          console.log(err);
        }
      });
    }
  };
};