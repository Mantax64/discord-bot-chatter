const { Client, GatewayIntentBits, REST } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

async function startBot() {
  const token = process.env.BOT_TOKEN;

  if (!token) {
    console.error('❌ BOT_TOKEN not set!');
    process.exit(1);
  }

  // Set token manually on REST just in case
  client.rest.setToken(token);

  await client.login(token);

  await new Promise((resolve) => {
    client.once('ready', () => {
      console.log(`✅ Logged in as ${client.user.tag}`);
      resolve();
    });
  });

  require('./server')(client);
}

startBot();