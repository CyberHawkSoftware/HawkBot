//template command
//when calling the commands, loader.js will create the command based on what the
//name of the file is.
module.exports = function command(bot, info)
{
    "use strict";
    return {
        //the alias can be set by putting what you'd like in that array
        alias: ['an'],
        //description that shows up in the help menu
        description: "[<anime>, <anime> --list, <anime> <number from --list> Looks up an anime from Hummingbird.me, you may use anime <anime> -- list to get a list of animes returned by the search. Then use anime <anime> <number> to get that anime info to display.]",
        //set the permissions [public, elevated, mod, private]
        permissions: "public",
        action: function(details)
        {
          const searchAnime = function(w,n)
          {
            //do something here
            const request = require("request");
            const urlencode = require("urlencode");
            var url = "https://hummingbird.me/api/v1/search/anime/?query=";

            url += urlencode(w);
            request({url: url, json: true}, function(error, response, body)
            {
              if(!error && response.statusCode === 200)
              {
                bot.sendMessage({
                  to: details.channelID,
                  embed: getInfo(body,n)
                });
              }
            });
          }
          
          const listAnime = function(w)
          {
            const request = require("request");
            const urlencode = require("urlencode");
            var url = "https://hummingbird.me/api/v1/search/anime/?query=";

            url += urlencode(w);
            request({url: url, json: true}, function(error, response, body)
            {
              if(!error && response.statusCode === 200)
              {
                bot.sendMessage({
                  to: details.channelID,
                  embed: getList(body)
                });
              }
            });
          }
          const getList = function(body)
          {
            let emb = {};
            emb.title = "List Results";
            emb.description = getNames(body);
            return emb;
          }

          const getNames = function(arr)
          {
            let str = "";
            for(let i = 0; i < arr.length; i ++)
            {
              str += `${i+1}. ${arr[i].title}`;
              if(arr[i].alternate_title != null)
              {
                str += ` (${arr[i].alternate_title})\n`;
              }
              else
              {
                str += "\n";
              }
            }
            return str;
          }

          const getInfo = function(body, n)
          {
            //main embed
            let emb = {};
            emb.title = body[n].title;
            if(body[n].alternate_title)
            {
              emb.description = body[n].alternate_title;
            }
            emb.url = body[n].url;
            //thumbnail
            let thumb = {};
            thumb.url = body[n].cover_image;
            //fields embeds
            let fields = [];
            //Air Dates
            let airDates = {name: "Air Date(s):", inline: true};
            if(body[n].started_airing != null)
            {
              airDates.value = `Start: ${body[n].started_airing}`;
            }
            if(body[n].finished_airing != null)
            {
              airDates.value += `\nFinish: ${body[n].finished_airing}`;
            }
            fields.push(airDates);
            //Episodes
            let eps = {name: "Episodes:", inline:true};
            if(body[n].episode_count == null)
            {
              eps.value = "Not known yet."
            }
            else
            {
              eps.value = body[n].episode_count;
            }
            fields.push(eps);
            //genre
            let genre = {name: "Genre:", inline: true};
            genre.value = concatArr(body[n].genres);
            fields.push(genre);
            //synopsis
            let synopsis = {name: "Synopsis:", inline: false};
            if(body[n].synopsis == "")
            {
              synopsis.value = "No synopsis yet :frowning:";
            }
            else
            {
              synopsis.value = body[n].synopsis;
            }
            fields.push(synopsis);
            //Rating
            emb.thumbnail = thumb;
            emb.fields = fields;
            return emb;
          }

          //concatenates an array to one line
          const concatArr = function(arr)
          {
            let s = "";
            for(let i = 0; i < arr.length; i++)
            {
                if(arr[i].name != null)
                {
                    if(i == (arr.length - 1))
                    {
                        s += arr[i].name;
                    }
                    else
                    {
                        s += arr[i].name + ", ";
                    }
                }
            }
            return s;
          }

          //processes the command
          //to better understand this part, take a look at the parameters at the top of the page
          try{
            if(details.input === "") {return;}
            else if(details.input.search(/.+\s(--list)/g) != -1)
            {
                listAnime(details.input.replace(" --list", ''));
                return;
            }
            else if(details.input.search(/^.+\s[1-9][0-9]*$/g) != -1)
            {
                let patt = /[1-9][0-9]*$/g;
                let num = parseInt(patt.exec(details.input),10);
                console.log("Num is " + num + " details is " + details.input);
                console.log("Searching for " + details.input.replace(/\s[1-9][0-9]*/g, ''));
                searchAnime(details.input.replace(/\s[1-9][0-9]*/g, ''),num - 1);
                return;
            }
            else
            {
                searchAnime(details.input, 0);
                return;
            }
          }
          catch(err)
          {
            bot.sendMessage({
              to: details.channelID,
              embed:{
                title: "Error",
                description: "Error occured, if you are using a number in a title try to put it in parenthesis. If the error continues, contact CyberRonin."
              }
            });
            console.log(err);
          }

        }
    };
};