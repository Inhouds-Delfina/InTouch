async function cargarPictos() {
  const res = await fetch("php/api.php");
  const data = await res.json();
  const tbody = document.getElementById("pictoTableBody");
  tbody.innerHTML = "";

  if (data.status === "ok") {
    data.data.forEach(p => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.id}</td>
        <td><img src="${p.imagen_url}" alt="${p.texto}" width="50"></td>
        <td>${p.texto}</td>
        <td>${p.categoria_nombre || 'Sin categoría'}</td>
        <td>
          <button onclick="editarPicto(${p.id}, '${p.texto}', ${p.categoria_id})">✏️ Editar</button>
          <button onclick="eliminarPicto(${p.id})">🗑️ Borrar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }
}

function editarPicto(id, texto, categoria_id) {
  document.getElementById("pictoId").value = id;
  document.getElementById("texto").value = texto;
  document.getElementById("categoria_id").value = categoria_id;
}

async function eliminarPicto(id) {
  if (confirm("¿Seguro que querés borrar este pictograma?")) {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("_method", "DELETE");
    const res = await fetch("php/api.php", { method: "POST", body: formData });
    const data = await res.json();
    alert(data.msg);
    cargarPictos();
  }
}

async function cargarCategorias() {
  try {
    console.log('Cargando categorías...');
    const res = await fetch("php/categorias.php");
    console.log('Respuesta categorias:', res.status);
    
    const data = await res.json();
    console.log('Datos categorias:', data);
    
    const select = document.getElementById("categoria_id");
    
    if (data.status === "ok" && select) {
      // Limpiar completamente el select
      select.innerHTML = '';
      
      // Agregar opción por defecto
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Seleccionar categoría';
      select.appendChild(defaultOption);
      
      // Agregar categorías únicas
      const categoriasUnicas = [];
      const nombresVistos = new Set();
      
      data.data.forEach(cat => {
        if (!nombresVistos.has(cat.nombre)) {
          nombresVistos.add(cat.nombre);
          categoriasUnicas.push(cat);
        }
      });
      
      categoriasUnicas.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.nombre;
        select.appendChild(option);
      });
      
      console.log('Categorías únicas cargadas:', categoriasUnicas.length);
    } else {
      console.error('Error cargando categorías:', data);
      if (select) {
        select.innerHTML = '<option value="">Error cargando categorías</option>';
      }
    }
  } catch (error) {
    console.error('Error en cargarCategorias:', error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pictoForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log('Enviando formulario...');
      
      const formData = new FormData(e.target);
      
      // Validar campos antes de enviar
      const texto = formData.get('texto');
      const categoria_id = formData.get('categoria_id');
      
      console.log('Validando campos:');
      console.log('texto:', texto);
      console.log('categoria_id:', categoria_id);
      
      if (!texto || !categoria_id || categoria_id === '') {
        alert('Por favor completa todos los campos obligatorios (Texto y Categoría)');
        return;
      }
      
      // Debug: mostrar datos del formulario
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      try {
        const res = await fetch("php/api.php", { 
          method: "POST", 
          body: formData 
        });
        
        console.log('Respuesta del servidor:', res.status);
        
        const data = await res.json();
        console.log('Datos recibidos:', data);
        
        alert(data.msg || 'Operación completada');
        
        if (data.status === 'ok') {
          e.target.reset();
          cargarPictos();
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión: ' + error.message);
      }
    });
  }
  cargarCategorias();
  cargarPictos();
});
