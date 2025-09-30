$conn->set_charset("utf8mb4_unicode_ci");
?>
<?php

ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

$host = "auth-db1659.hstgr.io"; 
$user = "u214138677_intouch";      
$pass = "Lachispa@25";     
$dbname = "u214138677_intouch";       

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
 
  die(json_encode([
    "status" => "error",
    "msg" => "Error de conexión: " . $conn->connect_error
  ]));
}

$conn->set_charset("utf8mb4"); 
?>