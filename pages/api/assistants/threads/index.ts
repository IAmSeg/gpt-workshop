import { NextApiRequest, NextApiResponse } from 'next';
import { config } from 'dotenv';
import { Message } from '@/types/chat';
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

config();
        
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {  
    const { messages } = req.body;

    if (messages && (!Array.isArray(messages) || messages.length === 0 || messages.some((message: Message) => !message.role || !message.content))) {
      res.status(400).json({ error: 'Invalid messages format' });
      return;
    }

    const emptyThread = await openai.beta.threads.create();
    res.status(200).json(emptyThread.id);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
}