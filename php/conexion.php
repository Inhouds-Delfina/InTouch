<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = "localhost";       
$user = "u214138677_intouch";      
$pass = "Lachispa@25";     
$dbname = "u214138677_intouch";       

try {
    $conn = new mysqli($host, $user, $pass, $dbname);
    
    if ($conn->connect_error) {
        throw new Exception("Error de conexión: " . $conn->connect_error);
    }
    
    $conn->set_charset("utf8mb4");
    
} catch (Exception $e) {
    error_log("Error de base de datos: " . $e->getMessage());
    throw $e;
}
?>
