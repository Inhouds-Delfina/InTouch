<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "conexion.php";

// Insertar categorías si no existen
$categorias = ['Saludos', 'Necesidades', 'Emociones', 'Acciones', 'Objetos', 'Lugares', 'Personas', 'Comida'];

foreach ($categorias as $categoria) {
    $sql = "INSERT IGNORE INTO categorias (nombre) VALUES (?)";
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("s", $categoria);
        $stmt->execute();
        $stmt->close();
    }
}

// Verificar categorías
$result = $conn->query("SELECT * FROM categorias");
$cats = [];
while ($row = $result->fetch_assoc()) {
    $cats[] = $row;
}

echo json_encode([
    "status" => "ok", 
    "msg" => "Conexión exitosa",
    "categorias" => $cats
]);
?>