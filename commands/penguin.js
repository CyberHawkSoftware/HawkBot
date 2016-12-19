//template command
//when calling the commands, loader.js will create the command based on what the
//name of the file is.
module.exports = function command(bot, info)
{
    "use strict";
    return {
        inline: true,
        //the alias can be set by putting what you'd like in that array
        alias: ['p'],
        //description that shows up in the help menu
        description: "(Gets random penguin pictures)",
        //set the permissions [public, elevated, mod, private]
        permissions: "public",
        action: function(details)
        {
          const sendPenguin = function()
          {
            const request = require("request");
            const url = "http://penguin.wtf";
            request({
              url: url,
              json: false
            }, function (error, response, body)
            {
              if(!error && response.statusCode === 200)
              {
                bot.sendMessage({
                  to: details.channelID,
                  embed:{
                    title: '',
                    description: '',
                    image:{
                      url: body
                    }
                  }
                });
              }
            });
          }
          if(details.input === "")
          {
            sendPenguin();
          }
        }
    };
};