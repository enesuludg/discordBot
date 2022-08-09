import { Client,GatewayIntentBits } from 'discord.js';
import express from 'express';
import { upload } from 'diawi-nodejs-uploader';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { readdir } from'fs/promises';
import  path from'path';
dotenv.config();

const app = express()
const jenkinsUrlPipeline1 =process.env.JENKINS_URL;
const jenkinsUrlPipeline2 =process.env.JENKINS_URL2;
const channelId=process.env.CHANNEL_ID;
const port = process.env.PORT || 3000;
const diawiToken = process.env.DIAWI_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.DirectMessages,GatewayIntentBits.DirectMessageTyping,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent,GatewayIntentBits.DirectMessageReactions] });
app.use(bodyParser.json())

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  //client.channels.cache.get(channelId).send('Build bot is online!');
});
  client.on('messageCreate', msg => {
    console.log(msg.content);
     if (msg.content.startsWith('/build')) {
        let message = msg.content.split(' ');
        let params=false;
        if(message.length >= 2) params=true;
        switch (message[1]) {
            case 'test':
              axios.get(`${jenkinsUrlPipeline1}&pod=${params}`)
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
                axios.get(`${jenkinsUrlPipeline2}&pod=true`)
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

app.get('/', async (_req, res) => {
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

app.post('/upload', async (req, res) => {
    try {
      req.socket.setTimeout(10 * 60 * 1000);
    const {directory} = req.body;
    const file = await findByExtension(directory,'ipa');
    const path =directory+file;
    const name = path.basename(file, '.ipa')
    const result = await upload({
      file: path,
      token: diawiToken,
    });
    client.channels.cache.get(channelId).send(` ${name} Build successfully!`);
    client.channels.cache.get(channelId).send(`${result.link}`); 
    res.status(200);
  } catch (error) {
      console.error(error);
    }
})
const findByExtension = async (dir, ext) => {
  let matchedFiles;

  const files = await readdir(dir);

  for (const file of files) {
      const fileExt = path.extname(file);

      if (fileExt === `.${ext}`) {
          matchedFiles =file
      }
  }

  return matchedFiles;
};
app.listen(port, () => console.log(` ${port}Build app listening on port 3000!`))
