//sends the user a PM of the roles in the server as well as their IDs to set up the config file
module.exports = function command(bot, info)
{
    "use strict";
    return {
        alias: ['ro'],
        //description that shows up in the help menu
        description: "(Sends a PM of the roles and their IDs)",
        //set the permissions [public, elevated, mod, private]
        permissions: "private",
        action: function(details)
        {
          bot.sendMessage({
              to: details.userID,
              message: "Roles for " +  bot.servers[details.serverID].name + ":\n" + info.utility.printRoles(details.serverID)
          });
        }
    };
};