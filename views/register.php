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
    <form id="registerForm" enctype="multipart/form-data">
      <input type="text" id="nombre" name="nombre" placeholder="Nombre" required>
      <input type="email" id="email" name="email" placeholder="Correo electrónico" required>
      <input type="password" id="password" name="contraseña" placeholder="Contraseña (mínimo 6 caracteres)" required>
      <label for="avatar">Avatar (opcional)</label>
      <input type="file" name="avatar" id="avatar" accept="image/*">
      <button type="submit">Crear cuenta</button>
    </form>
    <div id="errorMessage" style="display: none; color: red; margin-top: 10px; text-align: center;"></div>
    <p>¿Ya tenés cuenta? <a href="login.php">Iniciar sesión</a></p>
  </div>

  <script>
    document.getElementById('registerForm').addEventListener('submit', async function(e) {
      e.preventDefault();

      const formData = new FormData(this);
      const errorDiv = document.getElementById('errorMessage');

      try {
        const response = await fetch('../php/register.php', {
          method: 'POST',
          body: formData
        });

        const responseText = await response.text();

        // Si la respuesta contiene "Location:", es una redirección exitosa
        if (responseText.includes('Location:')) {
          // Extraer la URL de redirección
          const urlMatch = responseText.match(/Location:\s*(.+)/i);
          if (urlMatch) {
            window.location.href = urlMatch[1].trim();
            return;
          }
        }

        // Si no es redirección, mostrar el mensaje de error
        errorDiv.innerHTML = responseText;
        errorDiv.style.display = 'block';

      } catch (error) {
        errorDiv.textContent = 'Error de conexión. Inténtalo de nuevo.';
        errorDiv.style.display = 'block';
      }
    });
  </script>
</body>
</html>
