const express = require('express');
const cors = require('cors');
const axios = require('axios');
const ytdl = require('ytdl-core');

const app = express();
app.use(cors());
app.use(express.json());

const YT_URL = 'https://music.youtube.com/youtubei/v1/';
const KEY = 'AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30';
const HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0',
  'Origin': 'https://music.youtube.com'
};

app.post('/browse', async (req, res) => {
  try {
    const r = await axios.post(`${YT_URL}browse?key=${KEY}`, req.body, { headers: HEADERS });
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/stream', async (req, res) => {
  const videoId = req.query.videoId;
  if (!videoId) return res.status(400).json({ error: 'videoId required' });
  try {
    const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
    res.json({ streamUrl: format.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => console.log('Server ready: http://localhost:3000'));