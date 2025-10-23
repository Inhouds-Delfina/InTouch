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
          <?php if (!empty($_GET['error'])): ?>
            <div class="alert alert-error">
              Usuario o contraseña incorrectos. Intenta nuevamente.
            </div>
          <?php endif; ?>

      <h2>Iniciar sesión</h2>
      <form id="loginForm">
        <input type="email" id="email" name="email" placeholder="Correo electrónico" required>
        <input type="password" id="password" name="contraseña" placeholder="Contraseña" required>
        <button type="submit">Entrar</button>
      </form>
      <div id="errorMessage" style="display: none; color: red; margin-top: 10px; text-align: center;"></div>
  <p>¿No tenés cuenta? <a href="register.php">Crear una</a></p>
    </div>

    <script>
      document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('errorMessage');

        try {
          const response = await fetch('../php/login.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `email=${encodeURIComponent(email)}&contraseña=${encodeURIComponent(password)}`
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const responseText = await response.text();

          // Verificar si es HTML (error del servidor)
          if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
            throw new Error('El servidor devolvió una página HTML en lugar de JSON. Posible error 500.');
          }

          const data = JSON.parse(responseText);

          if (data.status === 'error') {
            errorDiv.textContent = data.message;
            errorDiv.style.display = 'block';
          } else {
            // Login exitoso, redirigir
            window.location.href = '../index.php';
          }
        } catch (error) {
          console.error('Error de conexión:', error);
          errorDiv.textContent = 'Error de conexión. Verifica tu conexión a internet.';
          errorDiv.style.display = 'block';
        }
      });
    </script>
</body>
</html>