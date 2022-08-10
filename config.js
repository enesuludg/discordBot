import dotenv from 'dotenv';
dotenv.config();

export const jenkinsUrlPipeline1 =process.env.JENKINS_URL;
export const jenkinsUrlPipeline2 =process.env.JENKINS_URL2;
export const jenkinsUrlPipeline3 =process.env.JENKINS_URL3;

export const channelId=process.env.CHANNEL_ID;
export const port = process.env.PORT || 3000;
export const diawiToken = process.env.DIAWI_TOKEN;
export const discordToken=process.env.BOT_TOKEN;
