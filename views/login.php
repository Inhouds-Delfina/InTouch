<?php
$success = $_GET['success'] ?? false;
$nombre = $_GET['nombre'] ?? '';
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Login | InTouch</title>
  <link rel="icon" type="image/x-icon" href="../img/logo_fondo.ico">
  <link rel="shortcut icon" type="image/x-icon" href="../img/logo_fondo.ico">
  <link rel="stylesheet" href="../css/auth.css">
  <style>
    .alert {
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
      text-align: center;
    }
    .alert-success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    .alert-error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  </style>
</head>
<body>
  <img src="../img/logo.png" alt="Logo InTouch" class="logo"/>
  <h2>Iniciar sesión</h2>
    <div class="container">
      <?php if ($success): ?>
        <div class="alert alert-success">
          ¡Cuenta creada exitosamente<?php echo $nombre ? ' para ' . htmlspecialchars($nombre) : ''; ?>! 
          Ya puedes iniciar sesión.
        </div>
      <?php endif; ?>

      <h2>Iniciar sesión</h2>
      <form method="POST" action="../php/login.php">
        <input type="email" name="email" placeholder="Correo electrónico" required>
        <input type="password" name="contraseña" placeholder="Contraseña" required>
        <button type="submit">Entrar</button>
      </form>
      <p>¿No tenés cuenta? <a href="register.html">Crear una</a></p>
    </div>
</body>
</html>