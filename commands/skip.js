//skips the song that is currently playing, it takes a few seconds to skip
//there seems to be data left after the unpipe (most likely in ffmpeg itself)
module.exports = function command(bot, info)
{
    "use strict";
    return {
        alias: ['s'],
        description: "(Skips the current song)",
        permissions: "public",
        action: function(details)
        {
          if(!details.isDirectMessage)
          {
            if(details.serverID === info.utility.getServerID(info.config.voice_channel))
            {
              console.log("Song skipped");
              info.audio.currentSong.unpipe();
            }
          }


        }
    };
};