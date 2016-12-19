//Makes the bot reconnect
module.exports = function command(bot, info)
{
    "use strict";
    return {
        inline: true,
        alias: ['re'],
        description: "(Makes the bot reconnect)",
        permissions: "private",
        action: function(details)
        {
            bot.disconnect();
        }
    };
};