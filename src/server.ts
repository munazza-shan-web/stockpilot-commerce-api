import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';

if (!process.env.VERCEL) {
  const server = app.listen(env.PORT, () => console.log(`StockPilot API running at http://localhost:${env.PORT}`));
  process.on('SIGTERM', () => server.close(() => prisma.$disconnect()));
}

export default app;
