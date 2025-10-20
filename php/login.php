<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
try {
    require_once 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $contraseña = $_POST['contraseña'] ?? '';

    if ($contraseña === '') {
        // Campo contraseña no enviado; redirigir con error
        header("Location: ../views/login.php?error=1");
        exit;
    }

    try {
        $sql = "SELECT * FROM usuarios WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $res = $stmt->get_result();

    if ($res->num_rows > 0) {
        $user = $res->fetch_assoc();
        if (password_verify($contraseña, $user['contraseña'])) {
            // Guardar id del usuario para asociar recursos (pictogramas)
            $_SESSION['usuario'] = $user['nombre'];
            $_SESSION['usuario_id'] = $user['id'];
            $_SESSION['rol'] = $user['rol'];
            $_SESSION['avatar'] = $user['avatar_url'];
            // Regenerar id de sesión y asegurar que se escriba antes de redirigir
            session_regenerate_id(true);
            session_write_close();
            // Redirigir al panel de administración
            header("Location: ../views/abm.php");
            exit;
        } else {
            // Redirigir a la vista de login con indicador de error
            header("Location: ../views/login.php?error=1");
            exit;
        }
    } else {
        // Usuario no existe, redirigir con error
        header("Location: ../views/login.php?error=1");
        exit;
    }
    } catch (Exception $e) {
        error_log("Error en login: " . $e->getMessage());
        header("Location: ../views/login.php?error=1");
        exit;
    }
}

// Si hay error de conexión
} catch (Exception $e) {
    error_log("Error de conexión en login: " . $e->getMessage());
    header("Location: ../views/login.php?error=1");
    exit;
}

// Si llegamos aquí sin POST o por algún otro motivo, redirigir al login
if (!isset($_SESSION['usuario_id'])) {
    header("Location: ../views/login.php");
    exit;
}

// Si hay sesión pero llegamos aquí, ir al panel
header("Location: ../views/abm.php");
exit;
?>