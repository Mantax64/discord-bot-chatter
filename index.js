// index.js
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const startServer = require('./server');

// Create a new Discord client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`[READY] Logged in as ${client.user.tag}`);

  // Start Express server and pass bot client
  startServer(client);
});

client.login(process.env.BOT_TOKEN);
