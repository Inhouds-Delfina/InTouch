<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
// Evitar cache
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    error_log("Intentando conectar a la base de datos...");
    require_once "conexion.php";
    error_log("Conexión exitosa a la base de datos");
    
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'GET') {
        error_log("Ejecutando consulta SELECT...");
        $result = $conn->query("SELECT * FROM categorias ORDER BY nombre ASC");
        
        if (!$result) {
            error_log("Error en la consulta: " . $conn->error);
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
    
} catch (Exception $e) {
    // Fallback con datos estáticos si falla la base de datos
    $categorias_fallback = [
        ["id" => 1, "nombre" => "Saludos"],
        ["id" => 2, "nombre" => "Necesidades"],
        ["id" => 3, "nombre" => "Emociones"],
        ["id" => 4, "nombre" => "Acciones"],
        ["id" => 5, "nombre" => "Comida"]
    ];
    
    echo json_encode(["status" => "ok", "data" => $categorias_fallback, "fallback" => true]);
}
?>