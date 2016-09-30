//loads the commands in from ./commands and builds the help menu
//the help menu displays only the commands that a user can use
module.exports = function commandLoad(bot,info)
{
    "use strict";
    const commands = {};
    const config = info.config;
    const utility = info.utility;
    const fs = require('fs');

    fs.readdir(__dirname, function(err, items){
        if(err)
        {
            console.log(err);
        }
        else
        {
            items.sort();
            for(let i = 0; i < items.length; i ++)
            {
                const commandName = items[i].slice(0,-3);
                if(items[i] !== "loader.js" && items[i].endsWith('.js'))
                {
                    commands[commandName] = require(__dirname + '/' + items[i])(bot,info);

                    if(!commands[commandName])
                    {
                        delete commands[commandName];
                    }
                }
            }
        }
    });

    commands['help'] = 
    {
        alias: ['?'],
        description: "(Shows help menu)",
        permissions: "public",
        action: function(details)
        {
            let lines = "Help Menu:\n"
            const wrap = "```md\n%content```";
            const filter = function(filterArr,key)
            {
                const aliases = [];
                let aliasStr = "";
                if(utility.searchArr(filterArr,commands[key]['permissions']))
                {
                    if(typeof commands[key]['alias'] === "object")
                    {
                        aliasStr += " " + config.prefix + commands[key]['alias'][0];
                    }
                    return "\n[" + config.prefix + key + aliasStr + "]" + commands[key]['description'];
                }
                else
                {
                    return "";
                }
            }
            let filterArr =[];
            if(details.isAdministrator)
            {
                filterArr = ["public","mod","elevated","private"];
            }
            else if(details.isMod)
            {
                filterArr = ["public","mod","elevated"];
            }
            else if(details.isElevated)
            {
                filterArr = ["public","elevated"];
            }
            else
            {
                filterArr = ["public"]
            }
            Object.keys(commands).forEach(function(key){ 
                lines += filter(filterArr,key);;             
            });
            lines += '\n#Example: !jisho song counter --list';
            lines = wrap.replace("%content",lines);
            bot.sendMessage({
                to: details.channelID,
                message: lines
            });
        }
    }

    return commands;
};