//Gets the info for a server
module.exports = function command(bot, info)
{
  'use strict';
  return {
    name: 'Server Info',
    inline: false,
    //the alias can be set by putting what you'd like in that array
    alias: ['si'],
    //description that shows up in the help menu
    description: 'Gets information on the current server.',
    //set the permissions [public, elevated, mod, private]
    permissions: 'public',
    action: function(details)
    {

      const getInfo = function(uid)
      {
        
        let emb = {};
        let server = bot.servers[details.serverID];
        let safe = false;
        if(server != undefined)
        {
          emb.title = server.name + '\'s Info';
          emb.description = '\n _ _';
          let thumbnail = {url: getIcon(details.serverID)};
          emb.thumbnail = thumbnail;
          let fields = [];
          emb.color = server.members[server.owner_id].color;
          //owner
          let owner = {name: 'Owner', value: `${bot.users[server.owner_id].username}#${bot.users[server.owner_id].discriminator}`};
          fields.push(owner);
          //reagion
          let region = {name: 'Region', value: server.region};
          fields.push(region);
          //creation time
          let created = {name: 'Created', value: getCreatedTime(server.id)};
          fields.push(created);
          //channel info
          let channels = {name: 'Channels', value: getChannelInfo(server.channels) };
          fields.push(channels);
          //member count
          let members = {name: 'Members', value: `${server.member_count} Members`};
          fields.push(members);
          //roles
          let serverRoles = {name: 'Roles', value: getRoles(bot.servers[details.serverID])};
          fields.push(serverRoles);
          emb.fields = fields;

          return emb;
        }
        else
        {
          emb.title = 'Error';
          emb.description = 'You are either not in a server, or there was an error looking up server info.';
          emb.color = 0xFF0000;
          return emb;
        }
      };
      const getChannelInfo = function(channels)
      {
        let voice = 0;
        let text = 0;
        Object.keys(channels).forEach((key) =>
        {
          if(channels[key].type == undefined)
          {
            text ++;
          }
          else
          {
            if(channels[key].type == 'text')
            {
              text ++;
            }
            else
            {
              voice ++;
            }
          }
        });
        return `${text} Text, ${voice} Voice`;
      };
      const getRoles = function(server)
      {
        const maxLength = 1014;
        const roles = Object.keys(server.roles).map(x => server.roles[x].name).join(', ');
        let numRoles = undefined;
        if(roles.length > maxLength)
        {
          numRoles = Object.keys(server.roles).length;
          return `${numRoles} Roles`;
        }
        else
        {
          return roles;
        }
      };
      const getCreatedTime = function(uid)
      {
        let t = (uid / 4194304) + 1420070400000;
        let created = new Date(t);
        return `${created.toUTCString()}`;
      };
      const getJoinedTime = function(uid)
      {
        let d = new Date(bot.servers[details.serverID].members[details.userID].joined_at);
        let localOffset = 5 * 60000;
        let utc = d.getTime() + localOffset;
        let dUTC = new Date(utc);
        return `${d.toUTCString()}`;

      };
      const getIcon = function(sid)
      {
        return `https://cdn.discordapp.com/icons/${sid}/${bot.servers[sid].icon}.jpg`;
      };
      //console.log(details.input);
      if(details.input === '')
      {
        bot.sendMessage(details.channelID, {
          embed: getInfo(details.userID)
        });
      }
      else if(details.args.length == 2)
      {
        let uid = info.utility.stripUID(details.args[1]);
        if(uid)
        {
          let link = getIcon(uid);
          if(link.includes('null.jpg'))
          {
            bot.sendMessage(details.channelID, {
              message: 'The user has a default avatar.'
            });
          }
          else
          {
            bot.sendMessage(details.channelID, {
              embed: getInfo(uid)
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