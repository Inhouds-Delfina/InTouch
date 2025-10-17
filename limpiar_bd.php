<?php
require_once "php/conexion.php";

echo "<h1>🧹 Limpieza de Base de Datos</h1>";

try {
    // 1. Eliminar todas las categorías duplicadas, manteniendo solo una de cada nombre
    echo "<h2>Limpiando categorías duplicadas...</h2>";
    
    $sql = "DELETE c1 FROM categorias c1 
            INNER JOIN categorias c2 
            WHERE c1.id > c2.id AND c1.nombre = c2.nombre";
    
    $result = $conn->query($sql);
    echo "<p>✅ Categorías duplicadas eliminadas: " . $conn->affected_rows . "</p>";
    
    // 2. Mostrar categorías restantes
    $result = $conn->query("SELECT * FROM categorias ORDER BY nombre");
    echo "<h3>Categorías restantes:</h3>";
    echo "<ul>";
    while ($row = $result->fetch_assoc()) {
        echo "<li>ID: {$row['id']} - {$row['nombre']}</li>";
    }
    echo "</ul>";
    
    // 3. Opción para eliminar TODAS las categorías (opcional)
    if (isset($_GET['eliminar_todo'])) {
        $conn->query("DELETE FROM pictogramas");
        $conn->query("DELETE FROM categorias");
        echo "<p style='color: red;'>🗑️ TODAS las categorías y pictogramas han sido eliminados</p>";
    }
    
    echo "<hr>";
    echo "<a href='?eliminar_todo=1' onclick=\"return confirm('¿Estás seguro de eliminar TODO?')\" style='background: red; color: white; padding: 10px; text-decoration: none;'>🗑️ ELIMINAR TODO</a>";
    echo "<br><br>";
    echo "<a href='index.html'>← Volver a la aplicación</a>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>