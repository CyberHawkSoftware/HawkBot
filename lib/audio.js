module.exports = function audioHandler(bot, info)
{
  "use strict";
  const fs = require('fs');
  const audio = {};
  const fork = require('child_process').fork;
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
              //get the song that just finished to grab info from it
              let finishedSong = audio.playlist.shift();
              //search through the playlist to see if the same song is on it that has yet to play
              //only delete the mp3 file if the song isn't on the playlist to play again
              if(!audio.searchSong(finishedSong.song_name))
              {
                fs.unlink("mp3/"+finishedSong.file);
              }
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
  //current song that is playing
  audio.currentSong = undefined;
  //play a song in the voice channel
  audio.play = function(song)
  {
    audio.currentSong = fs.createReadStream('mp3/'+song);
    audio.currentSong.pipe(audio.stream, {end:false});
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
  //searches through the playlist to see if a song already exists
  audio.searchSong = function(song)
  {
	  for(let i = 0; i < audio.playlist.length; i ++)
	  {
		  if(song === audio.playlist[i].song_name)
		  {
			  return true;
		  }
	  }
	  return false;
  }
  //fork download.js to set up a channel between it to avoid audio stream cutting out
  audio.downloader = fork('./download.js');
  //process the downloader messages
  audio.downloader.on('message', function(m)
  {
    if(m.status == 0)
    {
      info.audio.playlist.push({"song_name": m.title, "file": m.file})
      console.log("Downloaded " + m.title);
      audio.start();
    }
  });
  //return audio object
  return audio;
}