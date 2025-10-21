<?php
// filepath: c:\Users\abelr\OneDrive\Desktop\hoy\InTouch-2\php\check_session.php
header('Content-Type: application/json');
session_start();

$logged = isset($_SESSION['usuario_id']) && !empty($_SESSION['usuario_id']);
$response = [
    'logged_in' => $logged,
    'usuario' => $logged ? ($_SESSION['usuario'] ?? null) : null
];

echo json_encode($response);
