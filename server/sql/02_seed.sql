-- Configurar codificación UTF-8
SET CLIENT_ENCODING TO 'UTF8';

INSERT INTO users (nombre, apellido, email, password_hash)
VALUES ('Demo', 'Seller', 'demo@jeffmart.local', '$2a$10$abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefab')
ON CONFLICT (email) DO NOTHING;


INSERT INTO categories (nombre, slug) VALUES
  ('Guitarras','guitarras'),
  ('Accesorios','accesorios'),
  ('Amplificadores','amplificadores'),
  ('Pedales','pedales')
ON CONFLICT (slug) DO NOTHING;


WITH u AS (SELECT id FROM users WHERE email='demo@jeffmart.local' LIMIT 1),
     c AS (SELECT id FROM categories WHERE slug='guitarras' LIMIT 1)
INSERT INTO products (user_id, category_id, titulo, descripcion, precio, stock, imagen)
SELECT u.id, c.id, 'Guitarra Stratocaster', 'Modelo clásico HSS', 499.90, 5, ''
FROM u, c
UNION ALL
SELECT u.id, c.id, 'Guitarra Les Paul', 'Cuerpo sólido, humbuckers', 899.00, 3, ''
FROM u, c
ON CONFLICT DO NOTHING;
