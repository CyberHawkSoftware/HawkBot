//displays the rules of the server from rules.txt
module.exports = function command(bot, info)
{
    "use strict";

    return {
        alias: ['t'],
        description: "(test)",
        permissions: "private",
        action: function(details)
        {
            bot.sendMessage({
                to: details.channelID,
                message: "ChannelID " + details.channelID
            });
        }
    };
};