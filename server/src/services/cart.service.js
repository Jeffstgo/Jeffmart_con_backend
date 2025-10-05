import { pool } from '../config/db.js';

export async function addItem({ userId, productId, quantity }) {
  if (!userId) return { error: 'Auth requerida', code: 401 };
  if (!productId || quantity <= 0) return { error: 'Datos inválidos', code: 400 };
  
  await pool.query(
    `INSERT INTO cart(user_id, product_id, quantity)
     VALUES($1, $2, $3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity`,
    [userId, productId, quantity]
  );
  return await getCart({ userId });
}

export async function removeItem({ userId, productId }) {
  if (!userId) return { error: 'Auth requerida', code: 401 };
  if (!productId) return { error: 'productId requerido', code: 400 };
  await pool.query('DELETE FROM cart WHERE user_id=$1 AND product_id=$2', [userId, productId]);
  return await getCart({ userId });
}

export async function getCart({ userId }) {
  if (!userId) return { error: 'Auth requerida', code: 401 };

  const { rows: items } = await pool.query(
    `SELECT
       p.id,
       p.titulo AS title,
       p.precio AS price,
       p.imagen AS image,
       c.quantity,
       (p.precio * c.quantity) AS subtotal
     FROM cart c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = $1
     ORDER BY p.fecha_publicacion DESC`,
    [userId]
  );

  const total = items.reduce((acc, it) => acc + Number(it.subtotal), 0);
  return { cartId: userId, items, total };
}

export async function updateQuantity({ userId, productId, quantity }) {
  if (!userId) return { error: 'Auth requerida', code: 401 };
  if (!productId || quantity < 0) return { error: 'Datos inválidos', code: 400 };
  
  if (quantity === 0) {
    await pool.query('DELETE FROM cart WHERE user_id=$1 AND product_id=$2', [userId, productId]);
  } else {
    await pool.query(
      `UPDATE cart SET quantity = $3 WHERE user_id = $1 AND product_id = $2`,
      [userId, productId, quantity]
    );
  }
  
  return await getCart({ userId });
}

export async function clearCart({ userId }) {
  if (!userId) return { error: 'Auth requerida', code: 401 };
  
  await pool.query('DELETE FROM cart WHERE user_id=$1', [userId]);
  
  return { cartId: userId, items: [], total: 0 };
}
