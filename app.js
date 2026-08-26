const directoryList = document.getElementById("directoryList");
const searchInput = document.getElementById("searchInput");
const houseCount = document.getElementById("houseCount");
const apartmentCount = document.getElementById("apartmentCount");
const totalCount = document.getElementById("totalCount");

let domicilios = JSON.parse(localStorage.getItem("domicilios_v1") || "[]");

function render() {
  const q = searchInput.value.trim().toLowerCase();
  const filtered = domicilios.filter(d => {
    const haystack = [
      d.tipo, d.direccion, ...(d.direcciones || []),
      ...(d.personas || []), ...(d.telefonos || []), d.notas
    ].join(" ").toLowerCase();
    return haystack.includes(q);
  });

  houseCount.textContent = domicilios.filter(d => d.tipo === "casa").length;
  apartmentCount.textContent = domicilios.filter(d => d.tipo === "departamento").length;
  totalCount.textContent = `${domicilios.length} ${domicilios.length === 1 ? "registro" : "registros"}`;

  if (!filtered.length) {
    directoryList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔎</div>
        <h3>${domicilios.length ? "Sin resultados" : "Aún no tienes domicilios"}</h3>
        <p>${domicilios.length ? "Prueba con otro nombre, dirección o teléfono." : "La base está lista para recibir tu primer domicilio."}</p>
      </div>`;
    return;
  }

  directoryList.innerHTML = filtered.map(d => `
    <article class="stat-card">
      <span class="stat-icon">${d.tipo === "departamento" ? "🏢" : "🏠"}</span>
      <div><strong>${escapeHtml(d.direccion || "Sin dirección")}</strong><br>
      <small>${escapeHtml((d.personas || []).join(" · ") || "Sin personas registradas")}</small></div>
    </article>`).join("");
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function addDemo() {
  domicilios.push({
    id: crypto.randomUUID(),
    tipo: "casa",
    direccion: "Ejemplo — Calle Tikal Mz 45 Lt 11",
    direcciones: ["Mz 455 Lt 20"],
    personas: ["Salvador", "Karen", "Nora"],
    telefonos: ["5530463338", "4183290974"],
    notas: "Domicilio de prueba"
  });
  localStorage.setItem("domicilios_v1", JSON.stringify(domicilios));
  render();
}

document.getElementById("addButton").addEventListener("click", addDemo);
document.getElementById("emptyAddButton").addEventListener("click", addDemo);
searchInput.addEventListener("input", render);

render();
