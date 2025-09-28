import * as S from '../services/auth.service.js';

export async function register(req, res) {
  const out = await S.register({
    name: req.body?.name,
    lastName: req.body?.lastName,
    email: req.body?.email,
    password: req.body?.password
  });
  if (out.error) return res.status(out.code || 400).json({ error: out.error });
  res.status(201).json(out);
}

export async function login(req, res) {
  const out = await S.login({
    email: req.body?.email,
    password: req.body?.password
  });
  if (out.error) return res.status(out.code || 401).json({ error: out.error });
  res.json(out);
}

export async function getProfile(req, res) {
  const userId = req.user?.id;
  const profile = await S.getProfile(userId);
  if (!profile) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(profile);
}

export async function updateProfile(req, res) {
  const userId = req.user?.id;
  const out = await S.updateProfile(userId, {
    name: req.body?.name,
    lastName: req.body?.lastName,
    avatar: req.body?.avatar
  });
  if (out.error) return res.status(out.code || 400).json({ error: out.error });
  res.json(out);
}
