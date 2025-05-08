//const express = require('express');
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');

process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', err => {
    console.error('Unhandled Rejection:', err);
});

console.log("INDEX.JS STARTED"); //confirm execution

//const app = express();
//const port = process.env.PORT || 3000;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const token = process.env.BOT_TOKEN || 'OTc1NDczNjA4Mzk2NzY3MjQy.GJtXwT.9WwW3I0azIPqMo5EWY9RN4VPT66nBKAX5TA8A4';
client.login(token);

const prefix = '=';
client.commands = new Collection();

// Dynamically load commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('messageCreate', async (message) => {

     // Ignore bots and messages that don't start with the prefix
  if (message.author.bot || !message.content.startsWith(prefix)) return;

    // Extract command (remove prefix and split to get command & args)
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  
    // Acquire command
  const command = client.commands.get(commandName);
  if (!command) return;

  // Log the user and the command
  console.log(`[LOG] ${message.author.tag} invoked command: ${commandName}`);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error trying to execute that command!');
  }
});

console.log("Attempting to log in with token...");

    client.once('ready', () => {
        console.log(`Logged in as ${client.user.tag}`);
        require('./server')(client);
    });