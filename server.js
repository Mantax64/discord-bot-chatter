const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const CHANNELS = {
  '1160738866576228463': 'Gangest Chat',
  '1368989906843471962': 'Mod Team',
};

module.exports = (client) => {
  // Serve available channels
  app.get('/history/:channelId', async (req, res) => {
    const channelId = req.params.channelId;
  
    if (!CHANNELS[channelId])
      return res.status(404).json({ error: 'Invalid channel ID' });
  
    if (!client.isReady()) {
      return res.status(503).json({ error: 'Bot not ready yet' });
    }
  
    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel.isTextBased())
        return res.status(400).json({ error: 'Not a text channel' });
  
      const messages = await channel.messages.fetch({ limit: 10 });
      const history = Array.from(messages.values())
        .reverse()
        .map((msg) => msg.content);
  
      res.json(history);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to get messages' });
    }
  });

  // Get last 10 messages from a channel
  app.get('/history/:channelId', async (req, res) => {
    const channelId = req.params.channelId;

    if (!CHANNELS[channelId])
      return res.status(404).json({ error: 'Invalid channel ID' });

    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel.isTextBased())
        return res.status(400).json({ error: 'Not a text channel' });

      const messages = await channel.messages.fetch({ limit: 10 });
      const history = Array.from(messages.values())
        .reverse()
        .map((msg) => msg.content);

      res.json(history);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to get messages' });
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Web server running on port ${port}`));
};
