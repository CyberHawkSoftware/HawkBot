//gets the avatar of either the person calling, or the person that is mentioned
module.exports = function command(bot, info)
{
    "use strict";
    return {
        //the alias can be set by putting what you'd like in that array
        alias: ['a'],
        //description that shows up in the help menu
        description: "[<mention user>]Gets the avatar for a user that is mentioned. If there is no mention, then it will get the avatar of the person who used the command.",
        //set the permissions [public, elevated, mod, private]
        permissions: "public",
        action: function(details)
        {
          const getAvatar = function(uid)
          {
            return "https://cdn.discordapp.com/avatars/" +uid+"/"+bot.users[uid].avatar+".jpg";
          }
          console.log(details.input);
          if(details.input === "")
          {
            bot.sendMessage({
              to: details.channelID,
              message: getAvatar(details.userID)
            })
          }
          else if(details.args.length == 2)
          {
            let uid = info.utility.stripUID(details.args[1]);
            if(uid)
            {
              bot.sendMessage({
                to: details.channelID,
                message: getAvatar(uid)
              });
            }
          }
          else
          {
            bot.sendMessage({
              to: details.channelID,
              message: "Please look at the help menu to see how to properly use the command."
            });
          }
        }
    };
};