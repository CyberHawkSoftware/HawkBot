//evaluates js code
module.exports = function command(bot, info)
{
    "use strict";
    return {
        //the alias can be set by putting what you'd like in that array
        alias: ['ev'],
        //description that shows up in the help menu
        description: "(Evaluates JS code)",
        //set the permissions [public, elevated, mod, private]
        permissions: "private",
        action: function(details)
        {
          const echo = function(str)
          {
            bot.sendMessage({
              to: details.channelID,
              message: str
            });
          }
          if(details.input === "") {return;}
          else
          {
            try{
              bot.sendMessage({
                to: details.channelID,
                message: eval(details.input)
              });
            }
            catch(err)
            {
              bot.sendMessage({
                to: details.channelID,
                message: err
              });
            }
          }
        }
    };
};