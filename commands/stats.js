//gives a link to the source code on github
module.exports = function command(bot, info)
{
    "use strict";
    const pack = require('../package.json');
    return {
        alias: ['s'],
        description: "(Returns how many servers this bot is currently a part of)",
        permissions: "private",
        action: function(details)
        {
            bot.sendMessage({
                to: details.channelID,
                message: "```HawkBot is now on " + Object.keys(bot.servers).length + " servers!```"
            })
        }
    };
};