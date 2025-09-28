import { pool } from '../config/db.js';

export async function list() {
  const { rows } = await pool.query(
    'SELECT id, nombre AS name, slug FROM categories ORDER BY nombre ASC'
  );
  return rows;
}
