<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Registro | InTouch</title>
  <link rel="icon" type="image/x-icon" href="../img/logo_fondo.ico">
  <link rel="stylesheet" href="../css/auth.css">
</head>
<body>
  <img src="../img/logo.png" alt="Logo InTouch" class="logo"/>
  <div class="container">
    <h2>Crear una cuenta</h2>
    <form method="POST" action="../php/register.php" enctype="multipart/form-data">
      <input type="text" name="nombre" placeholder="Nombre" required>
      <input type="email" name="email" placeholder="Correo electrónico" required>
      <input type="password" name="contraseña" placeholder="Contraseña (mínimo 6 caracteres)" required>
      <label for="avatar">Avatar (opcional)</label>
      <input type="file" name="avatar" id="avatar" accept="image/*">
      <button type="submit">Crear cuenta</button>
    </form>
    <p>¿Ya tenés cuenta? <a href="login.php">Iniciar sesión</a></p>
  </div>
</body>
</html>
