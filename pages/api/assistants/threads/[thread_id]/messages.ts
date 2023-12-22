import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { thread_id } = req.query;

    const threadMessages = await openai.beta.threads.messages.list(
      thread_id as string
    );

    res.status(200).json(threadMessages.data[0]);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
}