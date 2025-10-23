let sentenceEl = null;
let grid = null;
let pictogramas = [];
let categorias = [];

// Datos de fallback si no hay base de datos
const categoriasDefault = [
  {id: 1, nombre: 'Saludos'},
  {id: 2, nombre: 'Necesidades'},
  {id: 3, nombre: 'Emociones'},
  {id: 4, nombre: 'Acciones'},
  {id: 8, nombre: 'Comida'}
];



function addChip(text) {
  const span = document.createElement('span');
  span.className = 'chip';
  span.textContent = text;
  span.title = 'Click para pronunciar';
  span.addEventListener('click', () => speak(text));
  sentenceEl?.appendChild(span);
}




async function cargarPictogramas() {
  console.log('=== INICIANDO CARGA DE PICTOGRAMAS ===');
  
  try {
    console.log('Intentando cargar desde API...');
    // Agregar headers anti-cache más agresivos
    const res = await fetch('php/api.php?t=' + Date.now() + '&r=' + Math.random(), {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    console.log('Status de respuesta:', res.status);
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    
    const data = await res.json();
    console.log('Datos recibidos:', data);
    
    if (data.status === 'ok' && data.data) {
      pictogramas = data.data;
      console.log('✅ Cargados desde BD:', pictogramas.length, 'pictogramas');
      console.log('Pictogramas cargados:', pictogramas);
    } else {
      console.log('⚠️ BD vacía o error, usando fallback');
      pictogramas = pictogramasDefault;
    }
  } catch (error) {
    console.error('❌ Error API, usando fallback:', error);
    pictogramas = pictogramasDefault;
  }
  
  console.log('Pictogramas finales a mostrar:', pictogramas.length);
  mostrarPictogramas(pictogramas);
  return pictogramas;
}

async function cargarCategorias() {
  try {
    const res = await fetch('php/categorias.php');
    const data = await res.json();
    if (data.status === 'ok') {
      categorias = data.data;
      mostrarFiltrosCategorias();
    } else {
      // Usar datos de fallback
      categorias = categoriasDefault;
      mostrarFiltrosCategorias();
    }
  } catch (error) {
    console.error('Error cargando categorías, usando datos de fallback:', error);
    // Usar datos de fallback
    categorias = categoriasDefault;
    mostrarFiltrosCategorias();
  }
}

function mostrarPictogramas(pictos) {
  console.log('=== MOSTRANDO PICTOGRAMAS ===');
  
  const currentGrid = document.getElementById('pictogramGrid');
  console.log('Grid element:', currentGrid);
  console.log('Pictogramas a mostrar:', pictos.length);
  
  if (!currentGrid) {
    console.error('❌ Grid no encontrado!');
    return;
  }
  
  // Limpiar grid pero mantener los controles
  const controles = currentGrid.querySelector('.controls');
  currentGrid.innerHTML = '';
  
  if (pictos.length === 0) {
    currentGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #7f8c8d;">
        <h3>🎨 No hay pictogramas aún</h3>
        <p>¡Crea pictogramas desde el panel de administración!</p>
      </div>
    `;
  } else {
    pictos.forEach(picto => {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.setAttribute('data-say', picto.texto);
      tile.innerHTML = `
        <img src="${picto.imagen_url}?v=${Date.now()}" alt="${picto.texto}" 
             onerror="this.src='https://placehold.co/100x100/a3c9f9/333333?text=${encodeURIComponent(picto.texto.charAt(0))}'" />
        <span>${picto.texto}</span>
      `;
      currentGrid.appendChild(tile);
    });
  }
  
  // Los controles ahora están en el HTML principal, no se crean dinámicamente
  
  console.log('Pictogramas mostrados en grid:', currentGrid.children.length - 1); // -1 por los controles
  console.log('=== CARGA COMPLETADA ===');
  
  // Mostrar notificación visual de éxito
  if (pictos.length > 0) {
    console.log(`✅ ${pictos.length} pictogramas cargados exitosamente`);
  }
}

function mostrarFiltrosCategorias() {
  const filterContainer = document.getElementById('categoryFilters');
  if (!filterContainer) return;
  
  filterContainer.innerHTML = '<button onclick="filtrarCategoria(null)" class="filter-btn active">Todas</button>';
  
  categorias.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.textContent = cat.nombre;
    btn.onclick = () => filtrarCategoria(cat.id);
    filterContainer.appendChild(btn);
  });
}

function filtrarCategoria(categoriaId) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  if (categoriaId === null) {
    mostrarPictogramas(pictogramas);
    buttons[0].classList.add('active');
  } else {
    const filtrados = pictogramas.filter(p => p.categoria_id == categoriaId);
    mostrarPictogramas(filtrados);
    event.target.classList.add('active');
  }
}

// Función para recargar pictogramas manualmente
function recargarPictogramas() {
  console.log('=== RECARGA MANUAL ===');

  const currentGrid = document.getElementById('pictogramGrid');
  if (currentGrid) {
    // Limpiar solo los pictogramas, mantener los controles
    const controles = currentGrid.querySelector('.controls');
    currentGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 20px; background: #e3f2fd; border-radius: 8px; margin: 10px;">🔄 Recargando pictogramas...</div>';

    // Reagregar controles si existían
    if (controles) {
      currentGrid.appendChild(controles);
    }

    pictogramas = [];

    cargarPictogramas().then(() => {
      mostrarNotificacion('✅ Pictogramas actualizados');
    });
    cargarCategorias();
  }
}

// Función para mostrar notificaciones temporales
function mostrarNotificacion(mensaje) {
  const notif = document.createElement('div');
  notif.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    z-index: 1000;
    font-weight: bold;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  `;
  notif.textContent = mensaje;
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.remove();
  }, 3000);
}

// Auto-recarga cada 30 segundos para detectar nuevos pictogramas
function iniciarAutoRecarga() {
  setInterval(() => {
    console.log('Auto-recarga de pictogramas...');
    cargarPictogramas();
  }, 30000); // 30 segundos
}



// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', function() {
  console.log('=== DOM CARGADO ===');

  // Inicializar elementos
  sentenceEl = document.getElementById('sentence');
  grid = document.getElementById('pictogramGrid');

  console.log('Grid encontrado:', !!grid);

  if (grid) {
    console.log('✅ Iniciando carga de datos...');

    // Configurar event listeners
    grid.addEventListener('click', (e) => {
      const tile = e.target.closest('.tile');
      if (!tile) return;
      const text = tile.getAttribute('data-say');
      addChip(text);
      speak(text);
    });

    // Configurar event listeners para los controles principales
    const speakBtn = document.getElementById('speakSentence');
    const clearBtn = document.getElementById('clearSentence');

    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        const sentence = Array.from(sentenceEl.querySelectorAll('.chip'))
          .map(c => c.textContent)
          .join(' ');
        speak(sentence);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        sentenceEl.innerHTML = '';
      });
    }

    setTimeout(() => {
      cargarPictogramas();
      cargarCategorias();
    }, 100);

    iniciarAutoRecarga();
  } else {
    console.error('❌ Grid no encontrado - revisar HTML');
  }
});

// Detectar cuando la página vuelve a estar visible (regreso del panel admin)
document.addEventListener('visibilitychange', function() {
  if (!document.hidden && grid) {
    console.log('Página visible de nuevo - recargando pictogramas...');
    setTimeout(() => {
      recargarPictogramas();
    }, 500);
  }
});

// Detectar cuando la ventana vuelve a tener foco
window.addEventListener('focus', function() {
  if (grid) {
    console.log('Ventana con foco - recargando pictogramas...');
    setTimeout(() => {
      recargarPictogramas();
    }, 500);
  }
});
