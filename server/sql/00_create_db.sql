-- Ejecutar conectado a la BD "postgres"
CREATE EXTENSION IF NOT EXISTS dblink;

DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'jeffmart_db') THEN
      PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE jeffmart_db');
   END IF;
END$$;