// index.js
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

function startBot() {
  const token = process.env.BOT_TOKEN;

console.log('[DEBUG] BOT_TOKEN is:', process.env.BOT_TOKEN ? 'Present' : 'Missing');
console.log('[DEBUG] Executing from:', require.main === module ? 'Runtime' : 'Import context');

  if (!token) {
    console.error('BOT_TOKEN is missing. Exiting.');
    process.exit(1);
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.once('ready', () => {
    console.log(`Bot logged in as ${client.user.tag}`);
    require('./server')(client); // Start Express after login
  });

  client.login(token);
}

if (require.main === module) {
  startBot(); // Only run if file is executed directly
}
