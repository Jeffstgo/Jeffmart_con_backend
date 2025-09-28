import { pool } from '../config/db.js';

async function ensureCart(userId) {
  const { rows } = await pool.query(
    `INSERT INTO cart(user_id) VALUES($1)
     ON CONFLICT (user_id) DO UPDATE SET user_id = EXCLUDED.user_id
     RETURNING id`, [userId]);
  return rows[0].id;
}

export async function addItem({ userId, productId, quantity }) {
  if (!userId) return { error: 'Auth requerida', code: 401 };
  if (!productId || quantity <= 0) return { error: 'Datos inválidos', code: 400 };
  const cartId = await ensureCart(userId);
  await pool.query(
    `INSERT INTO cart_items(cart_id, product_id, cantidad)
     VALUES($1,$2,$3)
     ON CONFLICT (cart_id, product_id)
     DO UPDATE SET cantidad = cart_items.cantidad + EXCLUDED.cantidad`,
    [cartId, productId, quantity]
  );
  return await getCart({ userId });
}

export async function removeItem({ userId, productId }) {
  if (!userId) return { error: 'Auth requerida', code: 401 };
  if (!productId) return { error: 'productId requerido', code: 400 };
  const { rows: cartRows } = await pool.query('SELECT id FROM cart WHERE user_id=$1', [userId]);
  if (!cartRows.length) return { cartId: null, items: [], total: 0 };
  const cartId = cartRows[0].id;
  await pool.query('DELETE FROM cart_items WHERE cart_id=$1 AND product_id=$2', [cartId, productId]);
  return await getCart({ userId });
}

export async function getCart({ userId }) {
  if (!userId) return { error: 'Auth requerida', code: 401 };
  const cartIdRes = await pool.query('SELECT id FROM cart WHERE user_id=$1', [userId]);
  if (!cartIdRes.rowCount) return { cartId: null, items: [], total: 0 };
  const cartId = cartIdRes.rows[0].id;

  const { rows: items } = await pool.query(
    `SELECT
       p.id,
       p.titulo AS title,
       p.precio AS price,
       p.imagen AS image,
       ci.cantidad AS quantity,
       (p.precio * ci.cantidad) AS subtotal
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = $1
     ORDER BY p.fecha_publicacion DESC`,
    [cartId]
  );

  const total = items.reduce((acc, it) => acc + Number(it.subtotal), 0);
  return { cartId, items, total };
}

export async function updateQuantity({ userId, productId, quantity }) {
  if (!userId) return { error: 'Auth requerida', code: 401 };
  if (!productId || quantity < 0) return { error: 'Datos inválidos', code: 400 };
  
  const { rows: cartRows } = await pool.query('SELECT id FROM cart WHERE user_id=$1', [userId]);
  if (!cartRows.length) return { error: 'Carrito no encontrado', code: 404 };
  
  const cartId = cartRows[0].id;
  
  if (quantity === 0) {
    await pool.query('DELETE FROM cart_items WHERE cart_id=$1 AND product_id=$2', [cartId, productId]);
  } else {
    await pool.query(
      `UPDATE cart_items SET cantidad = $3 WHERE cart_id = $1 AND product_id = $2`,
      [cartId, productId, quantity]
    );
  }
  
  return await getCart({ userId });
}

export async function clearCart({ userId }) {
  if (!userId) return { error: 'Auth requerida', code: 401 };
  
  const { rows: cartRows } = await pool.query('SELECT id FROM cart WHERE user_id=$1', [userId]);
  if (!cartRows.length) return { cartId: null, items: [], total: 0 };
  
  const cartId = cartRows[0].id;
  await pool.query('DELETE FROM cart_items WHERE cart_id=$1', [cartId]);
  
  return { cartId, items: [], total: 0 };
}
