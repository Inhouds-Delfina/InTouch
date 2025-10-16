<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$categorias = [
    ["id" => 1, "nombre" => "Saludos"],
    ["id" => 2, "nombre" => "Necesidades"],
    ["id" => 3, "nombre" => "Emociones"],
    ["id" => 4, "nombre" => "Acciones"],
    ["id" => 5, "nombre" => "Comida"]
];

echo json_encode(["status" => "ok", "data" => $categorias]);
?>