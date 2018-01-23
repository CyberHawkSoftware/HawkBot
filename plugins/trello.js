//template feather
module.exports = function plugin(bot, info)
{
  'use strict';
  //feather obj
  const plugin = {};
  //set variable for config
  const config = info.config;
  //requires
  const request = require('request');
  //plugin functions
  function createCard(content)
  {
    request.post({
      url: `https://api.trello.com/1/cards?key=${config.api.trello.api_key}&token=${config.api.trello.token}`,
      json: true,
      form: content
    }, (err, response, body) =>
    {
      if(err)
      {
        console.log(err);
      }
    });
  };
  bot.on('messageReactionAdd', (reaction) =>
  {
    if(reaction.user_id === '190175637271478273' && reaction.channel_id === info.config.suggestion_channel && reaction.emoji.name === '👍')
    {
      bot.getMessage(info.config.suggestion_channel,reaction.message_id).then((message) =>
      {
        let newCard = {
          name: `${message.embeds[0].description}\n${message.embeds[0].footer.text}`,
          idList: '58fe3b0d4e2f17d3cddb5f11',
          pos: 'top',
          idLabels: '58fe3a14ced82109ff526fbf'
        };
        createCard(newCard);
      }).catch((err) => 
      {
        console.log(err);
      });
    }
  });
  return plugin;
};
