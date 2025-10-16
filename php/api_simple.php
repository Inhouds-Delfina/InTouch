<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

ini_set('display_errors', 1);
error_reporting(E_ALL);

$method = $_SERVER['REQUEST_METHOD'];

// Datos de ejemplo sin base de datos
$pictogramas_ejemplo = [
    ["id" => 1, "texto" => "Hola", "categoria_id" => 1, "categoria_nombre" => "Saludos", "imagen_url" => "https://via.placeholder.com/100x100/a3c9f9/333?text=👋"],
    ["id" => 2, "texto" => "Adiós", "categoria_id" => 1, "categoria_nombre" => "Saludos", "imagen_url" => "https://via.placeholder.com/100x100/a3c9f9/333?text=👋"],
    ["id" => 3, "texto" => "Agua", "categoria_id" => 2, "categoria_nombre" => "Necesidades", "imagen_url" => "https://via.placeholder.com/100x100/f9c6d0/333?text=💧"],
    ["id" => 4, "texto" => "Hambre", "categoria_id" => 2, "categoria_nombre" => "Necesidades", "imagen_url" => "https://via.placeholder.com/100x100/f9c6d0/333?text=🍽️"]
];

if ($method === 'GET') {
    echo json_encode(["status" => "ok", "data" => $pictogramas_ejemplo]);
    exit;
}

if ($method === 'POST') {
    $texto = $_POST['texto'] ?? '';
    $categoria_id = $_POST['categoria_id'] ?? '';
    
    if ($texto && $categoria_id) {
        echo json_encode(["status" => "ok", "msg" => "Pictograma creado (modo demo)"]);
    } else {
        echo json_encode(["status" => "error", "msg" => "Faltan datos obligatorios"]);
    }
    exit;
}

echo json_encode(["status" => "error", "msg" => "Método no permitido"]);
?>