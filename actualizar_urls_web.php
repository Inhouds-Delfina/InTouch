<!DOCTYPE html>
<html>
<head>
    <title>Actualizar URLs</title>
</head>
<body>
    <h1>Actualizar URLs de Pictogramas</h1>
    
<?php
require_once "php/conexion.php";

try {
    // Actualizar todas las URLs de via.placeholder.com a placehold.co
    $sql = "UPDATE pictogramas SET imagen_url = REPLACE(imagen_url, 'https://via.placeholder.com/', 'https://placehold.co/') WHERE imagen_url LIKE '%via.placeholder.com%'";
    
    $result = $conn->query($sql);
    
    if ($result) {
        echo "<p style='color: green;'>✅ URLs actualizadas correctamente</p>";
        echo "<p>Filas afectadas: " . $conn->affected_rows . "</p>";
    } else {
        echo "<p style='color: red;'>❌ Error: " . $conn->error . "</p>";
    }
    
    // También actualizar URLs con parámetros problemáticos
    $sql2 = "UPDATE pictogramas SET imagen_url = REPLACE(imagen_url, '/333?text=', '/333333?text=') WHERE imagen_url LIKE '%/333?text=%'";
    $conn->query($sql2);
    
    // Mostrar pictogramas actualizados
    $result = $conn->query("SELECT id, texto, imagen_url FROM pictogramas ORDER BY id");
    echo "<h2>📋 Pictogramas actualizados:</h2>";
    echo "<table border='1' style='border-collapse: collapse;'>";
    echo "<tr><th>ID</th><th>Texto</th><th>URL Imagen</th></tr>";
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>{$row['id']}</td>";
        echo "<td>{$row['texto']}</td>";
        echo "<td style='font-size: 10px;'>{$row['imagen_url']}</td>";
        echo "</tr>";
    }
    echo "</table>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>

<br><br>
<a href="index.html">← Volver a la aplicación</a>

</body>
</html>