<?php
// Archivo de prueba para verificar la conexión a la base de datos
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "Probando conexión a la base de datos...\n";

require_once "conexion.php";

// Verificar conexión
if ($conn->connect_error) {
    echo "❌ Error de conexión: " . $conn->connect_error . "\n";
    exit;
}

echo "✅ Conexión exitosa a la base de datos\n";

// Probar consulta simple
$result = $conn->query("SELECT COUNT(*) as total FROM usuarios");
if ($result) {
    $row = $result->fetch_assoc();
    echo "✅ Consulta exitosa - Total usuarios: " . $row['total'] . "\n";
} else {
    echo "❌ Error en consulta: " . $conn->error . "\n";
}

// Verificar estructura de tablas
$tables = ['usuarios', 'categorias', 'pictogramas', 'frases', 'configuracion_tts'];
foreach ($tables as $table) {
    $result = $conn->query("SHOW TABLES LIKE '$table'");
    if ($result && $result->num_rows > 0) {
        echo "✅ Tabla '$table' existe\n";
    } else {
        echo "❌ Tabla '$table' no encontrada\n";
    }
}

$conn->close();
echo "Prueba completada.\n";
?>