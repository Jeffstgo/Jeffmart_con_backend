import { pool } from '../config/db.js';

export async function list({ q, category, limit = 12, offset = 0 }) {
  const params = [];
  const where = [];

  if (q) {
    params.push(`%${q}%`);
    where.push(`(p.titulo ILIKE $${params.length} OR p.descripcion ILIKE $${params.length})`);
  }
  if (category) {
    params.push(category);
    where.push(`c.slug = $${params.length}`);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  params.push(Number(limit), Number(offset));

  const itemsQ = `
    SELECT
      p.id,
      p.titulo AS title,
      p.descripcion AS description,
      p.precio AS price,
      p.stock,
      p.imagen AS image,
      json_build_object('id', c.id, 'name', c.nombre, 'slug', c.slug) AS category
    FROM products p
    JOIN categories c ON c.id = p.category_id
    ${whereSql}
    ORDER BY p.fecha_publicacion DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `;

  const countQ = `
    SELECT COUNT(*)::int AS total
    FROM products p
    JOIN categories c ON c.id = p.category_id
    ${whereSql}
  `;

  const [itemsRes, countRes] = await Promise.all([
    pool.query(itemsQ, params),
    pool.query(countQ, params.slice(0, params.length - 2))
  ]);

  return { total: countRes.rows[0].total, items: itemsRes.rows };
}

export async function getById(id) {
  if (!Number.isFinite(Number(id))) return null;
  const { rows } = await pool.query(
    `
    SELECT
      p.id,
      p.titulo AS title,
      p.descripcion AS description,
      p.precio AS price,
      p.stock,
      p.imagen AS image,
      p.user_id AS "userId",
      json_build_object('id', c.id, 'name', c.nombre, 'slug', c.slug) AS category
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.id = $1
    `,
    [id]
  );
  return rows[0] || null;
}

export async function create({ userId, title, description, price, image, categorySlug, categoryId, stock = 0 }) {
  if (!userId) return { error: 'Usuario requerido', code: 401 };
  if (!title || !price || !(categorySlug || categoryId)) return { error: 'Faltan campos', code: 400 };

  let catId = categoryId;
  if (!catId && categorySlug) {
    const cat = await pool.query('SELECT id FROM categories WHERE slug=$1', [categorySlug]);
    if (!cat.rowCount) return { error: 'Categoría no encontrada', code: 400 };
    catId = cat.rows[0].id;
  }

  const { rows } = await pool.query(`
    INSERT INTO products(user_id, category_id, titulo, descripcion, precio, stock, imagen)
    VALUES($1,$2,$3,$4,$5,$6,$7)
    RETURNING id
  `, [userId, catId, title, description || null, price, stock, image || null]);

  return { id: rows[0].id };
}

export async function getByUserId(userId) {
  if (!userId) return { items: [], total: 0 };
  
  const { rows } = await pool.query(`
    SELECT
      p.id,
      p.titulo AS title,
      p.descripcion AS description,
      p.precio AS price,
      p.stock,
      p.imagen AS image,
      p.fecha_publicacion AS created_at,
      json_build_object('id', c.id, 'name', c.nombre, 'slug', c.slug) AS category
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.user_id = $1
    ORDER BY p.fecha_publicacion DESC
  `, [userId]);

  return { items: rows, total: rows.length };
}

export async function update(id, { title, description, price, image, categoryId, stock }) {
  if (!Number.isFinite(Number(id))) return { error: 'ID inválido', code: 400 };
  if (!title || !price || !categoryId) return { error: 'Faltan campos requeridos', code: 400 };

  try {
    const { rows } = await pool.query(`
      UPDATE products 
      SET titulo = $1, descripcion = $2, precio = $3, imagen = $4, category_id = $5, stock = $6
      WHERE id = $7
      RETURNING id
    `, [title, description || null, price, image || null, categoryId, stock || 0, id]);

    if (!rows.length) return { error: 'Producto no encontrado', code: 404 };
    return { id: rows[0].id };
  } catch (error) {
    return { error: 'Error al actualizar producto', code: 500 };
  }
}

export async function deleteById(id) {
  if (!Number.isFinite(Number(id))) return { error: 'ID inválido', code: 400 };

  try {
    const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    if (!rowCount) return { error: 'Producto no encontrado', code: 404 };
    return { success: true };
  } catch (error) {
    return { error: 'Error al eliminar producto', code: 500 };
  }
}
