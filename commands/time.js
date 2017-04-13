//command to get the time
module.exports = function command(bot, info)
{
  'use strict';
  return {
    name: 'Time',
    inline: false,
    //the alias can be set by putting what you'd like in that array
    alias: ['t'],
    //description that shows up in the help menu
    description: `Gets the time in UTC. ${info.config.prefix}time <time zone abbreviation> for a specific time zone. ${info.config.prefix}time --list for a list of the time zones `,
    //set the permissions [public, elevated, mod, private]
    permissions: 'public',
    action: function(details)
    {
      //do something here
      //ms in an hour
      const msInHour = 3600000;
      const getTime = function(abbr)
      {

        if(info.time[abbr] != undefined)
        {
          let d = new Date();
          let localTime = d.getTime();
          let localOffset = d.getTimezoneOffset() * 60000;
          let utc = localTime + localOffset;
          let target = utc + (info.time[abbr].offset * 3600000)
          let dStr = new Date(target).toLocaleString();
          //let dStr = // `${dAdj.toDateString()} ${dAdj.getHours()}:${dAdj.getMinutes()} (${info.time[abbr].value})`
          return dStr + ' ' + info.time[abbr].text;
        }
        return undefined;
      };
      const getZones = function(page)
      {
        let p1 = '';
        let p2 = '';
        let arr = Object.keys(info.time);
        for(let i = 0; i < arr.length; i ++)
        {
          if(i < arr.length/2)
          {
            p1 += `${arr[i]}: ${info.time[arr[i]].text}\n`;
          }
          else
          {
            p2 += `${arr[i]}: ${info.time[arr[i]].text}\n`;
          }
        }
        if(page == '1')
        {
          return p1;
        }
        else
        {
          return p2;
        }
        /*
        Object.keys(info.time).forEach((key) =>
        {
          s += `${key}\n`//: ${info.time[key].value}\n`;
        });*/

        return s;
      };
      if(details.input === '')
      {
        let d = new Date();
        let localTime = d.getTime();
        let localOffset = d.getTimezoneOffset() * 60000;
        let utc = localTime + localOffset;
        let dUTC = new Date(utc);
        bot.sendMessage({
          to: details.channelID,
          embed: {
            title: 'Time',
            description: `${dUTC.toLocaleString()} (UTC)`
          }
        });
      }
      else if(details.args[1] != undefined)
      {
        //let num = parseInt(patt.exec(details.input),10);
        //console.log("Num is " + num + " details is " + details.input);
        //console.log("Searching for " + details.input.replace(/\s[1-9][0-9]*/g, ''));
        if(details.args[1] === '--list')
        {
          console.log('getting it');
          if(details.args[2] != undefined)
          {
            if(details.args[2] == '2')
            {
              bot.sendMessage({
                to: details.channelID,
                embed: {
                  title: 'Time Zone List',
                  description: getZones(2),
                  footer: {text: 'Page 2'}
                }
              });
            }
          }
          else
          {
            bot.sendMessage({
              to: details.channelID,
              embed: {
                title: 'Time Zone List',
                description: getZones(1),
                footer: {text: `Page 1: ${info.config.prefix}time --list 2 for Page 2`}
              }
            });
          }
          return;
        }
        let t = getTime(details.args[1].toUpperCase());
        if(t != undefined)
        {
          bot.sendMessage({
            to: details.channelID,
            embed:{
              title: 'Time',
              description: t
            } 
          });
        }
        return;
      }
    }
  };
};