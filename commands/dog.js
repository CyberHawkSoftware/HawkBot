//Gets a random dog picture/gif.
module.exports = function command(bot, info)
{
  'use strict';
  return {
    name: 'Dog',
    inline: true,
    //the alias can be set by putting what you'd like in that array
    alias: ['d', 'inu', '犬'],
    //description that shows up in the help menu
    description: '(Gets random dog pictures)',
    //set the permissions [public, elevated, mod, private]
    permissions: 'public',
    action: function(details)
    {
      const sendDog = function()
      {
        const request = require('request');
        const url = 'http://random.dog/woof';
        request({
          url: url,
          json: false
        }, function (error, response, body)
        {
          if(!error && response.statusCode === 200)
          {
            bot.sendMessage(details.channelID, {
              embed:{
                title: '',
                description: '',
                image:{
                  url: `http://random.dog/${body}`
                }
              }
            });
          }
        });
      };
      if(details.input === '')
      {
        sendDog();
      }
    }
  };
};