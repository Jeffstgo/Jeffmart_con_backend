
CREATE EXTENSION IF NOT EXISTS pg_trgm;


CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  telefono TEXT,
  direccion TEXT,
  ciudad TEXT,
  codigo_postal TEXT,
  pais TEXT,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  category_id INT NOT NULL REFERENCES categories(id),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock INT DEFAULT 0,
  imagen TEXT,
  fecha_publicacion TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS user_favorites (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  product_id INT NOT NULL REFERENCES products(id),
  UNIQUE(user_id, product_id)
);


CREATE TABLE IF NOT EXISTS cart (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL REFERENCES users(id),
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INT NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id),
  cantidad INT NOT NULL CHECK (cantidad > 0),
  UNIQUE(cart_id, product_id)
);


CREATE TABLE IF NOT EXISTS payment_methods (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  tipo TEXT NOT NULL,
  detalle TEXT,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  payment_method_id INT REFERENCES payment_methods(id),
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  fecha_orden TIMESTAMP DEFAULT NOW(),
  estado TEXT NOT NULL DEFAULT 'pendiente'
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id),
  cantidad INT NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(10,2) NOT NULL
);


CREATE INDEX IF NOT EXISTS idx_products_titulo ON products USING gin (titulo gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_desc ON products USING gin (descripcion gin_trgm_ops);
