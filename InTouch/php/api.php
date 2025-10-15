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
    $categoria_id = $_POST['categoria_id'] ?? '';
    $imagenUrl = $_POST['imagen_url'] ?? '';
    $usuario_id = $_POST['usuario_id'] ?? 1; // Valor por defecto

    if (!$texto || !$categoria_id) {
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
            $sql = "UPDATE pictogramas SET texto=?, categoria_id=?, imagen_url=? WHERE id=?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sisi", $texto, $categoria_id, $imagenUrl, $id);
        } else {
            $sql = "UPDATE pictogramas SET texto=?, categoria_id=? WHERE id=?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sii", $texto, $categoria_id, $id);
        }
        $ok = $stmt->execute();
        $response = ["status" => $ok ? "ok" : "error", "msg" => $ok ? "Pictograma actualizado" : $stmt->error];
        $stmt->close();
    } else {

        $sql = "INSERT INTO pictogramas (texto, categoria_id, imagen_url, usuario_id) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sisi", $texto, $categoria_id, $imagenUrl, $usuario_id);
        $ok = $stmt->execute();
        $response = ["status" => $ok ? "ok" : "error", "msg" => $ok ? "Pictograma creado" : $stmt->error];
        $stmt->close();
    }

    echo json_encode($response);
    exit;
}


if ($method === 'GET') {
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