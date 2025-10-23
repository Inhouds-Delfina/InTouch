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
    const res = await fetch(`../php/api.php?id=${id}`);
    const data = await res.json();

    if (data.status === "ok" && data.data.length > 0) {
      const picto = data.data[0];
      document.getElementById("pictoId").value = picto.id;
      document.getElementById("texto").value = picto.texto;
      document.getElementById("categoria_id").value = picto.categoria_id;
      // Nota: La imagen no se puede precargar en el input file por seguridad del navegador
    }
  } catch (error) {
    console.error('Error cargando pictograma:', error);
    mostrarNotificacion('Error al cargar datos del pictograma', 'error');
  }
}

// Cargar y mostrar lista de pictogramas
async function cargarPictogramas() {
  try {
    const res = await fetch("../php/api.php");
    const data = await res.json();

    if (data.status === "ok") {
      pictogramas = data.data;
      mostrarPictogramas();
      document.getElementById('totalPictogramas').textContent = pictogramas.length;
    }
  } catch (error) {
    console.error('Error cargando pictogramas:', error);
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
        <button class="btn-edit" onclick="abrirModal(${picto.id})" title="Editar">
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
    title.textContent = '✏️ Editar Pictograma';
    // Cargar datos del pictograma para editar
    cargarDatosPictograma(id);
  } else {
    title.textContent = '➕ Nuevo Pictograma';
    form.reset();
    document.getElementById("pictoId").value = "";
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
      
      if (!texto || !categoria_id) {
        mostrarNotificacion('Por favor completa todos los campos obligatorios', 'error');
        return;
      }
      
      try {
        const res = await fetch("../php/api.php", {
          method: "POST",
          body: formData
        });

        const data = await res.json();

        if (data.status === 'ok') {
          mostrarNotificacion(data.msg || 'Pictograma guardado correctamente', 'success');
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