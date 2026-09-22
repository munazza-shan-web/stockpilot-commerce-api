import { beforeAll, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

beforeAll(() => {
  process.env.DATABASE_URL ||= 'postgresql://user:password@localhost:5432/test';
  process.env.JWT_SECRET ||= 'test-secret-that-is-at-least-32-characters-long';
  process.env.CLIENT_URL ||= 'http://localhost:5173';
  process.env.NODE_ENV = 'test';
});

vi.mock('../src/lib/prisma.js', () => ({ prisma: {} }));

describe('GET /api/health', () => {
  it('returns service status', async () => {
    const { app } = await import('../src/app.js');
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
