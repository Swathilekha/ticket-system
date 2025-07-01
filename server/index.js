import express from 'express';
import cors from 'cors';
import { chatWithOpenAI } from './openai.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// ✅ Enable CORS for your frontend domain
app.use(cors({
  origin: 'https://witty-bush-07f86f81e.2.azurestaticapps.net', // your deployed frontend URL
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ✅ OpenAI proxy endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, messages } = req.body;

    const userPrompt = messages
      ? messages
      : [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt || 'No prompt provided.' }
        ];

    const response = await chatWithOpenAI(userPrompt);
    res.json(response);
  } catch (err) {
    console.error('🔴 OpenAI Proxy Error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ✅ Use dynamic port for Azure, fallback to 5000 locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
