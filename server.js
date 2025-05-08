require('dotenv').config();
const express = require('express');
const path = require('path');

module.exports = (client) => {
  try {
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(express.json());
    console.log("Static file server enabled. Looking for public/index.html");
    app.use(express.static(path.join(__dirname, 'public')));

    // POST: send a message
    app.post('/send-message', async (req, res) => {
      const { username, message, channelId } = req.body;

      if (!username || !message || !channelId) {
        return res.status(400).json({ error: 'Missing username, message, or channelId' });
      }

      try {
        const channel = await client.channels.fetch(channelId);
        if (!channel || !channel.isTextBased()) {
          return res.status(404).json({ error: 'Invalid or non-text channel' });
        }

        const finalMessage = `**${username}**: ${message}`;
        await channel.send(finalMessage);
        res.json({ success: true });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
      }
    });

    // GET: fetch recent messages
    app.get('/channel-messages', async (req, res) => {
      const channelId = req.query.channelId;
      if (!channelId) return res.status(400).json({ error: 'Missing channelId' });

      try {
        const channel = await client.channels.fetch(channelId);
        if (!channel || !channel.isTextBased()) {
          return res.status(404).json({ error: 'Invalid or non-text channel' });
        }

        const fetched = await channel.messages.fetch({ limit: 10 });
        const messages = fetched.map(msg => ({
          author: msg.author.username,
          content: msg.content,
          timestamp: msg.createdAt
        })).reverse();

        res.json({ success: true, messages });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch messages' });
      }
    });

    // Root: serve the HTML file
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    // ✅ Start the server after everything is defined
    app.listen(port, '0.0.0.0', () => {
      console.log(`Web server running on port ${port}`);
    });

  } catch (err) {
    console.error("Error inside server.js:", err);
  }
};
