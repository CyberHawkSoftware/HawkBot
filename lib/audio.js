module.exports = function audioHandler(bot, info)
{
  "use strict";
  const fs = require('fs');
  const audio = {};
  let created = false;
  audio.started = false;
  //gets the bot to join the voice channel, handles the audio to it then as well
  audio.initiate = function()
  {
      bot.joinVoiceChannel(info.config.voice_channel, function(err, events)
      {
        if(err){return;}
        else
        {
          console.log("Joined voice.")
          bot.getAudioContext(info.config.voice_channel, function(err, stream)
          {
            if(err)
            {
              console.log(err);
              return;
            }
            console.log("Audio data connection initiated.")
            audio.stream = stream;
            //once a song has finished
            stream.on('done', function()
            {
              //deletes the file after it's played to save space'
              fs.unlink("mp3/"+audio.playlist.shift().file);
              //if there are no songs in the playlist, it stops running through the queue
              if(audio.playlist.length === 0)
              {
                bot.sendMessage({
                  to: info.config.voice_channel_chat,
                  message: "There are currently no songs in the playlist"
                });
                audio.started = false;
              }
              //there are songs in the playlist, play the one up next
              else
              {
                console.log("Song finished, playing next song");
                audio.play(audio.playlist[0].file);
              }
              
            })
          })

        }
      });
  }
  //play a song in the voice channel
  audio.play = function(song)
  {
    fs.createReadStream('mp3/'+song).pipe(audio.stream, {end:false});
  }
  //start playing the songs from the queue
  audio.start = function()
  {
    if(!audio.started)
    {
      audio.play(audio.playlist[0].file);
      audio.started = true;
    }
  }
  //make the playlist (will be an array of {song_name: <songName>, file: <fileName>})
  audio.playlist = [];
  //returns a string that's a numbered list of the songs in the queue
  audio.printQueue = function()
  {
    let str = "";
    for(let i = 0; i < audio.playlist.length; i ++)
    {
      str += (i+1) + " " + audio.playlist[i].song_name + "\n";
    }
    if(str === "")
    {
      str = "There are no songs currently in the playlist";
    }
    return str;
  }
  //return audio object
  return audio;
}