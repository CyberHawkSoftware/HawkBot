//stroke order boi
module.exports = function command(bot, info)
{
  'use strict';
  const request = require('request');
  const urlencode = require('urlencode');

  return {
    name: 'Stroke Order',
    inline: true,
    alias: ['so'],
    description: 'Stroke order of a kanji.',
    permissions: 'public',
    action: function(details)
    {
      const searchKanji = (k) =>
      {
        kanjiReq(k).then((file) =>
        {
          bot.uploadFile(details.channelID, file, {
            fileName: 'strokes.gif',
          }).catch((err) => {
            console.log(err);
          });
        }).catch((err) =>
        {
          bot.sendMessage(details.channelID, {
            embed: {
              title: 'Error',
              description: 'Kanji not found.',
              color: info.utility.red
            }
          });
        });
      };

      const kanjiReq = function(kanji)
      {
        return new Promise((resolve, reject) =>
        {
          let options = {};
          options.url = 'https://skurt.me/api/kanji/stroke/' + urlencode(kanji);
          options.headers = {Authorization: info.config.api.kanji};
          options.json = true;
          options.encoding = null;
          request(options, (err, response, body) => {
            if(!err && response.statusCode == 200) {
              resolve(response.body);
            }
            else {
              reject({err, body});
            }
          });
        });
      };
    

      if(details.input === '') {return;}
      else
      {
        searchKanji(details.args[1]);
      }
    }
  };
};