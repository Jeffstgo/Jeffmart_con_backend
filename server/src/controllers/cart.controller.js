import * as S from '../services/cart.service.js';

export async function addItem(req, res) {
  const out = await S.addItem({
    userId: req.user?.id,
    productId: Number(req.body?.productId),
    quantity: Number(req.body?.quantity ?? 1),
  });
  if (out.error) return res.status(out.code || 400).json({ error: out.error });
  res.json(out);
}

export async function removeItem(req, res) {
  const out = await S.removeItem({
    userId: req.user?.id,
    productId: Number(req.params.productId),
  });
  if (out.error) return res.status(out.code || 400).json({ error: out.error });
  res.json(out);
}

export async function getCart(req, res) {
  const out = await S.getCart({ userId: req.user?.id });
  res.json(out);
}

export async function updateQuantity(req, res) {
  const out = await S.updateQuantity({
    userId: req.user?.id,
    productId: Number(req.body?.productId),
    quantity: Number(req.body?.quantity),
  });
  if (out.error) return res.status(out.code || 400).json({ error: out.error });
  res.json(out);
}

export async function clearCart(req, res) {
  const out = await S.clearCart({ userId: req.user?.id });
  if (out.error) return res.status(out.code || 400).json({ error: out.error });
  res.json(out);
}
