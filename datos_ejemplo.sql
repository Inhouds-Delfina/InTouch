-- Insertar categorías
INSERT INTO categorias (id, nombre) VALUES 
(1, 'Saludos'),
(2, 'Necesidades'),
(3, 'Emociones'),
(4, 'Acciones'),
(5, 'Objetos'),
(6, 'Lugares'),
(7, 'Personas'),
(8, 'Comida');

-- Insertar pictogramas de ejemplo
INSERT INTO pictogramas (id, texto, categoria_id, imagen_url) VALUES 
(1, 'Hola', 1, 'https://via.placeholder.com/100x100/a3c9f9/333?text=👋'),
(2, 'Adiós', 1, 'https://via.placeholder.com/100x100/a3c9f9/333?text=👋'),
(3, 'Agua', 2, 'https://via.placeholder.com/100x100/f9c6d0/333?text=💧'),
(4, 'Hambre', 2, 'https://via.placeholder.com/100x100/f9c6d0/333?text=🍽️'),
(5, 'Feliz', 3, 'https://via.placeholder.com/100x100/b5e6b5/333?text=😊'),
(6, 'Triste', 3, 'https://via.placeholder.com/100x100/b5e6b5/333?text=😢'),
(7, 'Enojado', 3, 'https://via.placeholder.com/100x100/b5e6b5/333?text=😠'),
(8, 'Jugar', 4, 'https://via.placeholder.com/100x100/f0e5f5/333?text=🎮'),
(9, 'Dormir', 4, 'https://via.placeholder.com/100x100/f0e5f5/333?text=😴'),
(10, 'Manzana', 8, 'https://via.placeholder.com/100x100/efbfbf/333?text=🍎'),
(11, 'Pan', 8, 'https://via.placeholder.com/100x100/efbfbf/333?text=🍞');