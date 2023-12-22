import { NextApiRequest, NextApiResponse } from "next";
import { Thread } from "openai/resources/beta/threads/threads";
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function validateThread(thread_id: string): Promise<Thread | boolean> {
  const myThread = await openai.beta.threads.retrieve(
    thread_id
  );
  return myThread;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { id: thread_id } = req.query;
    const thread = await validateThread(thread_id as string);

    if (!thread) {
      res.status(400).json({ error: 'Invalid thread_id' });
      return;
    }

    res.status(200).json(thread);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}