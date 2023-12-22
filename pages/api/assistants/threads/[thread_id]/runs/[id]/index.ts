import { NextApiRequest, NextApiResponse } from "next";
import { Run } from "openai/resources/beta/threads/runs/runs";
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function validateRun(thread_id: string, run_id: string): Promise<Run | boolean> {
  const run = await openai.beta.threads.runs.retrieve(
    thread_id,
    run_id
  );

  return run;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { thread_id, id: run_id } = req.query;
    const run = await validateRun(thread_id as string, run_id as string);

    if (!run) {
      res.status(400).json({ error: 'Invalid run_id' });
      return;
    }

    res.status(200).json(run);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}