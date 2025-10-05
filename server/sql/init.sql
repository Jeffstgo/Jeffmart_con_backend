-- Archivo combinado para inicialización en Render
-- Extensiones
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Esquema de tablas
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
  user_id INT NOT NULL REFERENCES users(id),
  product_id INT NOT NULL REFERENCES products(id),
  quantity INT NOT NULL DEFAULT 1,
  UNIQUE(user_id, product_id)
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_user ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_titulo ON products USING gin(titulo gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart(user_id);

-- Datos iniciales (seed)
INSERT INTO categories (nombre, slug) VALUES
  ('Electrónica', 'electronica'),
  ('Hogar', 'hogar'),
  ('Deportes', 'deportes'),
  ('Moda', 'moda'),
  ('Automóviles', 'automoviles'),
  ('Juguetes', 'juguetes')
ON CONFLICT (slug) DO NOTHING;

-- Usuario de ejemplo (la contraseña es 'password123' hasheada con bcrypt)
INSERT INTO users (nombre, apellido, email, password_hash, telefono, direccion, ciudad, codigo_postal, pais) VALUES
  ('Demo', 'User', 'demo@jeffmart.com', '$2a$10$K7L1OJ45/4Y2nIvL0DvAx.RSUrBhWV2/FeKLU4tGXfrFKgzf0KeSG', '+1234567890', '123 Main St', 'Demo City', '12345', 'Demo Country')
ON CONFLICT (email) DO NOTHING;

-- Productos de ejemplo
INSERT INTO products (user_id, category_id, titulo, descripcion, precio, stock, imagen) VALUES
  (1, 1, 'Smartphone Samsung Galaxy', 'Último modelo con cámara de 108MP', 899.99, 15, 'Smartphone.jpg'),
  (1, 1, 'Laptop Dell Inspiron', 'Intel i7, 16GB RAM, 512GB SSD', 1299.99, 8, 'Laptop.png'),
  (1, 1, 'Monitor Gaming 27"', 'Pantalla 144Hz, resolución 2K', 449.99, 12, 'Monitor Gamer.png'),
  (1, 2, 'Sofá de 3 Plazas', 'Cómodo sofá para sala de estar', 599.99, 5, 'Sofa.png'),
  (1, 2, 'Cafetera Espresso', 'Cafetera automática con molinillo', 299.99, 20, 'Cafetera.png'),
  (1, 2, 'Aspiradora Robot', 'Limpieza automática inteligente', 399.99, 10, 'Aspiradora.png'),
  (1, 3, 'Bicicleta de Montaña', 'Bicicleta profesional todo terreno', 799.99, 6, 'Bicicleta.png'),
  (1, 3, 'Set de Mancuernas', 'Juego completo de pesas', 199.99, 15, 'Mancuernas.png'),
  (1, 4, 'Zapatillas Deportivas', 'Zapatillas de running profesionales', 129.99, 25, 'Zapatillas.png'),
  (1, 6, 'Muñeca Articulada', 'Muñeca coleccionable premium', 59.99, 30, 'Muneca.png'),
  (1, 6, 'Carrito RC', 'Carro a control remoto todoterreno', 89.99, 18, 'Carrito RC.png'),
  (1, 1, 'Guitarra Acústica', 'Guitarra clásica para principiantes', 199.99, 12, 'Guitarra.png')
ON CONFLICT DO NOTHING;
