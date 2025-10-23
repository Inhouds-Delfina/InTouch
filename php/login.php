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
        // Campo contraseña no enviado; mostrar error directamente
        echo json_encode([
            "status" => "error",
            "message" => "Por favor ingresa tu contraseña"
        ]);
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
            $_SESSION['login_time'] = time(); // Timestamp para verificar sesión
            // Regenerar id de sesión y asegurar que se escriba antes de redirigir
            session_regenerate_id(true);
            // Forzar escritura de sesión antes de redirigir
            session_write_close();
            // Pequeña pausa para asegurar que la sesión se escriba
            usleep(1000);
            // Redirigir a la página principal
            header("Location: ../index.php");
            exit;
        } else {
            // Mostrar error directamente en lugar de redirigir
            echo json_encode([
                "status" => "error",
                "message" => "Usuario o contraseña incorrectos"
            ]);
            exit;
        }
    } else {
        // Usuario no existe, mostrar error directamente
        echo json_encode([
            "status" => "error",
            "message" => "Usuario o contraseña incorrectos"
        ]);
        exit;
    }
    } catch (Exception $e) {
        error_log("Error en login: " . $e->getMessage());
        echo json_encode([
            "status" => "error",
            "message" => "Error en el servidor. Inténtalo de nuevo."
        ]);
        exit;
    }
}

// Si hay error de conexión
} catch (Exception $e) {
    error_log("Error de conexión en login: " . $e->getMessage());
    echo json_encode([
        "status" => "error",
        "message" => "Error de conexión. Inténtalo de nuevo."
    ]);
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