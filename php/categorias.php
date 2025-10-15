<?php
header('Content-Type: application/json');
require_once "conexion.php";

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