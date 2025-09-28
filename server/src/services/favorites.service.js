import { pool } from '../config/db.js';

export async function add({ userId, productId }) {
  if (!userId) return { error: 'Auth requerida', code: 401 };
  if (!productId) return { error: 'productId requerido', code: 400 };
  await pool.query(
    `INSERT INTO user_favorites(user_id, product_id)
     VALUES($1,$2)
     ON CONFLICT (user_id, product_id) DO NOTHING`,
    [userId, productId]
  );
  return { ok: true };
}

export async function remove({ userId, productId }) {
  if (!userId) return { error: 'Auth requerida', code: 401 };
  await pool.query('DELETE FROM user_favorites WHERE user_id=$1 AND product_id=$2', [userId, productId]);
  return { ok: true };
}

export async function list({ userId }) {
  if (!userId) return { error: 'Auth requerida', code: 401 };
  const { rows } = await pool.query(
    `SELECT
       p.id,
       p.titulo AS title,
       p.descripcion AS description,
       p.precio AS price,
       p.imagen AS image,
       json_build_object('id', c.id, 'name', c.nombre, 'slug', c.slug) AS category
     FROM user_favorites f
     JOIN products p ON p.id = f.product_id
     JOIN categories c ON c.id = p.category_id
     WHERE f.user_id = $1
     ORDER BY p.fecha_publicacion DESC`,
    [userId]
  );
  return rows;
}
