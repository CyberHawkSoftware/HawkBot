//kills the bot, just in case it's acting up ;)
module.exports = function command(bot, info)
{
    "use strict";
    return {
        alias: ['s'],
        description: "(Skips the current song)",
        permissions: "public",
        action: function(details)
        {
            console.log("Song skipped");
            info.audio.currentSong.unpipe();
        }
    };
};