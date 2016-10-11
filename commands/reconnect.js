//Makes the bot reconnect
module.exports = function command(bot, info)
{
    "use strict";
    return {
        alias: ['re'],
        description: "(Makes the bot reconnect)",
        permissions: "private",
        action: function(details)
        {
            bot.disconnect();
        }
    };
};