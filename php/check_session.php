<?php
// filepath: c:\Users\abelr\OneDrive\Desktop\hoy\InTouch-2\php\check_session.php
header('Content-Type: application/json');
session_start();

$logged = isset($_SESSION['usuario_id']) && !empty($_SESSION['usuario_id']) &&
          isset($_SESSION['login_time']) && (time() - $_SESSION['login_time']) < 3600; // 1 hora de validez
$response = [
    'logged_in' => $logged,
    'usuario' => $logged ? ($_SESSION['usuario'] ?? null) : null
];

// Registro sencillo para depuración: escribir estado de sesión en un log
try {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $logLine = date('Y-m-d H:i:s') . " - check_session called - logged_in=" . ($logged ? '1' : '0') . "\n";
    $logLine .= "  SESSION: " . json_encode($_SESSION) . "\n";
    $logLine .= "  COOKIES: " . json_encode($_COOKIE) . "\n";
    $logLine .= "  HEADERS: " . json_encode($headers) . "\n";
    @file_put_contents(__DIR__ . '/check_session.log', $logLine, FILE_APPEND | LOCK_EX);
} catch (Exception $e) {
    // ignorar errores de logging
}

echo json_encode($response);
