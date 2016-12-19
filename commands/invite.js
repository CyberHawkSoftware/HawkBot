//gives a link to the source code on github
module.exports = function command(bot, info)
{
    "use strict";
    const pack = require('../package.json');
    return {
        inline: true,
        alias: ['i'],
        description: "(Gets the bot's invite link)",
        permissions: "public",
        action: function(details)
        {
            bot.sendMessage({
                to: details.channelID,
                message: "https://discordapp.com/oauth2/authorize?client_id=193403294419255297&scope=bot&permissions=0"
            })
        }
    };
};