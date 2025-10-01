<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "conexion.php";

$response = ["status" => "error", "msg" => "Acción no válida"];
$method = $_SERVER['REQUEST_METHOD'];


if ($method === 'POST' && !isset($_POST['_method'])) {
    $id        = $_POST['id'] ?? '';
    $texto     = $_POST['texto'] ?? '';
    $categoria = $_POST['categoria'] ?? '';
    $imagenUrl = '';

    if (!$texto || !$categoria) {
        echo json_encode(["status" => "error", "msg" => "Faltan datos obligatorios"]);
        exit;
    }


    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . "/uploads/";
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        $fileName = time() . "_" . basename($_FILES["imagen"]["name"]);
        $targetPath = $uploadDir . $fileName;
        $imagenUrl = "uploads/" . $fileName;
        move_uploaded_file($_FILES["imagen"]["tmp_name"], $targetPath);
    }

    if ($id) {

        if ($imagenUrl) {
            $sql = "UPDATE pictogramas SET texto=?, categoria=?, imagen_url=? WHERE id=?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sssi", $texto, $categoria, $imagenUrl, $id);
        } else {
            $sql = "UPDATE pictogramas SET texto=?, categoria=? WHERE id=?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssi", $texto, $categoria, $id);
        }
        $ok = $stmt->execute();
        $response = ["status" => $ok ? "ok" : "error", "msg" => $ok ? "Pictograma actualizado" : $stmt->error];
        $stmt->close();
    } else {

        // --- CAMBIO #1: Cambiada 'creado' por 'fecha' en el INSERT
        $sql = "INSERT INTO pictogramas (texto, categoria, imagen_url, fecha) VALUES (?, ?, ?, NOW())";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $texto, $categoria, $imagenUrl);
        $ok = $stmt->execute();
        $response = ["status" => $ok ? "ok" : "error", "msg" => $ok ? "Pictograma creado" : $stmt->error];
        $stmt->close();
    }

    echo json_encode($response);
    exit;
}


if ($method === 'GET') {
    // --- CAMBIO #2: Cambiada 'creado' por 'fecha' en el ORDER BY
    $result = $conn->query("SELECT * FROM pictogramas ORDER BY fecha DESC");
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

if ($method === 'POST' && ($_POST['_method'] ?? '') === 'DELETE') {
    $id = intval($_POST['id']);
    if (!$id) {
        echo json_encode(["status" => "error", "msg" => "ID inválido"]);
        exit;
    }

    $sql = "DELETE FROM pictogramas WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $ok = $stmt->execute();
    $response = ["status" => $ok ? "ok" : "error", "msg" => $ok ? "Pictograma borrado" : $stmt->error];
    $stmt->close();

    echo json_encode($response);
    exit;
}

echo json_encode($response);