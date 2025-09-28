import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const r = Router();
r.post('/register', register);
r.post('/login', login);
r.get('/profile', requireAuth, getProfile);
r.put('/profile', requireAuth, updateProfile);
export default r;
