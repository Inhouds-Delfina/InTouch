const sentenceEl = document.getElementById('sentence');
const grid = document.getElementById('pictogramGrid');
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

const pictogramasDefault = [
  {id: 1, texto: 'Hola', categoria_id: 1, categoria_nombre: 'Saludos', imagen_url: 'https://placehold.co/100x100/a3c9f9/333333?text=H'},
  {id: 2, texto: 'Adiós', categoria_id: 1, categoria_nombre: 'Saludos', imagen_url: 'https://placehold.co/100x100/a3c9f9/333333?text=A'},
  {id: 3, texto: 'Agua', categoria_id: 2, categoria_nombre: 'Necesidades', imagen_url: 'https://placehold.co/100x100/f9c6d0/333333?text=💧'},
  {id: 4, texto: 'Hambre', categoria_id: 2, categoria_nombre: 'Necesidades', imagen_url: 'https://placehold.co/100x100/f9c6d0/333333?text=🍽'},
  {id: 5, texto: 'Feliz', categoria_id: 3, categoria_nombre: 'Emociones', imagen_url: 'https://placehold.co/100x100/b5e6b5/333333?text=😊'},
  {id: 6, texto: 'Triste', categoria_id: 3, categoria_nombre: 'Emociones', imagen_url: 'https://placehold.co/100x100/b5e6b5/333333?text=😢'},
  {id: 7, texto: 'Enojado', categoria_id: 3, categoria_nombre: 'Emociones', imagen_url: 'https://placehold.co/100x100/b5e6b5/333333?text=😠'},
  {id: 8, texto: 'Jugar', categoria_id: 4, categoria_nombre: 'Acciones', imagen_url: 'https://placehold.co/100x100/f0e5f5/333333?text=J'},
  {id: 9, texto: 'Dormir', categoria_id: 4, categoria_nombre: 'Acciones', imagen_url: 'https://placehold.co/100x100/f0e5f5/333333?text=D'},
  {id: 10, texto: 'Manzana', categoria_id: 8, categoria_nombre: 'Comida', imagen_url: 'https://placehold.co/100x100/efbfbf/333333?text=🍎'},
  {id: 11, texto: 'Pan', categoria_id: 8, categoria_nombre: 'Comida', imagen_url: 'https://placehold.co/100x100/efbfbf/333333?text=🍞'}
];

function addChip(text) {
  const span = document.createElement('span');
  span.className = 'chip';
  span.textContent = text;
  span.title = 'Click para pronunciar';
  span.addEventListener('click', () => speak(text));
  sentenceEl?.appendChild(span);
}


if (grid) {
  grid.addEventListener('click', (e) => {
    const tile = e.target.closest('.tile');
    if (!tile) return;
    const text = tile.getAttribute('data-say');
    addChip(text);
    speak(text);
  });
}


const speakBtn = document.getElementById('speakSentence');
if (speakBtn) {
  speakBtn.addEventListener('click', () => {
    const sentence = Array.from(sentenceEl.querySelectorAll('.chip'))
      .map(c => c.textContent)
      .join(' ');
    speak(sentence);
  });
}


const clearBtn = document.getElementById('clearSentence');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    sentenceEl.innerHTML = '';
  });
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
  console.log('Grid element:', grid);
  console.log('Pictogramas a mostrar:', pictos.length);
  
  if (!grid) {
    console.error('❌ Grid no encontrado!');
    return;
  }
  
  // Limpiar grid pero mantener los controles
  const controles = grid.querySelector('.controls');
  grid.innerHTML = '';
  
  if (pictos.length === 0) {
    grid.innerHTML = `
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
        <img src="${picto.imagen_url}" alt="${picto.texto}" 
             onerror="this.src='https://placehold.co/100x100/a3c9f9/333333?text=${encodeURIComponent(picto.texto.charAt(0))}'" />
        <span>${picto.texto}</span>
      `;
      grid.appendChild(tile);
    });
  }
  
  // Reagregar controles al final
  if (controles) {
    grid.appendChild(controles);
  } else {
    const controlesDiv = document.createElement('div');
    controlesDiv.className = 'controls';
    controlesDiv.innerHTML = `
      <button id="speakSentence" class="btn-accent">🔊 Leer</button>
      <button id="clearSentence" class="btn-muted">🧹 Borrar</button>
    `;
    grid.appendChild(controlesDiv);
    
    // Reconfigurar event listeners para los controles
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
  }
  
  console.log('Pictogramas mostrados en grid:', grid.children.length - 1); // -1 por los controles
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
  console.log('Limpiando grid...');
  
  if (grid) {
    // Mostrar mensaje de carga
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 20px; background: #e3f2fd; border-radius: 8px; margin: 10px;">🔄 Recargando pictogramas...</div>';
    
    // Limpiar cache de pictogramas
    pictogramas = [];
    
    // Recargar datos inmediatamente
    cargarPictogramas().then(() => {
      // Mostrar notificación de éxito
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
  console.log('Grid encontrado:', !!grid);
  
  if (grid) {
    console.log('✅ Iniciando carga de datos...');
    // Pequeño delay para asegurar que todo esté listo
    setTimeout(() => {
      cargarPictogramas();
      cargarCategorias();
    }, 100);
    // Iniciar auto-recarga
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
