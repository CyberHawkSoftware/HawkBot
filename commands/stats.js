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