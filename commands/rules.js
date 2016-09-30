//displays the rules of the server from rules.txt
module.exports = function command(bot, info)
{
    "use strict";

    return {
        alias: ['r'],
        description: "(Displays server rules)",
        permissions: "public",
        action: function(details)
        {
            bot.sendMessage({
                to: details.channelID,
                message: info.rules
            });
        }
    };
};