<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
include 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Debug: mostrar datos recibidos
    echo "Datos recibidos:<br>";
    echo "Nombre: " . ($_POST['nombre'] ?? 'no recibido') . "<br>";
    echo "Email: " . ($_POST['email'] ?? 'no recibido') . "<br>";
    echo "Contraseña recibida: " . (isset($_POST['contraseña']) ? 'sí' : 'no') . "<br>";
    echo "Avatar recibido: " . (!empty($_FILES['avatar']['name']) ? 'sí' : 'no') . "<br>";
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

    // Debug: mostrar consulta SQL y parámetros
    echo "<br>Intentando ejecutar INSERT con:<br>";
    echo "Nombre: $nombre<br>";
    echo "Email: $email<br>";
    echo "Rol: $rol<br>";
    echo "Avatar URL: " . ($avatar_url ?? 'null') . "<br>";
    
    if ($stmt->execute()) {
        echo "<br>¡Registro exitoso! Redirigiendo en 3 segundos...<br>";
        echo "<script>
            setTimeout(function() {
                window.location.href = '../views/login.php?success=1&nombre=" . urlencode($nombre) . "';
            }, 3000);
        </script>";
    } else {
        echo "<br>Error en INSERT: " . $conn->error . "<br>";
        echo "Errno: " . $conn->errno . "<br>";
    }
}
?>
