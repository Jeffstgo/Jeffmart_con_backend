-- Corrección de caracteres con acentos
UPDATE products SET 
  titulo = 'Sofá de 3 Plazas',
  descripcion = 'Cómodo sofá para sala de estar'
WHERE titulo LIKE '%Sof%';

UPDATE products SET 
  titulo = 'Muñeca Articulada',
  descripcion = 'Muñeca coleccionable premium'
WHERE titulo LIKE '%Mu%eca%';

UPDATE products SET 
  descripcion = 'Último modelo con cámara de 108MP'
WHERE titulo LIKE '%Smartphone%';

UPDATE products SET 
  titulo = 'Bicicleta de Montaña',
  descripcion = 'Bicicleta profesional todo terreno'
WHERE titulo LIKE '%Bicicleta%';

UPDATE products SET 
  titulo = 'Guitarra Acústica',
  descripcion = 'Guitarra clásica para principiantes'
WHERE titulo LIKE '%Guitarra%';

UPDATE categories SET nombre = 'Electrónica' WHERE slug = 'electronica';
UPDATE categories SET nombre = 'Automóviles' WHERE slug = 'automoviles';
