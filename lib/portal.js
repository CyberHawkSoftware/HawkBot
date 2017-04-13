module.exports = function portal(bot, info)
{
  const express = require('express');
  const app = express();
  const request = require('request');
  const fs = require('fs');
  const Handlebars = require('handlebars');
  const session = require('express-session');
  const bodyParser = require('body-parser');
  const perms = require('./permissions')();
  const https = require('https');
  const helmet = require('helmet');
  //const multer = require('multer');
  //const upload = multer();
  const db = info.db;
  //keeps track of the guilds that sessions have access to
  const guildsWithPerms = {};
  //holds the tokens, keys are session IDs
  const tokens = {};
  //config for testing purposes
  const config = info.config;
  let privateKey = fs.readFileSync(__dirname + '/web/privkey1.pem');
  let certificate = fs.readFileSync(__dirname + '/web/fullchain1.pem');
  
  //use bodyParser to parse post shtuff\
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  //security shtuff
  app.use(helmet());
  app.use(helmet.referrerPolicy({ policy: 'no-referrer'}));
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
      imgSrc: ["'self'", 'https://cdn.discordapp.com', 'https://www.google-analytics.com'],
      scriptSrc: ["'self'", 'https://www.google-analytics.com', "'unsafe-inline'"],
      fontSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com', 'https://fonts.googleapis.com']
    }
  }));
  //Actually use session info.
  app.use(session({
    secret: config.web.client_secret,
    resave: false,
    saveUninitialized: true
  }));
  //get info from the users and guilds endpoints
  //Promise that resolves an object with user and guilds as keys.
  function getAllInfo (sessionId)
  {
    return new Promise((resolve, reject) =>
    {
      let token = tokens[sessionId];
      let userUrl = `https://discordapp.com/api/users/@me`;
      let guildsUrl = 'https://discordapp.com/api/users/@me/guilds';
      if(Date.now() - token.time >= 604800)
      {
        refreshToken(token).then((newToken) =>
        {
          token = newToken;
        }).then((err) =>
        {
          console.log(err);
        });
      }
      //console.log(tokens[sessionId]);
      let info = {};
      let userPromise = requestPage(userUrl, {json: true, headers: {Authorization: `Bearer ${token.token}`}});
      let guildsPromise = requestPage(guildsUrl, {json: true, headers: {Authorization: `Bearer ${token.token}`}});
      Promise.all([userPromise, guildsPromise]).then((values) =>
      {
        info.user = values[0];
        info.guilds = values[1];
        resolve(info);
      });
    });
  };
  //gets info for the servers a user is connected to
  //promise resolves an array of guild objects
  function getServerInfo(sessionId)
  {
    let token = tokens[sessionId];
    if(Date.now() - token.time >= 604800)
    {
      refreshToken(token).then((newToken) =>
      {
        token = newToken;
      });
    }
    let url = 'https://discordapp.com/api/users/@me/guilds';
    return requestPage(url, {json: true, headers: {Authorization: `Bearer ${tokens[sessionId].token}`}});
  }
  //gets info for a user (the user that is authenticated via Oauth)
  //promise resolves user obj
  function getUserInfo(sessionId)
  {
    return new Promise((resolve, reject) =>
    {
      let token = tokens[sessionId];
      if(Date.now() - token.time >= 604800)
      {
        refreshToken(token);
        token = tokens[sessionId];
      }
      let url = 'https://discordapp.com/api/users/@me';
      requestPage(url, {json: true, headers: {Authorization: `Bearer ${token.token}`}}).then((user) =>
      {
        resolve(user);
      });
    });
  }
  //the keys are sessionId's, which could be used in guildsWithPerms as well
  //what we'll do here is find any sessions that are older than 2 days and
  //clear them out of tokens and guildsWithPerms if they are present
  setInterval(() =>
  {
    Object.keys(tokens).forEach((key) =>
    {
      if(Date.now() - tokens[key].time >= 172800000)
      {
        delete tokens[key];
        if(guildsWithPerms[key] != undefined)
        {
          delete guildsWithPerms[key];
        }
      }
    });
  }, 172800000);
  //requests a url with the selected options
  //promise resolves the body of the url, or rejects with the error
  function requestPage(url, options)
  {
    options.url = url;
    return new Promise((resolve, reject) =>
    {
      request(options, (err, response, body) =>
      {
        if(!err && response.statusCode === 200)
        {
          //console.log(body);
          resolve(body);
        }
        else
        {
          reject(err);
        }
      });
    });
  }
  function filterSearch(guilds)
  {
    return new Promise((resolve, reject) =>
    {
      filterGuilds(guilds).then((filtered) =>
      {
        //console.log(filtered);
        searchServers(filtered).then((searched) =>
        {
          resolve(searched);
        });
      });
    });

  }
  //filters the guilds that you don't have access to
  //promise resolves the guilds that you have Manage Server perms
  function filterGuilds(guilds)
  {
    return new Promise((resolve, reject) =>
    {
      let filteredGuilds = guilds.filter((guild) =>
      {
        return perms.hasPermission(perms.permissionBits['GENERAL_MANAGE_GUILD'], guild.permissions);
      });
      resolve(filteredGuilds);
    });
  }
  //gets the prefix, nsfw setting and possibly add buttons to add HawkBot to the server
  function searchServers(guilds)
  {
    return new Promise((resolve, reject) =>
    {
      //console.log(`In searchServers: ${JSON.stringify(guilds)}`);
      let len = Object.keys(guilds).length -1;
      let counter = 0;
      Object.keys(guilds).forEach((key) =>
      {
        //console.log(guilds[key].id);
        db.getSettings(guilds[key].id).then((settings) =>
        {
          //console.log(settings);
          if(settings != null)
          {
            guilds[key].settings = settings;
          }
          if(counter == len)
          {
            resolve(guilds);
          }
          counter++;
        });
      });
    });

  }
  //Hopefully don't need this bs
  function getServerContext()
  {
    return new Promise((resolve, reject) =>
    {
      if(guildsWithPerms[req.sessionID])
      {
        if(guildsWithPerms[req.sessionID].indexOf(serverID) > -1)
        {
          resolve(serverID);
        }
        else
        {
          resolve(null);
        }
      }
    });
  }
  //handles the refreshing of tokens
  function refreshToken(token)
  {
    return new Promise((resolve, reject) =>
    {
      let data = {
        refresh_token: token.refresh,
        grant_type: 'refresh_token'
      };

      let base64 = new Buffer(`${config.web.client_id}:${config.web.client_secret}`).toString('base64');
      request.post({
        url: 'https://discordapp.com/api/oauth2/token',
        headers: { Authorization: `Basic ${base64}` },
        form: data
      }, (err, httpResponse, body) =>
      {
        
        if(err)
        {
          reject(err);
        }
        else
        {
          body = JSON.parse(body);
          tokens[token.session] = {
            token: body.access_token,
            session: token.session,
            time: Date.now(),
            refresh: body.refresh_token
          };
          resolve(tokens[token.session]);
        }
      });
    });
    
  }
  app.use(express.static(__dirname+'/web'));
  //handle the root of the site
  app.get('/', (req, res, next) =>
  {
    let context = {};
    if(tokens[req.sessionID])
    {
      getUserInfo(req.sessionID).then((info) =>
      {
        context.user = info;
        //console.log(info);
        let userPage = fs.readFileSync('./lib/web/index.hbs').toString();
        let renderedUserPage = Handlebars.compile(userPage);
        res.send(renderedUserPage(context));
      }).catch((err) =>
      {
        console.log(err);
      });
    }
    else
    {
      let userPage = fs.readFileSync('./lib/web/index.hbs').toString();
      let renderedUserPage = Handlebars.compile(userPage);
      res.send(renderedUserPage(context));
      //console.log(req.sessionID);
    }
  });
  //handles login
  app.get('/login', (req, res, next) =>
  {
    let data = {
      client_id: config.web.client_id,
      client_secret: config.web.client_secret,
      code: req.query.code,
      redirect_uri: config.web.redirect_uri,
      grant_type: 'authorization_code'
    };
    request.post({
      url: 'https://discordapp.com/api/oauth2/token',
      form: data
    }, (err, httpResponse, body) =>
    {
      if(err)
      {
        console.log(err);
      }
      else
      {
        body = JSON.parse(body);
        tokens[req.sessionID] = {
          token: body.access_token,
          session: req.sessionID,
          time: Date.now(),
          refresh: body.refresh_token
        };
        //console.log(tokens);
        //console.log(body);
      }
      res.redirect('https://bot.cyberhawk.co/');
    });
  });
  app.get('/servers', (req, res, next) =>
  {
    let context = {};
    if(tokens[req.sessionID])
    {
      getAllInfo(req.sessionID).then((info) =>
      {
        context.user = info.user;
        let guilds = info.guilds;
        
        return filterSearch(guilds);
      }).then((guilds) =>
      {
        context.guilds = guilds;
        //database query for guild info (parameter and nsfw flag)
        //console.log(guilds);
        guildsWithPerms[req.sessionID] = guilds.map((guild) =>
        {
          return guild.id;
        });
        //console.log(guildsWithPerms[req.sessionID]);
        let userPage = fs.readFileSync('./lib/web/servers.hbs').toString();
        let renderedUserPage = Handlebars.compile(userPage);
        res.send(renderedUserPage(context));
      }).catch((err) =>
      {
        console.log(err);
      });
    }
    else
    {
      let userPage = fs.readFileSync('./lib/web/servers.hbs').toString();
      let renderedUserPage = Handlebars.compile(userPage);
      res.send(renderedUserPage(context));
    }
  });
  app.get('/server', (req, res, next) =>
  {
    let context = {};
    if(tokens[req.sessionID])
    {
      getUserInfo(req.sessionID).then((info) =>
      {
        if(req.query.serverID != undefined)
        {
          //console.log('query is defined');
          let serverID = req.query.serverID;
          if(guildsWithPerms[req.sessionID])
          {
            if(guildsWithPerms[req.sessionID].indexOf(serverID) > -1)
            {
              context.user = info;
              //query db for document(nedb lingo)
              return db.findServer(serverID);
            }
          }
        }
        context.user = info;
        
      }).then((server) =>
      {
        if(server != null)
        {
          context.server = server;
          try{
            context.serverName = bot.servers[server._id].name;
          }
          catch(err)
          {
            console.log(err);
          }
        }
        
        //console.log(server);
        let userPage = fs.readFileSync('./lib/web/server.hbs').toString();
        let renderedUserPage = Handlebars.compile(userPage);
        res.send(renderedUserPage(context));
      }).catch((err) =>
      {
        console.log(err);
      });
    }
    else
    {
      let userPage = fs.readFileSync('./lib/web/index.hbs').toString();
      let renderedUserPage = Handlebars.compile(userPage);
      res.send(renderedUserPage(context));
      //console.log(req.sessionID);
    }
  });
  app.post('/form',(req, res, next) =>
  {
    if(req.body.id)
    {
      if(tokens[req.sessionID])
      {
        if(guildsWithPerms[req.sessionID])
        {
          if(guildsWithPerms[req.sessionID].indexOf(req.body.id) > -1)
          {
            let postData = req.body;
            //you can do stuff cuz you have perms.
            //if it has id, it will have at least prefix as well
            //console.log("You actually have perms to do this, nice");
            db.findServer(postData.id).then((oldInfo) =>
            {
              if(oldInfo !== null)
              {
                let done = oldInfo.commands.length - 1;
                let count = 0;
                for(let i = 0; i < oldInfo.commands.length; i ++)
                {
                  if(postData[oldInfo.commands[i].key])
                  {
                    //this means that the checkmard was on, so it'll be enabled
                    //console.log(`${postData[oldInfo.commands[i].key]} exists, going to enabled it`);
                    oldInfo.commands[i].enabled = true;
                  }
                  else
                  {
                    //this means that the command wasn't checked, so it's disabled
                    //console.log(`${postData[oldInfo.commands[i].key]} doesn't exist, going to disable it`);
                    oldInfo.commands[i].enabled = false;
                  }
                  if(count === done)
                  {
                    let newData = {};
                    newData.prefix = postData.prefix;
                    if(postData.nsfw)
                    {
                      newData.nsfw = true;
                    }
                    else
                    {
                      newData.nsfw = false;
                    }
                    newData.commands = oldInfo.commands;
                    //console.log(newData);
                    db.updateServer(postData.id, newData);
                  }
                  count++;
                }
              }
            });
          }
        }
      }
    }
    //console.log(req.body);
    res.json(req.body);
  });
  app.get('/logout', (req, res, next) =>
  {
    if(tokens[req.sessionID])
    {
      delete tokens[req.sessionID];
      delete guildsWithPerms[req.sessionID];
    }
    res.redirect("http://hawkbot.cyberhawk.co");
  });
  https.createServer({
    key: privateKey,
    cert: certificate
  }, app).listen(443);
  // Redirect from http port 80 to https
  const http = require('http');
  http.createServer(function (req, res)
  {
    res.writeHead(301, { 'Location': 'https://' + req.headers['host'] + req.url });
    res.end();
  }).listen(80);
};

