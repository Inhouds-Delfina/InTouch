<?php
require_once "php/conexion.php";

try {
    // Actualizar todas las URLs de via.placeholder.com a placehold.co
    $sql = "UPDATE pictogramas SET imagen_url = REPLACE(imagen_url, 'https://via.placeholder.com/', 'https://placehold.co/') WHERE imagen_url LIKE '%via.placeholder.com%'";
    
    $result = $conn->query($sql);
    
    if ($result) {
        echo "✅ URLs actualizadas correctamente\n";
        echo "Filas afectadas: " . $conn->affected_rows . "\n";
    } else {
        echo "❌ Error: " . $conn->error . "\n";
    }
    
    // Mostrar pictogramas actualizados
    $result = $conn->query("SELECT id, texto, imagen_url FROM pictogramas ORDER BY id");
    echo "\n📋 Pictogramas actualizados:\n";
    while ($row = $result->fetch_assoc()) {
        echo "ID: {$row['id']} - {$row['texto']} - {$row['imagen_url']}\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>