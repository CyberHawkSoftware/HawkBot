//gives a link to the source code on github
module.exports = function command(bot, info)
{
    "use strict";
    const pack = require('../package.json');
    return {
        alias: ['s'],
        description: "(Returns some bot stats)",
        permissions: "public",
        action: function(details)
        {
                let now = new Date();
                const convertDate = function(ms)
                {
                    let str = "";
                    let x = ms / 1000;
                    let seconds = Math.floor(x % 60);
                    x /= 60;
                    let minutes = Math.floor(x % 60);
                    x /= 60;
                    let hours = Math.floor(x % 24);
                    x /= 24;
                    let days = Math.floor(x);
                    if(days > 0)
                    {
                        str += `${days}d`;
                    }
                    if(hours > 0)
                    {
                        str += `${hours}h`;
                    }
                    if(minutes > 0)
                    {
                        str += `${minutes}m`;
                    }
                    if(seconds > 0)
                    {
                        str += `${seconds}s`;
                    }
                    return str;
                }
                bot.sendMessage({
                to: details.channelID,
                embed: {
                    title: 'HawkBot Stats',
                    description: '',
                    footer: {
                        text: "Created by CyberRonin#5517"
                    },
                    thumbnail: {
                        url: "https://cdn.discordapp.com/avatars/193403332046487552/cc2379129ee5450d617a1170a468e4f9.jpg"
                    },
                    fields:[
                    {
                        name: "Servers",
                        value: Object.keys(bot.servers).length,
                        inline: true
                    },
                    {
                        name: "Channels",
                        value: Object.keys(bot.channels).length,
                        inline: true
                    },
                    {
                        name: "Users",
                        value: Object.keys(bot.users).length,
                        inline: true
                    },
                    {
                        name: "Commands",
                        value: Object.keys(info.commands).length,
                        inline: true
                    },
                    {
                        name: "Uptime",
                        value: convertDate(now - info.start),
                        inline: true
                    },
                    {
                        name: "About",
                        value: "Primary purpose is to serve as a Jisho lookup, but there are fun commands as well. The beta and master branches have a DJ implementation."
                    },
                    {
                        name: "Github",
                        value: "[Public Branch - no audio](https://github.com/CyberHawkSoftware/HawkBot/tree/public)\n[Beta Branch - Most up to date w/audio](https://github.com/CyberHawkSoftware/HawkBot/tree/beta)\n[Master Branch w/audio](https://github.com/CyberHawkSoftware/HawkBot/tree/master)",
                        inline: true
                    }]
                }
            });
        }
    };
};