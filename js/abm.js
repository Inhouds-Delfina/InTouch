let pictogramas = [];
let categorias = [];

// Cargar estadísticas
async function cargarEstadisticas() {
  try {
    const res = await fetch("../php/api.php");
    const data = await res.json();

    if (data.status === "ok") {
      pictogramas = data.data;
      document.getElementById('totalPictogramas').textContent = pictogramas.length;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Cargar categorías únicas
async function cargarCategorias() {
  try {
    const res = await fetch("../php/categorias.php");
    const data = await res.json();

    if (data.status === "ok") {
      // Filtrar categorías únicas
      const categoriasUnicas = [];
      const nombresVistos = new Set();

      data.data.forEach(cat => {
        if (!nombresVistos.has(cat.nombre)) {
          nombresVistos.add(cat.nombre);
          categoriasUnicas.push(cat);
        }
      });

      categorias = categoriasUnicas;
      llenarSelectCategorias();
      actualizarEstadisticas();
    }
  } catch (error) {
    console.error('Error cargando categorías:', error);
  }
}

// Llenar select de categorías en el modal
function llenarSelectCategorias() {
  const select = document.getElementById("categoria_id");
  if (!select) return;
  
  select.innerHTML = '<option value="">Seleccionar categoría...</option>';
  
  categorias.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.nombre;
    select.appendChild(option);
  });
}

// Actualizar estadísticas de categorías
function actualizarEstadisticas() {
  document.getElementById('totalCategorias').textContent = categorias.length;
}

// Cargar datos de un pictograma para editar
async function cargarDatosPictograma(id) {
  try {
    console.log('Cargando datos del pictograma ID:', id);
    console.log('Pictogramas disponibles:', pictogramas.length);
    // Para obtener un pictograma específico, necesitamos modificar la API o hacer una consulta diferente
    // Por ahora, buscaremos en la lista ya cargada
    const picto = pictogramas.find(p => p.id == id);
    if (picto) {
      console.log('Pictograma encontrado:', picto);
      const idField = document.getElementById("pictoId");
      idField.value = picto.id;
      idField.name = "id"; // Asegurar que el campo tenga el atributo name correcto
      console.log('Campo ID configurado - value:', idField.value, 'name:', idField.name);
      document.getElementById("texto").value = picto.texto;
      document.getElementById("categoria_id").value = picto.categoria_id;
      // Limpiar el campo de archivo ya que no podemos precargarlo
      document.getElementById("imagen").value = "";
      document.getElementById("fileName").textContent = "Seleccionar archivo...";
      mostrarNotificacion('Datos cargados para edición', 'info');
    } else {
      console.error('Pictograma no encontrado en la lista local');
      console.log('IDs disponibles:', pictogramas.map(p => p.id));
      mostrarNotificacion('Error: Pictograma no encontrado', 'error');
    }
  } catch (error) {
    console.error('Error cargando pictograma:', error);
    mostrarNotificacion('Error al cargar datos del pictograma', 'error');
  }
}

// Cargar y mostrar lista de pictogramas
async function cargarPictogramas() {
  try {
    console.log('Cargando pictogramas...');
    const res = await fetch("../php/api.php");
    console.log('Respuesta HTTP:', res.status, res.statusText);
    const data = await res.json();
    console.log('Datos recibidos:', data);

    if (data.status === "ok") {
      pictogramas = data.data;
      console.log('Pictogramas cargados:', pictogramas.length);
      mostrarPictogramas();
      document.getElementById('totalPictogramas').textContent = pictogramas.length;
    } else {
      console.error('Error en respuesta:', data.msg);
      mostrarNotificacion('Error al cargar pictogramas: ' + data.msg, 'error');
    }
  } catch (error) {
    console.error('Error cargando pictogramas:', error);
    mostrarNotificacion('Error de conexión al cargar pictogramas', 'error');
  }
}

// Mostrar pictogramas en la lista
function mostrarPictogramas() {
  const container = document.getElementById('pictogramasList');
  if (!container) return;

  if (pictogramas.length === 0) {
    container.innerHTML = '<div class="no-pictogramas">No tienes pictogramas creados aún. ¡Crea el primero!</div>';
    return;
  }

  container.innerHTML = pictogramas.map(picto => `
    <div class="picto-card" data-id="${picto.id}">
      <div class="picto-image">
        <img src="${picto.imagen_url}" alt="${picto.texto}" onerror="this.src='https://placehold.co/100x100/a3c9f9/333333?text=${encodeURIComponent(picto.texto.charAt(0))}'">
      </div>
      <div class="picto-info">
        <h3>${picto.texto}</h3>
        <p class="categoria">${picto.categoria_nombre || 'Sin categoría'}</p>
      </div>
      <div class="picto-actions">
        <button class="btn-edit" onclick="console.log('Botón editar clickeado, ID:', ${picto.id}); abrirModal(${picto.id})" title="Editar">
          ✏️
        </button>
        <button class="btn-delete" onclick="eliminarPictograma(${picto.id})" title="Eliminar">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

// Eliminar pictograma
async function eliminarPictograma(id) {
  if (!confirm('¿Estás seguro de que quieres eliminar este pictograma?')) {
    return;
  }

  try {
    const formData = new FormData();
    formData.append('_method', 'DELETE');
    formData.append('id', id);

    const res = await fetch("../php/api.php", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.status === 'ok') {
      mostrarNotificacion('Pictograma eliminado correctamente', 'success');
      cargarPictogramas();
      cargarEstadisticas();
    } else {
      mostrarNotificacion('Error: ' + data.msg, 'error');
    }
  } catch (error) {
    mostrarNotificacion('Error de conexión', 'error');
  }
}



// Funciones del modal
function abrirModal(id = null) {
  const modal = document.getElementById('pictoModal');
  const title = document.getElementById('modalTitle');
  const form = document.getElementById('pictoForm');

  if (id) {
    console.log('Abriendo modal para editar pictograma ID:', id);
    title.textContent = '✏️ Editar Pictograma';
    // Cargar datos del pictograma para editar
    cargarDatosPictograma(id);
  } else {
    console.log('Abriendo modal para crear nuevo pictograma');
    title.textContent = '➕ Nuevo Pictograma';
    form.reset();
    document.getElementById("pictoId").value = "";
    document.getElementById("pictoId").name = "id"; // Asegurar que el campo tenga el atributo name
  }

  modal.style.display = 'flex';
}

function cerrarModal() {
  const modal = document.getElementById('pictoModal');
  modal.style.display = 'none';
}

// Mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
  // Crear elemento de notificación
  const notif = document.createElement('div');
  notif.className = `notification ${tipo}`;
  notif.innerHTML = `
    <span>${mensaje}</span>
    <button onclick="this.parentElement.remove()">&times;</button>
  `;
  
  // Agregar estilos inline para la notificación
  notif.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideInRight 0.3s ease;
    ${tipo === 'success' ? 'background: #4ecdc4;' : ''}
    ${tipo === 'error' ? 'background: #ff6b6b;' : ''}
    ${tipo === 'info' ? 'background: #667eea;' : ''}
  `;
  
  document.body.appendChild(notif);
  
  // Auto-remover después de 3 segundos
  setTimeout(() => {
    if (notif.parentElement) {
      notif.remove();
    }
  }, 3000);
}

// Manejar archivo seleccionado
function manejarArchivoSeleccionado() {
  const input = document.getElementById('imagen');
  const display = document.getElementById('fileName');
  
  input.addEventListener('change', function() {
    if (this.files && this.files[0]) {
      display.textContent = this.files[0].name;
    } else {
      display.textContent = 'Seleccionar archivo...';
    }
  });
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  // Configurar formulario
  const form = document.getElementById("pictoForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const texto = formData.get('texto');
      const categoria_id = formData.get('categoria_id');
      const pictoId = formData.get('id');

      console.log('=== FORM SUBMIT DEBUG ===');
      console.log('Texto:', texto);
      console.log('Categoria ID:', categoria_id);
      console.log('Picto ID desde formData.get("id"):', pictoId);
      console.log('Campo pictoId.value:', document.getElementById("pictoId").value);
      console.log('Campo pictoId.name:', document.getElementById("pictoId").name);
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key + ': ' + value);
      }

      if (!texto || !categoria_id) {
        mostrarNotificacion('Por favor completa todos los campos obligatorios', 'error');
        return;
      }

      try {
        console.log('Enviando petición a ../php/api.php');
        const res = await fetch("../php/api.php", {
          method: "POST",
          body: formData
        });

        console.log('Respuesta HTTP status:', res.status);
        const data = await res.json();
        console.log('Respuesta del servidor:', data);

        if (data.status === 'ok') {
          const mensaje = pictoId ? 'Pictograma actualizado correctamente' : 'Pictograma creado correctamente';
          mostrarNotificacion(mensaje, 'success');
          cerrarModal();
          form.reset();
          cargarPictogramas();
          cargarEstadisticas();
          // Limpiar cache del navegador para forzar recarga en index
          if ('caches' in window) {
            caches.delete('intouch-cache');
          }
        } else {
          mostrarNotificacion('Error: ' + data.msg, 'error');
        }
      } catch (error) {
        console.error('Error en submit:', error);
        mostrarNotificacion('Error de conexión', 'error');
      }
    });
  }
  
  // Cerrar modal al hacer clic fuera
  window.onclick = function(event) {
    const modal = document.getElementById('pictoModal');
    if (event.target === modal) {
      cerrarModal();
    }
  }
  
  // Configurar manejo de archivos
  manejarArchivoSeleccionado();
  
  // Cargar datos iniciales
  cargarCategorias();
  cargarPictogramas();
  cargarEstadisticas();
});

// Agregar estilos para notificaciones
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .notification button {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
document.head.appendChild(style);