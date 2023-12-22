import { NextApiRequest, NextApiResponse } from 'next';
import { config } from 'dotenv';
import { Message } from '@/types/chat';
import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { Thread } from 'openai/resources/beta/threads/threads';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

config(); // Load environment variables from .env.local file

async function validateAssistant(assistant_id: string): Promise<Assistant | boolean> {
  const myAssistant = await openai.beta.assistants.retrieve(
    assistant_id
  );

  return myAssistant;
}

async function validateThread(thread_id: string): Promise<Thread | boolean> {
  const myThread = await openai.beta.threads.retrieve(
    thread_id
  );
  return myThread;

  throw new Error('Not implemented');
}

async function createMessage(thread_id: string, message: Message): Promise<ThreadMessage | boolean> {
  const threadMessage = await openai.beta.threads.messages.create(
    thread_id,
    { role: "user", content: message.content }
  );

  return threadMessage;
}
        
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    let { message, assistant_id } = req.body;
    let { thread_id } = req.query;
    
    // Check if assistant_id exists
    const assistant = await validateAssistant(assistant_id);
    const thread = await validateThread(thread_id as string);

    if (!assistant) {
      res.status(400).json({ error: 'Invalid assistant_id' });
      return;
    }

    if (!thread) {
      res.status(400).json({ error: 'Invalid thread_id' });
      return;
    }

    message && await createMessage(thread_id as string, message);

    // TODO: Call OpenAI API to create a new run on the given thread
    const run = await openai.beta.threads.runs.create(
      thread_id as string,
      { assistant_id: assistant_id }
    );
    return run;

    res.status(500).send('Not implemented');
  } catch (error) {
    res.status(500).json({ error: error });
  }
}