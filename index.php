<?php
session_start();
if (!isset($_SESSION['usuario_id'])) {
    header("Location: views/login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <link rel="icon" type="image/x-icon" href="./img/logo_fondo.ico">
  <link rel="stylesheet" href="css/style.css">
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#a3c9f9">
  <title>InTouch</title>
</head>
<body>
  <main class="app" role="main">
    <header>
      <img src="img/logo.png" alt="Logo InTouch" class="logo"/>
      <h4 class="chip">¡Hola, <?php echo htmlspecialchars($_SESSION['usuario']); ?>!</h4>
    </header>
    <section class="bar" aria-label="Frase armada">
      <div id="sentence" class="sentence" aria-live="polite" aria-atomic="false">
        <span class="chip"><small>Consejo:</small> toca pictogramas para armar y leer una frase.</span>
      </div>
      <br>
    </section>
    <section class="categories" aria-label="Categorías">
      <div class="row">
        <label>Filtrar por categoría:</label>
        <div id="categoryFilters" class="filter-buttons">
          <!-- Los filtros se cargan dinámicamente -->
        </div>
      </div>
    </section>
    <section aria-label="Pictogramas">
      <div class="grid" id="pictogramGrid">
        <!-- Los pictogramas se cargan dinámicamente desde la base de datos -->
      </div>
      <div class="controls">
        <button id="speakSentence" class="btn-accent">🔊 Leer</button>
        <button id="clearSentence" class="btn-muted">🧹 Borrar</button>
        <button id="reloadPictos" class="btn-accent" onclick="recargarPictogramas()" title="Recargar pictogramas desde la base de datos">🔄 Recargar</button>
      </div>
    </section>
    <footer>
      <p>© InTouch - 2025</p>
    </footer>
  </main>
  <button class="menufloat" id="menufloat" onclick="mostrarMenu()">+</button>
  <section class="subButton-container">
    <button class="btn-admin" onclick="irAAdmin()" title="Panel de Administración">
      ⚙️
    </button>
    <button class="btn-tts" onclick="irATTS()" title="Texto a Voz">
      🎤
    </button>
    <button class="btn-logout" onclick="irALOGOUT()" title="Cerrar Sesión">
      ❌
    </button>
  </section>

  <script src="js/main.js"></script>
  <script src="js/pictos.js"></script>
  <script src="js/mostrar_menu.js"></script>
  <script src="js/session.js"></script>
</body>
</html>