//template command
//when calling the commands, loader.js will create the command based on what the
//name of the file is.
module.exports = function command(bot, info)
{
    "use strict";
    return {
        inline: true,
        //the alias can be set by putting what you'd like in that array
        alias: ['c', 'neko', '猫'],
        //description that shows up in the help menu
        description: "(Gets random cat pictures)",
        //set the permissions [public, elevated, mod, private]
        permissions: "public",
        action: function(details)
        {
          const sendCat = function()
          {
            const request = require("request");
            const url = "http://random.cat/meow";
            request({
              url: "http://random.cat/meow",
              json: false
            }, function (error, response, body)
            {
              if(!error && response.statusCode === 200)
              {
                let catResponse = JSON.parse(body);
                bot.sendMessage({
                  to: details.channelID,
                  embed:{
                    title: '',
                    description: '',
                    image:{
                      url: catResponse.file
                    }
                  }
                });
              }
            });
          }
          if(details.input === "")
          {
            sendCat();
          }
        }
    };
};