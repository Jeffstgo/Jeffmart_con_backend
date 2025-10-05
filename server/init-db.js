import pkg from 'pg';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Client } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('Conectado a la base de datos');

    // Leer el archivo SQL
    const sqlScript = readFileSync(join(__dirname, 'sql', 'init.sql'), 'utf8');
    
    // Ejecutar el script
    await client.query(sqlScript);
    console.log('Base de datos inicializada correctamente');

  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  } finally {
    await client.end();
  }
}

initDatabase();
