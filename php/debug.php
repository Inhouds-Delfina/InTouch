<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    // Test básico
    echo json_encode([
        "status" => "ok", 
        "msg" => "PHP funciona correctamente",
        "php_version" => phpversion(),
        "extensions" => [
            "mysqli" => extension_loaded('mysqli'),
            "pdo" => extension_loaded('pdo'),
            "pdo_mysql" => extension_loaded('pdo_mysql')
        ]
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "msg" => $e->getMessage()
    ]);
}
?>