<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "conexion.php";

// Insertar categorías básicas si no existen
$categorias_basicas = ['Saludos', 'Necesidades', 'Emociones', 'Acciones', 'Comida'];
foreach ($categorias_basicas as $cat) {
    $stmt = $conn->prepare("INSERT IGNORE INTO categorias (nombre) VALUES (?)");
    if ($stmt) {
        $stmt->bind_param("s", $cat);
        $stmt->execute();
        $stmt->close();
    }
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $result = $conn->query("SELECT * FROM categorias ORDER BY nombre ASC");
    
    if (!$result) {
        echo json_encode(["status" => "error", "msg" => "Error al obtener categorías: " . $conn->error]);
        exit;
    }

    $categorias = [];
    while ($row = $result->fetch_assoc()) {
        $categorias[] = $row;
    }
    
    echo json_encode(["status" => "ok", "data" => $categorias]);
    exit;
}

echo json_encode(["status" => "error", "msg" => "Método no permitido"]);
?>