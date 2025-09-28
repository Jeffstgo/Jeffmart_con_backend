import * as S from '../services/categories.service.js';

export async function list(_req, res) {
  const data = await S.list();
  res.json(data);
}
