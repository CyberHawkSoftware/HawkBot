//Deletes the contents of mp3 folder, just in case there was a crash and an mp3 file
//was left there to take up space.
var fs = require('fs');
var dir = __dirname + '/mp3';
var newPat = new RegExp("."+'.mp3');

fs.readdir(dir,function callback(err,list) 
{
	var buffStr = undefined;
	for(var i = 0; i < list.length; i ++)
	{
		buffStr = list[i].toString();
		if(newPat.test(buffStr))
		console.log(dir+"/"+buffStr);
    fs.unlink(dir+"/"+buffStr);
	}

});