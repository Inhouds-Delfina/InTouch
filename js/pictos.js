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
  {id: 1, texto: 'Hola', categoria_id: 1, categoria_nombre: 'Saludos', imagen_url: 'https://via.placeholder.com/100x100/a3c9f9/333?text=👋'},
  {id: 2, texto: 'Adiós', categoria_id: 1, categoria_nombre: 'Saludos', imagen_url: 'https://via.placeholder.com/100x100/a3c9f9/333?text=👋'},
  {id: 3, texto: 'Agua', categoria_id: 2, categoria_nombre: 'Necesidades', imagen_url: 'https://via.placeholder.com/100x100/f9c6d0/333?text=💧'},
  {id: 4, texto: 'Hambre', categoria_id: 2, categoria_nombre: 'Necesidades', imagen_url: 'https://via.placeholder.com/100x100/f9c6d0/333?text=🍽️'},
  {id: 5, texto: 'Feliz', categoria_id: 3, categoria_nombre: 'Emociones', imagen_url: 'https://via.placeholder.com/100x100/b5e6b5/333?text=😊'},
  {id: 6, texto: 'Triste', categoria_id: 3, categoria_nombre: 'Emociones', imagen_url: 'https://via.placeholder.com/100x100/b5e6b5/333?text=😢'},
  {id: 7, texto: 'Enojado', categoria_id: 3, categoria_nombre: 'Emociones', imagen_url: 'https://via.placeholder.com/100x100/b5e6b5/333?text=😠'},
  {id: 8, texto: 'Jugar', categoria_id: 4, categoria_nombre: 'Acciones', imagen_url: 'https://via.placeholder.com/100x100/f0e5f5/333?text=🎮'},
  {id: 9, texto: 'Dormir', categoria_id: 4, categoria_nombre: 'Acciones', imagen_url: 'https://via.placeholder.com/100x100/f0e5f5/333?text=😴'},
  {id: 10, texto: 'Manzana', categoria_id: 8, categoria_nombre: 'Comida', imagen_url: 'https://via.placeholder.com/100x100/efbfbf/333?text=🍎'},
  {id: 11, texto: 'Pan', categoria_id: 8, categoria_nombre: 'Comida', imagen_url: 'https://via.placeholder.com/100x100/efbfbf/333?text=🍞'}
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
  try {
    const res = await fetch('InTouch/php/api.php');
    const data = await res.json();
    if (data.status === 'ok') {
      pictogramas = data.data;
      mostrarPictogramas(pictogramas);
    } else {
      // Usar datos de fallback
      pictogramas = pictogramasDefault;
      mostrarPictogramas(pictogramas);
    }
  } catch (error) {
    console.error('Error cargando pictogramas, usando datos de fallback:', error);
    // Usar datos de fallback
    pictogramas = pictogramasDefault;
    mostrarPictogramas(pictogramas);
  }
}

async function cargarCategorias() {
  try {
    const res = await fetch('InTouch/php/categorias.php');
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
  if (!grid) return;
  
  grid.innerHTML = '';
  pictos.forEach(picto => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.setAttribute('data-say', picto.texto);
    tile.innerHTML = `
      <img src="${picto.imagen_url}" alt="${picto.texto}" />
      <span>${picto.texto}</span>
    `;
    grid.appendChild(tile);
  });
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

// Cargar datos al iniciar
if (grid) {
  cargarPictogramas();
  cargarCategorias();
}
