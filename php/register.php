<?php
session_start();
include 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = trim($_POST['nombre']);
    $email = trim($_POST['email']);
    $raw_password = $_POST['contraseña'] ?? '';
    if (strlen($raw_password) < 6) {
        echo "La contraseña debe tener al menos 6 caracteres.";
        exit;
    }
    $contraseña = password_hash($raw_password, PASSWORD_DEFAULT);
    $rol = "usuario";
    $fecha_creacion = date("Y-m-d H:i:s");

    // Manejo del avatar (guardar en php/uploads/avatars y exponer ruta relativa desde web root)
    $avatar_url = null;
    if (!empty($_FILES['avatar']['name']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . "/uploads/avatars/"; // php/uploads/avatars
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        $ext = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
        $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($_FILES['avatar']['name'], PATHINFO_FILENAME));
        $fileName = time() . "_" . $safeName . (
            $ext ? '.' . $ext : ''
        );
        $targetPath = $uploadDir . $fileName;
        if (move_uploaded_file($_FILES['avatar']['tmp_name'], $targetPath)) {
            // Ruta accesible desde las vistas: php/uploads/avatars/...
            $avatar_url = "php/uploads/avatars/" . $fileName;
        }
    }

    // Validaciones básicas
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Email inválido.";
        exit;
    }

    // Evitar emails duplicados
    $checkSql = "SELECT id FROM usuarios WHERE email = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    $checkRes = $checkStmt->get_result();
    if ($checkRes && $checkRes->num_rows > 0) {
        echo "Ya existe una cuenta con ese correo.";
        exit;
    }
    $checkStmt->close();

    $sql = "INSERT INTO usuarios (nombre, email, contraseña, rol, avatar_url, fecha_creacion)
        VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssss", $nombre, $email, $contraseña, $rol, $avatar_url, $fecha_creacion);

    // Si existe el log de depuración creado anteriormente, eliminarlo (temporal)
    $debugLog = __DIR__ . "/register_debug.log";
    if (file_exists($debugLog)) {
        @unlink($debugLog);
    }

    if ($stmt->execute()) {
        // Redirigir a login.php con mensaje de éxito y nombre del usuario
        header("Location: ../views/login.php?success=1&nombre=" . urlencode($nombre));
        exit;
    } else {
        $mensajes_error[] = "Error al crear la cuenta: " . $conn->error;
        echo implode("<br>", $mensajes_error);
    }
}
?>
