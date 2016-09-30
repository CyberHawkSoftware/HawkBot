module.exports = function utility(bot, info)
{
    "use strict";
    const utilities = {};
    const config = info.config;

    //Wraps a string in 3 backticks to make a code block
    utilities.codeBlock = function(str,style)
    {
        return `\`\`\`${style || ""}\n${str}\n\`\`\``;
    };
    //wraps a string to add one backtick to each side to make an inline code block
    utilities.codeInline = function(str)
    {
        return `\`${str}\``;
    };
    //Prints all of the roles in a server
    utilities.printRoles = function()
    {
        let serv = "";
        let r = "";
        for( serv in bot.servers)
        {
            for(r in bot.servers[serv].roles)
            {
                console.log("Name: " + bot.servers[serv].roles[r].name + " ID: " + bot.servers[serv].roles[r].id);
            }
        }
    };
    //Searches for an item in an array
    utilities.searchArr = function(array, item)
    {
        for(let i = 0; i < array.length; i ++)
        {
            if(item == array[i])
            {
                return true;
            }
        }
        return false;
    };
    //Checks to see if a message would be a command (Starts with the prefix)
    utilities.isCommandForm = function(message)
    {
        if(message.startsWith(config.prefix))
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    //Removes the prefix from the message
    utilities.stripPrefix = function(message)
    {
        if(message.startsWith(config.prefix))
        {
            message = message.replace(config.prefix,'');
        }
        return message;
    };
    utilities.formatBytes = function(bytes,decimals)
    {
        if (bytes === 0) {
            return '0 Byte';
        }
        const k = 1000;
        const dm = decimals + 1 || 3;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };
    //checks to see if the user that called a command is an Admin
    utilities.isAdministrator = function(userID)
    {
        return config.administrators.indexOf(userID) > -1;
    };
    //returns the userID of a mention
    utilities.stripUID = function(userString)
    {
        let userID = false;
        if (userString !== "")
        {
            //did we provide a mention?
            let regexp = /<\@!*([a-zA-Z0-9]+)>/g;
            let match = regexp.exec(userString);
            if (match)
            {
                userID = match[1];
            }
            else
            {
                userID = "false";
            }
        }
        return userID;
    };
    //gets the role(s) of a UID
    utilities.getRole = function (uid)
    {
        let roles = [];
        let server = "";
        for(server in bot.servers)
        {
            roles = bot.servers[server].members[uid].roles;
        }
        return roles;
    };
    //gets serverID
    utilities.getServerID = function()
    {
        let serverID = "";
        let server = "";
        for(server in bot.servers)
        {
            serverID = server;
        }
        return serverID;
    };
    //checks to see if you have elevated priveleges
    utilities.checkModPerm = function (uid)
    {
        //Admin, Moderator,  Developer
        const commandRoles = ["116664465629380612","116677736151384066","200599789455278080"];
        let userRoles = utilities.getRole(uid);
        for(let i = 0; i < userRoles.length; i++)
        {
            if(utilities.searchArr(commandRoles,userRoles[i]))
            {
                return true;
            }
        }
        return false;
    };
    //checks to see if you have slightly elevated priveleges
    utilities.checkCommandPerm = function (uid)
    {
        //Admin, Moderator, Mentor, Developer, for testing LEADER ROLE FROM PERSONAL SERVER
        const commandRoles = ["116664465629380612","116677736151384066","116729877574582273","200599789455278080","193353130648272896"];
        let userRoles = utilities.getRole(uid);
        for(let i = 0; i < userRoles.length; i++)
        {        
            if(utilities.searchArr(commandRoles,userRoles[i]))
            {
                return true;
            }
        }
        return false;
    };
    //split message into 3 parts, [username, identifier, reason]
    utilities.splitMessage = function(str)
    {
        const patt = /.+#[0-9]{4}/g;
        var result = patt.exec(str);
        let resultArr = [];
        if(result === null)
        {
            return false;
        }
        else
        {
            resultArr = result[0].split('#');
            resultArr.push(str.replace(result[0],'').replace(' ',""));
            return resultArr;
        }
    };
    return utilities;
};