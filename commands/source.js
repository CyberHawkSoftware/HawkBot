//gives a link to the source code on github
module.exports = function command(bot, info)
{
    "use strict";
    const pack = require('../package.json');
    return {
        alias: ['s'],
        description: "(Gets the bot's source)",
        permissions: "public",
        action: function(details)
        {
            bot.sendMessage({
                to: details.channelID,
                message: pack.homepage
            })
        }
    };
};