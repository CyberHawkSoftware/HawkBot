//Grabs a definition from Jisho.org
module.exports = function command(bot, info)
{
  'use strict';
  const utility = info.utility;
  const request = require('request');
  const urlencode = require('urlencode');

  return{
    name: 'Kanji',
    alias: ['k'],
    description: '<kanji> ,Looks up kanji information.',
    permissions: 'public',
    action: function(details)
    {
      const searchKanji = function(kanji)
      {
        let url = `http://api.nihongoresources.com/kanji/find/${urlencode(kanji)}`;
        
        request({url: url, json: true}, (err, response, body) =>
        {
          if(!err && response.statusCode === 200)
          {
            bot.sendMessage({
              to: details.channelID,
              embed: prettyDisplay(body)
            });
          }
        });
      };
      const prettyDisplay = function(body)
      {
        let emb = {};
        if(body.length > 0)
        {
          if(body[0].literal != undefined)
          {
            emb.title = body[0].literal;
            if(body[0].jlpt == undefined && body[0].grade == undefined)
            {
              emb.description = `\n _ _`;
            }
            else if(body[0].jlpt == undefined && body[0].grade != undefined)
            {
              emb.description = `Grade ${body[0].grade}`;
            }
            else if(body[0].jlpt != undefined && body[0].grade == undefined)
            {
              emb.description = `JLPT N${body[0].jlpt}`;
            }
            else if(body[0].jlpt != undefined && body[0].grade != undefined)
            {
              emb.description = `JLPT N${body[0].jlpt}, Grade ${body[0].grade}`;
            }
            
            let fields = [];
            let strokes = {name: 'Strokes', value: body[0].strokeCount, inline: true};
            fields.push(strokes);
            let radical = {name: 'Radical', value: body[0].radical, inline: true};
            fields.push(radical);
            if(body[0].parents.length > 0)
            {
              let parents = {name: 'Elements', value: body[0].parents.join('\n'), inline: true};
              fields.push(parents);
            }
            if(body[0].children.length > 0)
            {
              let related = {name: 'Related Kanji', value: body[0].children.join(', '), inline: true};
              fields.push(related);
            }
            let readings = {name: 'Readings', value: body[0].readings.join('\n'), inline: true};
            fields.push(readings);
            let meanings = {name: 'Meanings', value: body[0].meanings.join('\n'), inline: true};
            fields.push(meanings);
            emb.fields = fields;
            return emb;
          }
          else
          {
            emb.title = 'Error';
            emb.description = 'There was no result for what you searched. If this is an error of the command, please contact CyberRonin';
            return emb;
          }
        }
        else
        {
          emb.title = 'Error';
          emb.description = 'There was no result for what you searched. If this is an error of the command, please contact CyberRonin';
          return emb;
        }
      };

      if(details.input === '') {return;}
      else
      {
        searchKanji(details.args[1]);
      }
    }
  };
};