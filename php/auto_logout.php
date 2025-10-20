<?php
session_start();

// Destruir la sesión sin redirigir (usado por el evento beforeunload)
$_SESSION = array();
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}
session_destroy();

// No redirigir, solo devolver OK
echo "OK";
?>