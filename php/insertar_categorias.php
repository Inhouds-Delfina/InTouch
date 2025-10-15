<?php
require_once "conexion.php";

$categorias = [
    'Saludos',
    'Necesidades',
    'Emociones',
    'Acciones',
    'Objetos',
    'Lugares',
    'Personas',
    'Comida'
];

foreach ($categorias as $categoria) {
    $sql = "INSERT IGNORE INTO categorias (nombre) VALUES (?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $categoria);
    $stmt->execute();
    $stmt->close();
}

echo json_encode(["status" => "ok", "msg" => "Categorías insertadas correctamente"]);
?>