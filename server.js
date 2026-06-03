const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { exec } = require('child_process');

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

app.get('/stream', (req, res) => {
  const videoId = req.query.videoId;
  if (!videoId) return res.status(400).json({ error: 'videoId required' });

  exec(`yt-dlp -g "https://www.youtube.com/watch?v=${videoId}"`,
    { cwd: __dirname },
    (error, stdout, stderr) => {
      if (error) return res.status(500).json({ error: error.message });
      const urls = stdout.trim().split('\n');
      res.json({ streamUrl: urls[0] });
    }
  );
});

app.listen(3000, () => console.log('Server ready: http://localhost:3000'));