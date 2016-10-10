//handles playing and downloading a song from youtube
module.exports = function command(bot, info)
{
    "use strict";
    //load in the required files and create a Downloader object to handle downloading audio
    const yti = require('youtube-info');
    const Downloader = require("../lib/Downloader.js");
    var dl = new Downloader(info.config.ffmpeg_loc);
    const fs = require('fs');
    return {
        alias: ['p'],
        description: "[<YouTube URL>] Gets info from a YouTube link",
        permissions: "public",
        action: function(details)
        {
          //handles getting youtube information and initiates a download
          //the song gets added to the playlist AFTER it's downloaded
          const getData = function(parsed)
          {
            //get in the information from the youtube ID
            const yID = parsed || "noID";
            yti(yID, function(err, songInfo)
            {
              if(err)
              {
                console.log("Error occurred, the YID is: " + yID);
              }
              else
              {
                //gets rid of any spaces in the file name
                let title = songInfo.title.replace(/ /g, "").replace(/[\/\\\|]/g, "_")+".mp3";
                console.log("Recieved info for " + songInfo.title);
                //looks to see if the song requested is already downloaded
                //if it is, don't redownload it
                if(info.audio.searchSong(songInfo.title))
                {
                  info.audio.playlist.push({"song_name": songInfo.title, "file": title});
                  console.log("Song exists on playlist, file is present. No need to download it again");
                }
                else
                {
                   //send info to the downloader process to download a song.
                   console.log("Downloading " + songInfo.title);
                   info.audio.downloader.send({id: yID, title: songInfo.title, file: title});
                }
              }
            });
          }
          //check to make sure that you can only add to the queue from the server that you are playing music from.
          if(details.serverID === info.utility.getServerID(info.config.voice_channel))
          {
            if(details.input === "") {return;}
            switch(details.args.length)
            {
              case 1:
                return;
              case 2:
                if(details.args[1].includes("https://youtu.be/"))
                {
                  getData(details.args[1].replace(/https:\/\/youtu.be\//g,""));
                }
                else
                {
                  getData(details.args[1].split('=')[1] || "noid");
                }
                return;
            }
          }
        }
    };
};