<?php
header('Content-Type: application/json');


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "conexion.php";

$response = ["status" => "error", "msg" => "Acción no válida"];


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $texto = $_POST['texto'] ?? '';
    $categoria = $_POST['categoria'] ?? '';

    if (!$texto || !$categoria || !isset($_FILES['imagen'])) {
        echo json_encode(["status" => "error", "msg" => "Faltan datos (texto/categoría/imagen)"]);
        exit;
    }

    $uploadDir = __DIR__ . "/uploads/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileName = time() . "_" . basename($_FILES["imagen"]["name"]);
    $targetPath = $uploadDir . $fileName;
    $targetUrl = "uploads/" . $fileName; 

    if (move_uploaded_file($_FILES["imagen"]["tmp_name"], $targetPath)) {
        $sql = "INSERT INTO pictogramas (texto, categoria, imagen_url) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["status" => "error", "msg" => "Error en prepare(): " . $conn->error]);
            exit;
        }

        $stmt->bind_param("sss", $texto, $categoria, $targetUrl);

        if ($stmt->execute()) {
            $response = ["status" => "ok", "msg" => "Pictograma guardado"];
        } else {
            $response = ["status" => "error", "msg" => "Error en execute(): " . $stmt->error];
        }

        $stmt->close();
    } else {
        $response = ["status" => "error", "msg" => "No se pudo subir la imagen"];
    }

    echo json_encode($response);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM pictogramas ORDER BY creado DESC");
    if (!$result) {
        echo json_encode(["status" => "error", "msg" => "Error en SELECT: " . $conn->error]);
        exit;
    }

    $pictos = [];
    while ($row = $result->fetch_assoc()) {
        $pictos[] = $row;
    }
    echo json_encode(["status" => "ok", "data" => $pictos]);
    exit;
}


echo json_encode($response);
