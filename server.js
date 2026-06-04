const express = require('express');
const cors = require('cors');
const axios = require('axios');

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
    const body = {
      videoId,
      context: {
        client: {
          clientName: 'ANDROID_MUSIC',
          clientVersion: '6.42.52',
          androidSdkVersion: 30,
          hl: 'en'
        }
      }
    };
    const r = await axios.post(
      `https://music.youtube.com/youtubei/v1/player?key=${KEY}`,
      body,
      { headers: { ...HEADERS, 'User-Agent': 'com.google.android.apps.youtube.music/6.42.52 (Linux; U; Android 11)' } }
    );
    const formats = r.data?.streamingData?.adaptiveFormats || [];
    const audio = formats.filter(f => f.mimeType?.includes('audio/mp4')).sort((a, b) => b.bitrate - a.bitrate)[0];
    res.json({ streamUrl: audio?.url || null });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => console.log('Server ready: http://localhost:3000'));