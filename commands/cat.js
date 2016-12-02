//template command
//when calling the commands, loader.js will create the command based on what the
//name of the file is.
module.exports = function command(bot, info)
{
    "use strict";
    return {
        //the alias can be set by putting what you'd like in that array
        alias: ['c'],
        //description that shows up in the help menu
        description: "(Gets random cat pictures)",
        //set the permissions [public, elevated, mod, private]
        permissions: "public",
        action: function(details)
        {
          console.log("in cat");
          const sendCat = function()
          {
            const request = require("request");
            const url = "http://random.cat/meow";
            request({
              url: "http://random.cat/meow",
              json: false
            }, function (error, response, body)
            {
              console.log(`${response.statusCode}`);
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