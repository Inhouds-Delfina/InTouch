<?php
// Script para configurar la base de datos con pictogramas globales por defecto
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    require_once "conexion.php";
    
    // Insertar categorías
    $categorias = [
        'Saludos', 'Necesidades', 'Emociones', 'Acciones', 
        'Objetos', 'Lugares', 'Personas', 'Comida'
    ];
    
    $categoria_ids = [];
    foreach ($categorias as $categoria) {
        $stmt = $conn->prepare("INSERT IGNORE INTO categorias (nombre) VALUES (?)");
        $stmt->bind_param("s", $categoria);
        $stmt->execute();
        
        // Obtener el ID de la categoría
        $result = $conn->query("SELECT id FROM categorias WHERE nombre = '$categoria'");
        $row = $result->fetch_assoc();
        $categoria_ids[$categoria] = $row['id'];
        
        $stmt->close();
    }
    
    // Insertar pictogramas de ejemplo
    $pictogramas = [
        ['texto' => 'Hola', 'categoria' => 'Saludos', 'imagen' => 'https://via.placeholder.com/100x100/a3c9f9/333?text=👋'],
        ['texto' => 'Adiós', 'categoria' => 'Saludos', 'imagen' => 'https://via.placeholder.com/100x100/a3c9f9/333?text=👋'],
        ['texto' => 'Por favor', 'categoria' => 'Saludos', 'imagen' => 'https://via.placeholder.com/100x100/a3c9f9/333?text=🙏'],
        ['texto' => 'Gracias', 'categoria' => 'Saludos', 'imagen' => 'https://via.placeholder.com/100x100/a3c9f9/333?text=🙏'],
        
        ['texto' => 'Agua', 'categoria' => 'Necesidades', 'imagen' => 'https://via.placeholder.com/100x100/f9c6d0/333?text=💧'],
        ['texto' => 'Hambre', 'categoria' => 'Necesidades', 'imagen' => 'https://via.placeholder.com/100x100/f9c6d0/333?text=🍽️'],
        ['texto' => 'Baño', 'categoria' => 'Necesidades', 'imagen' => 'https://via.placeholder.com/100x100/f9c6d0/333?text=🚽'],
        ['texto' => 'Ayuda', 'categoria' => 'Necesidades', 'imagen' => 'https://via.placeholder.com/100x100/f9c6d0/333?text=🆘'],
        
        ['texto' => 'Feliz', 'categoria' => 'Emociones', 'imagen' => 'https://via.placeholder.com/100x100/b5e6b5/333?text=😊'],
        ['texto' => 'Triste', 'categoria' => 'Emociones', 'imagen' => 'https://via.placeholder.com/100x100/b5e6b5/333?text=😢'],
        ['texto' => 'Enojado', 'categoria' => 'Emociones', 'imagen' => 'https://via.placeholder.com/100x100/b5e6b5/333?text=😠'],
        ['texto' => 'Cansado', 'categoria' => 'Emociones', 'imagen' => 'https://via.placeholder.com/100x100/b5e6b5/333?text=😴'],
        
        ['texto' => 'Jugar', 'categoria' => 'Acciones', 'imagen' => 'https://via.placeholder.com/100x100/f0e5f5/333?text=🎮'],
        ['texto' => 'Dormir', 'categoria' => 'Acciones', 'imagen' => 'https://via.placeholder.com/100x100/f0e5f5/333?text=😴'],
        ['texto' => 'Comer', 'categoria' => 'Acciones', 'imagen' => 'https://via.placeholder.com/100x100/f0e5f5/333?text=🍽️'],
        ['texto' => 'Estudiar', 'categoria' => 'Acciones', 'imagen' => 'https://via.placeholder.com/100x100/f0e5f5/333?text=📚'],
        
        ['texto' => 'Manzana', 'categoria' => 'Comida', 'imagen' => 'https://via.placeholder.com/100x100/efbfbf/333?text=🍎'],
        ['texto' => 'Pan', 'categoria' => 'Comida', 'imagen' => 'https://via.placeholder.com/100x100/efbfbf/333?text=🍞'],
        ['texto' => 'Leche', 'categoria' => 'Comida', 'imagen' => 'https://via.placeholder.com/100x100/efbfbf/333?text=🥛'],
        ['texto' => 'Pizza', 'categoria' => 'Comida', 'imagen' => 'https://via.placeholder.com/100x100/efbfbf/333?text=🍕']
    ];
    
    foreach ($pictogramas as $picto) {
        $categoria_id = $categoria_ids[$picto['categoria']];
        // Insertar con usuario_id = NULL para que sean globales
        $stmt = $conn->prepare("INSERT IGNORE INTO pictogramas (texto, categoria_id, imagen_url, usuario_id) VALUES (?, ?, ?, NULL)");
        $stmt->bind_param("sis", $picto['texto'], $categoria_id, $picto['imagen']);
        $stmt->execute();
        $stmt->close();
    }
    
    echo json_encode([
        "status" => "ok", 
        "msg" => "Base de datos configurada correctamente",
        "categorias_insertadas" => count($categorias),
        "pictogramas_insertados" => count($pictogramas)
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "msg" => "Error configurando base de datos: " . $e->getMessage()
    ]);
}
?>