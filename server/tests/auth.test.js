import request from 'supertest';
import app from '../src/index.js';
import { closeDb } from './utils.js';

const rnd = () => Math.random().toString(36).slice(2,8);
const email = `test+${rnd()}@mail.local`;
const password = '123456';

afterAll(async () => {
  await closeDb();
});

describe('Auth + protected create product', () => {
  test('register → 201 with {user, token}', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test',
      lastName: 'User',
      email,
      password
    });
   expect(res.status).toBe(201);
   expect(res.body).toHaveProperty('user');
   expect(res.body).toHaveProperty('token');
  });

  test('login → 200 with {user, token}', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/products without token → 401', async () => {
    const res = await request(app).post('/api/products').send({
      title: 'TEST Product Unauthorized',
      price: 100,
      categorySlug: 'guitarras'
    });
    expect(res.status).toBe(401);
  });

  test('POST /api/products with token → 201 {id}', async () => {
    const loginRes = await request(app).post('/api/auth/login').send({ email, password });
    const token = loginRes.body.token;
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TEST Product OK',
        description: 'Spec created',
        price: 123.45,
        categorySlug: 'guitarras',
        stock: 1
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
