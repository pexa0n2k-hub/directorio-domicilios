const KEY="domicilios_v1";
let domicilios=JSON.parse(localStorage.getItem(KEY)||"[]");
const $=id=>document.getElementById(id);
const modal=$("modal"), form=$("domicilioForm"), list=$("directoryList");

function lines(value){return value.split("\n").map(x=>x.trim()).filter(Boolean)}
function save(){localStorage.setItem(KEY,JSON.stringify(domicilios))}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

function render(){
 const q=$("searchInput").value.trim().toLowerCase();
 const filtered=domicilios.filter(d=>[
   d.direccion,...d.direcciones,d.personas.join(" "),d.telefonos.join(" "),d.notas
 ].join(" ").toLowerCase().includes(q));
 $("houseCount").textContent=domicilios.filter(d=>d.tipo==="casa").length;
 $("apartmentCount").textContent=domicilios.filter(d=>d.tipo==="departamento").length;
 $("totalCount").textContent=`${domicilios.length} ${domicilios.length===1?"registro":"registros"}`;

 if(!filtered.length){
   list.innerHTML=`<div class="empty-state"><div class="empty-icon">${domicilios.length?"🔎":"🏠"}</div><h3>${domicilios.length?"Sin resultados":"Aún no tienes domicilios"}</h3><p>${domicilios.length?"Prueba con otro nombre, dirección o teléfono.":"Pulsa ＋ para registrar tu primer domicilio."}</p></div>`;
   return;
 }
 list.innerHTML=filtered.map(d=>`
 <article class="dom-card ${d.tipo==="departamento"?"department":"house"}">
   <div class="dom-type">${d.tipo==="departamento"?"🏢 DEPARTAMENTO":"🏠 CASA"}</div>
   <div class="dom-address">${esc(d.direccion)}</div>
   <div class="dom-people">${d.personas.length?esc(d.personas.join(" · ")):"Sin personas registradas"}</div>
   <div class="dom-meta">${d.direcciones.length?`🔄 ${d.direcciones.length} dirección${d.direcciones.length===1?"":"es"} asociada${d.direcciones.length===1?"":"s"}`:"Sin direcciones asociadas"}${d.telefonos.length?` · 📞 ${d.telefonos.length}`:""}</div>
 </article>`).join("");
}

function openModal(){modal.classList.remove("hidden");$("direccion").focus()}
function closeModal(){modal.classList.add("hidden");form.reset()}

$("addButton").addEventListener("click",openModal);
$("closeModal").addEventListener("click",closeModal);
$("modalBackdrop").addEventListener("click",closeModal);
$("searchInput").addEventListener("input",render);

form.addEventListener("submit",e=>{
 e.preventDefault();
 const data=new FormData(form);
 domicilios.push({
   id:crypto.randomUUID(),
   tipo:data.get("tipo"),
   direccion:$("direccion").value.trim(),
   direcciones:lines($("direcciones").value),
   personas:lines($("personas").value),
   telefonos:lines($("telefonos").value),
   notas:$("notas").value.trim(),
   createdAt:new Date().toISOString()
 });
 save(); closeModal(); render();
});

render();
