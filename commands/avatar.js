//Gets the avatar of either the person calling, or the person that is mentioned.
module.exports = function command(bot, info)
{
  'use strict';
  return {
    name: 'Avatar',
    inline: false,
    //the alias can be set by putting what you'd like in that array
    alias: ['a'],
    //description that shows up in the help menu
    description: '[<mention user>]Gets the avatar for a user that is mentioned. If there is no mention, then it will get the avatar of the person who used the command.',
    //set the permissions [public, elevated, mod, private]
    permissions: 'public',
    action: function(details)
    {
      const getAvatar = function(uid)
      {
        let ava = undefined;
        if(bot.users[uid].avatar.startsWith('a_'))
        {
          ava = 'https://cdn.discordapp.com/avatars/' +uid+'/'+bot.users[uid].avatar+'.gif';
        }
        else
        {
          ava = 'https://cdn.discordapp.com/avatars/' +uid+'/'+bot.users[uid].avatar+'.webp';
        }
        return ava;
      };
      console.log(details.input);
      if(details.input === '')
      {
        bot.sendMessage(details.channelID, {
          embed: {
            title: bot.users[details.userID].username +"'s Avatar",
            image: {
              url: getAvatar(details.userID)
            },
            color: parseInt('808080',16)
          }
        });
      }
      else if(details.args.length == 2)
      {
        let uid = info.utility.stripUID(details.args[1]);
        if(uid)
        {
          let link = getAvatar(uid);
          if(link.includes('null.jpg'))
          {
            bot.sendMessage(details.channelID, {
              message: 'The user has a default avatar.'
            });
          }
          else
          {
            bot.sendMessage(details.channelID, {
              embed: {
                title: bot.users[uid].username+"'s Avatar",
                image: {
                  url: getAvatar(uid)
                }
              }
            });
          }
        }
      }
      else
      {
        bot.sendMessage(details.channelID, {
          message: 'Please look at the help menu to see how to properly use the command.'
        });
      }
    }
  };
};