//grabs a definition from Jisho.org
module.exports = function command(bot, info)
{
    "use strict";
    const utility = info.utility;
    
    return{
        alias: ['j'],
        description: "[<word/sentence>, <word/sentence> --list, <word/sentence> <number from --list>] Looks up a word from Jisho.org, you may use jisho <word> --list to get a list of definitions. Then use jisho <word> <number> and that will display the definition",
        permissions: "public",
        action: function(details)
        {
            const out = {};
            //searches Jisho.org for a definition
            const searchJisho = function(w,n)
            {
                const request = require("request");
                const urlencode = require("urlencode");
                var url = "http://jisho.org/api/v1/search/words?keyword=";
                //encode the URL to be used for the request (in order to work with JP), then make the API call
                url += urlencode(w);
                request({
                    url: url,
                    json: true
                }, function (error, response, body) {

                    if (!error && response.statusCode === 200)
                    {
                        let mess = "";
                        if(body.data.length > 10)
                        {
                            mess += "The lookup has more than 10 items from Jisho. Try jisho(j) <word> list for the list.";
                        }
                        bot.sendMessage({
                            to: details.channelID,
                            message: prettyDisplay(body,n) + mess
                        });
                    }
                });
            };
            //lists all of the different readings/definitions returned by Jisho.org
            //if there are more than 10, it will be sent to the user via PM
            const listJisho = function(w)
            {
                const request = require("request");
                const urlencode = require("urlencode");
                var url = "http://jisho.org/api/v1/search/words?keyword=";
                url += urlencode(w);
                request({
                    url: url,
                    json: true
                }, function (error, response, body) {

                    if (!error && response.statusCode === 200)
                    {
                        if(body.data.length > 10 && details.isDirectMessage)
                        {
                            bot.sendMessage({
                                to: details.userID,
                                message: listJapanese(body) + "\nUse jisho(j) <word> <number on list> to get that definition"
                            });
                        }
                        else if(body.data.length > 10 && !details.isDirectMessage)
                        {
                            bot.sendMessage({
                                to: details.channelID,
                                message: "The word returned more than 10 items, sending a PM of the list!"
                            });
                            bot.sendMessage({
                                to: details.userID,
                                message: listJapanese(body) + "\nUse jisho(j) <word> <number on list> to get that definition"
                            });
                        }
                        else
                        {
                            bot.sendMessage({
                                to: details.channelID,
                                message: listJapanese(body) + "\nUse jisho(j) <word> <number on list> to get that definition"
                            });
                        }

                    }
                });
            };
            //list the japanese readings
            const listJapanese = function(api)
            {
                let list = "";
                for(let i = 0; i < api.data.length; i ++)
                {
                    let line = "";
                    line += (i+1) + "." + getJapanese(api.data[i].japanese);
                    if(i != (api.data.length - 1))
                    {
                        line += "\n";
                    }
                    list += line;
                }
                return list;
            }
            //grab the japanese readings
            const getJapanese = function(japaneseArr)
            {
                "use strict";
                let ret = "";
                for(let i = 0; i < japaneseArr.length; i ++)
                {
                    let line = "";
                    if(japaneseArr[i].word == undefined)
                    {
                        line += " (" + japaneseArr[i].reading + ")";
                    }
                    else if(japaneseArr[i].reading == undefined)
                    {
                        line += " " + japaneseArr[i].word;
                    }
                    else
                    {
                        line += " " + japaneseArr[i].word + " (" + japaneseArr[i].reading + ")";
                    }
                    if(i != japaneseArr.length - 1)
                    {
                        line += ",";
                    }
                    ret += line;
                }
                return ret;
            }
            //gets the definitions
            const getDefinitions = function(sensesArr)
            {
                "use strict";
                let definitions = "";
                for(var i = 0; i < sensesArr.length; i ++)
                {
                    definitions += (i+1) + ". "
                    if(concatArr(sensesArr[i].parts_of_speech) == "")
                    {
                        if(concatArr(sensesArr[i].tags) == "")
                        {
                            definitions += concatArr(sensesArr[i].english_definitions) +"\n";
                        }
                        else
                        {
                            definitions+= concatArr(sensesArr[i].english_definitions) + " - " + concatArr(sensesArr[i].tags) + ". " + concatArr(sensesArr[i].info) + "\n";
                        }
                    }
                    else
                    {
                        definitions += "*" + concatArr(sensesArr[i].parts_of_speech) + "*: "
                        if(concatArr(sensesArr[i].tags) == "")
                        {
                            definitions += concatArr(sensesArr[i].english_definitions) +"\n";
                        }
                        else
                        {
                            definitions+= concatArr(sensesArr[i].english_definitions) + " - " + concatArr(sensesArr[i].tags) + ". "+ concatArr(sensesArr[i].info) + "\n";
                        }
                    }
                }
                return definitions;
            }
            //concatenates an array to one line
            const concatArr = function(arr)
            {
                    "use strict";
                    let s = "";
                    for(let i = 0; i < arr.length; i++)
                    {
                        if(arr[i] != null)
                        {
                            if(i == (arr.length - 1))
                            {
                                s += arr[i];
                            }
                            else
                            {
                                s += arr[i] + ", ";
                            }
                        }
                    }
                return s;
            }
            //takes all of the data found and displays it nicely
            const prettyDisplay = function(api,num)
            {
                "use strict";
                var s ="";
                try
                {
                    if(api.data[num] == undefined)
                    {
                        throw "api.data is undefined";
                    }
                    else
                    {
                        const tags = getTags(api.data[num]);
                        s+= getJapanese(api.data[num].japanese) + '\n';
                        if(tags != "")
                        {
                            s += tags + '\n';
                        }
                        s += getDefinitions(api.data[num].senses);
                    }

                }
                catch(err)
                {
                    console.log( 'Error occured: Error Code ' + err +' - something was looked up that would break bot. Writing to dump file.' + new Date());
                    s = "Error occured with that lookup. Try the command again. If that command doesn't work, please contact CyberRonin";
                }
                out.return = s;
                
                return s;
            }
            //grabs the tags from the call
            const getTags = function(dataArr)
            {
                "use strict";
                let tags = "";
                if(dataArr.is_common == true)
                {
                    tags += '`Common` ';
                }
                tags += concatTags(dataArr.tags);
                return tags;
            }
            //lists the tags a little nicer
            const concatTags = function(arr)
            {
                "use strict";
                let s = "";
                for(let i = 0; i < arr.length; i++)
                {
                    if(i == (arr.length - 1))
                    {
                        s += utility.codeInline(arr[i]);
                        s += " ";
                    }
                    else
                    {
                        s += utility.codeInline(arr[i]);
                        s += " ";
                    }
                }
                return s;
            }
            //processes the command
            //to better understand this part, take a look at the parameters at the top of the page
            if(details.input === "") {return;}
            else if(details.input.search(/.+\s(--list)/g) != -1)
            {
                listJisho(details.input.replace(" --list", ''));
                return;
            }
            else if(details.input.search(/^.+\s[1-9][0-9]*$/g) != -1)
            {
                let patt = /[1-9][0-9]*$/g;
                let num = parseInt(patt.exec(details.input),10);
                console.log("Num is " + num + " details is " + details.input);
                console.log("Searching for " + details.input.replace(/\s[1-9][0-9]*/g, ''));
                searchJisho(details.input.replace(/\s[1-9][0-9]*/g, ''),num - 1);
                return;
            }
            else
            {
                searchJisho(details.input, 0);
                return;
            }
        }
    };
};