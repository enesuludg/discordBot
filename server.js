require('dotenv').config();
const { Client, Intents,GatewayIntentBits } = require('discord.js');
const express = require('express');
const axios = require('axios');
const app = express()
const jenkinsUrlTest =process.env.JENKINS_URL;
const jenkinsUrlScore =process.env.JENKINS_URL;
const channelId=process.env.CHANNEL_ID;
const port = process.env.PORT || 3000;
const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.DirectMessages,GatewayIntentBits.DirectMessageTyping,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent,GatewayIntentBits.DirectMessageReactions] });
const bodyParser = require('body-parser')
app.use(bodyParser.json())

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.channels.cache.get(channelId).send('Build bot is online!');
});
  client.on('messageCreate', msg => {
    console.log(msg.content);
     if (msg.content.startsWith('/build')) {
        let message = msg.content.slice(7);
        switch (message) {
            case 'test':
              axios.get(jenkinsUrlTest)
              .then(response => {
                if(response.status===201){
                  msg.reply('Build started')
                }
              })
              .catch(err => {
                console.log(err);
                msg.reply('Build error')
              });
                break;
              case 'score':
                axios.get(jenkinsUrlScore)
                .then(response => {
                  if(response.status===201){
                    msg.reply('Build started')
                  }
                })
                .catch(err => {
                  console.log(err);
                  msg.reply('Build error')
                });
                  break;
            default:
                msg.reply('fail');
                break;
        }
      }
      if (msg.content==='/status') {
        msg.reply('Active');
      }
    });

client.login(process.env.BOT_TOKEN);

router.get('/', async (_req, res, _next) => {
  const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now()
  };
  try {
      res.send(healthcheck);
  } catch (error) {
      healthcheck.message = error;
      res.status(503).send(healthcheck);
  }
});
app.post('/build', (req, res) => {
    const {link,name} = req.body;
    client.channels.cache.get(channelId).send(` ${name} Build successfully!`);
    client.channels.cache.get(channelId).send(`${link}`) 
    res.send('Build success')
  })
  app.listen(port, () => console.log('Build app listening on port 3000!'))
