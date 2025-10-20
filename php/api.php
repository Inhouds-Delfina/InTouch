<?php
session_start();
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
    
    // Categorías básicas removidas para evitar duplicados
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
            // Obtener id de usuario desde la sesión si existe
            $session_user_id = $_SESSION['usuario_id'] ?? null;
            $session_rol = $_SESSION['rol'] ?? null;

            if ($id) {
            // Actualizar
                // Comprobar propietario
                $ownerCheckSql = "SELECT usuario_id FROM pictogramas WHERE id = ?";
                $ownerStmt = $conn->prepare($ownerCheckSql);
                $ownerStmt->bind_param("i", $id);
                $ownerStmt->execute();
                $ownerRes = $ownerStmt->get_result();
                $owner = $ownerRes->fetch_assoc();
                $ownerStmt->close();

                if ($owner && $owner['usuario_id'] && $owner['usuario_id'] != $session_user_id && $session_rol !== 'admin') {
                    $response = ["status" => "error", "msg" => "No autorizado para actualizar este pictograma"];
                } else {
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
                }
        } else {
            // Crear nuevo
            if (!$imagenUrl) {
                $imagenUrl = "https://placehold.co/100x100/a3c9f9/333333?text=" . urlencode(substr($texto, 0, 1));
            }
                $sql = "INSERT INTO pictogramas (texto, categoria_id, imagen_url, usuario_id) VALUES (?, ?, ?, ?)";
                $stmt = $conn->prepare($sql);
                // asociar con el usuario si está logueado, sino NULL
                $user_id_param = $session_user_id ?: null;
                $stmt->bind_param("sisi", $texto, $categoria_id, $imagenUrl, $user_id_param);
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
        // Devolver solo los pictogramas del usuario logueado
        $session_user_id = $_SESSION['usuario_id'] ?? null;
        if ($session_user_id) {
            $sql = "SELECT p.*, c.nombre as categoria_nombre FROM pictogramas p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.usuario_id = ? ORDER BY p.creado DESC";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $session_user_id);
            $stmt->execute();
            $result = $stmt->get_result();
        } else {
            // Si no hay usuario logueado, devolver array vacío
            echo json_encode(["status" => "ok", "data" => []]);
            exit;
        }
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
    // Verificar propietario antes de borrar
    $session_user_id = $_SESSION['usuario_id'] ?? null;
    $session_rol = $_SESSION['rol'] ?? null;

        $ownerCheckSql = "SELECT usuario_id FROM pictogramas WHERE id = ?";
        $ownerStmt = $conn->prepare($ownerCheckSql);
        $ownerStmt->bind_param("i", $id);
        $ownerStmt->execute();
        $ownerRes = $ownerStmt->get_result();
        $owner = $ownerRes->fetch_assoc();
        $ownerStmt->close();

        if ($owner && $owner['usuario_id'] && $owner['usuario_id'] != $session_user_id && $session_rol !== 'admin') {
            $response = ["status" => "error", "msg" => "No autorizado para eliminar este pictograma"];
        } else {
            $sql = "DELETE FROM pictogramas WHERE id=?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $id);
            $ok = $stmt->execute();
            $response = ["status" => $ok ? "ok" : "error", "msg" => $ok ? "Pictograma borrado" : $stmt->error];
            $stmt->close();
        }
    } catch (Exception $e) {
        $response = ["status" => "error", "msg" => "Error al eliminar: " . $e->getMessage()];
    }

    echo json_encode($response);
    exit;
}

echo json_encode(["status" => "error", "msg" => "Método no permitido"]);