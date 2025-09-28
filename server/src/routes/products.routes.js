import { Router } from 'express';
import { list, getById, create, getMyProducts, updateProduct, deleteProduct } from '../controllers/products.controller.js';
import { requireAuth } from '../middlewares/auth.js';
const r = Router();

r.get('/', list);
r.get('/my', requireAuth, getMyProducts);
r.post('/', requireAuth, create);
r.get('/:id', getById);
r.put('/:id', requireAuth, updateProduct);
r.delete('/:id', requireAuth, deleteProduct);

export default r;
