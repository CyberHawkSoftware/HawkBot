const request = require('request');

module.exports = function plugin(bot, info)
{
  'use strict';
  const plugin = {};
  function submit(options)
  {
    request.post(options, (err, response, body) =>
    {
      if(err)
      {
        console.log(err)
      }
    });
  }
  plugin.updateBotLists = function()
  {
    let status = {
      server_count: Object.keys(bot.servers).length
    }
    let botsPW = {
      url: 'https://bots.discord.pw/api/bots/193403332046487552/stats',
      json: true,
      headers: {
        'Authorization': info.config.api.botsPW
      },
      form: status
    }
    let botsOrg = {
      url: 'https://discordbots.org/api/bots/193403332046487552/stats',
      json: true,
      headers: {
        'Authorization': info.config.api.botsOrg
      },
      form: status
    }
    submit(botsOrg);
    submit(botsPW);
  }
}