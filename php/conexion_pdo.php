<?php
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

$host = "localhost";       
$user = "u214138677_intouch";      
$pass = "Lachispa@25";     
$dbname = "u214138677_intouch";       

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode([
        "status" => "error",
        "msg" => "Error de conexión: " . $e->getMessage()
    ]));
}
?>