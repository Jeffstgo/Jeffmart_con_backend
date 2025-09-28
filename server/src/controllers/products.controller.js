import * as S from '../services/products.service.js';

export async function list(req, res) {
  const { q, category, limit, offset } = req.query;
  const data = await S.list({ q, category, limit, offset });
  res.json(data);
}

export async function getById(req, res) {
  const item = await S.getById(Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
}

export async function create(req, res) {
  const out = await S.create({
    userId: req.user?.id,
    title: req.body?.title,
    description: req.body?.description,
    price: req.body?.price,
    image: req.body?.image,
    categorySlug: req.body?.categorySlug,
    categoryId: req.body?.categoryId,
    stock: req.body?.stock
  });
  if (out.error) return res.status(out.code || 400).json({ error: out.error });
  res.status(201).json(out);
}

export async function getMyProducts(req, res) {
  const data = await S.getByUserId(req.user?.id);
  res.json(data);
}

export async function updateProduct(req, res) {
  const productId = Number(req.params.id);
  const userId = req.user?.id;
  
  const existingProduct = await S.getById(productId);
  if (!existingProduct) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  
  if (Number(existingProduct.userId) !== Number(userId)) {
    return res.status(403).json({ error: 'No tienes permisos para editar este producto' });
  }

  const out = await S.update(productId, {
    title: req.body?.title,
    description: req.body?.description,
    price: req.body?.price,
    image: req.body?.image,
    categoryId: req.body?.categoryId,
    stock: req.body?.stock
  });
  
  if (out.error) return res.status(out.code || 400).json({ error: out.error });
  res.json(out);
}

export async function deleteProduct(req, res) {
  const productId = Number(req.params.id);
  const userId = req.user?.id;
  
  const existingProduct = await S.getById(productId);
  if (!existingProduct) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  
  if (Number(existingProduct.userId) !== Number(userId)) {
    return res.status(403).json({ error: 'No tienes permisos para eliminar este producto' });
  }

  const out = await S.deleteById(productId);
  if (out.error) return res.status(out.code || 400).json({ error: out.error });
  res.json({ message: 'Producto eliminado correctamente' });
}
