<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
// Evitar cache
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    require_once "conexion.php";
    
    // Insertar categorías básicas si no existen
    $categorias_basicas = ['Saludos', 'Necesidades', 'Emociones', 'Acciones', 'Comida'];
    foreach ($categorias_basicas as $cat) {
        $stmt = $conn->prepare("INSERT IGNORE INTO categorias (nombre) VALUES (?)");
        if ($stmt) {
            $stmt->bind_param("s", $cat);
            $stmt->execute();
            $stmt->close();
        }
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "msg" => "Error de conexión: " . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' && !isset($_POST['_method'])) {
    $id = $_POST['id'] ?? '';
    $texto = $_POST['texto'] ?? '';
    $categoria_id = intval($_POST['categoria_id'] ?? 0);
    $imagenUrl = $_POST['imagen_url'] ?? '';

    if (!$texto || !$categoria_id) {
        echo json_encode(["status" => "error", "msg" => "Faltan datos obligatorios"]);
        exit;
    }

    // Manejo de imagen
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . "/uploads/";
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        $fileName = time() . "_" . basename($_FILES["imagen"]["name"]);
        $targetPath = $uploadDir . $fileName;
        $imagenUrl = "php/uploads/" . $fileName;
        move_uploaded_file($_FILES["imagen"]["tmp_name"], $targetPath);
    }

    try {
        if ($id) {
            // Actualizar
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
            // Crear nuevo
            if (!$imagenUrl) {
                $imagenUrl = "https://via.placeholder.com/100x100/a3c9f9/333?text=" . urlencode($texto);
            }
            $sql = "INSERT INTO pictogramas (texto, categoria_id, imagen_url) VALUES (?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sis", $texto, $categoria_id, $imagenUrl);
            $ok = $stmt->execute();
            $response = ["status" => $ok ? "ok" : "error", "msg" => $ok ? "Pictograma creado" : $stmt->error];
            $stmt->close();
        }
    } catch (Exception $e) {
        $response = ["status" => "error", "msg" => "Error en base de datos: " . $e->getMessage()];
    }

    echo json_encode($response);
    exit;
}

if ($method === 'GET') {
    try {
        $result = $conn->query("SELECT p.*, c.nombre as categoria_nombre FROM pictogramas p LEFT JOIN categorias c ON p.categoria_id = c.id ORDER BY p.creado DESC");
        if (!$result) {
            echo json_encode(["status" => "error", "msg" => "Error en SELECT: " . $conn->error]);
            exit;
        }

        $pictos = [];
        while ($row = $result->fetch_assoc()) {
            $pictos[] = $row;
        }
        echo json_encode(["status" => "ok", "data" => $pictos]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "msg" => "Error al obtener pictogramas: " . $e->getMessage()]);
    }
    exit;
}

if ($method === 'POST' && ($_POST['_method'] ?? '') === 'DELETE') {
    $id = intval($_POST['id']);
    if (!$id) {
        echo json_encode(["status" => "error", "msg" => "ID inválido"]);
        exit;
    }

    try {
        $sql = "DELETE FROM pictogramas WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $ok = $stmt->execute();
        $response = ["status" => $ok ? "ok" : "error", "msg" => $ok ? "Pictograma borrado" : $stmt->error];
        $stmt->close();
    } catch (Exception $e) {
        $response = ["status" => "error", "msg" => "Error al eliminar: " . $e->getMessage()];
    }

    echo json_encode($response);
    exit;
}

echo json_encode(["status" => "error", "msg" => "Método no permitido"]);