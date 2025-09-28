import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { addFav, removeFav, listFavs } from '../controllers/favorites.controller.js';
const r = Router();
r.post('/add', requireAuth, addFav);
r.delete('/remove/:productId', requireAuth, removeFav);
r.get('/', requireAuth, listFavs);
export default r;
