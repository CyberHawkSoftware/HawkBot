//checks to see if there is an mp3 folder
//if there isn't one, it will be created
const fs = require('fs');
fs.stat('mp3', function(err, stats)
{
  if(err)
  {
    if(err.errno === -4058)
    {
      fs.mkdir('mp3');
    }
    else
    {
      console.log(err);
    }
    
  }
  else
  {
    console.log(stats);
  }
});