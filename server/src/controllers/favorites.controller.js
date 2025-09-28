import * as S from '../services/favorites.service.js';

export async function addFav(req, res) {
  const out = await S.add({ userId: req.user?.id, productId: Number(req.body?.productId) });
  if (out.error) return res.status(out.code || 400).json({ error: out.error });
  res.status(201).json(out);
}

export async function removeFav(req, res) {
  const out = await S.remove({ userId: req.user?.id, productId: Number(req.params.productId) });
  if (out.error) return res.status(out.code || 400).json({ error: out.error });
  res.json(out);
}

export async function listFavs(req, res) {
  const out = await S.list({ userId: req.user?.id });
  res.json(out);
}
