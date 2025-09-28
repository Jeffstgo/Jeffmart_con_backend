import request from 'supertest';
import app from '../src/index.js';
import { closeDb } from './utils.js';

afterAll(async () => {
  await closeDb();
});

describe('GET /api/categories', () => {
  it('should return array of categories with id,name,slug', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length) {
      const c = res.body[0];
      expect(c).toHaveProperty('id');
      expect(c).toHaveProperty('name');
      expect(c).toHaveProperty('slug');
    }
  });
});
