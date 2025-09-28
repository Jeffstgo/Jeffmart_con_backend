import request from 'supertest';
import app from '../src/index.js';
import { closeDb } from './utils.js';

afterAll(async () => {
  await closeDb();
});

describe('GET /api/health', () => {
  it('should return ok true and service', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.service).toBe('jeffmart-api');
    expect(typeof res.body.ts).toBe('string');
  });
});
