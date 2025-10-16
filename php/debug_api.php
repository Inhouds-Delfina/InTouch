<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "conexion.php";

try {
    // Verificar conexión
    echo "Conexión: " . ($conn->ping() ? "OK" : "FALLO") . "\n";
    
    // Contar pictogramas
    $count = $conn->query("SELECT COUNT(*) as total FROM pictogramas")->fetch_assoc();
    echo "Total pictogramas en BD: " . $count['total'] . "\n";
    
    // Obtener pictogramas
    $result = $conn->query("SELECT p.*, c.nombre as categoria_nombre FROM pictogramas p LEFT JOIN categorias c ON p.categoria_id = c.id ORDER BY p.creado DESC");
    
    $pictos = [];
    while ($row = $result->fetch_assoc()) {
        $pictos[] = $row;
    }
    
    echo "Pictogramas obtenidos: " . count($pictos) . "\n";
    echo "Datos: " . json_encode($pictos, JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>