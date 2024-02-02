import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';

dotenv.config();

const PORT = process.env.PORT || 5000;

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_SECRET_KEY });

const app = express();

// enable cors
app.use(cors());
app.options('*', cors());

app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({ message: 'Hola, este es el backend!' });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: 'gpt-4',
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({ bot: completion.choices[0].message.content });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
