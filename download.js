"use strict";

const Downloader = require("./lib/Downloader.js");
const dl = new Downloader();
const yID = process.argv[2];
const title = process.argv[3];

process.on('message', function(m)
{
  dl.getMP3(m.id, m.file, function(err, result)
  {
    if(err)
    {
      process.send({status: 1});
    }
    else
    {
      process.send({status: 0, title: m.title, file: m.file});
    }
  });
});