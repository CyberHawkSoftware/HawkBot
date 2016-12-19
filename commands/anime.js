//template command
//when calling the commands, loader.js will create the command based on what the
//name of the file is.
module.exports = function command(bot, info)
{
    "use strict";
    return {
        inline: false,
        //the alias can be set by putting what you'd like in that array
        alias: ['an'],
        //description that shows up in the help menu
        description: "[<anime>, <anime> --list, <anime> --<number from --list> Looks up an anime from Hummingbird.me, you may use anime <anime> -- list to get a list of animes returned by the search. Then use anime <anime> --<number> to get that anime info to display.]",
        //set the permissions [public, elevated, mod, private]
        permissions: "public",
        action: function(details)
        {
          const searchAnime = function(w,n)
          {
            //do something here
            const request = require("request");
            const urlencode = require("urlencode");
            var url = "https://kitsu.io/api/edge/anime?filter[text]=";

            url += urlencode(w);
            request({url: url, json: false}, function(error, response, body)
            {
              if(!error && response.statusCode === 200)
              {
                let animeResponse = JSON.parse(body);
                //console.log(body);
                if(animeResponse.data.length != 0)
                {
                  bot.sendMessage({
                    to: details.channelID,
                    embed: getInfo(animeResponse.data,n)
                  });
                }
                else
                {
                  bot.sendMessage({
                    to: details.channelID,
                    embed: {
                      title: 'Error',
                      description: 'An error has occured with that lookup, please try a different name. If the error persists, contact CyberRonin'
                    }
                  });
                }

              }
            });
          }
          
          const listAnime = function(w)
          {
            const request = require("request");
            const urlencode = require("urlencode");
            var url = "https://kitsu.io/api/edge/anime?filter[text]=";

            url += urlencode(w);
            request({url: url, json: false}, function(error, response, body)
            {
              if(!error && response.statusCode === 200)
              {
                let animeResponse = JSON.parse(body);
                if(animeResponse.data.length != 0)
                {
                  bot.sendMessage({
                    to: details.channelID,
                    embed: getList(animeResponse)
                  });
                }
                else
                {
                  bot.sendMessage({
                    to: details.channelID,
                    embed: {
                      title: 'Error',
                      description: 'An error has occured with that lookup, please try a different name. If the error persists, contact CyberRonin'
                    }
                  });
                }

              }
            });
          }
          const getList = function(body)
          {
            let emb = {};
            emb.title = "List Results";
            emb.description = "Add --<number> where the number is on this list. e.g (--1 for the first, etc) to the original search.\n\n" +  getNames(body.data) + "\n _ _";
            emb.footer = { text: "Results provided by Kitsu.io", icon_url: "http://www.cyberhawk.co/kitsu.png"};
            emb.thumbnail = {url:"http://www.cyberhawk.co/kitsu.png" };
            emb.color = 0xf75239;
            return emb;
          }

          const getNames = function(arr)
          {
            let str = "";
            for(let i = 0; i < arr.length; i ++)
            {
              str += `${i+1}. ${arr[i].attributes.titles.en_jp}`;
              if(arr[i].attributes.titles.ja_jp != null && arr[i].attributes.titles.ja_jp != "")
              {
                str += ` (${arr[i].attributes.titles.ja_jp})\n`;
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
            const maxLength = 1014;
            //console.log(body);
            let tv = true;
            if(body[n].attributes.showType == "Movie")
            {
              tv = false;
            }
            //main embed
            let emb = {};
            if(body[n].attributes.titles.en != null && body[n].attributes.titles.en != "")
            {
              emb.title = body[n].attributes.titles.en
              emb.description = body[n].attributes.titles.en_jp
              if(body[n].attributes.titles.ja_jp)
              {
                emb.description += '\n' + body[n].attributes.titles.ja_jp;
              }
            }
            else
            {
              emb.title = body[n].attributes.titles.en_jp;
              if(body[n].attributes.titles.ja_jp)
              {
                emb.description = body[n].attributes.titles.ja_jp;
              }
              else
              {
                emb.description = "\n _ _"
              }
            }
            emb.url = `https://kitsu.io/anime/${body[n].attributes.slug}`;
            //thumbnail
            let thumb = {};
            thumb.url = body[n].attributes.posterImage.medium;
            //fields embeds
            let fields = [];
            //Air Dates
            let airDates = {name: "Air Date(s):", inline: true};
            if(body[n].attributes.startDate != null)
            {
              if(!tv)
              {
                airDates.value = `Aired: ${body[n].attributes.startDate}`
              }
              else
              {
                airDates.value = `Start: ${body[n].attributes.startDate}`;
              }
              
            }
            if(body[n].attributes.endDate != null)
            {
              if(tv)
              {
                airDates.value += `\nFinish: ${body[n].attributes.endDate}`;
              }      
            }
            if(body[n].attributes.endDate != null || body[n].attributes.startDate != null)
            {
              fields.push(airDates);
            }
            
            //Episodes
            let eps = {name: "Episodes:", inline:true};
            if(body[n].attributes.episodeCount == null)
            {
              eps.value = "Unknown."
            }
            else
            {
              eps.value = body[n].attributes.episodeCount;
            }
            if(tv)
            {
              fields.push(eps);
            }        
            //ep runtime
            let epRun = {name: "Episode Runtime:", inline: true};
            if(!tv)
            {
              epRun.name = "Movie Runtime:";
            }
            if(body[n].attributes.episodeLength!= null)
            {
              epRun.value = `${body[n].attributes.episodeLength}m`;
              fields.push(epRun);
            }
            //age Rating
            if(body[n].attributes.ageRating != null)
            {
              let age = {name: "Age Rating", value: body[n].attributes.ageRating, inline: true};
              fields.push(age);
            }
            if(body[n].attributes.youtubeVideoId != "" && body[n].attributes.youtubeVideoId != null)
            {
              let youtube = {name: "Trailer Link", value: `https://www.youtube.com/watch?v=${body[n].attributes.youtubeVideoId}`, inline: true};
              fields.push(youtube);
            }
            //synopsis
            let synopsis = {name: "Synopsis:", inline: false};
            if(body[n].attributes.synopsis == "")
            {
              synopsis.value = "No synopsis yet :frowning:";
            }
            else
            {
              if(body[n].attributes.synopsis.length > 1014)
              {
                synopsis.value = `${body[n].attributes.synopsis.slice(0, maxLength - 6)} [...]\n _ _`;
              }
              else
              {
                synopsis.value = body[n].attributes.synopsis + "\n _ _";
              }
            }
            fields.push(synopsis);
            //Rating
            emb.thumbnail = thumb;
            emb.fields = fields;
            emb.footer = { text: "Results provided by Kitsu.io", icon_url: "http://www.cyberhawk.co/kitsu.png"};
            emb.color = 0xf75239;
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
            else if(details.input.search(/^.+\s--[1-9][0-9]*$/g) != -1)
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