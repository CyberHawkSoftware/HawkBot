//template command
//when calling the commands, loader.js will create the command based on what the
//name of the file is.
module.exports = function command(bot, info)
{
    "use strict";
    return {
        inline: false,
        //the alias can be set by putting what you'd like in that array
        alias: ['book'],
        //description that shows up in the help menu
        description: "[<book title/ isbn>, <book title/ isbn> --list, <book title/ isbn> --<number from --list> Looks up a book from Google Books, you may use isbn <book title/ isbn> -- list to get a list of books returned by the search. Then use isbn <book title/ isbn> --<number> to get that book info to display.]",
        //set the permissions [public, elevated, mod, private]
        permissions: "public",
        action: function(details)
        {
          const searchBook = function(w,n)
          {
            //do something here
            const request = require("request");
            const urlencode = require("urlencode");
            var url = "https://www.googleapis.com/books/v1/volumes?q=";

            url += urlencode(w);
            request({url: url, json: false}, function(error, response, body)
            {
              if(!error && response.statusCode === 200)
              {
                let bookResponse = JSON.parse(body);
                //console.log(body);
                if(bookResponse.items.length != 0)
                {
                  bot.sendMessage({
                    to: details.channelID,
                    embed: getInfo(bookResponse.items,n)
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
          
          const listBooks = function(w)
          {
            const request = require("request");
            const urlencode = require("urlencode");
            var url = "https://www.googleapis.com/books/v1/volumes?q=";

            url += urlencode(w);
            request({url: url, json: false}, function(error, response, body)
            {
              if(!error && response.statusCode === 200)
              {
                let bookResponse = JSON.parse(body);
                if(bookResponse.items.length != 0)
                {
                  bot.sendMessage({
                    to: details.channelID,
                    embed: getList(bookResponse)
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
            emb.description = "Add --<number> where the number is on this list. e.g (--1 for the first, etc) to the original search.\n\n" +  getTitles(body.items) + "\n _ _";
            emb.footer = { text: "Results provided by Google"};
            //emb.color = 0xf75239;
            return emb;
          }

          const getTitles = function(arr)
          {
            let str = "";
            let stop = arr.length;
            if(arr.length > 10)
            {
              stop = 10;
            }
            for(let i = 0; i < stop; i ++)
            {
              str += `${i+1}. ${arr[i].volumeInfo.title}`;
              if(arr[i].volumeInfo.subtitle != undefined)
              {
                str += `: ${arr[i].volumeInfo.subtitle}\n`;
              }
              else
              {
                str += "\n";
              }
            }
            return str;
          }
          //gets info for a specific book
          const getInfo = function(body, n)
          {
            const maxLength = 1014;
            //main embed
            let emb = {};
            let tv = true;
            if(body[n].volumeInfo.maturityRating == "MATURE")
            {
              emb.title = "Error"
              emb.description = "The content requested had mature content"
              return emb;
            }
            let fields = [];
            let thumb = {url:body[n].volumeInfo.imageLinks.thumbnail}
            
            //Title
            emb.title = body[n].volumeInfo.title;
            if(body[n].volumeInfo.subtitle != undefined)
            {
              emb.title += `: ${body[n].volumeInfo.subtitle}`;
            }
            emb.description = "\n _ _";
            //authors
            let authors = {name: "Author(s)", inline: true};
            authors.value = concatArr(body[n].volumeInfo.authors);
            fields.push(authors);
            //publish date
            let published = {name: "Published", inline: true};
            published.value = body[n].volumeInfo.publishedDate;
            fields.push(published);
            //identifiers
            let ident = {name: "Identifiers", inline: false};
            ident.value = concatIdentifiers(body[n].volumeInfo.industryIdentifiers);
            fields.push(ident);
            //description
            let desc = {name: "Description", inline: false};
            if(body[n].volumeInfo.description.length > 1014)
            {
              desc.value = `${body[n].volumeInfo.description.slice(0, maxLength - 6)} [...]\n _ _`;
            }
            else
            {
              desc.value = body[n].volumeInfo.description + "\n _ _";
            }
            fields.push(desc);
            emb.thumbnail = thumb;
            emb.fields = fields;
            emb.footer = { text: "Results provided by Google"};
            //emb.color = 0xf75239;
            return emb;
          }
          //concatenates an array to one line
          const concatArr = function(arr)
          {
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
          //concatenates an array to one line
          const concatIdentifiers = function(arr)
          {
            let s = "";
            for(let i = 0; i < arr.length; i++)
            {
                if(arr[i] != null)
                {
                    if(i == (arr.length - 1))
                    {
                        s += `${arr[i].type}: ${arr[i].identifier}`;
                    }
                    else
                    {
                        s += `${arr[i].type}: ${arr[i].identifier}\n`;
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
                listBooks(details.input.replace(" --list", ''));
                return;
            }
            else if(details.input.search(/^.+\s--[1-9][0-9]*$/g) != -1)
            {
                let patt = /[1-9][0-9]*$/g;
                let num = parseInt(patt.exec(details.input),10);
                searchBook(details.input.replace(/\s[1-9][0-9]*/g, ''),num - 1);
                return;
            }
            else
            {
                searchBook(details.input, 0);
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