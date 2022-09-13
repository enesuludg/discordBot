import { Client,GatewayIntentBits } from 'discord.js';
import express from 'express';
import { upload } from 'diawi-nodejs-uploader';
import axios from 'axios';
import bodyParser from 'body-parser';
import { readdir } from'fs/promises';
import  path from 'path';
import {
  jenkinsParams,
  channelId,
  port,
  diawiToken,
  discordToken,
  baseUrl,
  config
} from './config.js';
import jenkinsHandler from 'jenkins';
import { pipeline } from './pipeline.js';
import  checkInternetConnected from 'check-internet-connected';
import * as child from 'child_process';
import * as cron from 'node-cron'

const jenkins = new jenkinsHandler({ baseUrl: baseUrl, crumbIssuer: true });
const app = express()

const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.DirectMessages,GatewayIntentBits.DirectMessageTyping,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent,GatewayIntentBits.DirectMessageReactions] });
app.use(bodyParser.json())

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  //client.channels.cache.get(channelId).send('Build bot is online!');
});
  client.on('messageCreate', msg => {
     if (msg.content.startsWith('/build')) {
        let message = msg.content.split(' ');
        let params=msg.content.includes('sdk');
        axios.get(`${baseUrl}/job/${message[1]}${jenkinsParams}&pod=${params}`)
              .then(response => {
                if(response.status===201){
                  msg.reply('Build started')
                }
              })
              .catch(err => {
                console.log(err);
                msg.reply('Build error')
              });
      }
      if (msg.content.startsWith('/create')) {
        let message = msg.content.split('/create ');
        if (message.length === 1) {
          msg.reply('syntax error');
          msg.reply(`example: /create { "name":"game nickname", "github":"github shh repo",branch:"branch name"}`);
        }
        const githubUrl=JSON.parse(message[1]).github;
        const pipelineName=JSON.parse(message[1]).name;
        let branch=JSON.parse(message[1]).branch;
        if(!branch) branch='main';
        const xml = pipeline(githubUrl,branch);
        console.log(xml)
        jenkins.job.create(pipelineName, xml, function(err) {
          if (err) {
            msg.reply(`${pipelineName} pipeline not created`);
            throw err
          }
          msg.reply(`${pipelineName} pipeline created`);
        });

      }
      if (msg.content==='/status') {
        msg.reply('Active');
      }
      if (msg.content.startsWith('/list')) {
        jenkins.job.list(function(err, data) {
          if (err) {
            msg.reply(`erorr`);
            throw err
          }     
          console.log(data)
          let res= new Array();
          for (const job of data) {
            if(job.color.includes('anime')){
              job.color='Running';
            }else if(job.color === 'blue'){
              job.color='Completed';
            }else{
              job.color='Failed or aborted';
            }
            res.push(`\n Name: ${job.name} State: ${job.color} `);
          }
          msg.reply(res.toString());
        });
      }
    });
client.login(discordToken);

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
app.get('/restart', async (_req, res) => {
  const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now()
  };
  try {
    child.exec('pm2 restart 0',
      (error) => {
          if (error !== null) {
              console.error(`exec error: ${error}`);
          }
      });
      res.send(healthcheck);
  } catch (error) {
      healthcheck.message = error;
      res.status(503).send(healthcheck);
  }
});
app.get('/error', async (req, res) => {
  const { name } = req.query;
  try {
    client.channels.cache.get(channelId).send(`${name} Build error!`);
    res.status(200).send('ok');
  } catch (error) {
      console.error(error);
      res.status(503).send(error);
  }
});
app.post('/build', (req, res) => {
    const {link,name} = req.body;
    client.channels.cache.get(channelId).send(` ${name} Build successfully!`);
    client.channels.cache.get(channelId).send(`${link}`) 
    res.send('Build success')
})

app.post('/upload', async (req, res, next) => {
    try {
      req.socket.setTimeout(5 * 60 * 1000);
    const {directory} = req.body;
    const file = await findByExtension(directory,'ipa');
    const ipaPath =directory+file;
    const name = path.basename(file, '.ipa');
    const result = await upload({
      file: ipaPath,
      token: diawiToken,
    });
    client.channels.cache.get(channelId).send(` ${name} Build successfully!`);
    client.channels.cache.get(channelId).send(`${result.link}`); 
    next();
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
app.listen(port, () => console.log(` ${port} Build app listening on port 3000!`))

setInterval(async () => {checkInternetConnected(config)
  .then(() => {
  })
  .catch((ex) => {
    child.exec('pm2 restart 0',
      (error) => {
          if (error !== null) {
              console.error(`exec error: ${error}`);
          }
      });
    console.log(ex); // cannot connect to a server or error occurred.
  }); }, 10000);

cron.schedule('0 9 * * *', () => {
  console.log('cron pm2 restart 0');
  child.exec('pm2 restart 0',
      (error) => {
          if (error !== null) {
              console.error(`exec error: ${error}`);
          }
      });
});