<?php
require_once "conexion_pdo.php";

$categorias = [
    'Saludos',
    'Necesidades', 
    'Emociones',
    'Acciones',
    'Objetos',
    'Lugares',
    'Personas',
    'Comida'
];

try {
    foreach ($categorias as $categoria) {
        $stmt = $pdo->prepare("INSERT IGNORE INTO categorias (nombre) VALUES (?)");
        $stmt->execute([$categoria]);
    }
    echo json_encode(["status" => "ok", "msg" => "Categorías insertadas correctamente"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "msg" => "Error: " . $e->getMessage()]);
}
?>