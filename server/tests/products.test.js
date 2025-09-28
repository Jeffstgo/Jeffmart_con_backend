import request from 'supertest';
import app from '../src/index.js';
import { closeDb } from './utils.js';

afterAll(async () => {
  await closeDb();
});

describe('Products public endpoints', () => {
  test('GET /api/products should return { total, items }', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  test('GET /api/products?q=guitarra should filter', async () => {
    const res = await request(app).get('/api/products').query({ q: 'guitarra' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
  });

  test('GET /api/products/:id returns 200 or 404', async () => {
    const ok = await request(app).get('/api/products/1');
    expect([200,404]).toContain(ok.status);

    const notFound = await request(app).get('/api/products/999999');
    expect(notFound.status).toBe(404);
  });
});
