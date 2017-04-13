//template command
//when calling the commands, loader.js will create the command based on what the
//name of the file is.
module.exports = function command(bot, info)
{
  'use strict';
  return {
    //the alias can be set by putting what you'd like in that array
    alias: [''],
    //description that shows up in the help menu
    description: '(Description)',
    //set the permissions [public, elevated, mod, private]
    permissions: '',
    action: function(details)
    {
      //do something here
    }
  };
};