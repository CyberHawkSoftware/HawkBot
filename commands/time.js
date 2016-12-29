//command to get the time
module.exports = function command(bot, info)
{
    "use strict";
    return {
        inline: false,
        //the alias can be set by putting what you'd like in that array
        alias: ['t'],
        //description that shows up in the help menu
        description: `Gets the time in UTC. ${info.config.prefix}time <time zone abbreviation> for a specific time zone. ${info.config.prefix}time --list for a list of the time zones `,
        //set the permissions [public, elevated, mod, private]
        permissions: "public",
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
              return dStr + " " + info.time[abbr].text;
            }
            return undefined;
          }
          const getZones = function()
          {
            let s = ""
            Object.keys(info.time).forEach((key) =>
            {
              s += `${key}: ${info.time[key].value}\n`;
            });
            return s;
          }
          if(details.input === "")
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
            })
          }
          else if(details.args[1] != undefined)
          {
              //let num = parseInt(patt.exec(details.input),10);
              //console.log("Num is " + num + " details is " + details.input);
              //console.log("Searching for " + details.input.replace(/\s[1-9][0-9]*/g, ''));
              if(details.args[1] === "--list")
              {
                bot.sendMessage({
                  to: details.channelID,
                  embed: {
                    title: 'Time Zone List',
                    description: getZones()
                  }
                });
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