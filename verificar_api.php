<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    require_once "php/conexion.php";
    
    // Verificar conexión
    if ($conn->ping()) {
        echo json_encode([
            "status" => "ok", 
            "msg" => "Conexión exitosa",
            "timestamp" => date('Y-m-d H:i:s')
        ]);
    } else {
        echo json_encode([
            "status" => "error", 
            "msg" => "Conexión fallida"
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "status" => "error", 
        "msg" => "Error: " . $e->getMessage()
    ]);
}
?>