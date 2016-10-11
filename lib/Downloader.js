const ytdl = require('youtube-mp3-downloader');

const Downloader = function(loc) {
    var self = this;

    self.YD = new ytdl({
        "ffmpegPath": loc,        // Where is the FFmpeg binary located?
        "outputPath": "mp3",                 // Where should the downloaded and encoded files be stored? 
        "youtubeVideoQuality": "highest",       // What video quality should be used? 
        "queueParallelism": 2,                  // How many parallel downloads/encodes should be started? 
        "progressTimeout": 2000                 // How long should be the interval of the progress reports 
    });

    self.callbacks = {};

    self.YD.on("finished", function(data) {

        if (self.callbacks[data.videoId]) {
            self.callbacks[data.videoId](null,"update");
        } else {
            console.log("Error: No callback for videoId!");
        }

    });

    self.YD.on("error", function(error) {
        console.log(error);
        
    });

}

Downloader.prototype.getMP3 = function(id, title, callback){
    var self = this;

    // Register callback
    self.callbacks[id] = callback;
    // Trigger download
    self.YD.download(id, title);

}

module.exports = Downloader;