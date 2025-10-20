<?php
session_start();
include 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $contraseña = $_POST['contraseña'];

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
            header("Location: dashboard.php");
            exit;
        } else {
            $error = "Contraseña incorrecta.";
        }
    } else {
        $error = "El usuario no existe.";
    }
}
?>