//displays the queue to the voice_chat in config.json
module.exports = function command(bot, info)
{
    "use strict";

    return {
        alias: ['q'],
        description: "(Displays the music queue)",
        permissions: "public",
        action: function(details)
        {
            bot.sendMessage({
                to: details.channelID,
                message: info.utility.codeBlock(info.audio.printQueue())
            });
        }
    };
};