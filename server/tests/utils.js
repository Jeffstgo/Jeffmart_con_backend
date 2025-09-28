import { pool } from '../src/config/db.js';
import { exec as _exec } from 'node:child_process';
import { promisify } from 'node:util';
const exec = promisify(_exec);

export async function dbExecSqlFile(file) {
  const cmd = `psql -U postgres -h localhost -p 5432 -d jeffmart_db_test -f ${file}`;
  await exec(cmd);
}

export async function closeDb() {
  await pool.end();
}
