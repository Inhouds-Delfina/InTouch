<?php
session_start();
// Si no hay sesión iniciada o ha expirado, redirigir al login
if (empty($_SESSION['usuario_id']) ||
    empty($_SESSION['login_time']) ||
    (time() - $_SESSION['login_time']) > 3600) {
    header('Location: ../views/login.php');
    exit;
}
$usuario_nombre = $_SESSION['usuario'] ?? 'Usuario';
?>
<?php
// Mostrar errores en entorno de desarrollo para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" type="image/x-icon" href="../img/logo_fondo.ico">
  <link rel="stylesheet" href="../css/abm.css">
  <title>InTouch · Administración de Pictogramas</title>
  <!-- Asegurarnos de que los scripts se cargan desde la raíz del proyecto -->
  <script src="../js/main.js"></script>
  <script src="../js/abm.js"></script>
</head>
<body>
  <main class="admin-app">
    <header class="admin-header">
      <div class="header-content">
        <h1>📋 Panel de Administración</h1>
        <p>Gestiona tus pictogramas de forma fácil y rápida — <strong><?php echo htmlspecialchars($usuario_nombre); ?></strong></p>
      </div>
      <div class="header-actions">
        <button class="btn-primary" onclick="window.location.href='../index.php'">🏠 Ir a la App</button>
        <button class="btn-success" onclick="abrirModal()">➕ Nuevo Pictograma</button>
      </div>
    </header>

    <section class="info-section">
      <div class="info-card">
        <h2>🎨 Panel de Administración</h2>
        <p>Desde aquí puedes crear, editar y eliminar pictogramas. Los pictogramas aparecerán automáticamente en la aplicación principal.</p>
        <div class="stats">
          <div class="stat-item">
            <span class="stat-number" id="totalPictogramas">0</span>
            <span class="stat-label">Pictogramas</span>
          </div>
          <div class="stat-item">
            <span class="stat-number" id="totalCategorias">0</span>
            <span class="stat-label">Categorías</span>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Modal para agregar/editar pictograma -->
  <div id="pictoModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3 id="modalTitle">➕ Nuevo Pictograma</h3>
        <button class="close-btn" onclick="cerrarModal()">&times;</button>
      </div>
      <form id="pictoForm" enctype="multipart/form-data">
        <input type="hidden" id="pictoId" name="id" value="">
        
        <div class="form-group">
          <label for="texto">📝 Texto del pictograma</label>
          <input type="text" id="texto" name="texto" placeholder="Ej: Hola, Agua, Feliz..." required>
        </div>

        <div class="form-group">
          <label for="categoria_id">🧾 Categoría</label>
          <select id="categoria_id" name="categoria_id" required>
            <option value="">Seleccionar categoría...</option>
          </select>
        </div>

        <div class="form-group">
          <label for="imagen">🖼️ Imagen (opcional)</label>
          <div class="file-input-wrapper">
            <input type="file" id="imagen" name="imagen" accept="image/*">
            <div class="file-input-display">
              <span id="fileName">Seleccionar archivo...</span>
              <button type="button" class="btn-file">📁 Explorar</button>
            </div>
          </div>
          <small>Si no seleccionas imagen, se generará automáticamente</small>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-secondary" onclick="cerrarModal()">Cancelar</button>
          <button type="submit" class="btn-primary">💾 Guardar</button>
        </div>
      </form>
    </div>
  </div>
  <script>
    // Funciones del modal
    function abrirModal(id = null) {
      const modal = document.getElementById('pictoModal');
      const title = document.getElementById('modalTitle');
      const form = document.getElementById('pictoForm');
      
      if (id) {
        title.textContent = '✏️ Editar Pictograma';
        // Cargar datos del pictograma
      } else {
        title.textContent = '➕ Nuevo Pictograma';
        form.reset();
      }
      
      modal.style.display = 'flex';
    }
    
    function cerrarModal() {
      const modal = document.getElementById('pictoModal');
      modal.style.display = 'none';
    }
    
    // Cerrar modal al hacer clic fuera
    window.onclick = function(event) {
      const modal = document.getElementById('pictoModal');
      if (event.target === modal) {
        cerrarModal();
      }
    }
  </script>
  <script src="../js/session.js"></script>
  <script src="../js/abm.js"></script>
</body>
</html>
