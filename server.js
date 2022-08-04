require('dotenv').config();
const { Client, Intents,GatewayIntentBits } = require('discord.js');
const express = require('express');
const axios = require('axios');
const app = express()
const jenkinsUrl =process.env.JENKINS_URL;
const jenkinsToken=process.env.JENKINS_TOKEN;
const channelId=process.env.CHANNEL_ID;
const port = process.env.PORT || 3000;
const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.DirectMessages,GatewayIntentBits.DirectMessageTyping,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent,GatewayIntentBits.DirectMessageReactions] });
const bodyParser = require('body-parser')
app.use(bodyParser.json())

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
 //client.channels.cache.get(channelId).send('Build bot is online!');
});
  client.on('messageCreate', msg => {
    console.log(msg.content);
     if (msg.content.startsWith('/build')) {
        let message = msg.content.slice(7);
        switch (message) {
            case 'test':
              axios.get(jenkinsUrl)
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
    });

client.login(process.env.BOT_TOKEN);

app.get('/', (req, res) => {
    res.send('hello world')
  });
  app.post('/build', (req, res) => {
    console.log('req.body');
    console.log(req.body);
    const {link,name} = req.body;
    console((`${link} and ${name}`))
   /*  client.channels.cache.get(channelId).send(` ${req.body.name} Build successfully!`);
    client.channels.cache.get(channelId).send(`${req.body.link}`) */

    res.send('Build success')
  })
  app.listen(port, () => console.log('Build app listening on port 3000!'))
