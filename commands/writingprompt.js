//template command
//when calling the commands, loader.js will create the command based on what the
//name of the file is.
module.exports = function command(bot, info)
{
  'use strict';
  return {
    name: 'Writing Prompt',
    inline: true,
    //the alias can be set by putting what you'd like in that array
    alias: ['wp'],
    //description that shows up in the help menu
    description: '(Gets random pictures)',
    //set the permissions [public, elevated, mod, private]
    permissions: 'public',
    action: function(details)
    {
      const sendImage = function()
      {
        const request = require('request');
        const url = 'http://www.splashbase.co/api/v1/images/random';
        request({
          url: url,
          json: true
        }, function (error, response, body)
        {
          if(!error && response.statusCode === 200)
          {
            //let catResponse = JSON.parse(body);
            bot.sendMessage(details.channelID, {
              embed:{
                title: '',
                description: '',
                image:{
                  url: body.url
                }
              }
            }).catch((err) =>
            {
              console.log(`In writingprompt: ${err}`);
            });
          }
        });
      };
      if(details.input === '')
      {
        sendImage();
      }
    }
  };
};