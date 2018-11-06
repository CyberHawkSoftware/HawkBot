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
        let options = {};
        options.url = `https://skurt.me/api/kanji/find/${urlencode(kanji)}`;
        options.json = true;
        options.headers = {Authorization: info.config.api.kanji};
        request(options, (err, response, body) =>
        {
          if(!err && response.statusCode === 200)
          {
            bot.sendMessage(details.channelID, {
              embed: prettyDisplay(body)
            }).catch((err) =>
            {
              console.log(`In kanji: ${err}`);
            });
          }
        });
      };
      const prettyDisplay = function(body)
      {
        let emb = {};
        if(body)
        {
          if(body._id != undefined)
          {
            emb.title = body._id;
            if(body.jlpt == undefined && body.grade == undefined)
            {
              emb.description = `\n _ _`;
            }
            else if(body.jlpt == undefined && body.grade != undefined)
            {
              emb.description = `Grade ${body.grade}`;
            }
            else if(body.jlpt != undefined && body.grade == undefined)
            {
              emb.description = `JLPT N${body.jlpt}`;
            }
            else if(body.jlpt != undefined && body.grade != undefined)
            {
              emb.description = `JLPT N${body.jlpt}, Grade ${body.grade}`;
            }
            
            let fields = [];
            let strokes = {name: 'Strokes', value: body.stroke_count[0], inline: true};
            fields.push(strokes);
            let radical = {name: 'Radical', value: body.radical.literal, inline: true};
            fields.push(radical);
            if(body.parents)
            {
              let parents = {name: 'Elements', value: body.parents.join('\n'), inline: true};
              fields.push(parents);
            }
            if(body.children)
            {
              let related = {name: 'Related Kanji', value: body.children.join(', '), inline: true};
              fields.push(related);
            }
            if(body.nanori)
            {
              let related = {name: 'Nanori', value: body.nanori.join(', '), inline: true};
              fields.push(related);
            }
            let readings = {name: 'Readings', value: `${body.reading.ja_on.join('\n')}\n${body.reading.ja_kun.join('\n')}`, inline: true};
            fields.push(readings);
            let meanings = {name: 'Meanings', value: body.meanings.join('\n'), inline: true};
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
      }

      if(details.input === '') {return;}
      else
      {
        searchKanji(details.args[1]);
      }
    }
  };
};