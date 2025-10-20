<?php
session_start();
// Destruir sesión
$_SESSION = [];
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params['path'], $params['domain'],
        $params['secure'], $params['httponly']
    );
}
session_destroy();
// Redirigir a la vista de logout (informativa)
header('Location: ../views/logout.php');
exit;
?>
<?php
session_start();
session_destroy();
header("Location: login.php");
exit;
?>