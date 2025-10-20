<?php
session_start();
include 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = trim($_POST['nombre']);
    $email = trim($_POST['email']);
    $contraseña = password_hash($_POST['contraseña'], PASSWORD_DEFAULT);
    $rol = "usuario";
    $fecha_creacion = date("Y-m-d H:i:s");

    // Manejo del avatar
    $avatar_url = null;
    if (!empty($_FILES['avatar']['name'])) {
        $target_dir = "../uploads/avatars/";
        if (!file_exists($target_dir)) mkdir($target_dir, 0777, true);
        $target_file = $target_dir . basename($_FILES["avatar"]["name"]);
        move_uploaded_file($_FILES["avatar"]["tmp_name"], $target_file);
        $avatar_url = $target_file;
    }

    $sql = "INSERT INTO usuarios (nombre, email, contraseña, rol, avatar_url, fecha_creacion)
            VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssss", $nombre, $email, $contraseña, $rol, $avatar_url, $fecha_creacion);

    if ($stmt->execute()) {
        header("Location: login.php?success=1");
        exit;
    } else {
        echo "❌ Error: " . $conn->error;
    }
}
?>
