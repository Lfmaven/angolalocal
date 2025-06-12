const API_URL = 'http://localhost:8000/api';
const token = localStorage.getItem('token');

// Helper com headers e token
function fetchAuthed(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
      ...(options.headers || {})
    }
  });
}

function mostrarGestao(tipo) {
  if (tipo === 'usuários') carregarUsuarios();
  else if (tipo === 'províncias') carregarProvincias();
  else if (tipo === 'municípios') carregarMunicipios();
  else if (tipo === 'comunas') carregarComunas();
}

// ============ USUÁRIOS ============
async function carregarUsuarios() {
  const me = await fetchAuthed(`${API_URL}/me/`).then(r => r.json());
  if (!me.is_staff) {
    document.getElementById("conteudo").innerHTML = "<p>❌ Apenas administradores.</p>";
    return;
  }

  const data = await fetchAuthed(`${API_URL}/usuarios/`).then(r => r.json());
  let html = "<h2>👥 Usuários</h2><table><tr><th>ID</th><th>Nome</th><th>Staff</th><th>Ações</th></tr>";
  data.forEach(u => {
    html += `<tr>
      <td>${u.id}</td>
      <td><input value="${u.username}" onchange="editarUsuario(${u.id}, this.value, ${u.is_staff})"></td>
      <td><input type="checkbox" ${u.is_staff ? "checked" : ""} onchange="editarUsuario(${u.id}, '${u.username}', this.checked)"></td>
      <td><button onclick="deletarUsuario(${u.id})">🗑️</button></td>
    </tr>`;
  });
  html += "</table>";
  document.getElementById("conteudo").innerHTML = html;
}

function editarUsuario(id, username, is_staff) {
  fetchAuthed(`${API_URL}/usuarios/${id}/`, {
    method: 'PUT',
    body: JSON.stringify({ username, is_staff })
  }).then(() => carregarUsuarios());
}

function deletarUsuario(id) {
  if (confirm("Tem certeza que deseja excluir?")) {
    fetchAuthed(`${API_URL}/usuarios/${id}/`, { method: 'DELETE' }).then(() => carregarUsuarios());
  }
}

// ============ PROVÍNCIAS ============
async function carregarProvincias() {
  const data = await fetchAuthed(`${API_URL}/provincias/`).then(r => r.json());
  let html = `
    <h2>📍 Províncias</h2>
    <input id="novaProvincia" placeholder="Nova província">
    <button onclick="criarProvincia()">➕ Adicionar</button>
    <table><tr><th>ID</th><th>Nome</th><th>Ações</th></tr>`;
  data.forEach(p => {
    html += `<tr>
      <td>${p.id}</td>
      <td><input value="${p.nome}" onchange="editarProvincia(${p.id}, this.value)"></td>
      <td><button onclick="deletarProvincia(${p.id})">🗑️</button></td>
    </tr>`;
  });
  html += "</table>";
  document.getElementById("conteudo").innerHTML = html;
}

function criarProvincia() {
  const nome = document.getElementById("novaProvincia").value;
  fetchAuthed(`${API_URL}/provincias/`, {
    method: 'POST',
    body: JSON.stringify({ nome })
  }).then(() => carregarProvincias());
}

function editarProvincia(id, nome) {
  fetchAuthed(`${API_URL}/provincias/${id}/`, {
    method: 'PUT',
    body: JSON.stringify({ nome })
  });
}

function deletarProvincia(id) {
  if (confirm("Excluir província?")) {
    fetchAuthed(`${API_URL}/provincias/${id}/`, { method: 'DELETE' }).then(() => carregarProvincias());
  }
}

// ============ MUNICÍPIOS ============
async function carregarMunicipios() {
  const [municipios, provincias] = await Promise.all([
    fetchAuthed(`${API_URL}/municipios/`).then(r => r.json()),
    fetchAuthed(`${API_URL}/provincias/`).then(r => r.json())
  ]);

  let select = `<select id="provSel">`;
  provincias.forEach(p => {
    select += `<option value="${p.id}">${p.nome}</option>`;
  });
  select += `</select>`;

  let html = `
    <h2>🏘️ Municípios</h2>
    <input id="novoMunicipio" placeholder="Nome">
    ${select}
    <button onclick="criarMunicipio()">➕</button>
    <table><tr><th>ID</th><th>Nome</th><th>Província</th><th>Ações</th></tr>`;
  municipios.forEach(m => {
    const prov = provincias.find(p => p.id === m.provincia);
    html += `<tr>
      <td>${m.id}</td>
      <td><input value="${m.nome}" onchange="editarMunicipio(${m.id}, this.value, ${m.provincia})"></td>
      <td>${prov ? prov.nome : m.provincia}</td>
      <td><button onclick="deletarMunicipio(${m.id})">🗑️</button></td>
    </tr>`;
  });
  html += "</table>";
  document.getElementById("conteudo").innerHTML = html;
}

function criarMunicipio() {
  const nome = document.getElementById("novoMunicipio").value;
  const provincia = document.getElementById("provSel").value;
  fetchAuthed(`${API_URL}/municipios/`, {
    method: 'POST',
    body: JSON.stringify({ nome, provincia })
  }).then(() => carregarMunicipios());
}

function editarMunicipio(id, nome, provincia) {
  fetchAuthed(`${API_URL}/municipios/${id}/`, {
    method: 'PUT',
    body: JSON.stringify({ nome, provincia })
  });
}

function deletarMunicipio(id) {
  if (confirm("Excluir município?")) {
    fetchAuthed(`${API_URL}/municipios/${id}/`, { method: 'DELETE' }).then(() => carregarMunicipios());
  }
}

// ============ COMUNAS ============
async function carregarComunas() {
  const [comunas, municipios] = await Promise.all([
    fetchAuthed(`${API_URL}/comunas/`).then(r => r.json()),
    fetchAuthed(`${API_URL}/municipios/`).then(r => r.json())
  ]);

  let select = `<select id="munSel">`;
  municipios.forEach(m => {
    select += `<option value="${m.id}">${m.nome}</option>`;
  });
  select += `</select>`;

  let html = `
    <h2>🌍 Comunas</h2>
    <input id="novaComuna" placeholder="Nome">
    ${select}
    <button onclick="criarComuna()">➕</button>
    <table><tr><th>ID</th><th>Nome</th><th>Município</th><th>Ações</th></tr>`;
  comunas.forEach(c => {
    const mun = municipios.find(m => m.id === c.municipio);
    html += `<tr>
      <td>${c.id}</td>
      <td><input value="${c.nome}" onchange="editarComuna(${c.id}, this.value, ${c.municipio})"></td>
      <td>${mun ? mun.nome : c.municipio}</td>
      <td><button onclick="deletarComuna(${c.id})">🗑️</button></td>
    </tr>`;
  });
  html += "</table>";
  document.getElementById("conteudo").innerHTML = html;
}

function criarComuna() {
  const nome = document.getElementById("novaComuna").value;
  const municipio = document.getElementById("munSel").value;
  fetchAuthed(`${API_URL}/comunas/`, {
    method: 'POST',
    body: JSON.stringify({ nome, municipio })
  }).then(() => carregarComunas());
}

function editarComuna(id, nome, municipio) {
  fetchAuthed(`${API_URL}/comunas/${id}/`, {
    method: 'PUT',
    body: JSON.stringify({ nome, municipio })
  });
}

function deletarComuna(id) {
  if (confirm("Excluir comuna?")) {
    fetchAuthed(`${API_URL}/comunas/${id}/`, { method: 'DELETE' }).then(() => carregarComunas());
  }
}
