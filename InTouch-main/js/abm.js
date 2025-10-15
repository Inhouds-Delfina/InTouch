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
        <td>${p.categoria}</td>
        <td>
          <button onclick="editarPicto(${p.id}, '${p.texto}', '${p.categoria}')">✏️ Editar</button>
          <button onclick="eliminarPicto(${p.id})">🗑️ Borrar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }
}

function editarPicto(id, texto, categoria) {
  document.getElementById("pictoId").value = id;
  document.getElementById("texto").value = texto;
  document.getElementById("categoria").value = categoria;
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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pictoForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const res = await fetch("php/api.php", { method: "POST", body: formData });
      const data = await res.json();
      alert(data.msg);
      e.target.reset();
      cargarPictos();
    });
  }
  cargarPictos();
});
