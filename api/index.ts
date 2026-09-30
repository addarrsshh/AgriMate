import { IncomingMessage, ServerResponse } from 'http';
import app, { ensureDatabaseInitialized } from '../backend/src/app';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  await ensureDatabaseInitialized();
  app(req, res);
}
