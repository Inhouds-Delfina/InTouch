<?php
session_start();
if (!isset($_SESSION['usuario'])) {
    header("Location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="../css/auth.css">
  <title>Panel - InTouch</title>
</head>
<body>
<div class="container">
  <h2>¡Bienvenido, <?php echo $_SESSION['usuario']; ?>!</h2>
  <?php if ($_SESSION['avatar']): ?>
    <img src="<?php echo $_SESSION['avatar']; ?>" class="avatar">
  <?php endif; ?>
  <p>Tu rol: <?php echo $_SESSION['rol']; ?></p>
  <a href="logout.php" class="logout-btn">Cerrar sesión</a>
</div>
</body>
</html>
