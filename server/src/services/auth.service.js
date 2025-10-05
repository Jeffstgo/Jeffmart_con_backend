import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES || '7d';

export async function register({ name, lastName, email, password }) {
  if (!name || !email || !password) return { error: 'Faltan campos', code: 400 };

  const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
  if (exists.rowCount) return { error: 'Email ya registrado', code: 409 };

  const hash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    `INSERT INTO users(nombre, apellido, email, password_hash)
     VALUES($1,$2,$3,$4)
     RETURNING id, nombre AS name, apellido AS "lastName", email, fecha_creacion AS "createdAt"`,
    [name, lastName || null, email, hash]
  );
  const user = rows[0];
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
  return { user, token };
}

export async function login({ email, password }) {
  if (!email || !password) return { error: 'Faltan credenciales', code: 400 };

  const { rows } = await pool.query(
    'SELECT id, nombre AS name, apellido AS "lastName", email, password_hash, fecha_creacion AS "createdAt" FROM users WHERE email=$1',
    [email]
  );
  if (!rows.length) return { error: 'Credenciales inválidas', code: 401 };

  const u = rows[0];
  const ok = await bcrypt.compare(password, u.password_hash);
  if (!ok) return { error: 'Credenciales inválidas', code: 401 };

  const token = jwt.sign({ id: u.id, email: u.email }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
  const { password_hash, ...user } = u;
  return { user, token };
}

export async function getProfile(userId) {
  if (!userId) return null;
  
  const { rows } = await pool.query(
    'SELECT id, nombre AS name, apellido AS "lastName", email, fecha_creacion AS "createdAt" FROM users WHERE id=$1',
    [userId]
  );
  return rows[0] || null;
}

export async function updateProfile(userId, { name, lastName }) {
  if (!userId) return { error: 'Usuario requerido', code: 401 };
  if (!name) return { error: 'El nombre es requerido', code: 400 };

  try {
    const { rows } = await pool.query(
      `UPDATE users 
       SET nombre = $1, apellido = $2 
       WHERE id = $3 
       RETURNING id, nombre AS name, apellido AS "lastName", email, fecha_creacion AS "createdAt"`,
      [name, lastName || null, userId]
    );

    if (!rows.length) return { error: 'Usuario no encontrado', code: 404 };
    return { user: rows[0] };
  } catch (error) {
    return { error: 'Error al actualizar perfil', code: 500 };
  }
}
