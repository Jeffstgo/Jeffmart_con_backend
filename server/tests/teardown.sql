-- Limpia correos de prueba y productos de prueba
DELETE FROM user_favorites WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'test+%');
DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM cart WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'test+%'));
DELETE FROM cart WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'test+%');
DELETE FROM products WHERE titulo LIKE 'TEST %';
DELETE FROM users WHERE email LIKE 'test+%';
