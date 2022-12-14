import dotenv from 'dotenv';
dotenv.config();

export const jenkinsUrlPipeline1 =process.env.JENKINS_URL;
export const jenkinsUrlPipeline2 =process.env.JENKINS_URL2;
export const jenkinsUrlPipeline3 =process.env.JENKINS_URL3;

export const channelId=process.env.CHANNEL_ID;
export const port = process.env.PORT || 3000;
export const diawiToken = process.env.DIAWI_TOKEN;
export const discordToken=process.env.BOT_TOKEN;
export const baseUrl=process.env.BASEURL
export const jenkinsParams = process.env.PARAMS

export const config = {
    timeout: 5000, //timeout connecting to each server, each try
    retries: 5,//number of retries to do before failing
    domain: 'https://apple.com',//the domain to check DNS record of
  }