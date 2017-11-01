const request = require('request');

module.exports = function plugin(bot, info)
{
  'use strict';
  const plugin = {};
  function submit(options)
  {
    request(options, (err, response, body) =>
    {
      if(err)
      {
        console.log(err)
      }
      else
      {
        console.log(body); 
      }
    });
  }
  function getInfo()
  {
    return new Promise((resolve, reject) =>
    {
      resolve({"server_count": Object.keys(bot.servers).length});
    });
  }
  plugin.updateBotLists = function()
  {
    getInfo().then((status) =>
    {
      let botsPW = {
        url: 'https://bots.discord.pw/api/bots/193403332046487552/stats',
        method: 'POST',
        headers: {
          'Authorization': info.config.api.botsPW,
          'content-type': 'application/json'
          },
        body: JSON.stringify(status)
      };
      submit(botsPW);
    });
  };
  return plugin;
}
