const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

async function startBot() {
  await client.login(process.env.BOT_TOKEN);

  // Wait until the bot is truly ready
  await new Promise((resolve) => {
    client.once('ready', () => {
      console.log(`Logged in as ${client.user.tag}`);
      resolve();
    });
  });

  require('./server')(client); // Start express only after login + ready
}

startBot();