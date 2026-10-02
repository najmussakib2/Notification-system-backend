// api/index.ts

import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';
import { connectDB } from '../src/app/DB/connectDB';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Ensure database is connected before handling the request
  await connectDB();

  // Hand off request handling to Express app
  return app(req, res);
}
